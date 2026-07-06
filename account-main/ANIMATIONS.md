# Website Animations - TMF Group Style

## Animations Added

### 1. **Scroll-Triggered Animations**
- Elements fade in and slide up as you scroll down the page
- Smooth transitions with staggered delays for multiple items
- Used in: ServiceCard, InsightCard, Stats, and section headers

### 2. **Parallax Effects**
- Background elements move at different speeds while scrolling
- Creates depth and dynamic movement
- Implemented in Home page with data-speed attributes

### 3. **Hover Animations**
- Cards lift up with shadow on hover
- Icons scale and rotate slightly
- Arrows slide in from the side
- Smooth color transitions

### 4. **Hero Section**
- Floating particles animation
- Pulsing decorative circles
- Fade-in animations with delays
- Bouncing scroll indicator

### 5. **Counter Animations**
- Numbers count up when stats section becomes visible
- Smooth easing for professional look

## Files Modified

1. **src/hooks/useScrollAnimation.js** - Custom hook for scroll detection
2. **src/pages/Home.jsx** - Main page with scroll animations
3. **src/pages/Home.css** - Section animation styles
4. **src/components/ServiceCard.jsx** - Added scroll animation
5. **src/components/InsightCard.jsx** - Added scroll animation
6. **src/components/Stats.jsx** - Updated with scroll hook
7. **src/index.css** - Global animation utilities

## How to Use

### Apply scroll animation to any element:
```jsx
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const [ref, isVisible] = useScrollAnimation(0.1);

<div ref={ref} className={`scroll-animate ${isVisible ? 'visible' : ''}`}>
  Content here
</div>
```

### Add staggered delays:
```jsx
<ServiceCard delay="0.1s" />
<ServiceCard delay="0.2s" />
<ServiceCard delay="0.3s" />
```

### CSS Animation Classes:
- `.scroll-animate` - Fade in and slide up
- `.scroll-fade-in` - Simple fade in
- `.scroll-slide-left` - Slide from left
- `.scroll-slide-right` - Slide from right
- `.scroll-scale` - Scale up effect
- `.hover-lift` - Lift on hover
- `.hover-scale` - Scale on hover

## Performance
- Uses IntersectionObserver API for efficient scroll detection
- Animations only trigger once when element enters viewport
- Respects user's reduced motion preferences
- GPU-accelerated transforms for smooth 60fps animations
