import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ServiceCard from '../components/ServiceCard';
import Stats from '../components/Stats';
import Testimonials from '../components/Testimonials';
import InsightCard from '../components/InsightCard';
import AnimateOnScroll from '../components/AnimateOnScroll';
import PromoVideo from '../components/PromoVideo';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import {
  BarChart3, FileText, Briefcase, BookOpen, Wallet, Target,
  ArrowRight, CheckCircle2, TrendingUp, Shield, Users, Award
} from 'lucide-react';
import './Home.css';

const Home = () => {
  const [servicesRef, servicesVisible] = useScrollAnimation(0.1);
  const [statsRef, statsVisible] = useScrollAnimation(0.1);
  const [insightsRef, insightsVisible] = useScrollAnimation(0.1);
  const [whyUsRef, whyUsVisible] = useScrollAnimation(0.1);
  const [ctaRef, ctaVisible] = useScrollAnimation(0.15);
  const [marqueeRef, marqueeVisible] = useScrollAnimation(0.05);

  // Smooth parallax effect
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const parallaxElements = document.querySelectorAll('.parallax');

      parallaxElements.forEach((el) => {
        const speed = el.dataset.speed || 0.5;
        el.style.transform = `translateY(${scrolled * speed}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    {
      icon: <BarChart3 size={28} strokeWidth={1.5} />,
      title: 'Tax Planning',
      description: 'Strategic tax solutions to minimize liability and maximize savings for your business.',
      path: '/services/tax',
    },
    {
      icon: <FileText size={28} strokeWidth={1.5} />,
      title: 'Audit & Assurance',
      description: 'Independent verification and risk assessment services that build stakeholder confidence.',
      path: '/services/audit',
    },
    {
      icon: <Briefcase size={28} strokeWidth={1.5} />,
      title: 'Financial Advisory',
      description: 'Expert guidance for business growth, mergers, and smart financial strategy.',
      path: '/services/advisory',
    },
    {
      icon: <BookOpen size={28} strokeWidth={1.5} />,
      title: 'Bookkeeping',
      description: 'Accurate, timely bookkeeping that lets you focus on growing your business.',
      path: '/services/bookkeeping',
    },
    {
      icon: <Wallet size={28} strokeWidth={1.5} />,
      title: 'Payroll Services',
      description: 'Seamless payroll management ensuring compliance and employee satisfaction.',
      path: '/services/payroll',
    },
    {
      icon: <Target size={28} strokeWidth={1.5} />,
      title: 'Business Consulting',
      description: 'Data-driven consulting to unlock growth potential and operational efficiency.',
      path: '/services/consulting',
    },
  ];

  const whyUsPoints = [
    { icon: <Shield size={24} strokeWidth={1.5} />, title: 'Trust & Integrity', description: 'Built on decades of principled practice and transparency.' },
    { icon: <TrendingUp size={24} strokeWidth={1.5} />, title: 'Growth-Oriented', description: 'Strategies tailored to scale your business sustainably.' },
    { icon: <Users size={24} strokeWidth={1.5} />, title: 'Dedicated Team', description: 'Experienced CPAs and advisors assigned to each client.' },
    { icon: <Award size={24} strokeWidth={1.5} />, title: 'Award-Winning', description: 'Recognized for excellence in accounting and advisory.' },
  ];

  return (
    <div className="home">
      <Hero
        title="Expert Accounting & Tax Solutions"
        subtitle="Trusted Financial Partner"
        description="Empowering businesses with precision accounting, strategic tax planning, and comprehensive financial advisory services."
        primaryCTA={{ label: 'Get Started', path: '/contact' }}
        secondaryCTA={{ label: 'Our Services', path: '/services' }}
        size="large"
      />

      {/* Marquee Band */}
      <div ref={marqueeRef} className={`marquee-band ${marqueeVisible ? 'visible' : ''}`}>
        <div className="marquee-track">
          {[...Array(2)].map((_, i) => (
            <div className="marquee-content" key={i}>
              <span>Tax Planning</span>
              <span className="marquee-dot">◆</span>
              <span>Audit & Assurance</span>
              <span className="marquee-dot">◆</span>
              <span>Financial Advisory</span>
              <span className="marquee-dot">◆</span>
              <span>Bookkeeping</span>
              <span className="marquee-dot">◆</span>
              <span>Payroll Services</span>
              <span className="marquee-dot">◆</span>
              <span>Business Consulting</span>
              <span className="marquee-dot">◆</span>
            </div>
          ))}
        </div>
      </div>

      {/* Services Section */}
      <section ref={servicesRef} className={`section services-section ${servicesVisible ? 'visible' : ''}`}>
        <div className="container">
          <AnimateOnScroll animation="fade-up" duration={0.9}>
            <div className="section-header text-center">
              <span className="section-subtitle">What We Do</span>
              <h2>Comprehensive Financial Solutions</h2>
              <p>Tailored to accelerate your business growth with confidence.</p>
            </div>
          </AnimateOnScroll>

          <div className={`services-grid stagger-children ${servicesVisible ? 'visible' : ''}`}>
            {services.map((service, index) => (
              <AnimateOnScroll
                key={index}
                animation="scale-up"
                delay={0}
                stagger={0.12}
                index={index}
              >
                <ServiceCard
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  path={service.path}
                  delay={`${index * 0.1}s`}
                />
              </AnimateOnScroll>
            ))}
          </div>

          <AnimateOnScroll animation="fade-up" delay={0.4}>
            <div className="section-footer text-center" style={{ marginTop: '3rem' }}>
              <Link to="/services" className="btn btn-dark btn-lg">
                Explore All Services
                <ArrowRight size={18} />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className={`section stats-section bg-dark ${statsVisible ? 'visible' : ''}`}>
        <Stats />
      </section>

      {/* Promo Video Section */}
      <AnimateOnScroll animation="fade-up" duration={1}>
        <PromoVideo />
      </AnimateOnScroll>

      {/* Why Choose Us Section */}
      <section ref={whyUsRef} className={`section why-us-section ${whyUsVisible ? 'visible' : ''}`}>
        <div className="container">
          <div className="why-us-layout">
            <AnimateOnScroll animation="slide-left" duration={1}>
              <div className="why-us-text">
                <span className="section-subtitle">Why Choose Us</span>
                <h2>A Partner You Can Trust</h2>
                <p>
                  For over 15 years, we've helped businesses navigate complex financial
                  landscapes with clarity, precision, and unwavering commitment to their success.
                </p>
                <Link to="/about" className="btn btn-primary btn-lg why-us-btn">
                  Learn More About Us
                  <ArrowRight size={18} />
                </Link>
              </div>
            </AnimateOnScroll>

            <div className="why-us-grid">
              {whyUsPoints.map((point, index) => (
                <AnimateOnScroll
                  key={index}
                  animation="fade-up"
                  stagger={0.15}
                  index={index}
                  delay={0.2}
                >
                  <div className="why-us-card">
                    <div className="why-us-icon">{point.icon}</div>
                    <h4>{point.title}</h4>
                    <p>{point.description}</p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Insights Section */}
      <section ref={insightsRef} className={`section insights-section ${insightsVisible ? 'visible' : ''}`}>
        <div className="container">
          <AnimateOnScroll animation="fade-up" duration={0.9}>
            <div className="section-header">
              <div>
                <span className="section-subtitle">Knowledge Hub</span>
                <h2>Latest Insights</h2>
                <p>Stay informed with our expert analysis and industry updates.</p>
              </div>
            </div>
          </AnimateOnScroll>

          <div className="insights-grid">
            <AnimateOnScroll animation="fade-up" delay={0.1}>
              <InsightCard
                title="2025 Tax Planning Strategies"
                category="Tax"
                date="March 15, 2025"
              />
            </AnimateOnScroll>
            <AnimateOnScroll animation="fade-up" delay={0.25}>
              <InsightCard
                title="Financial Controls Best Practices"
                category="Advisory"
                date="March 10, 2025"
              />
            </AnimateOnScroll>
            <AnimateOnScroll animation="fade-up" delay={0.4}>
              <InsightCard
                title="Audit Readiness Guide"
                category="Audit"
                date="March 5, 2025"
              />
            </AnimateOnScroll>
          </div>

          <AnimateOnScroll animation="fade-up" delay={0.5}>
            <div className="section-footer text-center" style={{ marginTop: '3rem' }}>
              <Link to="/insights" className="btn btn-dark btn-lg">
                View All Insights
                <ArrowRight size={18} />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Testimonials */}
      <AnimateOnScroll animation="fade-up" duration={1}>
        <Testimonials />
      </AnimateOnScroll>

      {/* CTA Section */}
      <section ref={ctaRef} className={`section home-cta ${ctaVisible ? 'visible' : ''}`}>
        <div className="container">
          <AnimateOnScroll animation="scale" duration={0.9}>
            <div className="cta-card">
              <div className="cta-content">
                <h2>Ready to Transform Your Financial Strategy?</h2>
                <p>Let's have a conversation about how Precision Accounting can drive your business forward.</p>
                <div className="cta-actions">
                  <Link to="/contact" className="btn btn-primary btn-lg">
                    Schedule a Consultation
                  </Link>
                  <Link to="/services" className="btn btn-outline btn-lg">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                    Explore Services
                  </Link>
                </div>
              </div>
              <div className="cta-decoration">
                <div className="cta-circle"></div>
                <div className="cta-circle"></div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
};

export default Home;
