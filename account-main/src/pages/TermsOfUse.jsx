import Hero from '../components/Hero';
import { Link } from 'react-router-dom';
import './LegalPages.css';

const TermsOfUse = () => {
    return (
        <main className="legal-page">
            <Hero
                size="small"
                subtitle="Legal"
                title="Terms of Use"
                description="Last updated: January 1, 2026"
            />

            <section className="legal-content section-lg">
                <div className="container">
                    <div className="legal-container">
                        <nav className="legal-nav">
                            <h4>Contents</h4>
                            <ul>
                                <li><a href="#acceptance">Acceptance of Terms</a></li>
                                <li><a href="#services">Our Services</a></li>
                                <li><a href="#account">Account Responsibilities</a></li>
                                <li><a href="#intellectual-property">Intellectual Property</a></li>
                                <li><a href="#prohibited">Prohibited Activities</a></li>
                                <li><a href="#disclaimer">Disclaimer of Warranties</a></li>
                                <li><a href="#limitation">Limitation of Liability</a></li>
                                <li><a href="#indemnification">Indemnification</a></li>
                                <li><a href="#termination">Termination</a></li>
                                <li><a href="#governing-law">Governing Law</a></li>
                                <li><a href="#changes">Changes to Terms</a></li>
                                <li><a href="#contact">Contact Information</a></li>
                            </ul>
                        </nav>

                        <div className="legal-body">
                            <section id="acceptance">
                                <h2>1. Acceptance of Terms</h2>
                                <p>
                                    By accessing or using the Precision Accounting website and services, you agree to be
                                    bound by these Terms of Use and all applicable laws and regulations. If you do not
                                    agree with any of these terms, you are prohibited from using or accessing our services.
                                </p>
                                <p>
                                    These Terms of Use constitute a legally binding agreement between you and Precision
                                    Accounting regarding your use of our website and professional accounting services.
                                </p>
                            </section>

                            <section id="services">
                                <h2>2. Our Services</h2>
                                <p>
                                    Precision Accounting provides professional accounting, tax preparation, financial advisory,
                                    and related services. Our services include but are not limited to:
                                </p>
                                <ul>
                                    <li>Tax planning and preparation</li>
                                    <li>Audit and assurance services</li>
                                    <li>Financial consulting and advisory</li>
                                    <li>Bookkeeping and accounting services</li>
                                    <li>Payroll processing</li>
                                    <li>Business consulting</li>
                                </ul>
                                <p>
                                    All professional services are subject to separate engagement letters that outline
                                    specific terms, scope, and fees for each engagement.
                                </p>
                            </section>

                            <section id="account">
                                <h2>3. Account Responsibilities</h2>
                                <p>When you create an account with us or use our client portal, you are responsible for:</p>
                                <ul>
                                    <li>Providing accurate, current, and complete information</li>
                                    <li>Maintaining the confidentiality of your account credentials</li>
                                    <li>All activities that occur under your account</li>
                                    <li>Notifying us immediately of any unauthorized access or security breaches</li>
                                    <li>Updating your information to keep it accurate and current</li>
                                </ul>
                                <p>
                                    We reserve the right to suspend or terminate accounts that violate these terms or
                                    engage in fraudulent activity.
                                </p>
                            </section>

                            <section id="intellectual-property">
                                <h2>4. Intellectual Property</h2>
                                <p>
                                    All content on our website, including text, graphics, logos, images, audio clips,
                                    digital downloads, and software, is the property of Precision Accounting or its
                                    content suppliers and is protected by international copyright laws.
                                </p>
                                <p>You may not:</p>
                                <ul>
                                    <li>Reproduce, duplicate, copy, sell, or exploit any portion of our website without express written permission</li>
                                    <li>Use our trademarks or service marks without prior written consent</li>
                                    <li>Modify or create derivative works based on our content</li>
                                    <li>Remove any copyright or proprietary notices from our materials</li>
                                </ul>
                            </section>

                            <section id="prohibited">
                                <h2>5. Prohibited Activities</h2>
                                <p>You agree not to engage in any of the following prohibited activities:</p>
                                <ul>
                                    <li>Using our services for any unlawful purpose or in violation of any applicable laws</li>
                                    <li>Attempting to gain unauthorized access to our systems or networks</li>
                                    <li>Transmitting viruses, malware, or other harmful code</li>
                                    <li>Interfering with or disrupting our services or servers</li>
                                    <li>Harvesting or collecting information about other users</li>
                                    <li>Impersonating another person or entity</li>
                                    <li>Providing false or misleading information</li>
                                    <li>Using our services to engage in tax evasion or fraud</li>
                                </ul>
                            </section>

                            <section id="disclaimer">
                                <h2>6. Disclaimer of Warranties</h2>
                                <p>
                                    Our website and informational content are provided on an "as is" and "as available"
                                    basis without warranties of any kind, either express or implied.
                                </p>
                                <p>
                                    <strong>Important:</strong> The information on our website is for general informational
                                    purposes only and does not constitute professional tax, legal, or financial advice.
                                    You should consult with qualified professionals for advice specific to your situation.
                                </p>
                                <p>
                                    We do not warrant that our website will be uninterrupted, error-free, or free of
                                    viruses or other harmful components.
                                </p>
                            </section>

                            <section id="limitation">
                                <h2>7. Limitation of Liability</h2>
                                <p>
                                    To the fullest extent permitted by law, Precision Accounting shall not be liable
                                    for any indirect, incidental, special, consequential, or punitive damages, including
                                    but not limited to:
                                </p>
                                <ul>
                                    <li>Loss of profits, revenue, or data</li>
                                    <li>Business interruption</li>
                                    <li>Cost of substitute services</li>
                                    <li>Any other intangible losses</li>
                                </ul>
                                <p>
                                    Our total liability for any claims arising from your use of our website shall not
                                    exceed the amount you paid for our services in the twelve (12) months preceding the claim.
                                </p>
                            </section>

                            <section id="indemnification">
                                <h2>8. Indemnification</h2>
                                <p>
                                    You agree to indemnify, defend, and hold harmless Precision Accounting, its officers,
                                    directors, employees, agents, and affiliates from and against any claims, liabilities,
                                    damages, losses, costs, or expenses (including reasonable attorneys' fees) arising out of:
                                </p>
                                <ul>
                                    <li>Your use of our website or services</li>
                                    <li>Your violation of these Terms of Use</li>
                                    <li>Your violation of any third-party rights</li>
                                    <li>Any content you submit or transmit through our services</li>
                                </ul>
                            </section>

                            <section id="termination">
                                <h2>9. Termination</h2>
                                <p>
                                    We may terminate or suspend your access to our website and services immediately,
                                    without prior notice or liability, for any reason, including if you breach these
                                    Terms of Use.
                                </p>
                                <p>
                                    Upon termination, your right to use our services will cease immediately. All
                                    provisions of these Terms which by their nature should survive termination shall
                                    survive, including ownership provisions, warranty disclaimers, and limitations of liability.
                                </p>
                            </section>

                            <section id="governing-law">
                                <h2>10. Governing Law</h2>
                                <p>
                                    These Terms of Use shall be governed by and construed in accordance with the laws
                                    of India, without regard to its conflict of law provisions. Any disputes arising
                                    from these terms shall be subject to the exclusive jurisdiction of the courts in Delhi.
                                </p>
                            </section>

                            <section id="changes">
                                <h2>11. Changes to Terms</h2>
                                <p>
                                    We reserve the right to modify or replace these Terms of Use at any time at our
                                    sole discretion. We will provide notice of material changes by updating the "Last
                                    Updated" date at the top of this page.
                                </p>
                                <p>
                                    Your continued use of our services after any such changes constitutes your
                                    acceptance of the new Terms of Use.
                                </p>
                            </section>

                            <section id="contact">
                                <h2>12. Contact Information</h2>
                                <p>
                                    If you have any questions about these Terms of Use, please contact us:
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

export default TermsOfUse;
