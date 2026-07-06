import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import './InsightCard.css';

const InsightCard = ({
    image,
    title,
    excerpt,
    category,
    date,
    readTime,
    path = '/insights',
    featured = false,
    delay = '0s'
}) => {
    const [ref, isVisible] = useScrollAnimation(0.1);

    return (
        <article 
            ref={ref}
            className={`insight-card ${featured ? 'insight-card-featured' : ''} scroll-animate ${isVisible ? 'visible' : ''}`}
            style={{ animationDelay: delay }}
        >
            <Link to={path} className="insight-card-link">
                <div className="insight-card-image">
                    {image ? (
                        <img src={image} alt={title} />
                    ) : (
                        <div className="insight-card-placeholder">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                            </svg>
                        </div>
                    )}
                    <div className="insight-card-overlay">
                        <span className="insight-card-category">{category}</span>
                    </div>
                </div>

                <div className="insight-card-content">
                    <h3 className="insight-card-title">{title}</h3>

                    {excerpt && (
                        <p className="insight-card-excerpt">{excerpt}</p>
                    )}

                    <span className="insight-card-cta">
                        Read More
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </span>
                </div>
            </Link>
        </article>
    );
};

export default InsightCard;
