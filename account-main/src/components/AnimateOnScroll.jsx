import { useEffect, useRef, useState } from 'react';

const AnimateOnScroll = ({
    children,
    animation = 'fade-up',
    delay = 0,
    duration = 0.8,
    threshold = 0.15,
    once = true,
    className = '',
    style = {},
    stagger = 0,
    index = 0,
}) => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (once && ref.current) {
                        observer.unobserve(ref.current);
                    }
                } else if (!once) {
                    setIsVisible(false);
                }
            },
            { threshold, rootMargin: '0px 0px -50px 0px' }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [threshold, once]);

    const getInitialStyles = () => {
        const base = {
            opacity: 0,
            transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1)`,
            transitionDelay: `${delay + (stagger * index)}s`,
            willChange: 'opacity, transform',
        };

        switch (animation) {
            case 'fade-up':
                return { ...base, transform: 'translateY(60px)' };
            case 'fade-down':
                return { ...base, transform: 'translateY(-60px)' };
            case 'slide-left':
                return { ...base, transform: 'translateX(-80px)' };
            case 'slide-right':
                return { ...base, transform: 'translateX(80px)' };
            case 'scale':
                return { ...base, transform: 'scale(0.85)' };
            case 'scale-up':
                return { ...base, transform: 'scale(0.9) translateY(30px)' };
            case 'reveal':
                return {
                    ...base,
                    clipPath: 'inset(0 0 100% 0)',
                    transform: 'translateY(20px)',
                };
            case 'fade':
                return { ...base };
            case 'rotate-in':
                return { ...base, transform: 'rotate(-5deg) scale(0.95)' };
            case 'blur-in':
                return {
                    ...base,
                    filter: 'blur(10px)',
                    transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1), filter ${duration}s cubic-bezier(0.16, 1, 0.3, 1)`,
                    transform: 'translateY(30px)',
                };
            default:
                return { ...base, transform: 'translateY(60px)' };
        }
    };

    const getVisibleStyles = () => {
        const base = {
            opacity: 1,
            transform: 'translateY(0) translateX(0) scale(1) rotate(0)',
        };

        if (animation === 'reveal') {
            return { ...base, clipPath: 'inset(0 0 0% 0)' };
        }
        if (animation === 'blur-in') {
            return { ...base, filter: 'blur(0px)' };
        }

        return base;
    };

    const animationStyles = isVisible
        ? { ...getInitialStyles(), ...getVisibleStyles() }
        : getInitialStyles();

    return (
        <div
            ref={ref}
            className={`animate-on-scroll ${isVisible ? 'aos-visible' : ''} ${className}`}
            style={{ ...animationStyles, ...style }}
        >
            {children}
        </div>
    );
};

export default AnimateOnScroll;
