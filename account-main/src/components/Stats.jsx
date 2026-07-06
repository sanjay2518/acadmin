import { useEffect, useState, useRef } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import './Stats.css';

const Stats = ({ stats = defaultStats, variant = 'default', title, subtitle }) => {
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
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className={`stat-item ${isVisible ? 'visible' : ''}`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="stat-icon">
                                {stat.icon}
                            </div>
                            <div className="stat-content">
                                <span className="stat-number">
                                    {isVisible && (
                                        <CountUp end={stat.value} suffix={stat.suffix || ''} prefix={stat.prefix || ''} />
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

// Count up animation component
const CountUp = ({ end, duration = 2000, suffix = '', prefix = '' }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime;
        let animationFrame;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            setCount(Math.floor(progress * end));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);

    return <>{prefix}{count.toLocaleString()}{suffix}</>;
};

// Default stats data
const defaultStats = [
    { value: 500, suffix: '+', label: 'Clients Served', icon: '👥' },
    { value: 15, suffix: '+', label: 'Years Experience', icon: '⭐' },
    { value: 98, suffix: '%', label: 'Client Satisfaction', icon: '💯' },
    { value: 50, suffix: '+', label: 'Managed Assets', icon: '💼', prefix: '$' }
];

export default Stats;
