import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import './ServiceCard.css';

const ServiceCard = ({
    icon,
    title,
    description,
    path = '/services',
    tag,
    variant = 'default',
    size = 'medium',
    delay = '0s'
}) => {
    const [ref, isVisible] = useScrollAnimation(0.1);

    return (
        <Link 
            ref={ref}
            to={path} 
            className={`service-card service-card-${variant} service-card-${size} scroll-animate ${isVisible ? 'visible' : ''}`}
            style={{ animationDelay: delay }}
        >
            <div className="service-card-inner">
                {tag && <span className="service-card-tag">{tag}</span>}

                <div className="service-card-icon">
                    {icon}
                </div>

                <h3 className="service-card-title">{title}</h3>

                <p className="service-card-description">{description}</p>

                <div className="service-card-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </div>
            </div>

            <div className="service-card-decoration"></div>
        </Link>
    );
};

export default ServiceCard;
