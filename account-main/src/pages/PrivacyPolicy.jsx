import Hero from '../components/Hero';
import { Link } from 'react-router-dom';
import './LegalPages.css';

const PrivacyPolicy = () => {
    return (
        <main className="legal-page">
            <Hero
                size="small"
                subtitle="Legal"
                title="Privacy Policy"
                description="Last updated: January 1, 2026"
            />

            <section className="legal-content section-lg">
                <div className="container">
                    <div className="legal-container">
                        <nav className="legal-nav">
                            <h4>Contents</h4>
                            <ul>
                                <li><a href="#introduction">Introduction</a></li>
                                <li><a href="#information-collected">Information We Collect</a></li>
                                <li><a href="#how-we-use">How We Use Your Information</a></li>
                                <li><a href="#information-sharing">Information Sharing</a></li>
                                <li><a href="#data-security">Data Security</a></li>
                                <li><a href="#your-rights">Your Rights</a></li>
                                <li><a href="#cookies">Cookies</a></li>
                                <li><a href="#changes">Changes to This Policy</a></li>
                                <li><a href="#contact">Contact Us</a></li>
                            </ul>
                        </nav>

                        <div className="legal-body">
                            <section id="introduction">
                                <h2>1. Introduction</h2>
                                <p>
                                    Precision Accounting ("we," "our," or "us") is committed to protecting your privacy.
                                    This Privacy Policy explains how we collect, use, disclose, and safeguard your information
                                    when you visit our website or use our accounting and financial services.
                                </p>
                                <p>
                                    By accessing our services, you agree to the collection and use of information in accordance
                                    with this policy. If you do not agree with the terms of this privacy policy, please do not
                                    access our website or use our services.
                                </p>
                            </section>

                            <section id="information-collected">
                                <h2>2. Information We Collect</h2>

                                <h3>Personal Information</h3>
                                <p>We may collect personally identifiable information that you voluntarily provide, including:</p>
                                <ul>
                                    <li>Name and contact information (email address, phone number, mailing address)</li>
                                    <li>Business information (company name, job title, industry)</li>
                                    <li>Financial information necessary for providing our services</li>
                                    <li>Tax-related documents and information</li>
                                    <li>Account credentials for our client portal</li>
                                </ul>

                                <h3>Automatically Collected Information</h3>
                                <p>When you visit our website, we may automatically collect:</p>
                                <ul>
                                    <li>IP address and browser type</li>
                                    <li>Device information and operating system</li>
                                    <li>Pages visited and time spent on our website</li>
                                    <li>Referring website addresses</li>
                                    <li>Cookie and tracking data</li>
                                </ul>
                            </section>

                            <section id="how-we-use">
                                <h2>3. How We Use Your Information</h2>
                                <p>We use the information we collect for various purposes, including:</p>
                                <ul>
                                    <li>Providing and maintaining our accounting and financial services</li>
                                    <li>Processing your tax returns and financial statements</li>
                                    <li>Communicating with you about your account and our services</li>
                                    <li>Sending newsletters, updates, and marketing materials (with your consent)</li>
                                    <li>Improving our website and services</li>
                                    <li>Complying with legal and regulatory requirements</li>
                                    <li>Detecting and preventing fraud or unauthorized access</li>
                                </ul>
                            </section>

                            <section id="information-sharing">
                                <h2>4. Information Sharing</h2>
                                <p>
                                    We do not sell, trade, or rent your personal information to third parties.
                                    We may share your information only in the following circumstances:
                                </p>
                                <ul>
                                    <li><strong>Service Providers:</strong> With trusted third parties who assist us in operating our business (e.g., cloud storage, payment processors)</li>
                                    <li><strong>Legal Requirements:</strong> When required by law or to respond to legal process</li>
                                    <li><strong>Tax Authorities:</strong> As necessary to file returns and communicate with tax agencies on your behalf</li>
                                    <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                                    <li><strong>With Your Consent:</strong> When you have given us explicit permission</li>
                                </ul>
                            </section>

                            <section id="data-security">
                                <h2>5. Data Security</h2>
                                <p>
                                    We implement appropriate technical and organizational security measures to protect your
                                    personal information against unauthorized access, alteration, disclosure, or destruction.
                                    These measures include:
                                </p>
                                <ul>
                                    <li>Encryption of data in transit and at rest</li>
                                    <li>Secure client portal with multi-factor authentication</li>
                                    <li>Regular security audits and vulnerability assessments</li>
                                    <li>Employee training on data protection practices</li>
                                    <li>Physical security measures at our offices</li>
                                </ul>
                                <p>
                                    While we strive to protect your information, no method of transmission over the Internet
                                    is 100% secure. We cannot guarantee absolute security.
                                </p>
                            </section>

                            <section id="your-rights">
                                <h2>6. Your Rights</h2>
                                <p>Depending on your location, you may have the following rights regarding your personal data:</p>
                                <ul>
                                    <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                                    <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                                    <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal retention requirements)</li>
                                    <li><strong>Portability:</strong> Request transfer of your data to another service provider</li>
                                    <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
                                </ul>
                                <p>
                                    To exercise any of these rights, please contact us at{' '}
                                    <a href="mailto:reliableprofessionals.co@gmail.com">reliableprofessionals.co@gmail.com</a>
                                </p>
                            </section>

                            <section id="cookies">
                                <h2>7. Cookies</h2>
                                <p>
                                    We use cookies and similar tracking technologies to enhance your experience on our website.
                                    For detailed information about our use of cookies, please see our{' '}
                                    <Link to="/cookies">Cookie Settings</Link> page.
                                </p>
                            </section>

                            <section id="changes">
                                <h2>8. Changes to This Policy</h2>
                                <p>
                                    We may update this Privacy Policy from time to time to reflect changes in our practices
                                    or applicable laws. We will notify you of any material changes by posting the new policy
                                    on this page with an updated "Last Updated" date. We encourage you to review this policy
                                    periodically.
                                </p>
                            </section>

                            <section id="contact">
                                <h2>9. Contact Us</h2>
                                <p>
                                    If you have any questions about this Privacy Policy or our data practices, please contact us:
                                </p>
                                <div className="contact-info-box">
                                    <p><strong>Precision Accounting</strong></p>
                                    <p>56, New Layal Pur, Dixit Gali, Delhi-51</p>
                                    <p>Email: <a href="mailto:reliableprofessionals.co@gmail.com">reliableprofessionals.co@gmail.com</a></p>
                                    <p>Phone: <a href="tel:+918920473074">+91 8920473074</a></p>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default PrivacyPolicy;
