# Device & Viewport Reference

Design for real devices, not abstract breakpoints. Each device context changes how users interact.

## Core Breakpoints

Based on actual device usage, not arbitrary numbers:

| Breakpoint | Range | Devices | Input Mode |
|------------|-------|---------|------------|
| `xs` | < 480px | Small phones | Touch |
| `sm` | 480-767px | Large phones, small tablets | Touch |
| `md` | 768-1023px | Tablets, small laptops | Touch/Mouse |
| `lg` | 1024-1279px | Laptops | Mouse |
| `xl` | 1280-1535px | Desktops | Mouse |
| `2xl` | >= 1536px | Large monitors | Mouse |

```css
/* Mobile-first breakpoints */
--breakpoint-sm: 480px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;

/* Usage */
@media (min-width: 768px) { /* Tablet and up */ }
@media (min-width: 1024px) { /* Desktop and up */ }
```

## Touch vs Mouse

Different input methods require different targets and interactions.

### Touch Requirements

- **Minimum touch target**: 44x44px (Apple HIG), 48x48px (Material Design)
- **Spacing between targets**: Minimum 8px to prevent mis-taps
- **No hover-dependent UI**: Touch has no hover state

```css
/* Touch-safe button */
.btn-touch {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
}

/* Touch-safe icon button */
.icon-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### Mouse Affordances

- **Hover states**: Expected and useful for feedback
- **Smaller targets**: 32px minimum acceptable
- **Cursor changes**: Indicate interactive elements

```css
/* Desktop can use smaller targets */
@media (min-width: 1024px) {
  .btn {
    min-height: 32px;
    padding: 8px 12px;
  }
}
```

## Device Pixel Ratios

Design for sharp displays:

| Device Type | Pixel Ratio | Asset Multiplier |
|-------------|-------------|------------------|
| Standard displays | 1x | @1x |
| Retina/HiDPI | 2x | @2x |
| Super Retina | 3x | @3x |

```css
/* Hairline borders on retina */
.card {
  border: 0.5px solid var(--border);
}

/* Image resolution */
.logo {
  background-image: url('logo.png');
  background-image: -webkit-image-set(
    url('logo.png') 1x,
    url('logo@2x.png') 2x
  );
}
```

## Safe Areas

Modern devices have notches, rounded corners, and system UI.

```css
/* Respect safe areas */
.app-container {
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
  padding-bottom: env(safe-area-inset-bottom);
}

/* Full-bleed with safe content */
.hero {
  padding: 16px;
  padding-top: max(16px, env(safe-area-inset-top));
}
```

## Viewport Considerations

### Mobile Viewport

- **100vh is unreliable**: Mobile browsers have dynamic toolbars
- **Use `dvh` units**: Dynamic viewport height adapts to browser chrome

```css
/* Avoid */
.full-height {
  height: 100vh;
}

/* Better */
.full-height {
  height: 100dvh;
  height: 100vh; /* Fallback */
}
```

### Landscape Orientation

- **Limited vertical space**: Reduce header heights
- **Consider hiding navigation**: More content, less chrome

```css
@media (orientation: landscape) and (max-height: 500px) {
  .header {
    height: 48px;
    padding: 8px 16px;
  }

  .sidebar {
    display: none;
  }
}
```

## Screen Types

### Phones (< 768px)

- Single column layouts
- Bottom navigation preferred
- Large touch targets
- Thumb-zone aware design

### Tablets (768-1023px)

- Two-column layouts possible
- Side navigation viable
- Hybrid touch/mouse
- Consider both orientations

### Laptops (1024-1279px)

- Multi-column layouts
- Full navigation
- Mouse-optimized
- Keyboard shortcuts expected

### Desktops (1280px+)

- Wide layouts with constraints
- Split views common
- Complex interactions
- Power user features

## Content Width

Don't stretch content to full width on large screens:

```css
/* Maximum readable width */
.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Prose/text content */
.prose {
  max-width: 65ch; /* ~65 characters */
}

/* Data tables can be wider */
.data-table {
  max-width: 1400px;
}
```

## Input Method Detection

Feature detection over device detection:

```css
/* Touch device */
@media (hover: none) and (pointer: coarse) {
  /* Touch-optimized styles */
}

/* Mouse/trackpad device */
@media (hover: hover) and (pointer: fine) {
  /* Hover-dependent styles */
}

/* Stylus/pen */
@media (pointer: fine) and (hover: none) {
  /* Precise touch styles */
}
```

```javascript
// JavaScript detection
const isTouchDevice = window.matchMedia('(hover: none)').matches;
const hasFinePonter = window.matchMedia('(pointer: fine)').matches;
```

## Performance by Device

### Mobile Optimization

- Reduce animation complexity
- Lazy load off-screen content
- Minimize layout shifts
- Prioritize above-the-fold content

```css
/* Reduce motion on mobile */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

/* Simpler shadows on mobile */
@media (max-width: 767px) {
  .card {
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  }
}
```

## Device Testing Checklist

Before shipping, test on:

- [ ] iPhone SE (small phone, 375px)
- [ ] iPhone 14 Pro (standard phone, 393px)
- [ ] iPad (tablet, 768px)
- [ ] MacBook Air 13" (laptop, 1280px)
- [ ] 27" monitor (desktop, 1920px+)
- [ ] Both orientations on mobile/tablet
- [ ] Touch and mouse interactions
