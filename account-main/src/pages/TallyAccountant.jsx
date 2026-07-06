import { Link } from 'react-router-dom';
import { MapPin, Clock, GraduationCap } from 'lucide-react';
import Hero from '../components/Hero';
import './Careers.css';

const TallyAccountant = () => {
    return (
        <main className="job-detail-page">
            <Hero
                size="small"
                subtitle="Full-time Position"
                title="Tally Accountant"
                description="Join our accounting team and handle comprehensive accounting operations using Tally software."
            />

            <section className="job-detail section-lg">
                <div className="container">
                    <div className="job-detail-content">
                        <div className="job-header">
                            <div className="job-meta">
                                <span className="job-location"><MapPin size={16} /> Delhi, India</span>
                                <span className="job-type"><Clock size={16} /> Full-time</span>
                                <span className="job-experience"><GraduationCap size={16} /> 1+ years</span>
                            </div>
                        </div>

                        <div className="job-description">
                            <h2>About This Role</h2>
                            <p>
                                We are seeking an experienced Tally Accountant to join our accounting team.
                                The role involves comprehensive accounting operations, GST compliance, and
                                supporting various financial processes using Tally software.
                            </p>

                            <h2>Job Responsibilities:</h2>

                            <div className="responsibility-section">
                                <h3>1. Day-to-Day Accounting:</h3>
                                <ul>
                                    <li>Recording daily accounting transactions in Tally.</li>
                                    <li>Passing sales, purchase, expense, journal and contra entries.</li>
                                    <li>Maintaining proper ledger accounts, vouchers and narration.</li>
                                    <li>Ensuring correct account heads and cost centres are used.</li>
                                    <li>Handling cash and bank accounting.</li>
                                </ul>
                            </div>

                            <div className="responsibility-section">
                                <h3>2. Sales & Purchase Accounting:</h3>
                                <ul>
                                    <li>Recording sales invoices, credit notes and debit notes.</li>
                                    <li>Recording purchase bills, expense invoices and vendor advances.</li>
                                    <li>Tracking receivables and payables.</li>
                                    <li>Coordinating with operations/sales team for missing or incorrect bills.</li>
                                </ul>
                            </div>

                            <div className="responsibility-section">
                                <h3>3. Bank, Cash & Other Reconciliations:</h3>
                                <ul>
                                    <li>Performing bank reconciliation statements (BRS) on monthly basis.</li>
                                    <li>Cash balance verification and reporting differences.</li>
                                    <li>Reconciliation of:</li>
                                    <ul>
                                        <li>Sales as per books vs GST returns</li>
                                        <li>Purchase register vs GSTR-2B</li>
                                        <li>Ledger balances vs confirmations</li>
                                    </ul>
                                </ul>
                            </div>

                            <div className="responsibility-section">
                                <h3>4. GST Compliance Support:</h3>
                                <ul>
                                    <li>Preparation of GST data for:</li>
                                    <ul>
                                        <li>GSTR-1 (Sales data)</li>
                                        <li>GSTR-3B (Summary data)</li>
                                    </ul>
                                    <li>Matching purchase data with GSTR-2B.</li>
                                    <li>Identifying ineligible ITC and reversals.</li>
                                    <li>Assisting in GST notices, reconciliations and corrections.</li>
                                    <li>Maintaining proper GST working files in Excel.</li>
                                </ul>
                            </div>

                            <div className="responsibility-section">
                                <h3>5. TDS Compliance Support:</h3>
                                <ul>
                                    <li>Preparation of TDS working (vendor-wise / section-wise).</li>
                                    <li>Assisting in:</li>
                                    <ul>
                                        <li>Quarterly TDS return data preparation</li>
                                        <li>Challan reconciliation with books</li>
                                        <li>Matching TDS with Form 26Q / 24Q data</li>
                                    </ul>
                                    <li>Maintaining TDS deduction records and due dates.</li>
                                </ul>
                            </div>

                            <div className="responsibility-section">
                                <h3>6. Documentation & Records:</h3>
                                <ul>
                                    <li>Maintaining proper physical and digital records of:</li>
                                    <ul>
                                        <li>Invoices</li>
                                        <li>Bank statements</li>
                                        <li>GST filings</li>
                                        <li>TDS workings</li>
                                    </ul>
                                    <li>Ensuring documents are audit-ready.</li>
                                </ul>
                            </div>

                            <div className="responsibility-section">
                                <h3>7. MIS & Reporting Support:</h3>
                                <ul>
                                    <li>Preparing basic monthly MIS reports:</li>
                                    <ul>
                                        <li>Outstanding receivables & payables</li>
                                        <li>Expense summaries</li>
                                        <li>GST summaries</li>
                                    </ul>
                                    <li>Providing data support for finalisation and audits.</li>
                                </ul>
                            </div>

                            <div className="responsibility-section">
                                <h3>8. Coordination & Compliance Support:</h3>
                                <ul>
                                    <li>Coordinating with:</li>
                                    <ul>
                                        <li>Vendors for pending bills</li>
                                        <li>Clients/internal teams for data</li>
                                    </ul>
                                    <li>Supporting seniors during:</li>
                                    <ul>
                                        <li>Audits</li>
                                        <li>Return filings</li>
                                        <li>Departmental requirements</li>
                                    </ul>
                                </ul>
                            </div>

                            <h2>Required Skills & Knowledge:</h2>
                            <ul className="requirements-list">
                                <li>Working knowledge of Tally</li>
                                <li>Basic understanding of GST & TDS</li>
                                <li>Good command over Excel (basic formulas, filters)</li>
                                <li>Attention to detail and documentation discipline</li>
                                <li>Ability to meet compliance timelines</li>
                                <li>English Proficiency (Written)</li>
                                <li>MS-Excel and MS-Office proficiency</li>
                            </ul>

                            <h2>Who Can Apply:</h2>
                            <ul className="requirements-list">
                                <li>Candidates with minimum 1 year of experience</li>
                                <li>Strong knowledge of Tally software</li>
                                <li>Experience in GST and TDS compliance</li>
                                <li>Ability to work independently and meet deadlines</li>
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

export default TallyAccountant;