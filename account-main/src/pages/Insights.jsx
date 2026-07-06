import { useState, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Search, Calendar, BarChart3, BookOpen } from 'lucide-react';
import Hero from '../components/Hero';
import InsightCard from '../components/InsightCard';
import './Insights.css';

// Import insight images
import taxPlanningImg from '../assets/images/insight-tax-planning.png';
import auditStandardsImg from '../assets/images/insight-audit-standards.png';
import cashFlowImg from '../assets/images/insight-cash-flow.png';
import healthcareImg from '../assets/images/insight-healthcare.png';
import webinarImg from '../assets/images/insight-webinar.png';
import stateTaxImg from '../assets/images/insight-state-tax.png';
import maDiligenceImg from '../assets/images/insight-ma-diligence.png';
import techSectorImg from '../assets/images/insight-tech-sector.png';
import internalControlsImg from '../assets/images/insight-controls.png';

const Insights = () => {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Handle URL query params for category filtering
    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            // Map URL params to filter values
            const categoryMap = {
                'tax': 'tax',
                'reports': 'industry',
                'industry': 'industry',
                'webinars': 'webinar',
                'webinar': 'webinar',
                'audit': 'audit',
                'advisory': 'advisory'
            };
            setActiveFilter(categoryMap[categoryParam] || 'all');
        } else {
            setActiveFilter('all');
        }
    }, [searchParams]);

    // Handle hash navigation for scrolling to sections
    useEffect(() => {
        if (location.hash) {
            const element = document.querySelector(location.hash);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        }
    }, [location]);

    const categories = [
        { value: 'all', label: 'All' },
        { value: 'tax', label: 'Tax Updates' },
        { value: 'audit', label: 'Audit' },
        { value: 'advisory', label: 'Advisory' },
        { value: 'industry', label: 'Industry Reports' },
    ];

    const insights = [
        {
            id: 1,
            title: '2026 Tax Planning Strategies for Startups',
            excerpt: 'Discover essential tax-saving strategies that can help your startup minimize liability and maximize growth potential in the new year.',
            category: 'tax',
            categoryLabel: 'Tax Update',
            date: 'January 15, 2026',
            readTime: '5 min read',
            path: '/insights/tax-planning-2026',
            image: taxPlanningImg,
            featured: true
        },
        {
            id: 2,
            title: 'Understanding the New Audit Standards',
            excerpt: 'A comprehensive guide to the latest changes in audit requirements and how they affect your business compliance.',
            category: 'audit',
            categoryLabel: 'Audit',
            date: 'January 12, 2026',
            readTime: '4 min read',
            path: '/insights/new-audit-standards',
            image: auditStandardsImg
        },
        {
            id: 3,
            title: 'CFO Insights: Managing Cash Flow for New Businesses',
            excerpt: 'Expert tips on maintaining healthy cash flow and financial stability during your startup phase.',
            category: 'advisory',
            categoryLabel: 'Advisory',
            date: 'January 10, 2026',
            readTime: '6 min read',
            path: '/insights/cfo-cash-flow',
            image: cashFlowImg
        },
        {
            id: 4,
            title: 'Healthcare Industry Financial Trends 2026',
            excerpt: 'Key financial trends shaping the healthcare industry and what they mean for your organization.',
            category: 'industry',
            categoryLabel: 'Industry Report',
            date: 'January 8, 2026',
            readTime: '8 min read',
            path: '/insights/healthcare-trends-2026',
            image: healthcareImg
        },
        {
            id: 5,
            title: 'R&D Tax Credit Maximization Guide',
            excerpt: 'Expert strategies to maximize your R&D tax credits while maintaining full compliance with all requirements.',
            category: 'tax',
            categoryLabel: 'Tax Update',
            date: 'January 6, 2026',
            readTime: '7 min read',
            path: '/insights/rd-tax-credit',
            image: webinarImg
        },
        {
            id: 6,
            title: 'State Tax Nexus: What You Need to Know',
            excerpt: 'Understanding state tax nexus requirements in the post-Wayfair era and how to maintain multi-state compliance.',
            category: 'tax',
            categoryLabel: 'Tax Update',
            date: 'January 5, 2026',
            readTime: '7 min read',
            path: '/insights/state-tax-nexus',
            image: stateTaxImg
        },
        {
            id: 7,
            title: 'M&A Due Diligence Best Practices',
            excerpt: 'Essential due diligence practices to protect your interests in mergers and acquisitions.',
            category: 'advisory',
            categoryLabel: 'Advisory',
            date: 'January 4, 2026',
            readTime: '6 min read',
            path: '/insights/ma-due-diligence',
            image: maDiligenceImg
        },
        {
            id: 8,
            title: 'Technology Sector Financial Outlook',
            excerpt: 'Analysis of financial trends in the technology sector and strategic considerations for tech companies.',
            category: 'industry',
            categoryLabel: 'Industry Report',
            date: 'January 3, 2026',
            readTime: '10 min read',
            path: '/insights/tech-outlook',
            image: techSectorImg
        },
        {
            id: 9,
            title: 'Internal Control Assessments: A Practical Guide',
            excerpt: 'Step-by-step guidance on evaluating and strengthening your organization\'s internal controls.',
            category: 'audit',
            categoryLabel: 'Audit',
            date: 'January 2, 2026',
            readTime: '5 min read',
            path: '/insights/internal-controls',
            image: internalControlsImg
        },
    ];

    const filteredInsights = insights.filter(insight => {
        const matchesFilter = activeFilter === 'all' || insight.category === activeFilter;
        const matchesSearch = insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            insight.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <main className="insights-page">
            <Hero
                size="medium"
                subtitle="Our Thinking"
                title="Insights & Resources"
                description="Stay informed with the latest tax updates, industry trends, and expert perspectives from our team."
                primaryCTA={{ label: "Subscribe", path: "/subscribe" }}
            />

            {/* Filters */}
            <section className="insights-filters">
                <div className="container">
                    <div className="filters-bar">
                        <div className="filter-categories">
                            {categories.map(category => (
                                <button
                                    key={category.value}
                                    className={`filter-btn ${activeFilter === category.value ? 'active' : ''}`}
                                    onClick={() => setActiveFilter(category.value)}
                                >
                                    {category.label}
                                </button>
                            ))}
                        </div>

                        <div className="filter-search">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <path d="M21 21l-4.35-4.35" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search insights..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Insights Grid */}
            <section className="insights-content section-lg">
                <div className="container">
                    {filteredInsights.length > 0 ? (
                        <div className="insights-grid">
                            {filteredInsights.map((insight, index) => (
                                <InsightCard
                                    key={insight.id}
                                    title={insight.title}
                                    excerpt={insight.excerpt}
                                    category={insight.categoryLabel}
                                    date={insight.date}
                                    readTime={insight.readTime}
                                    path={insight.path}
                                    image={insight.image}
                                    featured={index === 0 && activeFilter === 'all'}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="no-results">
                            <div className="no-results-icon"><Search size={48} color="var(--accent-green)" strokeWidth={1.5} /></div>
                            <h3>No results found</h3>
                            <p>Try adjusting your search or filter criteria.</p>
                            <button
                                className="btn btn-dark"
                                onClick={() => { setActiveFilter('all'); setSearchQuery(''); }}
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="newsletter-section section-lg bg-dark">
                <div className="container">
                    <div className="newsletter-content">
                        <div className="newsletter-text">
                            <span className="section-subtitle">Stay Informed</span>
                            <h2>Subscribe to Our Newsletter</h2>
                            <p>
                                Get the latest insights, tax updates, and industry news delivered
                                straight to your inbox.
                            </p>
                        </div>

                        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                            <div className="newsletter-input-group">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    required
                                />
                                <button type="submit" className="btn btn-primary">
                                    Subscribe
                                </button>
                            </div>
                            <p className="newsletter-disclaimer">
                                By subscribing, you agree to our privacy policy. You can unsubscribe at any time.
                            </p>
                        </form>
                    </div>
                </div>
            </section>

            {/* Resources Section */}
            <section id="resources" className="resources-section section-lg">
                <div className="container">
                    <div className="section-header text-center">
                        <span className="section-subtitle">Free Resources</span>
                        <h2>Helpful Tools & Guides</h2>
                        <p className="section-description">
                            Download our free resources to help you manage your business finances effectively.
                        </p>
                    </div>

                    <div className="resources-grid">
                        <div className="resource-card">
                            <div className="resource-icon"><Calendar size={32} color="#00D26A" strokeWidth={1.8} /></div>
                            <h3>Tax Calendar 2026</h3>
                            <p>Never miss an important tax deadline with our comprehensive calendar covering all federal and GST filing dates.</p>
                            <div className="resource-meta">
                                <span className="resource-format">PDF</span>
                                <span className="resource-size">~50 KB</span>
                            </div>
                            <a
                                href="/resources/tax-calendar-2026.pdf"
                                download="Tax-Calendar-2026.pdf"
                                className="resource-link"
                            >
                                Download PDF
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                                </svg>
                            </a>
                        </div>

                        <div className="resource-card">
                            <div className="resource-icon"><BarChart3 size={32} color="#00D26A" strokeWidth={1.8} /></div>
                            <h3>Business Financial Checklist</h3>
                            <p>Essential daily, weekly, monthly, quarterly, and annual tasks to keep your business finances in perfect order.</p>
                            <div className="resource-meta">
                                <span className="resource-format">PDF</span>
                                <span className="resource-size">~45 KB</span>
                            </div>
                            <a
                                href="/resources/business-financial-checklist.pdf"
                                download="Business-Financial-Checklist.pdf"
                                className="resource-link"
                            >
                                Download PDF
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                                </svg>
                            </a>
                        </div>

                        <div className="resource-card">
                            <div className="resource-icon"><BookOpen size={32} color="#00D26A" strokeWidth={1.8} /></div>
                            <h3>Small Business Tax Guide</h3>
                            <p>Complete guide covering tax obligations, record keeping, deductions, GST compliance, and tax planning strategies.</p>
                            <div className="resource-meta">
                                <span className="resource-format">PDF</span>
                                <span className="resource-size">~60 KB</span>
                            </div>
                            <a
                                href="/resources/small-business-tax-guide.pdf"
                                download="Small-Business-Tax-Guide.pdf"
                                className="resource-link"
                            >
                                Download PDF
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Insights;
