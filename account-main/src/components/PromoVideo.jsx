import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
    Play, Pause, Volume2, VolumeX, Maximize, Minimize,
    BookOpen, Calculator, BarChart3, Shield,
    Users, Globe, Clock, Award, Headphones,
    CheckCircle, TrendingUp, FileText, Settings,
    ArrowRight, Zap, Lock, Eye
} from 'lucide-react';
import { getPromoAudio } from '../utils/promoAudio';
import './PromoVideo.css';

const PromoVideo = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentScene, setCurrentScene] = useState(0);
    const [progress, setProgress] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [sceneProgress, setSceneProgress] = useState(0);
    const containerRef = useRef(null);
    const intervalRef = useRef(null);
    const sceneTimerRef = useRef(null);
    const sceneProgressRef = useRef(null);
    const audioRef = useRef(null);

    const SCENE_DURATION = 4500;
    const TOTAL_SCENES = 8;
    const TOTAL_DURATION = SCENE_DURATION * TOTAL_SCENES;

    const advanceScene = useCallback(() => {
        setCurrentScene(prev => {
            if (prev >= TOTAL_SCENES - 1) {
                setIsPlaying(false);
                setHasStarted(false);
                setSceneProgress(0);
                if (audioRef.current) {
                    audioRef.current.stopMusic();
                }
                return 0;
            }
            return prev + 1;
        });
        setSceneProgress(0);
    }, []);

    useEffect(() => {
        if (isPlaying) {
            intervalRef.current = setInterval(() => {
                setProgress(prev => {
                    const increment = (100 / TOTAL_DURATION) * 50;
                    if (prev >= 100) return 100;
                    return prev + increment;
                });
            }, 50);

            sceneProgressRef.current = setInterval(() => {
                setSceneProgress(prev => {
                    const increment = (100 / SCENE_DURATION) * 50;
                    if (prev >= 100) return 100;
                    return prev + increment;
                });
            }, 50);

            sceneTimerRef.current = setInterval(() => {
                advanceScene();
            }, SCENE_DURATION);
        }

        return () => {
            clearInterval(intervalRef.current);
            clearInterval(sceneTimerRef.current);
            clearInterval(sceneProgressRef.current);
        };
    }, [isPlaying, advanceScene]);

    // Audio sync
    useEffect(() => {
        const audio = getPromoAudio();
        audioRef.current = audio;
        if (isPlaying && hasStarted) {
            audio.startMusic();
            audio.setMuted(isMuted);
        }
    }, [isPlaying, hasStarted]);

    useEffect(() => {
        if (audioRef.current) audioRef.current.setMuted(isMuted);
    }, [isMuted]);

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.destroy();
                audioRef.current = null;
            }
        };
    }, []);

    // Fullscreen change listener
    useEffect(() => {
        const handleFsChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFsChange);
        return () => document.removeEventListener('fullscreenchange', handleFsChange);
    }, []);

    const handlePlay = () => {
        if (!hasStarted) {
            setHasStarted(true);
            setCurrentScene(0);
            setProgress(0);
            setSceneProgress(0);
        }
        setIsPlaying(true);
    };

    const handlePause = () => {
        setIsPlaying(false);
        if (audioRef.current) audioRef.current.stopMusic();
    };

    const handleToggle = () => {
        isPlaying ? handlePause() : handlePlay();
    };

    const handleSceneClick = (i) => {
        setCurrentScene(i);
        setProgress((i / TOTAL_SCENES) * 100);
        setSceneProgress(0);
        if (!isPlaying) {
            setHasStarted(true);
            setIsPlaying(true);
        }
    };

    const toggleFullscreen = (e) => {
        e.stopPropagation();
        if (containerRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                containerRef.current.requestFullscreen();
            }
        }
    };

    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const currentTimeMs = (currentScene * SCENE_DURATION) + (sceneProgress / 100 * SCENE_DURATION);

    // Particles memoized to prevent re-render flicker
    const particles = useMemo(() => [...Array(25)].map((_, i) => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 6}s`,
        duration: `${4 + Math.random() * 5}s`,
        size: `${2 + Math.random() * 3}px`,
    })), []);

    return (
        <div className="promo-video-section">
            <div className="container">
                <div className="promo-video-header">
                    <span className="section-subtitle">Watch Our Story</span>
                    <h2>Discover Wealcco Private Limited</h2>
                    <p className="section-description">
                        See how we help businesses achieve financial clarity and sustainable growth.
                    </p>
                </div>

                <div className="promo-video-wrapper" ref={containerRef}>
                    <div className={`video-canvas ${hasStarted ? 'started' : ''}`}>

                        {/* === Animated Background === */}
                        <div className="video-bg">
                            <div className="bg-gradient-layer"></div>
                            <div className="bg-mesh"></div>
                            <div className="bg-glow glow-1"></div>
                            <div className="bg-glow glow-2"></div>
                            <div className="bg-glow glow-3"></div>
                            {particles.map((p, i) => (
                                <div
                                    key={i}
                                    className="bg-particle"
                                    style={{
                                        left: p.left, top: p.top,
                                        animationDelay: p.delay,
                                        animationDuration: p.duration,
                                        width: p.size, height: p.size,
                                    }}
                                />
                            ))}
                        </div>

                        {/* === Play Button Overlay === */}
                        {!hasStarted && (
                            <div className="play-overlay" onClick={handlePlay}>
                                <div className="play-ring">
                                    <div className="play-ring-inner">
                                        <Play size={44} fill="white" color="white" />
                                    </div>
                                </div>
                                <p className="play-label">Play Intro Video</p>
                                <span className="play-duration">{formatTime(TOTAL_DURATION)}</span>
                            </div>
                        )}

                        {/* === SCENES === */}
                        {hasStarted && (
                            <div className="scenes-container" onClick={handleToggle}>

                                {/* Scene 0 — Brand Intro */}
                                <div className={`scene ${currentScene === 0 ? 'active' : ''}`}>
                                    <div className="scene-inner scene-brand">
                                        <div className="brand-diamond-wrap">
                                            <div className="brand-diamond">◆</div>
                                            <div className="diamond-ring"></div>
                                        </div>
                                        <h2 className="brand-title anim-item">
                                            <span className="brand-name-main">Wealcco</span>
                                            <span className="brand-name-sub">Private Limited</span>
                                        </h2>
                                        <div className="brand-line anim-item a-delay-1"></div>
                                        <p className="brand-tagline anim-item a-delay-2">
                                            Your Trusted Financial Partner
                                        </p>
                                        <p className="brand-motto anim-item a-delay-3">
                                            Precision in Every Number · Growth in Every Decision
                                        </p>
                                    </div>
                                </div>

                                {/* Scene 1 — Problem Statement */}
                                <div className={`scene ${currentScene === 1 ? 'active' : ''}`}>
                                    <div className="scene-inner scene-problem">
                                        <div className="scene-icon-badge anim-item">
                                            <Zap size={32} />
                                        </div>
                                        <h3 className="scene-heading anim-item a-delay-1">
                                            Managing Finances Is Complex
                                        </h3>
                                        <p className="scene-desc anim-item a-delay-2">
                                            Tax compliance, bookkeeping, audits, payroll —<br />
                                            businesses need a partner who handles it all.
                                        </p>
                                        <div className="pain-points anim-item a-delay-3">
                                            {['Tax Stress', 'Compliance Risks', 'Cash Flow Issues', 'Audit Anxiety'].map((item, i) => (
                                                <span key={i} className="pain-tag">{item}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Scene 2 — Services Overview */}
                                <div className={`scene ${currentScene === 2 ? 'active' : ''}`}>
                                    <div className="scene-inner scene-services">
                                        <h3 className="scene-heading anim-item">
                                            Comprehensive Solutions
                                        </h3>
                                        <p className="scene-desc anim-item a-delay-1">Everything your business needs under one roof</p>
                                        <div className="services-grid-video">
                                            {[
                                                { icon: BookOpen, label: 'Bookkeeping', color: '#00d26a' },
                                                { icon: Calculator, label: 'Tax Services', color: '#3b82f6' },
                                                { icon: BarChart3, label: 'Financial Advisory', color: '#f59e0b' },
                                                { icon: Shield, label: 'Audit & Assurance', color: '#8b5cf6' },
                                                { icon: FileText, label: 'GST Returns', color: '#ef4444' },
                                                { icon: Settings, label: 'Payroll', color: '#06b6d4' },
                                            ].map((s, i) => (
                                                <div key={i} className="svc-card anim-item" style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
                                                    <div className="svc-icon" style={{ background: `${s.color}20`, color: s.color }}>
                                                        <s.icon size={22} />
                                                    </div>
                                                    <span className="svc-label">{s.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Scene 3 — Dashboard / Full Ownership */}
                                <div className={`scene ${currentScene === 3 ? 'active' : ''}`}>
                                    <div className="scene-inner scene-dashboard">
                                        <h3 className="scene-heading anim-item">
                                            Full Ownership of Your Accounts
                                        </h3>
                                        <p className="scene-desc anim-item a-delay-1">Cloud-Based · Real-Time · Transparent</p>
                                        <div className="dash-window anim-item a-delay-2">
                                            <div className="dash-titlebar">
                                                <div className="dash-dots">
                                                    <span className="dot dot-red"></span>
                                                    <span className="dot dot-yellow"></span>
                                                    <span className="dot dot-green"></span>
                                                </div>
                                                <span className="dash-title-text">Wealcco Dashboard</span>
                                                <div></div>
                                            </div>
                                            <div className="dash-body">
                                                <div className="dash-side">
                                                    {['Dashboard', 'Reports', 'Banking', 'Invoices', 'Expenses', 'Payroll'].map((item, i) => (
                                                        <div key={i} className={`dash-menu-item ${i === 0 ? 'active' : ''}`}>
                                                            <div className="menu-dot"></div>
                                                            <span>{item}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="dash-content">
                                                    <div className="dash-stat-row">
                                                        <div className="dash-stat-card stat-green">
                                                            <span className="ds-label">Revenue</span>
                                                            <span className="ds-value">₹24.5L</span>
                                                            <div className="ds-bar"><div className="ds-fill" style={{ width: '78%' }}></div></div>
                                                        </div>
                                                        <div className="dash-stat-card stat-amber">
                                                            <span className="ds-label">Expenses</span>
                                                            <span className="ds-value">₹12.3L</span>
                                                            <div className="ds-bar"><div className="ds-fill" style={{ width: '45%' }}></div></div>
                                                        </div>
                                                        <div className="dash-stat-card stat-blue">
                                                            <span className="ds-label">Profit</span>
                                                            <span className="ds-value">₹12.2L</span>
                                                            <div className="ds-bar"><div className="ds-fill" style={{ width: '62%' }}></div></div>
                                                        </div>
                                                    </div>
                                                    <div className="dash-chart-area">
                                                        {[35, 52, 45, 68, 58, 75, 82, 70, 88, 95].map((h, i) => (
                                                            <div key={i} className="dash-bar" style={{ '--bar-height': `${h}%`, animationDelay: `${0.6 + i * 0.08}s` }}></div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Scene 4 — Security & Compliance */}
                                <div className={`scene ${currentScene === 4 ? 'active' : ''}`}>
                                    <div className="scene-inner scene-security">
                                        <div className="scene-icon-badge anim-item" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa' }}>
                                            <Lock size={32} />
                                        </div>
                                        <h3 className="scene-heading anim-item a-delay-1">
                                            100% Secure & Compliant
                                        </h3>
                                        <p className="scene-desc anim-item a-delay-2">
                                            Your data is protected with enterprise-grade security<br />
                                            and full regulatory compliance.
                                        </p>
                                        <div className="security-features anim-item a-delay-3">
                                            {[
                                                { icon: Lock, text: 'Data Encryption' },
                                                { icon: Shield, text: 'GST Compliant' },
                                                { icon: Eye, text: 'Full Transparency' },
                                                { icon: CheckCircle, text: 'Audit Ready' },
                                            ].map((f, i) => (
                                                <div key={i} className="sec-feature">
                                                    <f.icon size={18} />
                                                    <span>{f.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Scene 5 — Stats / Why Wealcco */}
                                <div className={`scene ${currentScene === 5 ? 'active' : ''}`}>
                                    <div className="scene-inner scene-stats">
                                        <h3 className="scene-heading anim-item">Why Wealcco?</h3>
                                        <p className="scene-desc anim-item a-delay-1">Numbers that speak for themselves</p>
                                        <div className="stats-row">
                                            {[
                                                { icon: Users, value: '50+', label: 'Happy Clients', color: '#00d26a' },
                                                { icon: Clock, value: '24/7', label: 'Support', color: '#3b82f6' },
                                                { icon: Award, value: '5+', label: 'Years Experience', color: '#f59e0b' },
                                                { icon: Globe, value: 'Pan India', label: 'Coverage', color: '#8b5cf6' },
                                            ].map((stat, i) => (
                                                <div key={i} className="stat-block anim-item" style={{ animationDelay: `${0.3 + i * 0.15}s` }}>
                                                    <div className="stat-icon-circle" style={{ background: `${stat.color}15`, color: stat.color }}>
                                                        <stat.icon size={26} />
                                                    </div>
                                                    <span className="stat-num">{stat.value}</span>
                                                    <span className="stat-txt">{stat.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Scene 6 — Industries */}
                                <div className={`scene ${currentScene === 6 ? 'active' : ''}`}>
                                    <div className="scene-inner scene-industries">
                                        <h3 className="scene-heading anim-item">Trusted Across Industries</h3>
                                        <div className="ind-tags">
                                            {['Healthcare', 'Technology', 'Manufacturing', 'Real Estate', 'Retail', 'Startups', 'Education', 'E-Commerce'].map((ind, i) => (
                                                <div key={i} className="ind-tag anim-item" style={{ animationDelay: `${0.2 + i * 0.08}s` }}>
                                                    <CheckCircle size={15} />
                                                    <span>{ind}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="ind-badge anim-item a-delay-3">
                                            <TrendingUp size={18} />
                                            <span>Driving Growth for Businesses Across India</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Scene 7 — CTA / Outro */}
                                <div className={`scene ${currentScene === 7 ? 'active' : ''}`}>
                                    <div className="scene-inner scene-outro">
                                        <div className="brand-diamond-wrap">
                                            <div className="brand-diamond outro-diamond">◆</div>
                                            <div className="diamond-ring"></div>
                                        </div>
                                        <h3 className="outro-title anim-item">
                                            Ready to Transform<br />Your Finances?
                                        </h3>
                                        <div className="brand-line anim-item a-delay-1"></div>
                                        <p className="outro-subtitle anim-item a-delay-2">
                                            Partner with <strong>Wealcco Private Limited</strong>
                                        </p>
                                        <div className="outro-contacts anim-item a-delay-3">
                                            <span>📧 reliableprofessionals.co@gmail.com</span>
                                            <span>📞 +91 8920473074</span>
                                        </div>
                                        <div className="outro-website anim-item a-delay-3">
                                            www.wealcco.com
                                        </div>
                                    </div>
                                </div>

                                {/* Pause indicator */}
                                {!isPlaying && hasStarted && (
                                    <div className="pause-indicator">
                                        <Play size={40} fill="white" color="white" />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* === Video Controls === */}
                        {hasStarted && (
                            <div className="video-controls" onClick={(e) => e.stopPropagation()}>
                                <div className="progress-track" onClick={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const pct = ((e.clientX - rect.left) / rect.width) * 100;
                                    const newScene = Math.floor((pct / 100) * TOTAL_SCENES);
                                    setProgress(pct);
                                    setCurrentScene(Math.min(newScene, TOTAL_SCENES - 1));
                                    setSceneProgress(0);
                                }}>
                                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                                    <div className="progress-thumb" style={{ left: `${progress}%` }}></div>
                                </div>
                                <div className="controls-row">
                                    <div className="ctrl-left">
                                        <button className="ctrl-btn" onClick={handleToggle} aria-label={isPlaying ? 'Pause' : 'Play'}>
                                            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                                        </button>
                                        <div className="volume-group">
                                            <button className="ctrl-btn" onClick={() => setIsMuted(!isMuted)} aria-label={isMuted ? 'Unmute' : 'Mute'}>
                                                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                            </button>
                                        </div>
                                        <span className="time-code">
                                            {formatTime(currentTimeMs)} / {formatTime(TOTAL_DURATION)}
                                        </span>
                                    </div>
                                    <div className="ctrl-right">
                                        <button className="ctrl-btn" onClick={toggleFullscreen} aria-label="Fullscreen">
                                            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Wealcco watermark */}
                        {hasStarted && (
                            <div className="video-watermark">
                                <span className="wm-diamond">◆</span> Wealcco
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromoVideo;
