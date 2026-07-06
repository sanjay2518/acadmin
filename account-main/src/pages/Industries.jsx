import { Link, useParams } from 'react-router-dom';
import { Hospital, Monitor, Factory, Building2, ShoppingCart, Handshake, BarChart3, FileText, Briefcase } from 'lucide-react';
import Hero from '../components/Hero';
import ServiceCard from '../components/ServiceCard';
import './Industries.css';

const Industries = () => {
    const { industryType } = useParams();

    const allIndustries = {
        healthcare: {
            icon: <Hospital size={32} color="#fff" strokeWidth={1.8} />,
            title: 'Healthcare',
            tagline: 'Specialized solutions for healthcare providers',
            description: 'We understand the unique financial challenges facing healthcare organizations, from regulatory compliance to revenue cycle management.',
            challenges: [
                'Complex regulatory environment (HIPAA, Medicare/Medicaid)',
                'Revenue cycle management and billing optimization',
                'Cost containment and operational efficiency',
                'Technology integration and cybersecurity'
            ],
            solutions: [
                'Healthcare-specific audit and compliance services',
                'Revenue cycle optimization',
                'Cost reduction strategies',
                'HIPAA compliance consulting'
            ]
        },
        technology: {
            icon: <Monitor size={32} color="#fff" strokeWidth={1.8} />,
            title: 'Technology',
            tagline: 'Fueling growth for tech innovators',
            description: 'From startups to established tech companies, we provide the financial expertise needed to scale successfully.',
            challenges: [
                'Rapid growth and scaling challenges',
                'R&D tax credit optimization',
                'Stock compensation accounting',
                'M&A and exit planning'
            ],
            solutions: [
                'R&D tax credit studies',
                'Stock-based compensation advisory',
                'IPO and exit readiness services',
                'International tax planning'
            ]
        },
        manufacturing: {
            icon: <Factory size={32} color="#fff" strokeWidth={1.8} />,
            title: 'Manufacturing',
            tagline: 'Precision accounting for precision manufacturing',
            description: 'We help manufacturers optimize operations, manage costs, and navigate the complexities of global supply chains.',
            challenges: [
                'Supply chain cost management',
                'Inventory and cost accounting',
                'International operations and transfer pricing',
                'Tax incentives for equipment and facilities'
            ],
            solutions: [
                'Cost accounting optimization',
                'Transfer pricing studies',
                'Equipment depreciation strategies',
                'State and local tax incentives'
            ]
        },
        'real-estate': {
            icon: <Building2 size={32} color="#fff" strokeWidth={1.8} />,
            title: 'Real Estate',
            tagline: 'Building value in real estate investments',
            description: 'Our real estate specialists understand the unique accounting, tax, and advisory needs of property owners and investors.',
            challenges: [
                'Complex partnership and fund structures',
                'Cost segregation and depreciation',
                'Like-kind exchanges (1031)',
                'Opportunity Zone investments'
            ],
            solutions: [
                'Real estate fund administration',
                'Cost segregation studies',
                '1031 exchange planning',
                'Opportunity Zone consulting'
            ]
        },
        retail: {
            icon: <ShoppingCart size={32} color="#fff" strokeWidth={1.8} />,
            title: 'Retail',
            tagline: 'Supporting retail success',
            description: 'We help retailers navigate the rapidly changing landscape with actionable financial insights and strategic guidance.',
            challenges: [
                'Omnichannel operations and e-commerce',
                'Inventory management and valuation',
                'Multi-state tax compliance',
                'Seasonal cash flow management'
            ],
            solutions: [
                'Sales tax compliance and automation',
                'Inventory valuation services',
                'Cash flow forecasting',
                'E-commerce tax advisory'
            ]
        },
        'non-profit': {
            icon: <Handshake size={32} color="#fff" strokeWidth={1.8} />,
            title: 'Non-Profit',
            tagline: 'Maximizing impact for mission-driven organizations',
            description: 'We help non-profits maintain compliance, improve efficiency, and focus on their mission.',
            challenges: [
                'Grant management and compliance',
                'Form 990 preparation and compliance',
                'Donor restrictions and fund accounting',
                'Board governance and oversight'
            ],
            solutions: [
                'Non-profit audit and assurance',
                'Form 990 preparation',
                'Grant compliance consulting',
                'Board training and governance'
            ]
        }
    };

    const industries = Object.entries(allIndustries).map(([key, value]) => ({
        ...value,
        path: `/industries/${key}`
    }));

    // Individual industry page
    if (industryType && allIndustries[industryType]) {
        const industry = allIndustries[industryType];

        return (
            <main className="industry-detail-page">
                <Hero
                    size="medium"
                    subtitle={`Industry Expertise`}
                    title={industry.title}
                    description={industry.description}
                    primaryCTA={{ label: "Get Started", path: "/contact" }}
                    secondaryCTA={{ label: "All Industries", path: "/industries" }}
                />

                {/* Challenges & Solutions */}
                <section className="challenges-section section-lg">
                    <div className="container">
                        <div className="challenges-grid">
                            <div className="challenges-column">
                                <span className="section-subtitle">Understanding Your Challenges</span>
                                <h2>Industry Challenges</h2>
                                <ul className="challenges-list">
                                    {industry.challenges.map((challenge, index) => (
                                        <li key={index}>
                                            <svg viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                            </svg>
                                            <span>{challenge}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="solutions-column">
                                <span className="section-subtitle">How We Help</span>
                                <h2>Our Solutions</h2>
                                <ul className="solutions-list">
                                    {industry.solutions.map((solution, index) => (
                                        <li key={index}>
                                            <svg viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                            </svg>
                                            <span>{solution}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services for Industry */}
                <section className="industry-services section-lg bg-gray">
                    <div className="container">
                        <div className="section-header text-center">
                            <span className="section-subtitle">Our Services</span>
                            <h2>Services for {industry.title}</h2>
                        </div>

                        <div className="services-grid grid grid-cols-3">
                            <ServiceCard
                                icon={<BarChart3 size={32} color="#fff" strokeWidth={1.8} />}
                                title="Audit & Assurance"
                                description={`Specialized audit services for ${industry.title.toLowerCase()} organizations.`}
                                path="/services/audit"
                            />
                            <ServiceCard
                                icon={<FileText size={32} color="#fff" strokeWidth={1.8} />}
                                title="Tax Services"
                                description={`Industry-specific tax planning and compliance for ${industry.title.toLowerCase()}.`}
                                path="/services/tax"
                            />
                            <ServiceCard
                                icon={<Briefcase size={32} color="#fff" strokeWidth={1.8} />}
                                title="Advisory"
                                description={`Strategic guidance tailored to the ${industry.title.toLowerCase()} sector.`}
                                path="/services/advisory"
                            />
                        </div>
                    </div>
                </section>

                {/* Other Industries */}
                <section className="other-industries section-lg">
                    <div className="container">
                        <div className="section-header text-center">
                            <span className="section-subtitle">Explore More</span>
                            <h2>Other Industries We Serve</h2>
                        </div>

                        <div className="industries-cards">
                            {industries
                                .filter(i => i.title !== industry.title)
                                .slice(0, 4)
                                .map((ind, index) => (
                                    <Link key={index} to={ind.path} className="industry-link-card">
                                        <span className="industry-icon">{ind.icon}</span>
                                        <span className="industry-name">{ind.title}</span>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                ))
                            }
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="industry-cta-section section-lg bg-dark">
                    <div className="container">
                        <div className="cta-content text-center">
                            <h2>Let's Discuss Your {industry.title} Needs</h2>
                            <p>
                                Our industry specialists are ready to help you navigate your unique challenges.
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

    // Industries overview page
    return (
        <main className="industries-page">
            <Hero
                size="medium"
                subtitle="Industry Expertise"
                title="Deep Knowledge Across Sectors"
                description="We bring specialized expertise to each industry we serve, understanding the unique challenges and opportunities that affect your business."
                primaryCTA={{ label: "Contact Us", path: "/contact" }}
            />

            {/* All Industries */}
            <section className="all-industries section-lg">
                <div className="container">
                    <div className="industries-intro">
                        <span className="section-subtitle">Industries We Serve</span>
                        <h2>Specialized Expertise for Your Sector</h2>
                        <p>
                            Our professionals have deep experience across a wide range of industries,
                            allowing us to understand your specific regulatory requirements, accounting
                            standards, and business challenges.
                        </p>
                    </div>

                    <div className="industries-grid-large">
                        {industries.map((industry, index) => (
                            <Link key={index} to={industry.path} className="industry-card-large">
                                <div className="industry-header">
                                    <span className="industry-icon-large">{industry.icon}</span>
                                    <h3>{industry.title}</h3>
                                </div>
                                <p className="industry-tagline">{industry.tagline}</p>
                                <p className="industry-description">{industry.description}</p>
                                <span className="industry-cta">
                                    Learn More
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="industries-cta section-lg bg-dark">
                <div className="container">
                    <div className="cta-content text-center">
                        <h2>Don't See Your Industry?</h2>
                        <p>
                            We work with businesses across all sectors. Contact us to discuss
                            your specific needs and how we can help.
                        </p>
                        <Link to="/contact" className="btn btn-primary btn-lg">
                            Get in Touch
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Industries;
