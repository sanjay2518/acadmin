import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Users, Star, UserCog, Rocket, Target, Lightbulb, Handshake, Award, Zap, CheckCircle, Building2 } from 'lucide-react';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import TeamCard from '../components/TeamCard';
import AnimateOnScroll from '../components/AnimateOnScroll';
import './About.css';

// Team Member Images
import teamMember1 from '../assets/images/team-member-1.jpg';
import teamMember2 from '../assets/images/team-member-2.png';
import teamMember3 from '../assets/images/team-member-3.jpg';
import teamMember4 from '../assets/images/team-member-4.jpg';
import teamMember5 from '../assets/images/team-member-5.jpg';

const About = () => {
    const stats = [
        { value: 50, suffix: '+', label: 'Clients Served', icon: <Users size={26} color="#fff" strokeWidth={1.8} /> },
        { value: 100, suffix: '%', label: 'Client Satisfaction', icon: <Star size={26} color="#fff" strokeWidth={1.8} /> },
        { value: 6, suffix: '+', label: 'Team Members', icon: <UserCog size={26} color="#fff" strokeWidth={1.8} /> },
        { value: 24, suffix: '/7', label: 'Support', icon: <Rocket size={26} color="#fff" strokeWidth={1.8} /> },
    ];

    const values = [
        {
            icon: <Target size={28} color="#00D26A" strokeWidth={1.8} />,
            title: 'Integrity',
            description: 'We uphold the highest ethical standards in everything we do, ensuring trust and transparency in all client relationships.'
        },
        {
            icon: <Lightbulb size={28} color="#00D26A" strokeWidth={1.8} />,
            title: 'Innovation',
            description: 'We continuously embrace new technologies and methodologies to deliver cutting-edge solutions for our clients.'
        },
        {
            icon: <Handshake size={28} color="#00D26A" strokeWidth={1.8} />,
            title: 'Collaboration',
            description: 'We work as partners with our clients, understanding their goals and delivering personalized service.'
        },
        {
            icon: <Award size={28} color="#00D26A" strokeWidth={1.8} />,
            title: 'Excellence',
            description: 'We are committed to delivering the highest quality work, exceeding expectations at every opportunity.'
        },
    ];

    const leadership = [
        {
            name: 'Athrav Kumar',
            role: 'Accounting & Finance Specialist',
            image: teamMember1,
            bio: 'I work in the field of accounting and finance, handling financial records, reporting, and documentation work. I believe in doing my work with clarity, honesty, and consistency rather than relying on shortcuts. I focus on keeping records accurate, understanding the logic behind numbers, and improving steadily through regular practice. Calm, disciplined, and detail-oriented by nature, I also have a creative side in writing and visual storytelling, which helps me communicate ideas clearly. I aim to grow into someone people can genuinely trust with their financial work.',
            linkedin: '#',
            email: 'sanjay@precisionaccounting.com'
        },
        {
            name: 'Padmana Chopra',
            role: 'Operations Head – Accounting & Finance',
            image: teamMember5,
            bio: 'Results-driven Accounting and Finance professional with a strong command over financial reporting, budgeting, forecasting, and compliance. Dedicated to transforming numbers into strategic business intelligence. With expertise in cost optimization, profit analysis, and operational financial control, I streamline accounting workflows, strengthen internal systems, and ensure data accuracy that drives confident decision-making. Passionate about financial strategy, automation, and scalable operations, I align financial precision with business growth—building systems that enhance transparency, efficiency, and long-term sustainability. As Operations Head, I don\'t just manage finances—I engineer financial excellence that powers performance, trust, and measurable success.',
            linkedin: '#',
            email: 'padmana@precisionaccounting.com'
        },
        {
            name: 'Paras Gupta',
            role: 'Software Engineer',
            image: teamMember3,
            bio: 'I\'m a Software Engineer passionate about building intelligent, scalable, and high-performance digital solutions. With a strong foundation in C++, Python, Web Development, and Machine Learning, I enjoy transforming complex problems into clean, real-world applications. My background in AI and Machine Learning from NSUT, New Delhi, has shaped the way I think about systems, data, and optimization. I thrive on writing efficient code, designing intuitive user experiences, and engineering solutions that balance logic with creativity. Having solved 700+ algorithmic challenges, problem-solving comes naturally to me. I\'m comfortable working across technologies, adapting quickly, and continuously pushing myself to build better, smarter systems. Driven by curiosity and growth, I\'m focused on evolving into a future-ready technologist who builds with purpose and impact.',
            linkedin: 'https://www.linkedin.com/in/paras--gupta',
            email: 'paras.gupta.ws@gmail.com'
        },
        {
            name: 'Sanjay A',
            role: 'Full Stack Developer',
            image: teamMember4,
            bio: 'Creative and detail-oriented Full Stack Web Developer with a strong foundation in building responsive, scalable, and user-centric web applications. I work with HTML, CSS, JavaScript, React, Node.js, Python, Java, SQL, and MongoDB, focusing on clean code, performance, and real-world usability. I have hands-on experience developing full-stack projects, including an E-commerce platform, a French Learning Web Application, and an Emotion-Based Music Recommendation System that uses AI and real-time facial expression analysis to personalize user experiences. These projects strengthened my skills in REST APIs, database integration, and end-to-end application development. Alongside development, I bring experience in automation and cloud technologies, supported by certifications such as UiPath Certified Automation Developer – Associate and SnowPro Associate – Platform.',
            linkedin: '#',
            email: 'sanjayalagupandi@gmail.com'
        },
        {
            name: 'Tasleem Shah',
            role: 'Lead Generation & Virtual Assistant – Admin Support',
            image: teamMember2,
            bio: 'Provides reliable support in lead generation, virtual assistance, and administrative operations. Responsible for prospect research, data collection and verification, CRM-ready lead preparation, calendar and email support, and day-to-day administrative tasks to help the firm operate efficiently and connect with potential clients.',
            linkedin: '#',
            email: 'tasleem@precisionaccounting.com'
        },
        {
            name: 'Nikhil',
            role: 'Chartered Accountant',
            image: null,
            bio: 'A Chartered Accountant with a relentless focus on precision, compliance, and business growth. Helps startups, founders, freelancers, and international clients bring clarity to their finances and confidence to their decisions.\n\nExpertise spans accounting, taxation, GST, audits, and corporate compliances—delivered with a strong commercial mindset. Doesn\'t just prepare numbers; interprets them, challenges them, and turns them into insights that actually drive results.\n\nBacked by advanced skills in Excel, automation, and Power BI, combines financial expertise with technology to deliver fast, accurate, and decision-ready reporting.\n\nClients work with Nikhil for one reason: reliability without excuses. Operates as a long-term financial partner—proactive, detail-obsessed, and always ahead of deadlines.\n\nIf you want your finances handled with absolute seriousness and strategic intent, you\'re in the right place.',
            linkedin: '#',
            email: 'nikhil@precisionaccounting.com'
        },
    ];

    const timeline = [
        { year: '2026', title: 'Founded', description: 'Precision Accounting launched as a modern startup with a vision to provide innovative financial services.' },
        { year: '2026', title: 'Team Assembly', description: 'Built a diverse team of experts in accounting, technology, and business operations.' },
        { year: '2026', title: 'Digital-First Approach', description: 'Launched with cloud-based solutions and AI-powered financial tools from day one.' },
        { year: '2026', title: 'First Clients', description: 'Started serving our first clients with personalized, tech-driven accounting solutions.' },
        { year: 'Future', title: 'Growth Vision', description: 'Committed to becoming a trusted partner for businesses seeking modern financial excellence.' },
    ];

    // Scroll to section if hash is present in URL
    const location = useLocation();

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

    return (
        <main className="about-page">
            <Hero
                size="medium"
                subtitle="About Precision Accounting"
                title="A Fresh Start in Financial Excellence"
                description="We are a passionate team committed to helping businesses achieve their financial goals through innovative solutions, modern technology, and personalized service."
                primaryCTA={{ label: "Meet Our Team", path: "/about#leadership" }}
                secondaryCTA={{ label: "Our Services", path: "/services" }}
            />

            {/* Mission Section */}
            <section className="mission-section section-lg">
                <div className="container">
                    <div className="mission-grid">
                        <AnimateOnScroll animation="slide-left" duration={1}>
                            <div className="mission-content">
                                <span className="section-subtitle">Our Mission</span>
                                <h2>Empowering Businesses Through Financial Clarity</h2>
                                <p>
                                    At Precision Accounting, our mission is to provide exceptional accounting,
                                    tax, and advisory services that empower startups and growing businesses to make
                                    informed decisions and achieve sustainable growth.
                                </p>
                                <p>
                                    As a startup, we combine fresh perspectives with modern technology
                                    to deliver world-class financial expertise. Our approach blends innovation
                                    with a genuine understanding of your business challenges.
                                </p>
                                <div className="mission-features">
                                    <div className="feature">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                        </svg>
                                        <span>Personalized Service</span>
                                    </div>
                                    <div className="feature">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                        </svg>
                                        <span>Industry Expertise</span>
                                    </div>
                                    <div className="feature">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                        </svg>
                                        <span>Proactive Guidance</span>
                                    </div>
                                </div>
                            </div>
                        </AnimateOnScroll>
                        <AnimateOnScroll animation="slide-right" duration={1} delay={0.2}>
                            <div className="mission-image">
                                <div className="image-placeholder">
                                    <Building2 size={48} color="var(--accent-green)" strokeWidth={1.5} />
                                </div>
                            </div>
                        </AnimateOnScroll>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <Stats
                stats={stats}
                variant="minimal"
                subtitle="By The Numbers"
                title="Our Startup Journey So Far"
            />

            {/* Values Section */}
            <section id="values" className="values-section section-lg bg-dark">
                <div className="container">
                    <div className="section-header text-center">
                        <span className="section-subtitle">Our Values</span>
                        <h2 className="text-white">The Principles That Guide Us</h2>
                    </div>

                    <div className="values-grid">
                        {values.map((value, index) => (
                            <AnimateOnScroll key={index} animation="fade-up" stagger={0.15} index={index}>
                                <div className="value-card">
                                    <span className="value-icon">{value.icon}</span>
                                    <h3>{value.title}</h3>
                                    <p>{value.description}</p>
                                </div>
                            </AnimateOnScroll>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="timeline-section section-lg">
                <div className="container">
                    <div className="section-header text-center">
                        <span className="section-subtitle">Our Journey</span>
                        <h2>Building Our Vision in 2026</h2>
                    </div>

                    <div className="timeline">
                        {timeline.map((item, index) => (
                            <AnimateOnScroll key={index} animation="fade-up" stagger={0.2} index={index}>
                                <div className="timeline-item">
                                    <div className="timeline-marker">
                                        <span className="timeline-year">{item.year}</span>
                                    </div>
                                    <div className="timeline-content">
                                        <h4>{item.title}</h4>
                                        <p>{item.description}</p>
                                    </div>
                                </div>
                            </AnimateOnScroll>
                        ))}
                    </div>
                </div>
            </section>

            {/* Leadership Section */}
            <section id="leadership" className="leadership-section section-lg bg-gray">
                <div className="container">
                    <div className="section-header text-center">
                        <span className="section-subtitle">Leadership</span>
                        <h2>Meet Our Partners</h2>
                        <p className="section-description">
                            Our leadership team brings decades of combined experience across
                            all areas of accounting and advisory services.
                        </p>
                    </div>

                    <div className="leadership-grid">
                        {leadership.map((member, index) => (
                            <AnimateOnScroll key={index} animation="scale-up" stagger={0.12} index={index}>
                                <TeamCard {...member} />
                            </AnimateOnScroll>
                        ))}
                    </div>

                    <div className="section-footer text-center">
                        <Link to="/about/leadership" className="btn btn-dark btn-lg">
                            View Full Team
                        </Link>
                    </div>
                </div>
            </section>

            {/* Recognition Section */}
            <section id="recognition" className="recognition-section section-lg">
                <div className="container">
                    <div className="recognition-content">
                        <div className="recognition-text">
                            <span className="section-subtitle">Our Commitments</span>
                            <h2>What We Stand For</h2>
                            <p>
                                As a Startup, we are committed to building trust through
                                transparency, innovation, and exceptional service.
                            </p>
                        </div>

                        <div className="awards-grid">
                            <div className="award-item">
                                <div className="award-icon"><Rocket size={28} color="#00D26A" strokeWidth={1.8} /></div>
                                <h4>Innovation Focus</h4>
                                <p>Modern, tech-driven solutions</p>
                            </div>
                            <div className="award-item">
                                <div className="award-icon"><CheckCircle size={28} color="#00D26A" strokeWidth={1.8} /></div>
                                <h4>Client-First Approach</h4>
                                <p>100% satisfaction commitment</p>
                            </div>
                            <div className="award-item">
                                <div className="award-icon"><Zap size={28} color="#00D26A" strokeWidth={1.8} /></div>
                                <h4>Tech-Driven Solutions</h4>
                                <p>AI & cloud-powered services</p>
                            </div>
                            <div className="award-item">
                                <div className="award-icon"><Award size={28} color="#00D26A" strokeWidth={1.8} /></div>
                                <h4>Quality Assurance</h4>
                                <p>Accuracy in every detail</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="about-cta section-lg bg-dark">
                <div className="container">
                    <div className="cta-content text-center">
                        <h2>Ready to Work with Us?</h2>
                        <p>
                            Let's discuss how our team can help your business achieve its financial goals.
                        </p>
                        <div className="cta-actions">
                            <Link to="/contact" className="btn btn-primary btn-lg">
                                Contact Us
                            </Link>
                            <Link to="/careers" className="btn btn-outline btn-lg">
                                Join Our Team
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default About;
