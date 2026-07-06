import { useParams, Link, useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import './InsightDetail.css';

// Import images
import taxPlanningImg from '../assets/images/insight-tax-planning.png';
import auditStandardsImg from '../assets/images/insight-audit-standards.png';
import cashFlowImg from '../assets/images/insight-cash-flow.png';
import healthcareImg from '../assets/images/insight-healthcare.png';
import webinarImg from '../assets/images/insight-webinar.png';
import stateTaxImg from '../assets/images/insight-state-tax.png';
import maDiligenceImg from '../assets/images/insight-ma-diligence.png';
import techSectorImg from '../assets/images/insight-tech-sector.png';
import internalControlsImg from '../assets/images/insight-controls.png';

const InsightDetail = () => {
    const { slug } = useParams();
    const location = useLocation();

    // Determine the full key based on the path (for webinar routes)
    const isWebinar = location.pathname.includes('/webinars/');
    const dataKey = isWebinar ? `webinars/${slug}` : slug;

    // Full insight data with detailed content
    const insightsData = {
        'tax-planning-2026': {
            id: 1,
            title: '2026 Tax Planning Strategies for Startups',
            category: 'Tax Update',
            date: 'January 15, 2026',
            readTime: '5 min read',
            author: 'Precision Accounting Team',
            image: taxPlanningImg,
            excerpt: 'Discover essential tax-saving strategies that can help your startup minimize liability and maximize growth potential in the new year.',
            content: `
                <h2>Introduction</h2>
                <p>As a startup in 2026, understanding the tax landscape is crucial for maximizing your financial resources and ensuring sustainable growth. With the right strategies, you can minimize your tax liability while remaining fully compliant with all regulations.</p>
                
                <h2>Key Tax Deductions for Startups</h2>
                <p>Startups have access to numerous tax deductions that can significantly reduce their taxable income:</p>
                <ul>
                    <li><strong>Startup Costs:</strong> You can deduct up to ₹50,000 in startup costs in your first year, with the remaining costs amortized over 15 years.</li>
                    <li><strong>Home Office Deduction:</strong> If you work from home, you may be eligible for the home office deduction based on the percentage of your home used for business.</li>
                    <li><strong>Equipment and Technology:</strong> Computers, software, and other business equipment can often be fully deducted in the year of purchase.</li>
                    <li><strong>Professional Services:</strong> Legal, accounting, and consulting fees are fully deductible business expenses.</li>
                </ul>

                <h2>R&D Tax Credits</h2>
                <p>The Research and Development (R&D) tax credit is one of the most valuable incentives available to startups engaged in innovation. This credit can offset payroll taxes for qualifying small businesses, providing immediate cash flow benefits.</p>

                <h2>Entity Structure Considerations</h2>
                <p>Choosing the right business entity structure can have significant tax implications. Consider factors like:</p>
                <ul>
                    <li>Pass-through taxation vs. corporate taxation</li>
                    <li>Self-employment tax obligations</li>
                    <li>Future investment and exit plans</li>
                    <li>State-specific tax considerations</li>
                </ul>

                <h2>Quarterly Tax Planning</h2>
                <p>Don't wait until year-end to think about taxes. Quarterly tax planning helps you:</p>
                <ul>
                    <li>Avoid underpayment penalties</li>
                    <li>Maintain healthy cash flow</li>
                    <li>Make informed business decisions throughout the year</li>
                    <li>Identify tax-saving opportunities early</li>
                </ul>

                <h2>Conclusion</h2>
                <p>Effective tax planning is essential for startup success. By understanding available deductions, credits, and strategies, you can keep more of your hard-earned revenue and reinvest it in your business growth. Contact our team for personalized tax planning advice tailored to your startup's unique situation.</p>
            `
        },
        'new-audit-standards': {
            id: 2,
            title: 'Understanding the New Audit Standards',
            category: 'Audit',
            date: 'January 12, 2026',
            readTime: '4 min read',
            author: 'Precision Accounting Team',
            image: auditStandardsImg,
            excerpt: 'A comprehensive guide to the latest changes in audit requirements and how they affect your business compliance.',
            content: `
                <h2>Overview of New Standards</h2>
                <p>The auditing profession is continuously evolving to meet the demands of modern business. The new audit standards introduced in 2026 bring significant changes that affect how audits are conducted and what businesses need to prepare.</p>

                <h2>Key Changes in 2026</h2>
                <p>The major updates to audit standards include:</p>
                <ul>
                    <li><strong>Enhanced Risk Assessment:</strong> Auditors must now perform more rigorous risk assessment procedures, including deeper analysis of internal controls.</li>
                    <li><strong>Technology Integration:</strong> New standards emphasize the use of data analytics and automated audit tools.</li>
                    <li><strong>ESG Reporting:</strong> Environmental, Social, and Governance factors are now part of standard audit considerations.</li>
                    <li><strong>Fraud Detection:</strong> Enhanced procedures for identifying and responding to fraud risks.</li>
                </ul>

                <h2>Impact on Your Business</h2>
                <p>These changes may require your organization to:</p>
                <ul>
                    <li>Strengthen internal controls and documentation</li>
                    <li>Invest in better financial reporting systems</li>
                    <li>Prepare more detailed supporting documentation</li>
                    <li>Engage in more frequent communication with auditors</li>
                </ul>

                <h2>Preparing for Your Next Audit</h2>
                <p>To ensure a smooth audit process under the new standards:</p>
                <ul>
                    <li>Review and update your accounting policies</li>
                    <li>Document all significant estimates and judgments</li>
                    <li>Ensure your internal control documentation is current</li>
                    <li>Train your team on the new requirements</li>
                </ul>

                <h2>How We Can Help</h2>
                <p>Our audit team is fully trained on the new standards and can help your organization prepare for and navigate these changes. Contact us to schedule a pre-audit consultation.</p>
            `
        },
        'cfo-cash-flow': {
            id: 3,
            title: 'CFO Insights: Managing Cash Flow for New Businesses',
            category: 'Advisory',
            date: 'January 10, 2026',
            readTime: '6 min read',
            author: 'Precision Accounting Team',
            image: cashFlowImg,
            excerpt: 'Expert tips on maintaining healthy cash flow and financial stability during your startup phase.',
            content: `
                <h2>The Importance of Cash Flow Management</h2>
                <p>For new businesses, cash is king. Even profitable companies can fail if they run out of cash. Understanding and managing your cash flow is one of the most critical skills for any business owner or CFO.</p>

                <h2>Cash Flow vs. Profit</h2>
                <p>It's essential to understand that profit and cash flow are not the same thing:</p>
                <ul>
                    <li><strong>Profit:</strong> Revenue minus expenses on an accrual basis</li>
                    <li><strong>Cash Flow:</strong> Actual money coming in and going out of your business</li>
                </ul>
                <p>A business can be profitable on paper but still face cash shortages due to timing differences between when revenue is recognized and when cash is received.</p>

                <h2>Strategies for Healthy Cash Flow</h2>
                <p>Implement these proven strategies to maintain healthy cash flow:</p>
                <ul>
                    <li><strong>Invoice Promptly:</strong> Send invoices immediately upon delivering products or services</li>
                    <li><strong>Offer Early Payment Discounts:</strong> Incentivize customers to pay faster with small discounts</li>
                    <li><strong>Negotiate Payment Terms:</strong> Work with suppliers to extend payment terms where possible</li>
                    <li><strong>Maintain Cash Reserves:</strong> Build a cushion of 3-6 months of operating expenses</li>
                    <li><strong>Monitor Regularly:</strong> Review cash flow statements weekly, not just monthly</li>
                </ul>

                <h2>Cash Flow Forecasting</h2>
                <p>Accurate forecasting helps you anticipate and prepare for cash shortfalls:</p>
                <ul>
                    <li>Create 13-week rolling cash flow forecasts</li>
                    <li>Factor in seasonal variations</li>
                    <li>Include both optimistic and pessimistic scenarios</li>
                    <li>Update forecasts regularly as new information becomes available</li>
                </ul>

                <h2>Warning Signs to Watch</h2>
                <p>Be alert to these red flags that may indicate cash flow problems:</p>
                <ul>
                    <li>Increasing accounts receivable aging</li>
                    <li>Difficulty meeting payroll or vendor payments</li>
                    <li>Reliance on credit facilities for daily operations</li>
                    <li>Declining cash balance trend</li>
                </ul>

                <h2>Conclusion</h2>
                <p>Effective cash flow management is the foundation of financial stability. By implementing these strategies and maintaining vigilant monitoring, you can ensure your business has the cash it needs to thrive.</p>
            `
        },
        'healthcare-trends-2026': {
            id: 4,
            title: 'Healthcare Industry Financial Trends 2026',
            category: 'Industry Report',
            date: 'January 8, 2026',
            readTime: '8 min read',
            author: 'Precision Accounting Team',
            image: healthcareImg,
            excerpt: 'Key financial trends shaping the healthcare industry and what they mean for your organization.',
            content: `
                <h2>State of Healthcare Finance in 2026</h2>
                <p>The healthcare industry continues to evolve rapidly, driven by technological advances, regulatory changes, and shifting patient expectations. Understanding these trends is essential for healthcare organizations to remain financially healthy.</p>

                <h2>Key Financial Trends</h2>
                
                <h3>1. Value-Based Care Expansion</h3>
                <p>The shift from fee-for-service to value-based care models continues to accelerate, requiring healthcare providers to focus on outcomes rather than volume. This impacts revenue recognition, contract management, and performance measurement.</p>

                <h3>2. Telehealth Integration</h3>
                <p>Virtual care has become a permanent fixture in healthcare delivery. Organizations must account for:</p>
                <ul>
                    <li>Technology infrastructure investments</li>
                    <li>Revised billing and coding procedures</li>
                    <li>New revenue streams and cost structures</li>
                </ul>

                <h3>3. Labor Cost Challenges</h3>
                <p>Healthcare organizations face ongoing challenges with:</p>
                <ul>
                    <li>Rising wages and signing bonuses</li>
                    <li>Increased use of travel nurses and contract staff</li>
                    <li>Investment in workforce development and retention</li>
                </ul>

                <h3>4. Cybersecurity Investments</h3>
                <p>With healthcare being a prime target for cyberattacks, organizations are investing heavily in:</p>
                <ul>
                    <li>Security infrastructure and monitoring</li>
                    <li>Staff training and awareness programs</li>
                    <li>Incident response capabilities</li>
                </ul>

                <h2>Regulatory Considerations</h2>
                <p>Healthcare organizations must stay current with evolving regulations including:</p>
                <ul>
                    <li>Price transparency requirements</li>
                    <li>Surprise billing protections</li>
                    <li>HIPAA compliance updates</li>
                    <li>State-specific regulations</li>
                </ul>

                <h2>Strategic Recommendations</h2>
                <p>To navigate these trends successfully:</p>
                <ul>
                    <li>Invest in robust financial planning and analysis capabilities</li>
                    <li>Develop flexible budgeting approaches</li>
                    <li>Focus on operational efficiency</li>
                    <li>Build strong payer relationships</li>
                </ul>

                <h2>Conclusion</h2>
                <p>The healthcare financial landscape in 2026 presents both challenges and opportunities. Organizations that adapt quickly and strategically will be best positioned for success.</p>
            `
        },
        'rd-tax-credit': {
            id: 5,
            title: 'R&D Tax Credit Maximization Guide',
            category: 'Tax Update',
            date: 'January 6, 2026',
            readTime: '7 min read',
            author: 'Precision Accounting Team',
            image: webinarImg,
            excerpt: 'Expert strategies to maximize your R&D tax credits while maintaining full compliance with all requirements.',
            content: `
                <h2>Understanding R&D Tax Credits</h2>
                <p>The Research and Development (R&D) tax credit is one of the most valuable incentives available to businesses engaged in innovation. This guide shares insights on how businesses can maximize their R&D tax credits while ensuring full compliance with all requirements.</p>

                <h2>What Qualifies as R&D?</h2>
                <ul>
                    <li>Understanding what qualifies as R&D for tax credit purposes</li>
                    <li>Documentation requirements for successful claims</li>
                    <li>Common mistakes to avoid</li>
                    <li>Strategies to maximize your credit amount</li>
                    <li>Recent changes in R&D tax credit regulations</li>
                </ul>

                <h2>Who Should Use This Guide</h2>
                <p>This guide is designed for:</p>
                <ul>
                    <li>CFOs and Finance Directors</li>
                    <li>Tax Managers and Accountants</li>
                    <li>R&D and Engineering Leaders</li>
                    <li>Business Owners in technology and manufacturing sectors</li>
                </ul>

                <h2>Key Topics Covered</h2>

                <h3>Qualifying Activities</h3>
                <p>Learn which activities qualify for the R&D tax credit, including development of new products, processes, software, and improvements to existing offerings.</p>

                <h3>Four-Part Test</h3>
                <p>Understand the IRS four-part test that determines qualifying research:</p>
                <ul>
                    <li>Permitted Purpose</li>
                    <li>Technological Uncertainty</li>
                    <li>Process of Experimentation</li>
                    <li>Technological in Nature</li>
                </ul>

                <h3>Documentation Best Practices</h3>
                <p>Proper documentation is critical for successful R&D tax credit claims. We cover:</p>
                <ul>
                    <li>What records to maintain</li>
                    <li>Time tracking requirements</li>
                    <li>Project documentation</li>
                    <li>Contractor and supplier records</li>
                </ul>

                <h2>Downloadable Resources</h2>
                <p>As part of this guide, we offer access to:</p>
                <ul>
                    <li>R&D Tax Credit Qualification Checklist</li>
                    <li>Documentation Template Package</li>
                    <li>Case Study Examples</li>
                </ul>

                <h2>Schedule a Consultation</h2>
                <p>Need help with your R&D tax credit claim? Schedule a consultation with our specialists to discuss your specific situation and opportunities.</p>
            `
        },
        'state-tax-nexus': {
            id: 6,
            title: 'State Tax Nexus: What You Need to Know',
            category: 'Tax Update',
            date: 'January 5, 2026',
            readTime: '7 min read',
            author: 'Precision Accounting Team',
            image: stateTaxImg,
            excerpt: 'Understanding state tax nexus requirements in the post-Wayfair era and how to maintain multi-state compliance.',
            content: `
                <h2>Introduction to State Tax Nexus</h2>
                <p>State tax nexus determines when a business has sufficient connection to a state to be subject to its taxes. In the post-Wayfair era, understanding these requirements is crucial for any business selling across state lines.</p>

                <h2>What is Tax Nexus?</h2>
                <p>Nexus is the connection between a business and a state that gives the state the authority to tax that business. Types of nexus include:</p>
                <ul>
                    <li><strong>Physical Nexus:</strong> Having employees, inventory, property, or offices in a state</li>
                    <li><strong>Economic Nexus:</strong> Exceeding sales thresholds in a state (typically $100,000 in sales or 200 transactions)</li>
                    <li><strong>Click-Through Nexus:</strong> Having in-state affiliates who refer customers through website links</li>
                    <li><strong>Marketplace Nexus:</strong> Selling through marketplace facilitators like Amazon or eBay</li>
                </ul>

                <h2>The Wayfair Decision Impact</h2>
                <p>The 2018 South Dakota v. Wayfair Supreme Court decision fundamentally changed nexus rules by allowing states to require sales tax collection based on economic activity alone, without any physical presence. Key implications include:</p>
                <ul>
                    <li>All states can now impose economic nexus standards</li>
                    <li>Remote sellers must track sales by state</li>
                    <li>Small seller exceptions vary by state</li>
                    <li>Compliance complexity has increased significantly</li>
                </ul>

                <h2>State-by-State Variations</h2>
                <p>Each state has its own nexus rules and thresholds. Common variations include:</p>
                <ul>
                    <li>Different economic thresholds (sales amounts and transaction counts)</li>
                    <li>Varying effective dates for compliance</li>
                    <li>Different product and service taxability rules</li>
                    <li>Various registration and filing requirements</li>
                </ul>

                <h2>Compliance Best Practices</h2>
                <p>To maintain multi-state compliance:</p>
                <ul>
                    <li>Track sales by state in real-time</li>
                    <li>Implement automated tax calculation software</li>
                    <li>Monitor threshold approaching triggers</li>
                    <li>Register proactively when approaching thresholds</li>
                    <li>Keep detailed records of all transactions</li>
                </ul>

                <h2>Conclusion</h2>
                <p>Navigating state tax nexus requires ongoing attention and expertise. Our team can help you assess your nexus footprint and implement compliant processes. Contact us for a nexus study tailored to your business.</p>
            `
        },
        'ma-due-diligence': {
            id: 7,
            title: 'M&A Due Diligence Best Practices',
            category: 'Advisory',
            date: 'January 4, 2026',
            readTime: '6 min read',
            author: 'Precision Accounting Team',
            image: maDiligenceImg,
            excerpt: 'Essential due diligence practices to protect your interests in mergers and acquisitions.',
            content: `
                <h2>The Importance of Due Diligence</h2>
                <p>Due diligence is the critical investigation process that occurs before finalizing a merger or acquisition. Thorough due diligence protects buyers from unforeseen liabilities and helps ensure a successful transaction.</p>

                <h2>Key Areas of Due Diligence</h2>

                <h3>1. Financial Due Diligence</h3>
                <p>This is often the most critical area and includes:</p>
                <ul>
                    <li>Analysis of historical financial statements</li>
                    <li>Quality of earnings assessment</li>
                    <li>Working capital analysis</li>
                    <li>Debt and liability review</li>
                    <li>Cash flow sustainability evaluation</li>
                </ul>

                <h3>2. Tax Due Diligence</h3>
                <p>Understanding the tax implications is essential:</p>
                <ul>
                    <li>Review of tax returns and positions</li>
                    <li>Identification of tax exposures and risks</li>
                    <li>Analysis of tax attributes (NOLs, credits)</li>
                    <li>Transfer pricing compliance</li>
                    <li>Post-transaction tax structuring opportunities</li>
                </ul>

                <h3>3. Operational Due Diligence</h3>
                <p>Assess the target's operations:</p>
                <ul>
                    <li>Customer concentration analysis</li>
                    <li>Supplier and vendor relationships</li>
                    <li>Key employee retention risks</li>
                    <li>IT systems and infrastructure</li>
                    <li>Intellectual property assessment</li>
                </ul>

                <h3>4. Legal Due Diligence</h3>
                <p>Legal review should cover:</p>
                <ul>
                    <li>Contract review and assignment provisions</li>
                    <li>Pending and threatened litigation</li>
                    <li>Regulatory compliance status</li>
                    <li>Environmental liabilities</li>
                    <li>Employment matters and obligations</li>
                </ul>

                <h2>Common Due Diligence Pitfalls</h2>
                <p>Avoid these common mistakes:</p>
                <ul>
                    <li>Insufficient time allocated for the process</li>
                    <li>Over-reliance on management representations</li>
                    <li>Failure to verify key assumptions</li>
                    <li>Inadequate integration planning</li>
                    <li>Ignoring cultural fit assessment</li>
                </ul>

                <h2>Conclusion</h2>
                <p>Comprehensive due diligence is your best protection in any M&A transaction. Our experienced team has helped numerous clients navigate successful acquisitions. Contact us to discuss your upcoming transaction.</p>
            `
        },
        'tech-outlook': {
            id: 8,
            title: 'Technology Sector Financial Outlook',
            category: 'Industry Report',
            date: 'January 3, 2026',
            readTime: '10 min read',
            author: 'Precision Accounting Team',
            image: techSectorImg,
            excerpt: 'Analysis of financial trends in the technology sector and strategic considerations for tech companies.',
            content: `
                <h2>Technology Sector Overview 2026</h2>
                <p>The technology sector continues to be a driving force in the global economy. As we move through 2026, several key trends are shaping the financial landscape for tech companies of all sizes.</p>

                <h2>Key Financial Trends</h2>

                <h3>1. AI and Machine Learning Investments</h3>
                <p>Artificial intelligence remains the dominant investment theme:</p>
                <ul>
                    <li>Massive R&D spending on AI capabilities</li>
                    <li>Integration of AI across product lines</li>
                    <li>Premium valuations for AI-native companies</li>
                    <li>Talent acquisition costs for AI expertise</li>
                </ul>

                <h3>2. Cloud Computing Economics</h3>
                <p>Cloud infrastructure continues to evolve:</p>
                <ul>
                    <li>Shift from growth-at-all-costs to profitable growth</li>
                    <li>Multi-cloud and hybrid strategies gaining traction</li>
                    <li>Edge computing investments increasing</li>
                    <li>Focus on cloud cost optimization</li>
                </ul>

                <h3>3. Cybersecurity Spending</h3>
                <p>Security remains a top priority:</p>
                <ul>
                    <li>Increased budgets for security infrastructure</li>
                    <li>Demand for zero-trust architecture solutions</li>
                    <li>Compliance-driven security investments</li>
                    <li>Cyber insurance considerations</li>
                </ul>

                <h2>Financial Considerations for Tech Companies</h2>

                <h3>Revenue Recognition Challenges</h3>
                <p>Tech companies face unique revenue recognition issues:</p>
                <ul>
                    <li>SaaS subscription revenue timing</li>
                    <li>Multi-element arrangements</li>
                    <li>Usage-based billing models</li>
                    <li>Platform and marketplace economics</li>
                </ul>

                <h3>Stock-Based Compensation</h3>
                <p>Equity compensation remains significant:</p>
                <ul>
                    <li>Impact on profitability metrics</li>
                    <li>Dilution management strategies</li>
                    <li>Retention and incentive balance</li>
                    <li>Tax implications for employees and companies</li>
                </ul>

                <h2>Strategic Recommendations</h2>
                <p>For tech companies navigating 2026:</p>
                <ul>
                    <li>Balance growth investments with path to profitability</li>
                    <li>Implement robust financial planning and forecasting</li>
                    <li>Focus on unit economics and customer lifetime value</li>
                    <li>Maintain strong cash reserves for opportunities</li>
                </ul>

                <h2>Conclusion</h2>
                <p>The technology sector offers tremendous opportunities but requires sophisticated financial management. Our team specializes in helping tech companies navigate these challenges. Reach out to discuss your specific needs.</p>
            `
        },
        'internal-controls': {
            id: 9,
            title: 'Internal Control Assessments: A Practical Guide',
            category: 'Audit',
            date: 'January 2, 2026',
            readTime: '5 min read',
            author: 'Precision Accounting Team',
            image: internalControlsImg,
            excerpt: 'Step-by-step guidance on evaluating and strengthening your organization\'s internal controls.',
            content: `
                <h2>What Are Internal Controls?</h2>
                <p>Internal controls are the policies, procedures, and practices an organization implements to ensure reliable financial reporting, operational efficiency, and compliance with laws and regulations. A strong control environment is essential for any well-managed organization.</p>

                <h2>The COSO Framework</h2>
                <p>The Committee of Sponsoring Organizations (COSO) framework is the leading standard for internal control. It consists of five integrated components:</p>
                <ul>
                    <li><strong>Control Environment:</strong> The tone at the top and overall control consciousness</li>
                    <li><strong>Risk Assessment:</strong> Identifying and analyzing risks to achievement of objectives</li>
                    <li><strong>Control Activities:</strong> Policies and procedures that address identified risks</li>
                    <li><strong>Information & Communication:</strong> Systems supporting internal control responsibilities</li>
                    <li><strong>Monitoring Activities:</strong> Ongoing evaluations and separate assessments</li>
                </ul>

                <h2>Types of Controls</h2>
                <p>Effective control systems include various types:</p>
                <ul>
                    <li><strong>Preventive Controls:</strong> Designed to prevent errors or irregularities (e.g., segregation of duties)</li>
                    <li><strong>Detective Controls:</strong> Designed to identify issues after they occur (e.g., reconciliations)</li>
                    <li><strong>Manual Controls:</strong> Performed by people (e.g., approvals, reviews)</li>
                    <li><strong>Automated Controls:</strong> Built into systems (e.g., system access restrictions)</li>
                </ul>

                <h2>Conducting a Control Assessment</h2>
                <p>Follow these steps to assess your internal controls:</p>
                <ul>
                    <li><strong>Step 1:</strong> Identify key processes and risks</li>
                    <li><strong>Step 2:</strong> Document existing controls</li>
                    <li><strong>Step 3:</strong> Evaluate control design (are they designed to address risks?)</li>
                    <li><strong>Step 4:</strong> Test control effectiveness (are they operating as designed?)</li>
                    <li><strong>Step 5:</strong> Identify gaps and remediation actions</li>
                    <li><strong>Step 6:</strong> Report findings and monitor improvements</li>
                </ul>

                <h2>Common Control Deficiencies</h2>
                <p>Watch for these frequently encountered issues:</p>
                <ul>
                    <li>Inadequate segregation of duties</li>
                    <li>Lack of documented policies and procedures</li>
                    <li>Insufficient review and approval processes</li>
                    <li>Weak IT access controls</li>
                    <li>Incomplete reconciliation processes</li>
                </ul>

                <h2>Benefits of Strong Controls</h2>
                <p>Investing in internal controls provides numerous benefits:</p>
                <ul>
                    <li>Reduced risk of fraud and errors</li>
                    <li>Improved financial reporting reliability</li>
                    <li>Enhanced operational efficiency</li>
                    <li>Better regulatory compliance</li>
                    <li>Stronger stakeholder confidence</li>
                </ul>

                <h2>Conclusion</h2>
                <p>Effective internal controls are fundamental to organizational success. Whether you need a full control assessment or help addressing specific gaps, our team is here to help. Contact us to discuss your internal control needs.</p>
            `
        }
    };

    // Get the insight data based on dataKey (handles webinar routes)
    const insight = insightsData[dataKey];

    // If insight not found, show a default message
    if (!insight) {
        return (
            <main className="insight-detail-page">
                <Hero
                    size="small"
                    subtitle="Insight"
                    title="Article Not Found"
                    description="The requested article could not be found."
                />
                <section className="insight-not-found section-lg">
                    <div className="container text-center">
                        <p>Sorry, we couldn't find the article you're looking for.</p>
                        <Link to="/insights" className="btn btn-primary btn-lg">
                            Back to Insights
                        </Link>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="insight-detail-page">
            {/* Hero with Article Title */}
            <Hero
                size="medium"
                subtitle={insight.category}
                title={insight.title}
                description={`${insight.date} • ${insight.readTime}`}
            />

            {/* Article Content */}
            <article className="insight-article section-lg">
                <div className="container">
                    <div className="article-layout">
                        {/* Featured Image */}
                        <div className="article-image">
                            <img src={insight.image} alt={insight.title} />
                        </div>

                        {/* Article Meta */}
                        <div className="article-meta">
                            <span className="article-category">{insight.category}</span>
                            <span className="article-date">{insight.date}</span>
                            <span className="article-author">By {insight.author}</span>
                        </div>

                        {/* Article Body */}
                        <div
                            className="article-body"
                            dangerouslySetInnerHTML={{ __html: insight.content }}
                        />

                        {/* Share & Actions */}
                        <div className="article-actions">
                            <div className="share-section">
                                <span>Share this article:</span>
                                <div className="share-buttons">
                                    <button className="share-btn" aria-label="Share on LinkedIn">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                    </button>
                                    <button className="share-btn" aria-label="Share on Twitter">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                        </svg>
                                    </button>
                                    <button className="share-btn" aria-label="Share via Email">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <Link to="/insights" className="btn btn-dark">
                                ← Back to All Insights
                            </Link>
                        </div>
                    </div>
                </div>
            </article>

            {/* CTA Section */}
            <section className="insight-cta section-lg bg-gray">
                <div className="container">
                    <div className="cta-content text-center">
                        <h2>Need Expert Guidance?</h2>
                        <p>
                            Our team is here to help you navigate the complexities of financial
                            management and tax planning.
                        </p>
                        <Link to="/contact" className="btn btn-primary btn-lg">
                            Schedule a Consultation
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default InsightDetail;
