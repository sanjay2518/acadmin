// ============================================================
//  SINGLE SOURCE OF TRUTH — all dynamic company data
//  Founded: 2026. All time-based values auto-calculate.
// ============================================================

const FOUNDED_YEAR = 2026;
const FOUNDED_MONTH = 1; // January

/** Returns how many full months the company has been operating */
export const getMonthsOperating = () => {
    const now = new Date();
    const founded = new Date(FOUNDED_YEAR, FOUNDED_MONTH - 1, 1);
    const months =
        (now.getFullYear() - founded.getFullYear()) * 12 +
        (now.getMonth() - founded.getMonth());
    return Math.max(0, months);
};

/** Returns how many full years (decimal) since founding */
export const getYearsOperating = () => {
    const months = getMonthsOperating();
    return parseFloat((months / 12).toFixed(1));
};

/** Current calendar year */
export const getCurrentYear = () => new Date().getFullYear();

export const COMPANY = {
    name: 'Wealcco',
    foundedYear: FOUNDED_YEAR,
    tagline: 'Expert Accounting & Tax Solutions',
    email: 'hello@wealcco.com',
    phone: '+1 (555) 000-0000',
    address: 'New Delhi, India',
};

// ── Stats (auto-calculated from founding date) ──────────────
export const getStats = () => {
    const m = getMonthsOperating();
    return [
        {
            value: Math.max(10, Math.round(10 + m * 8)),
            suffix: '+',
            label: 'Clients Served',
            icon: '👥',
        },
        {
            value: m < 12 ? Math.max(1, m) : Math.max(1, Math.floor(m / 12)),
            suffix: '+',
            label: m < 12 ? 'Months in Operation' : 'Years in Operation',
            icon: '⭐',
        },
        {
            value: 98,
            suffix: '%',
            label: 'Client Satisfaction',
            icon: '💯',
        },
        {
            value: 6,
            suffix: '+',
            label: 'Expert Advisors',
            icon: '💼',
        },
    ];
};

// ── Insights / Blog posts (dates relative to founding) ──────
export const INSIGHTS = [
    {
        title: `${getCurrentYear()} Tax Planning Strategies for Startups`,
        category: 'Tax',
        date: `January 15, ${FOUNDED_YEAR}`,
        excerpt: 'Smart tax strategies every new business should implement from day one.',
    },
    {
        title: 'Financial Controls Best Practices for Growing Teams',
        category: 'Advisory',
        date: `February 10, ${FOUNDED_YEAR}`,
        excerpt: 'How to build robust internal controls as your headcount scales.',
    },
    {
        title: 'Audit Readiness Guide for Early-Stage Companies',
        category: 'Audit',
        date: `March 5, ${FOUNDED_YEAR}`,
        excerpt: 'Everything you need to prepare for your first external audit.',
    },
];

// ── Timeline (milestones since founding) ────────────────────
export const TIMELINE = [
    {
        year: `${FOUNDED_YEAR}`,
        title: 'Founded',
        description: 'Wealcco launched with a vision to deliver modern, tech-driven financial services.',
    },
    {
        year: `${FOUNDED_YEAR}`,
        title: 'Team Assembly',
        description: 'Built a diverse team of CPAs, technologists, and business advisors.',
    },
    {
        year: `${FOUNDED_YEAR}`,
        title: 'Digital-First Launch',
        description: 'Launched cloud-based and AI-powered financial tools from day one.',
    },
    {
        year: `${FOUNDED_YEAR}`,
        title: 'First Clients Onboarded',
        description: 'Began serving our first clients with personalised, tech-driven accounting solutions.',
    },
    {
        year: 'Ahead',
        title: 'Growth Vision',
        description: 'Scaling to become the most trusted modern accounting partner for businesses across India and beyond.',
    },
];

// ── Why-Us copy (references founding year dynamically) ───────
export const WHY_US_DESCRIPTION = `Founded in ${FOUNDED_YEAR}, we combine fresh perspectives with modern technology to help businesses navigate complex financial landscapes with clarity, precision, and unwavering commitment to their success.`;

// ── Hero / CTA copy ──────────────────────────────────────────
export const HOME_HERO = {
    subtitle: 'Trusted Financial Partner',
    title: 'Expert Accounting & Tax Solutions',
    description: `Empowering businesses with precision accounting, strategic tax planning, and comprehensive financial advisory services — built for ${getCurrentYear()} and beyond.`,
};

export const ABOUT_HERO = {
    subtitle: 'About Wealcco',
    title: 'A Fresh Start in Financial Excellence',
    description: `Founded in ${FOUNDED_YEAR}, we are a passionate team committed to helping businesses achieve their financial goals through innovative solutions, modern technology, and personalised service.`,
};
