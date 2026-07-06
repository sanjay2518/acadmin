import nodemailer from 'nodemailer';

// Email configuration
// For production, use environment variables for credentials
const EMAIL_CONFIG = {
    // The email address that will receive notifications
    notificationEmail: process.env.NOTIFICATION_EMAIL || 'admin@precisionaccounting.com',

    // SMTP Configuration
    // For Gmail, use: smtp.gmail.com with port 587
    // For Outlook, use: smtp-mail.outlook.com with port 587
    smtp: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER || '',
            pass: process.env.SMTP_PASS || ''
        }
    },

    // From address for sent emails
    fromEmail: process.env.FROM_EMAIL || 'noreply@precisionaccounting.com',
    fromName: process.env.FROM_NAME || 'Precision Accounting Website'
};

// Create transporter
let transporter = null;

const initializeTransporter = () => {
    if (EMAIL_CONFIG.smtp.auth.user && EMAIL_CONFIG.smtp.auth.pass) {
        transporter = nodemailer.createTransport({
            host: EMAIL_CONFIG.smtp.host,
            port: EMAIL_CONFIG.smtp.port,
            secure: EMAIL_CONFIG.smtp.secure,
            auth: EMAIL_CONFIG.smtp.auth
        });
        console.log('📧 Email service initialized');
        return true;
    } else {
        console.log('⚠️  Email service not configured (SMTP credentials missing)');
        console.log('   Set SMTP_USER and SMTP_PASS environment variables to enable email notifications');
        return false;
    }
};

// Send contact form notification to admin
export const sendContactNotification = async (submission) => {
    if (!transporter) {
        console.log('📧 Email skipped (not configured):', submission.email);
        return { success: false, reason: 'Email service not configured' };
    }

    const { name, email, phone, company, service, message, subscribe } = submission;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #00D26A, #006A96); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #555; }
        .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; border: 1px solid #eee; }
        .message-box { background: white; padding: 15px; border-left: 4px solid #00D26A; margin-top: 10px; }
        .footer { background: #333; color: #999; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
        .badge { display: inline-block; padding: 3px 8px; background: #00D26A; color: #000; border-radius: 4px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2 style="margin: 0;">📧 New Contact Form Submission</h2>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Precision Accounting Website</p>
        </div>
        
        <div class="content">
          <div class="field">
            <div class="label">Name</div>
            <div class="value">${name}</div>
          </div>
          
          <div class="field">
            <div class="label">Email</div>
            <div class="value"><a href="mailto:${email}">${email}</a></div>
          </div>
          
          ${phone ? `
          <div class="field">
            <div class="label">Phone</div>
            <div class="value"><a href="tel:${phone}">${phone}</a></div>
          </div>
          ` : ''}
          
          ${company ? `
          <div class="field">
            <div class="label">Company</div>
            <div class="value">${company}</div>
          </div>
          ` : ''}
          
          ${service ? `
          <div class="field">
            <div class="label">Service Interest</div>
            <div class="value"><span class="badge">${service}</span></div>
          </div>
          ` : ''}
          
          <div class="field">
            <div class="label">Message</div>
            <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
          </div>
          
          <div class="field">
            <div class="label">Newsletter Subscription</div>
            <div class="value">${subscribe ? '✅ Yes, subscribed' : '❌ No'}</div>
          </div>
        </div>
        
        <div class="footer">
          <p>This email was sent from the Precision Accounting website contact form.</p>
          <p>Submitted at: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    </body>
    </html>
  `;

    const textContent = `
New Contact Form Submission
===========================

Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}
${company ? `Company: ${company}` : ''}
${service ? `Service Interest: ${service}` : ''}

Message:
${message}

Newsletter: ${subscribe ? 'Yes' : 'No'}

---
Submitted at: ${new Date().toLocaleString()}
  `;

    try {
        const info = await transporter.sendMail({
            from: `"${EMAIL_CONFIG.fromName}" <${EMAIL_CONFIG.fromEmail}>`,
            to: EMAIL_CONFIG.notificationEmail,
            subject: `🔔 New Contact: ${name} - ${service || 'General Inquiry'}`,
            text: textContent,
            html: htmlContent,
            replyTo: email
        });

        console.log(`📧 Notification email sent: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('📧 Error sending email:', error.message);
        return { success: false, error: error.message };
    }
};

// Send confirmation email to the person who submitted the form
export const sendConfirmationEmail = async (submission) => {
    if (!transporter) {
        return { success: false, reason: 'Email service not configured' };
    }

    const { name, email } = submission;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #00D26A, #006A96); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
        .footer { background: #333; color: #999; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
        .btn { display: inline-block; padding: 12px 24px; background: #00D26A; color: #000; text-decoration: none; border-radius: 6px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">Thank You, ${name}!</h1>
          <p style="margin: 15px 0 0 0; opacity: 0.9;">We've received your message</p>
        </div>
        
        <div class="content">
          <p>Hi ${name},</p>
          
          <p>Thank you for contacting Precision Accounting. We've received your inquiry and our team will review it promptly.</p>
          
          <p><strong>What happens next?</strong></p>
          <ul>
            <li>Our team will review your message within 24 hours</li>
            <li>A specialist will reach out to you via email or phone</li>
            <li>We'll schedule a consultation at your convenience</li>
          </ul>
          
          <p>If you have any urgent questions, feel free to call us at <a href="tel:+15551234567">(555) 123-4567</a>.</p>
          
          <p>Best regards,<br>The Precision Accounting Team</p>
        </div>
        
        <div class="footer">
          <p>Precision Accounting | Expert Financial & Tax Services</p>
          <p>123 Financial District, New York, NY 10004</p>
        </div>
      </div>
    </body>
    </html>
  `;

    try {
        const info = await transporter.sendMail({
            from: `"${EMAIL_CONFIG.fromName}" <${EMAIL_CONFIG.fromEmail}>`,
            to: email,
            subject: `Thank you for contacting Precision Accounting`,
            html: htmlContent
        });

        console.log(`📧 Confirmation email sent to ${email}: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('📧 Error sending confirmation:', error.message);
        return { success: false, error: error.message };
    }
};

// Initialize on module load
initializeTransporter();

export default {
    sendContactNotification,
    sendConfirmationEmail,
    initializeTransporter,
    EMAIL_CONFIG
};
