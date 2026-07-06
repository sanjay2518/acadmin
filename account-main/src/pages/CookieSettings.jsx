import Hero from '../components/Hero';
import { useState } from 'react';
import './LegalPages.css';

const CookieSettings = () => {
    const [preferences, setPreferences] = useState({
        necessary: true,
        analytics: true,
        marketing: false,
        functional: true
    });

    const [saved, setSaved] = useState(false);

    const handleToggle = (key) => {
        if (key === 'necessary') return; // Necessary cookies cannot be disabled
        setPreferences(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
        setSaved(false);
    };

    const handleSave = () => {
        localStorage.setItem('cookie_preferences', JSON.stringify(preferences));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleAcceptAll = () => {
        const allEnabled = {
            necessary: true,
            analytics: true,
            marketing: true,
            functional: true
        };
        setPreferences(allEnabled);
        localStorage.setItem('cookie_preferences', JSON.stringify(allEnabled));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <main className="legal-page">
            <Hero
                size="small"
                subtitle="Settings"
                title="Cookie Settings"
                description="Manage your cookie preferences"
            />

            <section className="legal-content section-lg">
                <div className="container">
                    <div className="cookie-settings-container">
                        <div className="cookie-intro">
                            <h2>About Cookies</h2>
                            <p>
                                Cookies are small text files stored on your device when you visit our website.
                                They help us provide you with a better experience by remembering your preferences,
                                analyzing how you use our site, and personalizing content.
                            </p>
                            <p>
                                You can customize your cookie preferences below. Please note that disabling certain
                                cookies may affect the functionality of our website.
                            </p>
                        </div>

                        <div className="cookie-categories">
                            {/* Necessary Cookies */}
                            <div className="cookie-category">
                                <div className="cookie-category-header">
                                    <div className="cookie-category-info">
                                        <h3>Necessary Cookies</h3>
                                        <span className="cookie-badge required">Always Active</span>
                                    </div>
                                    <div className="cookie-toggle disabled">
                                        <input
                                            type="checkbox"
                                            checked={preferences.necessary}
                                            disabled
                                            readOnly
                                        />
                                        <span className="toggle-slider"></span>
                                    </div>
                                </div>
                                <p>
                                    These cookies are essential for the website to function properly. They enable
                                    basic features like page navigation, access to secure areas, and form submissions.
                                    The website cannot function properly without these cookies.
                                </p>
                                <details>
                                    <summary>View cookies in this category</summary>
                                    <table className="cookie-table">
                                        <thead>
                                            <tr>
                                                <th>Cookie Name</th>
                                                <th>Purpose</th>
                                                <th>Duration</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>session_id</td>
                                                <td>Maintains user session state</td>
                                                <td>Session</td>
                                            </tr>
                                            <tr>
                                                <td>csrf_token</td>
                                                <td>Security token for form submissions</td>
                                                <td>Session</td>
                                            </tr>
                                            <tr>
                                                <td>cookie_consent</td>
                                                <td>Stores your cookie preferences</td>
                                                <td>1 year</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </details>
                            </div>

                            {/* Analytics Cookies */}
                            <div className="cookie-category">
                                <div className="cookie-category-header">
                                    <div className="cookie-category-info">
                                        <h3>Analytics Cookies</h3>
                                        <span className={`cookie-badge ${preferences.analytics ? 'enabled' : 'disabled-badge'}`}>
                                            {preferences.analytics ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                    <div className="cookie-toggle" onClick={() => handleToggle('analytics')}>
                                        <input
                                            type="checkbox"
                                            checked={preferences.analytics}
                                            onChange={() => { }}
                                        />
                                        <span className="toggle-slider"></span>
                                    </div>
                                </div>
                                <p>
                                    Analytics cookies help us understand how visitors interact with our website.
                                    They collect information about page views, time spent on pages, and navigation
                                    patterns. This data helps us improve our website and services.
                                </p>
                                <details>
                                    <summary>View cookies in this category</summary>
                                    <table className="cookie-table">
                                        <thead>
                                            <tr>
                                                <th>Cookie Name</th>
                                                <th>Purpose</th>
                                                <th>Duration</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>_ga</td>
                                                <td>Google Analytics - distinguishes users</td>
                                                <td>2 years</td>
                                            </tr>
                                            <tr>
                                                <td>_gid</td>
                                                <td>Google Analytics - distinguishes users</td>
                                                <td>24 hours</td>
                                            </tr>
                                            <tr>
                                                <td>_gat</td>
                                                <td>Google Analytics - throttles request rate</td>
                                                <td>1 minute</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </details>
                            </div>

                            {/* Functional Cookies */}
                            <div className="cookie-category">
                                <div className="cookie-category-header">
                                    <div className="cookie-category-info">
                                        <h3>Functional Cookies</h3>
                                        <span className={`cookie-badge ${preferences.functional ? 'enabled' : 'disabled-badge'}`}>
                                            {preferences.functional ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                    <div className="cookie-toggle" onClick={() => handleToggle('functional')}>
                                        <input
                                            type="checkbox"
                                            checked={preferences.functional}
                                            onChange={() => { }}
                                        />
                                        <span className="toggle-slider"></span>
                                    </div>
                                </div>
                                <p>
                                    Functional cookies enable enhanced functionality and personalization, such as
                                    remembering your preferences, language settings, and login information. Without
                                    these cookies, some features may not work as intended.
                                </p>
                                <details>
                                    <summary>View cookies in this category</summary>
                                    <table className="cookie-table">
                                        <thead>
                                            <tr>
                                                <th>Cookie Name</th>
                                                <th>Purpose</th>
                                                <th>Duration</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>user_preferences</td>
                                                <td>Stores user interface preferences</td>
                                                <td>1 year</td>
                                            </tr>
                                            <tr>
                                                <td>language</td>
                                                <td>Remembers language preference</td>
                                                <td>1 year</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </details>
                            </div>

                            {/* Marketing Cookies */}
                            <div className="cookie-category">
                                <div className="cookie-category-header">
                                    <div className="cookie-category-info">
                                        <h3>Marketing Cookies</h3>
                                        <span className={`cookie-badge ${preferences.marketing ? 'enabled' : 'disabled-badge'}`}>
                                            {preferences.marketing ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                    <div className="cookie-toggle" onClick={() => handleToggle('marketing')}>
                                        <input
                                            type="checkbox"
                                            checked={preferences.marketing}
                                            onChange={() => { }}
                                        />
                                        <span className="toggle-slider"></span>
                                    </div>
                                </div>
                                <p>
                                    Marketing cookies are used to track visitors across websites. They help us
                                    display relevant advertisements and measure the effectiveness of our marketing
                                    campaigns. These cookies are optional and do not affect the core functionality.
                                </p>
                                <details>
                                    <summary>View cookies in this category</summary>
                                    <table className="cookie-table">
                                        <thead>
                                            <tr>
                                                <th>Cookie Name</th>
                                                <th>Purpose</th>
                                                <th>Duration</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>_fbp</td>
                                                <td>Facebook Pixel - tracks website visits</td>
                                                <td>3 months</td>
                                            </tr>
                                            <tr>
                                                <td>ads_session</td>
                                                <td>Advertising session tracking</td>
                                                <td>Session</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </details>
                            </div>
                        </div>

                        <div className="cookie-actions">
                            <button className="btn btn-outline" onClick={handleAcceptAll}>
                                Accept All Cookies
                            </button>
                            <button className="btn btn-primary" onClick={handleSave}>
                                Save Preferences
                            </button>
                        </div>

                        {saved && (
                            <div className="cookie-saved-message">
                                ✓ Your cookie preferences have been saved
                            </div>
                        )}

                        <div className="cookie-more-info">
                            <h3>More Information</h3>
                            <p>
                                For more details about how we use cookies and process your data, please read our{' '}
                                <a href="/privacy">Privacy Policy</a>.
                            </p>
                            <p>
                                If you have any questions about our use of cookies, please contact us at{' '}
                                <a href="mailto:reliableprofessionals.co@gmail.com">reliableprofessionals.co@gmail.com</a>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default CookieSettings;
