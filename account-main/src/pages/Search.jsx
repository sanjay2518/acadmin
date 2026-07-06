import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Briefcase, Building2, Newspaper, FileText, Download, Search as SearchIcon, Users } from 'lucide-react';
import Hero from '../components/Hero';
import './Search.css';

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    // All searchable content on the website
    const searchableContent = [
        // Services
        { type: 'Service', title: 'Audit & Assurance', description: 'Comprehensive audit services to ensure compliance and accuracy in financial reporting.', path: '/services/audit', keywords: ['audit', 'assurance', 'compliance', 'financial statements', 'reporting'] },
        { type: 'Service', title: 'Tax Services', description: 'Strategic tax planning and compliance services for individuals and businesses.', path: '/services/tax', keywords: ['tax', 'taxes', 'IRS', 'tax planning', 'tax compliance', 'returns'] },
        { type: 'Service', title: 'Financial Advisory', description: 'Expert financial guidance for mergers, acquisitions, and strategic transactions.', path: '/services/advisory', keywords: ['advisory', 'M&A', 'mergers', 'acquisitions', 'financial planning', 'strategy'] },
        { type: 'Service', title: 'Bookkeeping', description: 'Accurate and efficient bookkeeping services to keep your finances organized.', path: '/services/bookkeeping', keywords: ['bookkeeping', 'accounting', 'ledger', 'records', 'financial records'] },
        { type: 'Service', title: 'Payroll Services', description: 'Complete payroll processing and management solutions for businesses.', path: '/services/payroll', keywords: ['payroll', 'salary', 'wages', 'employees', 'paycheck'] },
        { type: 'Service', title: 'Business Consulting', description: 'Strategic consulting to help your business grow and succeed.', path: '/services/consulting', keywords: ['consulting', 'business strategy', 'growth', 'operations'] },

        // Industries
        { type: 'Industry', title: 'Healthcare', description: 'Specialized financial services for healthcare organizations and providers.', path: '/industries/healthcare', keywords: ['healthcare', 'medical', 'hospitals', 'clinics', 'HIPAA'] },
        { type: 'Industry', title: 'Technology', description: 'Financial solutions tailored for tech companies and startups.', path: '/industries/technology', keywords: ['technology', 'tech', 'software', 'startups', 'SaaS', 'IT'] },
        { type: 'Industry', title: 'Manufacturing', description: 'Accounting services designed for manufacturing and industrial businesses.', path: '/industries/manufacturing', keywords: ['manufacturing', 'industrial', 'factory', 'production'] },
        { type: 'Industry', title: 'Real Estate', description: 'Comprehensive financial services for real estate investors and developers.', path: '/industries/real-estate', keywords: ['real estate', 'property', 'investment', 'development'] },
        { type: 'Industry', title: 'Retail', description: 'Financial solutions for retail businesses and e-commerce companies.', path: '/industries/retail', keywords: ['retail', 'e-commerce', 'stores', 'sales'] },
        { type: 'Industry', title: 'Non-Profit', description: 'Specialized accounting for non-profit organizations and foundations.', path: '/industries/non-profit', keywords: ['non-profit', 'nonprofit', 'charity', 'foundation', '501c3'] },

        // Insights
        { type: 'Insight', title: '2026 Tax Planning Strategies for Startups', description: 'Discover essential tax-saving strategies for your startup.', path: '/insights', keywords: ['tax planning', 'startup', 'tax strategies', '2026'] },
        { type: 'Insight', title: 'Understanding the New Audit Standards', description: 'A comprehensive guide to the latest changes in audit requirements.', path: '/insights', keywords: ['audit standards', 'compliance', 'regulations'] },
        { type: 'Insight', title: 'CFO Insights: Managing Cash Flow for New Businesses', description: 'Expert tips on maintaining healthy cash flow during your startup phase.', path: '/insights', keywords: ['cash flow', 'CFO', 'financial management', 'startup'] },
        { type: 'Insight', title: 'Healthcare Industry Financial Trends 2026', description: 'Key financial trends shaping the healthcare industry.', path: '/insights', keywords: ['healthcare trends', 'financial trends', '2026'] },
        { type: 'Insight', title: 'R&D Tax Credit Maximization', description: 'Strategies to maximize your R&D tax credits while maintaining compliance.', path: '/insights', keywords: ['R&D', 'tax credit', 'research and development'] },

        // Pages
        { type: 'Page', title: 'About Us', description: 'Learn about Precision Accounting and our team of dedicated professionals.', path: '/about', keywords: ['about', 'company', 'team', 'history'] },
        { type: 'Page', title: 'Our Leadership', description: 'Meet our experienced partners and leadership team.', path: '/about#leadership', keywords: ['leadership', 'partners', 'executives', 'team'] },
        { type: 'Page', title: 'Our Values', description: 'Discover the principles that guide our work and relationships.', path: '/about#values', keywords: ['values', 'integrity', 'excellence', 'principles'] },
        { type: 'Page', title: 'Careers', description: 'Explore career opportunities at Precision Accounting.', path: '/careers', keywords: ['careers', 'jobs', 'employment', 'hiring', 'work'] },
        { type: 'Page', title: 'Open Positions', description: 'View our current job openings and apply today.', path: '/careers#positions', keywords: ['jobs', 'positions', 'openings', 'apply'] },
        { type: 'Page', title: 'Contact Us', description: 'Get in touch with our team for questions or consultations.', path: '/contact', keywords: ['contact', 'phone', 'email', 'address', 'location'] },

        // Resources
        { type: 'Resource', title: 'Tax Calendar 2025', description: 'Never miss an important tax deadline with our comprehensive calendar.', path: '/insights#resources', keywords: ['tax calendar', 'deadlines', 'due dates'] },
        { type: 'Resource', title: 'Business Financial Checklist', description: 'Essential checklist to keep your business finances in order.', path: '/insights#resources', keywords: ['checklist', 'financial checklist', 'business finances'] },
        { type: 'Resource', title: 'Small Business Tax Guide', description: 'Complete guide to understanding and managing your business taxes.', path: '/insights#resources', keywords: ['tax guide', 'small business', 'guide'] },
    ];

    useEffect(() => {
        if (!query) {
            setResults([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        // Simulate search delay for better UX
        const timer = setTimeout(() => {
            const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);

            const searchResults = searchableContent.filter(item => {
                const titleMatch = item.title.toLowerCase().includes(query.toLowerCase());
                const descMatch = item.description.toLowerCase().includes(query.toLowerCase());
                const keywordMatch = item.keywords.some(keyword =>
                    searchTerms.some(term => keyword.toLowerCase().includes(term))
                );

                return titleMatch || descMatch || keywordMatch;
            });

            // Sort results by relevance (title matches first)
            searchResults.sort((a, b) => {
                const aTitle = a.title.toLowerCase().includes(query.toLowerCase());
                const bTitle = b.title.toLowerCase().includes(query.toLowerCase());
                if (aTitle && !bTitle) return -1;
                if (!aTitle && bTitle) return 1;
                return 0;
            });

            setResults(searchResults);
            setLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const getTypeIcon = (type) => {
        const icons = {
            'Service': <Briefcase size={16} />,
            'Industry': <Building2 size={16} />,
            'Insight': <Newspaper size={16} />,
            'Page': <FileText size={16} />,
            'Resource': <Download size={16} />
        };
        return icons[type] || <FileText size={16} />;
    };

    const getTypeColor = (type) => {
        const colors = {
            'Service': '#00D26A',
            'Industry': '#006A96',
            'Insight': '#9B59B6',
            'Page': '#3498DB',
            'Resource': '#E67E22'
        };
        return colors[type] || '#6c757d';
    };

    return (
        <main className="search-page">
            <Hero
                size="small"
                subtitle="Search Results"
                title={query ? `Results for "${query}"` : 'Search Our Website'}
                description={loading ? 'Searching...' : `Found ${results.length} result${results.length !== 1 ? 's' : ''}`}
            />

            <section className="search-results section-lg">
                <div className="container">
                    {loading ? (
                        <div className="search-loading">
                            <div className="loading-spinner"></div>
                            <p>Searching...</p>
                        </div>
                    ) : results.length > 0 ? (
                        <>
                            <div className="results-summary">
                                <p>Showing {results.length} result{results.length !== 1 ? 's' : ''} for <strong>"{query}"</strong></p>
                            </div>

                            <div className="results-list">
                                {results.map((result, index) => (
                                    <Link key={index} to={result.path} className="result-card">
                                        <div className="result-type" style={{ backgroundColor: getTypeColor(result.type) }}>
                                            <span>{getTypeIcon(result.type)}</span>
                                            <span>{result.type}</span>
                                        </div>
                                        <div className="result-content">
                                            <h3>{result.title}</h3>
                                            <p>{result.description}</p>
                                            <span className="result-path">{result.path}</span>
                                        </div>
                                        <div className="result-arrow">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </>
                    ) : query ? (
                        <div className="no-results">
                            <div className="no-results-icon"><SearchIcon size={48} color="var(--accent-green)" strokeWidth={1.5} /></div>
                            <h3>No results found for "{query}"</h3>
                            <p>Try different keywords or browse our sections below.</p>

                            <div className="search-suggestions">
                                <h4>Popular Searches</h4>
                                <div className="suggestion-tags">
                                    <Link to="/search?q=tax">Tax Services</Link>
                                    <Link to="/search?q=audit">Audit</Link>
                                    <Link to="/search?q=payroll">Payroll</Link>
                                    <Link to="/search?q=consulting">Consulting</Link>
                                    <Link to="/search?q=careers">Careers</Link>
                                </div>
                            </div>

                            <div className="quick-links">
                                <h4>Quick Links</h4>
                                <div className="quick-links-grid">
                                    <Link to="/services" className="quick-link">
                                        <span><Briefcase size={20} /></span>
                                        <span>Our Services</span>
                                    </Link>
                                    <Link to="/industries" className="quick-link">
                                        <span><Building2 size={20} /></span>
                                        <span>Industries</span>
                                    </Link>
                                    <Link to="/insights" className="quick-link">
                                        <span><Newspaper size={20} /></span>
                                        <span>Insights</span>
                                    </Link>
                                    <Link to="/contact" className="quick-link">
                                        <span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg></span>
                                        <span>Contact Us</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-search">
                            <div className="empty-icon"><SearchIcon size={48} color="var(--accent-green)" strokeWidth={1.5} /></div>
                            <h3>Start Searching</h3>
                            <p>Use the search bar above to find what you're looking for.</p>

                            <div className="browse-sections">
                                <h4>Or Browse Our Sections</h4>
                                <div className="browse-grid">
                                    <Link to="/services" className="browse-card">
                                        <span className="browse-icon"><Briefcase size={24} /></span>
                                        <h5>Services</h5>
                                        <p>Explore our accounting and advisory services</p>
                                    </Link>
                                    <Link to="/industries" className="browse-card">
                                        <span className="browse-icon"><Building2 size={24} /></span>
                                        <h5>Industries</h5>
                                        <p>Industry-specific financial solutions</p>
                                    </Link>
                                    <Link to="/insights" className="browse-card">
                                        <span className="browse-icon"><Newspaper size={24} /></span>
                                        <h5>Insights</h5>
                                        <p>Latest articles and thought leadership</p>
                                    </Link>
                                    <Link to="/careers" className="browse-card">
                                        <span className="browse-icon"><Users size={24} /></span>
                                        <h5>Careers</h5>
                                        <p>Join our team of professionals</p>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Search;
