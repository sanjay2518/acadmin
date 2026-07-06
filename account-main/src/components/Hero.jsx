import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = ({
    title,
    subtitle,
    description,
    primaryCTA,
    secondaryCTA,
    backgroundImage,
    overlay = true,
    size = 'large',
    align = 'center'
}) => {
    return (
        <section
            className={`hero hero-${size} hero-${align}`}
            style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}
        >
            {overlay && <div className="hero-overlay"></div>}

            <div className="hero-particles">
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
            </div>

            <div className="container hero-container">
                <div className="hero-content">
                    {subtitle && (
                        <span className="hero-subtitle animate-fadeInUp">
                            {subtitle}
                        </span>
                    )}

                    <h1 className="hero-title animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                        {title}
                    </h1>

                    {description && (
                        <p className="hero-description animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                            {description}
                        </p>
                    )}

                    {(primaryCTA || secondaryCTA) && (
                        <div className="hero-actions animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                            {primaryCTA && (
                                <Link to={primaryCTA.path} className="btn btn-primary btn-lg">
                                    {primaryCTA.label}
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            )}
                            {secondaryCTA && (
                                <Link to={secondaryCTA.path} className="btn btn-outline btn-lg">
                                    {secondaryCTA.label}
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="hero-scroll-indicator">
                <span>Scroll to explore</span>
                <div className="scroll-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12l7 7 7-7" />
                    </svg>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="hero-decoration">
                <div className="decoration-circle decoration-circle-1"></div>
                <div className="decoration-circle decoration-circle-2"></div>
                <div className="decoration-line"></div>
            </div>
        </section>
    );
};

export default Hero;
