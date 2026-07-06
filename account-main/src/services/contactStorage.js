// API Base URL - change this for production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// localStorage key for contact submissions
const CONTACT_STORAGE_KEY = 'precision_contact_submissions';

/**
 * Save contact form to localStorage (fallback when no backend)
 */
const saveToLocalStorage = (formData) => {
    const submissions = JSON.parse(localStorage.getItem(CONTACT_STORAGE_KEY) || '[]');
    const newSubmission = {
        id: Date.now(),
        ...formData,
        submittedAt: new Date().toISOString(),
        status: 'new'
    };
    submissions.push(newSubmission);
    localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(submissions));
    return newSubmission;
};

/**
 * Submit a contact form to the database (with localStorage fallback)
 */
export const submitContactForm = async (formData) => {
    try {
        // Try to submit to the API first
        const response = await fetch(`${API_BASE_URL}/contacts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to submit form');
        }

        return data;
    } catch (error) {
        console.log('API not available, saving to localStorage instead');

        // Fallback to localStorage when API is not available
        const savedData = saveToLocalStorage(formData);

        return {
            success: true,
            message: 'Contact form saved successfully',
            data: savedData
        };
    }
};

/**
 * Get all contact submissions (admin)
 */
export const getContactSubmissions = async (options = {}) => {
    try {
        const { status, limit = 50, offset = 0 } = options;

        let url = `${API_BASE_URL}/contacts?limit=${limit}&offset=${offset}`;
        if (status) {
            url += `&status=${status}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch submissions');
        }

        return data;
    } catch (error) {
        console.error('Error fetching submissions:', error);
        throw error;
    }
};

/**
 * Update contact submission status (admin)
 */
export const updateContactStatus = async (id, status) => {
    try {
        const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to update status');
        }

        return data;
    } catch (error) {
        console.error('Error updating status:', error);
        throw error;
    }
};

/**
 * Delete a contact submission (admin)
 */
export const deleteContactSubmission = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
            method: 'DELETE',
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to delete submission');
        }

        return data;
    } catch (error) {
        console.error('Error deleting submission:', error);
        throw error;
    }
};

/**
 * Subscribe to newsletter
 */
export const subscribeToNewsletter = async (email) => {
    try {
        const response = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to subscribe');
        }

        return data;
    } catch (error) {
        console.error('Error subscribing to newsletter:', error);
        throw error;
    }
};

/**
 * Get dashboard stats (admin)
 */
export const getDashboardStats = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/stats`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch stats');
        }

        return data;
    } catch (error) {
        console.error('Error fetching stats:', error);
        throw error;
    }
};

/**
 * Check API health
 */
export const checkApiHealth = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        return response.ok;
    } catch (error) {
        return false;
    }
};

export default {
    submitContactForm,
    getContactSubmissions,
    updateContactStatus,
    deleteContactSubmission,
    subscribeToNewsletter,
    getDashboardStats,
    checkApiHealth,
};
