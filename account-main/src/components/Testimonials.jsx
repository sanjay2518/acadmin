import { useState, useEffect } from 'react';
import './Testimonials.css';

const defaultTestimonials = [
    {
        text: "Precision Accounting has been instrumental in streamlining our financial operations. Their expertise in tax planning saved us significantly and their team's dedication is unmatched.",
        name: 'Rajesh Kumar',
        role: 'CEO',
        company: 'TechVentures India',
        rating: 5,
    },
    {
        text: "The audit and assurance services provided by Precision Accounting gave us complete confidence in our financial statements. Their attention to detail is remarkable.",
        name: 'Priya Sharma',
        role: 'CFO',
        company: 'GreenLeaf Exports',
        rating: 5,
    },
    {
        text: "Working with Precision Accounting transformed how we handle our books. Their advisory services helped us scale from a startup to a mid-size enterprise seamlessly.",
        name: 'Arjun Patel',
        role: 'Founder',
        company: 'NovaBuild Construction',
        rating: 5,
    },
    {
        text: "Their payroll and compliance management is top-notch. We never worry about deadlines or regulatory changes anymore. Truly a trusted partner in growth.",
        name: 'Meena Iyer',
        role: 'HR Director',
        company: 'Skyline Retail Group',
        rating: 4,
    },
];

const Testimonials = ({
    testimonials = defaultTestimonials,
    title = 'What Our Clients Say',
    subtitle = 'Client Testimonials'
}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [testimonials.length, isAutoPlaying]);

    const handleDotClick = (index) => {
        setActiveIndex(index);
        setIsAutoPlaying(false);
        // Resume autoplay after 10 seconds
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    return (
        <section className="testimonials-section">
            <div className="container">
                <div className="testimonials-header">
                    {subtitle && <span className="testimonials-subtitle">{subtitle}</span>}
                    {title && <h2 className="testimonials-title">{title}</h2>}
                </div>

                <div className="testimonials-carousel">
                    <button className="carousel-btn carousel-prev" onClick={handlePrev} aria-label="Previous">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>

                    <div className="testimonials-track">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className={`testimonial-item ${index === activeIndex ? 'active' : ''}`}
                            >
                                <div className="testimonial-content">
                                    <div className="testimonial-quote">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                                        </svg>
                                    </div>
                                    <p className="testimonial-text">{testimonial.text}</p>
                                    <div className="testimonial-author">
                                        {testimonial.image && (
                                            <div className="author-image">
                                                <img src={testimonial.image} alt={testimonial.name} />
                                            </div>
                                        )}
                                        <div className="author-info">
                                            <h4 className="author-name">{testimonial.name}</h4>
                                            <span className="author-role">{testimonial.role}</span>
                                            {testimonial.company && (
                                                <span className="author-company">{testimonial.company}</span>
                                            )}
                                        </div>
                                    </div>
                                    {testimonial.rating && (
                                        <div className="testimonial-rating">
                                            {[...Array(5)].map((_, i) => (
                                                <svg
                                                    key={i}
                                                    viewBox="0 0 24 24"
                                                    fill={i < testimonial.rating ? 'currentColor' : 'none'}
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                </svg>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="carousel-btn carousel-next" onClick={handleNext} aria-label="Next">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>
                </div>

                <div className="testimonials-dots">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            className={`dot ${index === activeIndex ? 'active' : ''}`}
                            onClick={() => handleDotClick(index)}
                            aria-label={`Go to testimonial ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
