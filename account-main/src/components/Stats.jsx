import { useEffect, useState } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { getStats } from '../utils/companyData';
import './Stats.css';

const CountUp = ({ end, duration = 2000, suffix = '', prefix = '' }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime;
        let animationFrame;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) animationFrame = requestAnimationFrame(animate);
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);

    return <>{prefix}{count.toLocaleString()}{suffix}</>;
};

const Stats = ({ stats, variant = 'default', title, subtitle }) => {
    const resolvedStats = stats || getStats();
    const [ref, isVisible] = useScrollAnimation(0.2);

    return (
        <section ref={ref} className={`stats-section stats-${variant} ${isVisible ? 'visible' : ''}`}>
            <div className="container">
                {(title || subtitle) && (
                    <div className="stats-header">
                        {subtitle && <span className="stats-subtitle">{subtitle}</span>}
                        {title && <h2 className="stats-title">{title}</h2>}
                    </div>
                )}

                <div className="stats-grid">
                    {resolvedStats.map((stat, index) => (
                        <div
                            key={index}
                            className={`stat-item ${isVisible ? 'visible' : ''}`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="stat-icon">{stat.icon}</div>
                            <div className="stat-content">
                                <span className="stat-number">
                                    {isVisible && (
                                        <CountUp
                                            end={stat.value}
                                            suffix={stat.suffix || ''}
                                            prefix={stat.prefix || ''}
                                        />
                                    )}
                                </span>
                                <span className="stat-label">{stat.label}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;
