import Hero from '../components/Hero';
import ContactForm from '../components/ContactForm';
import './Contact.css';

const Contact = () => {
    const offices = [
        {
            city: 'Delhi',
            address: '56, New Layal Pur',
            address2: 'Dixit Gali, Delhi -110051',
            phone: '+91 8920473074',
            email: 'reliableprofessionals.co@gmail.com'
        },
    ];

    const handleFormSubmit = (data) => {
        console.log('Form submitted:', data);
        // Handle form submission - API call, etc.
    };

    return (
        <main className="contact-page">
            <Hero
                size="small"
                subtitle="Get in Touch"
                title="Let's Start a Conversation"
                description="Have a question or want to discuss your needs? We're here to help."
            />

            {/* Contact Section */}
            <section className="contact-section section-lg">
                <div className="container">
                    <div className="contact-grid">
                        {/* Contact Form */}
                        <div className="contact-form-wrapper">
                            <div className="form-header">
                                <h2>Send Us a Message</h2>
                                <p>
                                    Fill out the form below and a member of our team will get back
                                    to you within 24 hours.
                                </p>
                            </div>
                            <ContactForm onSubmit={handleFormSubmit} />
                        </div>

                        {/* Contact Info */}
                        <div className="contact-info">
                            <div className="info-card">
                                <h3>Quick Contact</h3>
                                <div className="info-items">
                                    <div className="info-item">
                                        <div className="info-icon">
                                            <svg viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                                            </svg>
                                        </div>
                                        <div className="info-content">
                                            <h4>Phone</h4>
                                            <a href="tel:+918920473074">+91 8920473074</a>
                                        </div>
                                    </div>

                                    <div className="info-item">
                                        <div className="info-icon">
                                            <svg viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                            </svg>
                                        </div>
                                        <div className="info-content">
                                            <h4>Email</h4>
                                            <a href="mailto:reliableprofessionals.co@gmail.com">reliableprofessionals.co@gmail.com</a>
                                        </div>
                                    </div>

                                    <div className="info-item">
                                        <div className="info-icon">
                                            <svg viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                                            </svg>
                                        </div>
                                        <div className="info-content">
                                            <h4>Office Hours</h4>
                                            <p>Mon - Fri: 8:00 AM - 6:00 PM</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="social-card">
                                <h3>Follow Us</h3>
                                <div className="social-links">
                                    <a href="https://www.linkedin.com/company/wealcco/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-link">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                    </a>
                                    <a href="https://www.instagram.com/wealcco/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-link">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                                        </svg>
                                    </a>
                                    <a href="https://in.pinterest.com/wealcco/" target="_blank" rel="noopener noreferrer" aria-label="Pinterest" className="social-link">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Offices Section */}
            <section className="offices-section section-lg bg-gray">
                <div className="container">
                    <div className="section-header text-center">
                        <span className="section-subtitle">Our Locations</span>
                        <h2>Office Locations</h2>
                    </div>

                    <div className="offices-grid">
                        {offices.map((office, index) => (
                            <div key={index} className="office-card">
                                <div className="office-icon">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                    </svg>
                                </div>
                                <h3>{office.city}</h3>
                                <p className="office-address">
                                    {office.address}<br />
                                    {office.address2}
                                </p>
                                <div className="office-contacts">
                                    <a href={`tel:${office.phone.replace(/[^0-9]/g, '')}`}>
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                                        </svg>
                                        {office.phone}
                                    </a>
                                    <a href={`mailto:${office.email}`}>
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                        </svg>
                                        Email
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section section-lg">
                <div className="container">
                    <div className="faq-content">
                        <div className="faq-header">
                            <span className="section-subtitle">FAQ</span>
                            <h2>Common Questions</h2>
                        </div>

                        <div className="faq-list">
                            <details className="faq-item">
                                <summary>How do I schedule a consultation?</summary>
                                <p>
                                    You can schedule a consultation by filling out the contact form above,
                                    calling us directly, or sending an email. We typically respond within
                                    24 hours to set up a meeting at your convenience.
                                </p>
                            </details>

                            <details className="faq-item">
                                <summary>What should I bring to the initial meeting?</summary>
                                <p>
                                    For the initial consultation, please bring any relevant financial documents,
                                    prior tax returns, and a list of questions or concerns you'd like to discuss.
                                    This helps us understand your situation and provide relevant guidance.
                                </p>
                            </details>

                            <details className="faq-item">
                                <summary>Do you offer virtual consultations?</summary>
                                <p>
                                    Yes, we offer virtual consultations via video conferencing for clients
                                    who prefer remote meetings or are located outside our office areas.
                                    Just let us know your preference when scheduling.
                                </p>
                            </details>

                            <details className="faq-item">
                                <summary>How are your fees structured?</summary>
                                <p>
                                    Our fees vary based on the complexity and scope of services required.
                                    We offer transparent pricing and will provide a detailed quote after
                                    understanding your specific needs during the initial consultation.
                                </p>
                            </details>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Contact;
