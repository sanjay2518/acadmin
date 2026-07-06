import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentYear = new Date().getFullYear();

    // Handle navigation for links that may have query params or hashes
    const handleNavigation = (path) => {
        // Check if path contains a hash
        if (path.includes('#')) {
            const [basePath, hash] = path.split('#');

            // If we're already on the same page, just scroll to the section
            if (location.pathname === basePath || (basePath === '' && location.pathname === '/')) {
                const element = document.getElementById(hash);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } else {
                // Navigate to the page first, then scroll
                navigate(basePath || '/');
                setTimeout(() => {
                    const element = document.getElementById(hash);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 100);
            }
        } else if (path.includes('?')) {
            // Handle query params - force navigation even if on same base path
            navigate(path);
            // Scroll to top when navigating with query params
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            navigate(path);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const footerLinks = {
        whoWeAre: [
            { label: 'Overview', path: '/about' },
            { label: 'Our Leadership', path: '/about#leadership' },
            { label: 'Our Values', path: '/about#values' },
            { label: 'Recognition', path: '/about#recognition' },
            { label: 'Newsroom', path: '/insights' },
        ],
        services: [
            { label: 'Audit & Assurance', path: '/services/audit' },
            { label: 'Tax Services', path: '/services/tax' },
            { label: 'Financial Advisory', path: '/services/advisory' },
            { label: 'Bookkeeping', path: '/services/bookkeeping' },
            { label: 'Payroll Services', path: '/services/payroll' },
        ],
        industries: [
            { label: 'Healthcare', path: '/industries/healthcare' },
            { label: 'Technology', path: '/industries/technology' },
            { label: 'Manufacturing', path: '/industries/manufacturing' },
            { label: 'Real Estate', path: '/industries/real-estate' },
            { label: 'Retail', path: '/industries/retail' },
        ],
        resources: [
            { label: 'Insights', path: '/insights' },
            { label: 'Tax Updates', path: '/insights?category=tax' },
            { label: 'Industry Reports', path: '/insights?category=reports' },
            { label: 'Careers', path: '/careers' },
            { label: 'Contact Us', path: '/contact' },
        ],
    };

    const socialLinks = [
        {
            name: 'LinkedIn',
            url: 'https://www.linkedin.com/company/wealcco/',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
            )
        },
        {
            name: 'Instagram',
            url: 'https://www.instagram.com/wealcco/',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                </svg>
            )
        },
        {
            name: 'Pinterest',
            url: 'https://in.pinterest.com/wealcco/',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
            )
        },
    ];

    return (
        <footer className="footer">
            {/* CTA Section */}
            <div className="footer-cta">
                <div className="container">
                    <div className="cta-content">
                        <div className="cta-text">
                            <h2>Ready to Transform Your Financial Future?</h2>
                            <p>Let's connect and discuss how we can help your business thrive.</p>
                        </div>
                        <div className="cta-actions">
                            <Link to="/contact" className="btn btn-primary btn-lg">
                                Get Started Today
                            </Link>
                            <Link to="/services" className="btn btn-outline btn-lg">
                                Explore Services
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="footer-main">
                <div className="container">
                    <div className="footer-grid">
                        {/* Company Info */}
                        <div className="footer-brand">
                            <Link to="/" className="footer-logo">
                                <span className="logo-icon">◆</span>
                                <span className="logo-text">
                                    <span className="logo-primary">Precision</span>
                                    <span className="logo-secondary">Accounting</span>
                                </span>
                            </Link>
                            <p className="footer-description">
                                Trusted accounting and advisory services to help businesses achieve
                                financial clarity and sustainable growth.
                            </p>
                            <div className="footer-contact-info">
                                <div className="contact-item">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                    </svg>
                                    <span>56, New Layal Pur, Dixit Gali, Delhi -110051</span>
                                </div>
                                <div className="contact-item">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                                    </svg>
                                    <span>+91 8920473074</span>
                                </div>
                                <div className="contact-item">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                    </svg>
                                    <span>reliableprofessionals.co@gmail.com</span>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Columns */}
                        <div className="footer-nav">
                            <div className="footer-nav-column">
                                <h4>Who We Are</h4>
                                <ul>
                                    {footerLinks.whoWeAre.map((link, index) => (
                                        <li key={index}>
                                            <a
                                                href={link.path}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleNavigation(link.path);
                                                }}
                                            >
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="footer-nav-column">
                                <h4>Services</h4>
                                <ul>
                                    {footerLinks.services.map((link, index) => (
                                        <li key={index}>
                                            <Link to={link.path}>{link.label}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="footer-nav-column">
                                <h4>Industries</h4>
                                <ul>
                                    {footerLinks.industries.map((link, index) => (
                                        <li key={index}>
                                            <Link to={link.path}>{link.label}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="footer-nav-column">
                                <h4>Resources</h4>
                                <ul>
                                    {footerLinks.resources.map((link, index) => (
                                        <li key={index}>
                                            <a
                                                href={link.path}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleNavigation(link.path);
                                                }}
                                            >
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="footer-social">
                        <h4>Follow Us</h4>
                        <div className="social-links">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.url}
                                    className="social-link"
                                    aria-label={social.name}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom">
                <div className="container">
                    <div className="footer-bottom-content">
                        <p className="copyright">
                            © {currentYear} Precision Accounting. All rights reserved.
                        </p>
                        <div className="footer-legal">
                            <Link to="/privacy">Privacy Policy</Link>
                            <Link to="/terms">Terms of Use</Link>
                            <Link to="/cookies">Cookie Settings</Link>
                            <Link to="/accessibility">Accessibility</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
