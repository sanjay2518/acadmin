import { useState } from 'react';
import emailjs from '@emailjs/browser';
import './ContactForm.css';

const ContactForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            // Send admin notification
            const adminResponse = await emailjs.send(
                'service_mzqdu0g',
                'template_vokf2l1',
                {
                    full_name: formData.name,
                    email_address: formData.email,
                    phone_number: formData.phone,
                    company_name: formData.company,
                    service_interest: formData.subject,
                    message: formData.message,
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    company: formData.company,
                    subject: formData.subject,
                    service: formData.subject,
                    interest: formData.subject
                },
                'LXsRg2HXQ8Q5TBqB-'
            );

            // Send user acknowledgment
            const userResponse = await emailjs.send(
                'service_mzqdu0g',
                'template_kpchqd1',
                {
                    name: formData.name,
                    email: formData.email,
                    subject: formData.subject,
                    message: formData.message,
                    service_interest: formData.subject,
                    service: formData.subject,
                    interest: formData.subject
                },
                'LXsRg2HXQ8Q5TBqB-'
            );

            setSubmitStatus('success');
            setFormData({
                name: '',
                email: '',
                phone: '',
                company: '',
                subject: '',
                message: ''
            });

            if (onSubmit) {
                onSubmit(formData);
            }
        } catch (error) {
            console.error('EmailJS Error:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="company">Company</label>
                    <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select a subject</option>
                    <option value="Tax Services">Tax Services</option>
                    <option value="Accounting Services">Accounting Services</option>
                    <option value="Audit Services">Audit Services</option>
                    <option value="Business Advisory">Business Advisory</option>
                    <option value="Payroll Services">Payroll Services</option>
                    <option value="General Inquiry">General Inquiry</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your needs..."
                    required
                ></textarea>
            </div>

            <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>

            {submitStatus === 'success' && (
                <div className="form-message success">
                    Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.
                </div>
            )}

            {submitStatus === 'error' && (
                <div className="form-message error">
                    Sorry, there was an error sending your message. Please try again or contact us directly.
                </div>
            )}
        </form>
    );
};

export default ContactForm;