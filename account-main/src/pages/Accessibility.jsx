import Hero from '../components/Hero';
import './LegalPages.css';

const Accessibility = () => {
    return (
        <main className="legal-page">
            <Hero
                size="small"
                subtitle="Commitment"
                title="Accessibility Statement"
                description="Our commitment to digital accessibility for all users"
            />

            <section className="legal-content section-lg">
                <div className="container">
                    <div className="legal-container">
                        <nav className="legal-nav">
                            <h4>Contents</h4>
                            <ul>
                                <li><a href="#commitment">Our Commitment</a></li>
                                <li><a href="#standards">Accessibility Standards</a></li>
                                <li><a href="#features">Accessibility Features</a></li>
                                <li><a href="#assistive">Assistive Technologies</a></li>
                                <li><a href="#improvements">Ongoing Improvements</a></li>
                                <li><a href="#feedback">Feedback</a></li>
                                <li><a href="#contact">Contact Us</a></li>
                            </ul>
                        </nav>

                        <div className="legal-body">
                            <section id="commitment">
                                <h2>Our Commitment to Accessibility</h2>
                                <p>
                                    Precision Accounting is committed to ensuring digital accessibility for people
                                    with disabilities. We are continually improving the user experience for everyone
                                    and applying the relevant accessibility standards.
                                </p>
                                <p>
                                    We believe that every individual deserves equal access to information and
                                    functionality. Our goal is to make our website and services accessible to all
                                    users, regardless of ability or technology used.
                                </p>
                            </section>

                            <section id="standards">
                                <h2>Accessibility Standards</h2>
                                <p>
                                    We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA
                                    standards. These guidelines explain how to make web content more accessible for
                                    people with disabilities and more user-friendly for everyone.
                                </p>
                                <p>The four main principles of WCAG are:</p>
                                <ul>
                                    <li>
                                        <strong>Perceivable:</strong> Information and user interface components must
                                        be presentable to users in ways they can perceive
                                    </li>
                                    <li>
                                        <strong>Operable:</strong> User interface components and navigation must be
                                        operable by all users
                                    </li>
                                    <li>
                                        <strong>Understandable:</strong> Information and the operation of the user
                                        interface must be understandable
                                    </li>
                                    <li>
                                        <strong>Robust:</strong> Content must be robust enough to be interpreted by a
                                        wide variety of user agents, including assistive technologies
                                    </li>
                                </ul>
                            </section>

                            <section id="features">
                                <h2>Accessibility Features</h2>
                                <p>Our website includes the following accessibility features:</p>

                                <h3>Navigation and Structure</h3>
                                <ul>
                                    <li>Clear and consistent navigation throughout the site</li>
                                    <li>Descriptive page titles and headings</li>
                                    <li>Skip navigation links to bypass repetitive content</li>
                                    <li>Logical reading order and focus sequence</li>
                                    <li>Breadcrumb navigation where appropriate</li>
                                </ul>

                                <h3>Visual Design</h3>
                                <ul>
                                    <li>High contrast color schemes for improved readability</li>
                                    <li>Resizable text without loss of functionality</li>
                                    <li>No content that flashes more than three times per second</li>
                                    <li>Color is not used as the sole means of conveying information</li>
                                    <li>Clear visual focus indicators</li>
                                </ul>

                                <h3>Content</h3>
                                <ul>
                                    <li>Alternative text for images and graphics</li>
                                    <li>Captions and transcripts for multimedia content</li>
                                    <li>Clear and simple language</li>
                                    <li>Descriptive link text</li>
                                    <li>Properly labeled form fields and controls</li>
                                </ul>

                                <h3>Interactive Elements</h3>
                                <ul>
                                    <li>Keyboard accessible menus and forms</li>
                                    <li>Clear error messages and form validation</li>
                                    <li>Sufficient time to read and interact with content</li>
                                    <li>No keyboard traps</li>
                                </ul>
                            </section>

                            <section id="assistive">
                                <h2>Assistive Technologies</h2>
                                <p>Our website is designed to be compatible with the following assistive technologies:</p>
                                <ul>
                                    <li>Screen readers (JAWS, NVDA, VoiceOver, TalkBack)</li>
                                    <li>Screen magnification software</li>
                                    <li>Speech recognition software</li>
                                    <li>Keyboard-only navigation</li>
                                    <li>High contrast and color inversion modes</li>
                                </ul>

                                <h3>Browser Compatibility</h3>
                                <p>We recommend using the latest versions of the following browsers for the best experience:</p>
                                <ul>
                                    <li>Google Chrome</li>
                                    <li>Mozilla Firefox</li>
                                    <li>Microsoft Edge</li>
                                    <li>Apple Safari</li>
                                </ul>
                            </section>

                            <section id="improvements">
                                <h2>Ongoing Improvements</h2>
                                <p>
                                    We are committed to continuously improving the accessibility of our website.
                                    Our efforts include:
                                </p>
                                <ul>
                                    <li>Regular accessibility audits and testing</li>
                                    <li>User testing with people who use assistive technologies</li>
                                    <li>Staff training on digital accessibility</li>
                                    <li>Integration of accessibility into our development process</li>
                                    <li>Prompt response to accessibility issues and feedback</li>
                                </ul>
                            </section>

                            <section id="feedback">
                                <h2>Feedback</h2>
                                <p>
                                    We welcome your feedback on the accessibility of the Precision Accounting website.
                                    If you encounter any accessibility barriers or have suggestions for improvement,
                                    please let us know.
                                </p>
                                <p>When providing feedback, please include:</p>
                                <ul>
                                    <li>The web page URL where you encountered the issue</li>
                                    <li>A description of the accessibility problem</li>
                                    <li>The assistive technology or browser you were using</li>
                                    <li>Any suggestions for how we might resolve the issue</li>
                                </ul>
                            </section>

                            <section id="contact">
                                <h2>Contact Us</h2>
                                <p>
                                    If you have any questions about our accessibility efforts or need assistance
                                    accessing any part of our website, please contact us:
                                </p>
                                <div className="contact-info-box">
                                    <p><strong>Accessibility Support</strong></p>
                                    <p>Email: <a href="mailto:reliableprofessionals.co@gmail.com">reliableprofessionals.co@gmail.com</a></p>
                                    <p>Phone: <a href="tel:+918920473074">+91 8920473074</a></p>
                                    <p>Address: 56, New Layal Pur, Dixit Gali, Delhi -110051</p>
                                </div>
                                <p>
                                    We aim to respond to accessibility feedback within 2 business days and to
                                    resolve accessibility issues as quickly as possible.
                                </p>
                            </section>

                            <div className="accessibility-note">
                                <h3>Alternative Formats</h3>
                                <p>
                                    If you need any of our content in an alternative format (such as large print,
                                    audio, or Braille), please contact us and we will do our best to accommodate
                                    your request.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Accessibility;
