import { Link } from 'react-router-dom';
import { MapPin, Clock, GraduationCap } from 'lucide-react';
import Hero from '../components/Hero';
import './Careers.css';

const AccountingIntern = () => {
    return (
        <main className="job-detail-page">
            <Hero
                size="small"
                subtitle="Internship Opportunity"
                title="Accounting Intern"
                description="Join our team and gain hands-on experience in accounting, taxation, and audit practices."
            />

            <section className="job-detail section-lg">
                <div className="container">
                    <div className="job-detail-content">
                        <div className="job-header">
                            <div className="job-meta">
                                <span className="job-location"><MapPin size={16} /> Delhi, India</span>
                                <span className="job-type"><Clock size={16} /> Internship</span>
                                <span className="job-experience"><GraduationCap size={16} /> 0-1 years</span>
                            </div>
                        </div>

                        <div className="job-description">
                            <h2>About This Role</h2>
                            <p>
                                We are currently hiring Accounting Interns to join our dynamic team.
                                This internship provides excellent exposure to practical accounting,
                                taxation, and audit work under the guidance of experienced Chartered Accountants.
                            </p>

                            <h2>Selected Intern's Day-to-Day Responsibilities Include:</h2>

                            <div className="responsibility-section">
                                <h3>1. Daily Accounting Entries:</h3>
                                <ul>
                                    <li>Record day-to-day transactions in Tally or Excel including sales, purchases, payments, and receipts.</li>
                                    <li>Maintain vouchers and supporting documents properly filed and organized.</li>
                                </ul>
                            </div>

                            <div className="responsibility-section">
                                <h3>2. GST Work:</h3>
                                <ul>
                                    <li>Assist in preparation and working of GST returns (GSTR-1, GSTR-3B, etc.).</li>
                                    <li>Match purchase invoices and reconcile input tax credit.</li>
                                    <li>Help in preparing data for GST audit or notices, if any.</li>
                                </ul>
                            </div>

                            <div className="responsibility-section">
                                <h3>3. Income Tax Assistance:</h3>
                                <ul>
                                    <li>Collect and organize financial data for filing income tax returns.</li>
                                    <li>Support in computation of taxable income and preparation of workings.</li>
                                    <li>Maintain client-wise ITR working papers and trackers.</li>
                                </ul>
                            </div>

                            <div className="responsibility-section">
                                <h3>4. Audit Support:</h3>
                                <ul>
                                    <li>Assist in statutory, internal, and tax audits.</li>
                                    <li>Prepare audit schedules and collect necessary client documents.</li>
                                    <li>Check vouchers, ledgers, and supporting entries for accuracy.</li>
                                </ul>
                            </div>

                            <div className="responsibility-section">
                                <h3>5. Reconciliation Work:</h3>
                                <ul>
                                    <li>Perform bank reconciliation on a regular basis.</li>
                                    <li>Assist in vendor, debtor, and creditor reconciliation as assigned.</li>
                                </ul>
                            </div>

                            <div className="responsibility-section">
                                <h3>6. Client Coordination:</h3>
                                <ul>
                                    <li>Communicate with clients for document collection and clarification of queries.</li>
                                    <li>Maintain proper follow-up records for pending data.</li>
                                </ul>
                            </div>

                            <div className="responsibility-section">
                                <h3>7. Data Compilation & Reporting:</h3>
                                <ul>
                                    <li>Help in preparation of monthly P&L, balance sheet summaries, and MIS reports.</li>
                                    <li>Update Excel trackers and maintain filing status logs.</li>
                                </ul>
                            </div>

                            <div className="responsibility-section">
                                <h3>8. Learning & Documentation:</h3>
                                <ul>
                                    <li>Work under the supervision of the Chartered Accountant and seniors to understand practical accounting and tax concepts.</li>
                                    <li>Maintain notes and learnings for future reference.</li>
                                </ul>
                            </div>

                            <h2>Requirements</h2>
                            <ul className="requirements-list">
                                <li>Currently pursuing or recently completed B.Com/M.Com/CA/CMA</li>
                                <li>Basic knowledge of accounting principles</li>
                                <li>Familiarity with Tally and Excel (preferred)</li>
                                <li>Strong attention to detail and organizational skills</li>
                                <li>Good communication skills</li>
                                <li>Eagerness to learn and grow</li>
                            </ul>
                        </div>

                        <div className="job-apply">
                            <Link to="/contact" className="btn btn-primary btn-lg">
                                Apply Now
                            </Link>
                            <Link to="/careers" className="btn btn-outline btn-lg">
                                Back to Careers
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default AccountingIntern;