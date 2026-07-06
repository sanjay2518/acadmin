import { Link, useParams } from 'react-router-dom';
import { BarChart3, FileText, Briefcase, BookOpen, Wallet, Target } from 'lucide-react';
import Hero from '../components/Hero';
import ServiceCard from '../components/ServiceCard';
import './Services.css';

const Services = () => {
    const { serviceType } = useParams();

    const allServices = {
        audit: {
            icon: <BarChart3 size={32} color="#fff" strokeWidth={1.8} />,
            title: 'Audit & Assurance',
            tagline: 'Building trust through transparency',
            description: 'Our audit and assurance services help organizations build trust with stakeholders through independent, high-quality audits and attestation engagements.',
            features: [
                'Financial Statement Audits',
                'Internal Control Reviews',
                'SOC 1 & SOC 2 Reports',
                'Agreed-Upon Procedures',
                'Compliance Audits',
                'Employee Benefit Plan Audits'
            ],
            benefits: [
                { title: 'Enhanced Credibility', description: 'Independent verification of your financial statements builds trust with investors, lenders, and partners.' },
                { title: 'Risk Identification', description: 'Our auditors identify potential risks and control weaknesses before they become problems.' },
                { title: 'Regulatory Compliance', description: 'Stay compliant with evolving regulatory requirements and industry standards.' },
            ]
        },
        tax: {
            icon: <FileText size={32} color="#fff" strokeWidth={1.8} />,
            title: 'Tax Services',
            tagline: 'Strategic tax planning for growth',
            description: 'Our comprehensive tax services help businesses and individuals minimize tax liability while maintaining full compliance with all applicable laws and regulations.',
            features: [
                'Corporate Tax Planning',
                'Individual Tax Returns',
                'State & Local Tax (SALT)',
                'International Tax',
                'Tax Controversy & Resolution',
                'R&D Tax Credits'
            ],
            benefits: [
                { title: 'Tax Savings', description: 'Strategic planning to minimize your tax burden and maximize available credits and deductions.' },
                { title: 'Proactive Strategy', description: 'Year-round tax planning, not just compliance at tax time.' },
                { title: 'Multi-State Expertise', description: 'Navigate complex state and local tax requirements with confidence.' },
            ]
        },
        advisory: {
            icon: <Briefcase size={32} color="#fff" strokeWidth={1.8} />,
            title: 'Financial Advisory',
            tagline: 'Expert guidance for critical decisions',
            description: 'Our advisory team provides strategic guidance for transactions, transformations, and complex business challenges.',
            features: [
                'Mergers & Acquisitions',
                'Due Diligence',
                'Business Valuations',
                'Restructuring',
                'Litigation Support',
                'Strategic Planning'
            ],
            benefits: [
                { title: 'Transaction Success', description: 'Expert support throughout the deal lifecycle to maximize value and minimize risk.' },
                { title: 'Objective Insights', description: 'Unbiased analysis and recommendations based on data and experience.' },
                { title: 'Implementation Support', description: 'Help executing strategies and integrating acquisitions.' },
            ]
        },
        bookkeeping: {
            icon: <BookOpen size={32} color="#fff" strokeWidth={1.8} />,
            title: 'Bookkeeping',
            tagline: 'Accurate records, clear insights',
            description: 'Our bookkeeping services ensure your financial records are accurate, up-to-date, and provide the insights you need to manage your business effectively.',
            features: [
                'Daily Transaction Recording',
                'Bank Reconciliation',
                'Accounts Payable/Receivable',
                'Financial Reporting',
                'Cash Flow Management',
                'Year-End Closing'
            ],
            benefits: [
                { title: 'Time Savings', description: 'Focus on running your business while we handle the financial details.' },
                { title: 'Real-Time Visibility', description: 'Always know where your business stands financially.' },
                { title: 'Cost Efficiency', description: 'Reduce overhead compared to maintaining in-house staff.' },
            ]
        },
        payroll: {
            icon: <Wallet size={32} color="#fff" strokeWidth={1.8} />,
            title: 'Payroll Services',
            tagline: 'Reliable payroll, every time',
            description: 'Our payroll services ensure your employees are paid accurately and on time, while maintaining compliance with all employment tax requirements.',
            features: [
                'Payroll Processing',
                'Tax Filing & Deposits',
                'Direct Deposit',
                'Employee Self-Service',
                'Benefits Administration',
                'Time & Attendance'
            ],
            benefits: [
                { title: 'Accuracy Guaranteed', description: 'Eliminate errors and ensure every paycheck is correct.' },
                { title: 'Compliance Assurance', description: 'Stay current with changing employment tax laws and regulations.' },
                { title: 'Employee Satisfaction', description: 'Self-service portals and on-time pay keep employees happy.' },
            ]
        },
        consulting: {
            icon: <Target size={32} color="#fff" strokeWidth={1.8} />,
            title: 'Business Consulting',
            tagline: 'Strategy for sustainable growth',
            description: 'Our consulting services help businesses overcome challenges, capitalize on opportunities, and achieve sustainable growth.',
            features: [
                'Strategic Planning',
                'Process Improvement',
                'Technology Advisory',
                'CFO Services',
                'Growth Strategy',
                'Performance Management'
            ],
            benefits: [
                { title: 'Expert Perspective', description: 'Fresh insights from experienced advisors who have seen what works.' },
                { title: 'Actionable Solutions', description: 'Practical recommendations that can be implemented immediately.' },
                { title: 'Measurable Results', description: 'Track improvements and demonstrate ROI on consulting investments.' },
            ]
        }
    };

    const services = Object.values(allServices);

    // If viewing a specific service
    if (serviceType && allServices[serviceType]) {
        const service = allServices[serviceType];

        return (
            <main className="service-detail-page">
                <Hero
                    size="medium"
                    subtitle={service.tagline}
                    title={service.title}
                    description={service.description}
                    primaryCTA={{ label: "Get Started", path: "/contact" }}
                    secondaryCTA={{ label: "All Services", path: "/services" }}
                />

                {/* Features Section */}
                <section className="features-section section-lg">
                    <div className="container">
                        <div className="features-grid">
                            <div className="features-content">
                                <span className="section-subtitle">Our Capabilities</span>
                                <h2>What We Offer</h2>
                                <p>
                                    Our {service.title.toLowerCase()} team brings deep expertise and
                                    a commitment to excellence to every engagement.
                                </p>
                            </div>
                            <div className="features-list">
                                {service.features.map((feature, index) => (
                                    <div key={index} className="feature-item">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                        </svg>
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="benefits-section section-lg bg-gray">
                    <div className="container">
                        <div className="section-header text-center">
                            <span className="section-subtitle">Why Choose Us</span>
                            <h2>The Precision Advantage</h2>
                        </div>

                        <div className="benefits-grid">
                            {service.benefits.map((benefit, index) => (
                                <div key={index} className="benefit-card">
                                    <div className="benefit-number">{String(index + 1).padStart(2, '0')}</div>
                                    <h3>{benefit.title}</h3>
                                    <p>{benefit.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Related Services */}
                <section className="related-services section-lg">
                    <div className="container">
                        <div className="section-header text-center">
                            <span className="section-subtitle">Explore More</span>
                            <h2>Related Services</h2>
                        </div>

                        <div className="services-grid grid grid-cols-3">
                            {services
                                .filter(s => s.title !== service.title)
                                .slice(0, 3)
                                .map((s, index) => (
                                    <ServiceCard
                                        key={index}
                                        icon={s.icon}
                                        title={s.title}
                                        description={s.description.substring(0, 100) + '...'}
                                        path={`/services/${Object.keys(allServices).find(key => allServices[key].title === s.title)}`}
                                    />
                                ))
                            }
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="service-cta section-lg bg-dark">
                    <div className="container">
                        <div className="cta-content text-center">
                            <h2>Ready to Get Started?</h2>
                            <p>
                                Contact us today to learn how our {service.title.toLowerCase()} can help your business.
                            </p>
                            <Link to="/contact" className="btn btn-primary btn-lg">
                                Schedule a Consultation
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    // Services overview page
    return (
        <main className="services-page">
            <Hero
                size="medium"
                subtitle="What We Do"
                title="Comprehensive Financial Services"
                description="From day-to-day bookkeeping to strategic advisory, we offer a full spectrum of services tailored to help your business thrive."
                primaryCTA={{ label: "Contact Us", path: "/contact" }}
            />

            {/* All Services */}
            <section className="all-services section-lg">
                <div className="container">
                    <div className="services-intro">
                        <span className="section-subtitle">Our Services</span>
                        <h2>Expertise Across Every Financial Discipline</h2>
                        <p>
                            We combine deep technical expertise with a genuine understanding of your business
                            to deliver solutions that create real value.
                        </p>
                    </div>

                    <div className="services-grid grid grid-cols-3">
                        {services.map((service, index) => (
                            <ServiceCard
                                key={index}
                                icon={service.icon}
                                title={service.title}
                                description={service.description.substring(0, 120) + '...'}
                                path={`/services/${Object.keys(allServices).find(key => allServices[key].title === service.title)}`}
                                tag={index === 0 ? 'Most Popular' : undefined}
                                size="large"
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="process-section section-lg bg-dark">
                <div className="container">
                    <div className="section-header text-center">
                        <span className="section-subtitle">Our Approach</span>
                        <h2 className="text-white">How We Work</h2>
                    </div>

                    <div className="process-steps">
                        <div className="process-step">
                            <div className="step-number">01</div>
                            <h3>Discovery</h3>
                            <p>We begin by understanding your business, challenges, and goals through in-depth consultation.</p>
                        </div>
                        <div className="process-connector"></div>
                        <div className="process-step">
                            <div className="step-number">02</div>
                            <h3>Strategy</h3>
                            <p>Our team develops a customized approach tailored to your specific needs and objectives.</p>
                        </div>
                        <div className="process-connector"></div>
                        <div className="process-step">
                            <div className="step-number">03</div>
                            <h3>Execution</h3>
                            <p>We implement solutions with precision, keeping you informed every step of the way.</p>
                        </div>
                        <div className="process-connector"></div>
                        <div className="process-step">
                            <div className="step-number">04</div>
                            <h3>Support</h3>
                            <p>Our relationship doesn't end at delivery. We provide ongoing support and guidance.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="services-cta section-lg">
                <div className="container">
                    <div className="cta-card">
                        <div className="cta-content text-center">
                            <h2>Not Sure Which Service You Need?</h2>
                            <p>
                                Our team can help you identify the right solutions for your business.
                                Schedule a free consultation to discuss your needs.
                            </p>
                            <Link to="/contact" className="btn btn-primary btn-lg">
                                Schedule Free Consultation
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Services;
