import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendContactNotification, sendConfirmationEmail } from './emailService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS contact_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    service TEXT,
    message TEXT NOT NULL,
    subscribe INTEGER DEFAULT 0,
    status TEXT DEFAULT 'new',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'active'
  );
`);

console.log('✅ Database initialized');

// ==================== CONTACT SUBMISSIONS API ====================

// Get all contact submissions
app.get('/api/contacts', (req, res) => {
    try {
        const { status, limit = 50, offset = 0 } = req.query;

        let query = 'SELECT * FROM contact_submissions';
        const params = [];

        if (status) {
            query += ' WHERE status = ?';
            params.push(status);
        }

        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const submissions = db.prepare(query).all(...params);
        const total = db.prepare('SELECT COUNT(*) as count FROM contact_submissions').get();

        res.json({
            success: true,
            data: submissions,
            total: total.count,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get single contact submission
app.get('/api/contacts/:id', (req, res) => {
    try {
        const submission = db.prepare('SELECT * FROM contact_submissions WHERE id = ?').get(req.params.id);

        if (!submission) {
            return res.status(404).json({ success: false, error: 'Submission not found' });
        }

        res.json({ success: true, data: submission });
    } catch (error) {
        console.error('Error fetching contact:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create new contact submission
app.post('/api/contacts', (req, res) => {
    try {
        const { name, email, phone, company, service, message, subscribe } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                error: 'Name, email, and message are required'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email address'
            });
        }

        const stmt = db.prepare(`
      INSERT INTO contact_submissions (name, email, phone, company, service, message, subscribe)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

        const result = stmt.run(name, email, phone || null, company || null, service || null, message, subscribe ? 1 : 0);

        // If subscribed, also add to newsletter
        if (subscribe) {
            try {
                db.prepare('INSERT OR IGNORE INTO newsletter_subscribers (email) VALUES (?)').run(email);
            } catch (e) {
                // Ignore duplicate email errors
            }
        }

        const newSubmission = db.prepare('SELECT * FROM contact_submissions WHERE id = ?').get(result.lastInsertRowid);

        console.log(`📧 New contact submission from: ${name} (${email})`);

        // Send email notifications (async, don't block response)
        const submissionData = { name, email, phone, company, service, message, subscribe };

        // Send notification to admin
        sendContactNotification(submissionData).catch(err => {
            console.error('Failed to send admin notification:', err);
        });

        // Send confirmation to user
        sendConfirmationEmail(submissionData).catch(err => {
            console.error('Failed to send user confirmation:', err);
        });

        res.status(201).json({
            success: true,
            data: newSubmission,
            message: 'Your message has been received. We will contact you within 24 hours.',
            emailSent: true
        });
    } catch (error) {
        console.error('Error creating contact:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update contact submission status
app.patch('/api/contacts/:id', (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['new', 'in_progress', 'completed', 'archived'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: `Status must be one of: ${validStatuses.join(', ')}`
            });
        }

        const stmt = db.prepare(`
      UPDATE contact_submissions 
      SET status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);

        const result = stmt.run(status, req.params.id);

        if (result.changes === 0) {
            return res.status(404).json({ success: false, error: 'Submission not found' });
        }

        const updated = db.prepare('SELECT * FROM contact_submissions WHERE id = ?').get(req.params.id);

        res.json({ success: true, data: updated });
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete contact submission
app.delete('/api/contacts/:id', (req, res) => {
    try {
        const result = db.prepare('DELETE FROM contact_submissions WHERE id = ?').run(req.params.id);

        if (result.changes === 0) {
            return res.status(404).json({ success: false, error: 'Submission not found' });
        }

        res.json({ success: true, message: 'Submission deleted successfully' });
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== NEWSLETTER API ====================

// Subscribe to newsletter
app.post('/api/newsletter/subscribe', (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, error: 'Email is required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, error: 'Invalid email address' });
        }

        const existing = db.prepare('SELECT * FROM newsletter_subscribers WHERE email = ?').get(email);

        if (existing) {
            if (existing.status === 'active') {
                return res.json({ success: true, message: 'Already subscribed!' });
            } else {
                db.prepare('UPDATE newsletter_subscribers SET status = ? WHERE email = ?').run('active', email);
                return res.json({ success: true, message: 'Welcome back! You have been resubscribed.' });
            }
        }

        db.prepare('INSERT INTO newsletter_subscribers (email) VALUES (?)').run(email);

        console.log(`📰 New newsletter subscriber: ${email}`);

        res.status(201).json({ success: true, message: 'Successfully subscribed to newsletter!' });
    } catch (error) {
        console.error('Error subscribing:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get newsletter subscribers (admin)
app.get('/api/newsletter/subscribers', (req, res) => {
    try {
        const subscribers = db.prepare('SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC').all();
        res.json({ success: true, data: subscribers, total: subscribers.length });
    } catch (error) {
        console.error('Error fetching subscribers:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== STATS API ====================

app.get('/api/stats', (req, res) => {
    try {
        const contactsTotal = db.prepare('SELECT COUNT(*) as count FROM contact_submissions').get();
        const contactsNew = db.prepare("SELECT COUNT(*) as count FROM contact_submissions WHERE status = 'new'").get();
        const contactsToday = db.prepare("SELECT COUNT(*) as count FROM contact_submissions WHERE date(created_at) = date('now')").get();
        const subscribers = db.prepare('SELECT COUNT(*) as count FROM newsletter_subscribers WHERE status = ?').get('active');

        res.json({
            success: true,
            data: {
                totalContacts: contactsTotal.count,
                newContacts: contactsNew.count,
                contactsToday: contactsToday.count,
                newsletterSubscribers: subscribers.count
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`
🚀 Precision Accounting API Server
================================
Server running on: http://localhost:${PORT}
Database: ${dbPath}

API Endpoints:
  GET    /api/contacts          - List all contact submissions
  GET    /api/contacts/:id      - Get single submission
  POST   /api/contacts          - Create new submission
  PATCH  /api/contacts/:id      - Update submission status
  DELETE /api/contacts/:id      - Delete submission

  POST   /api/newsletter/subscribe   - Subscribe to newsletter
  GET    /api/newsletter/subscribers - List all subscribers

  GET    /api/stats             - Get dashboard statistics
  GET    /api/health            - Health check
  `);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down server...');
    db.close();
    process.exit(0);
});
