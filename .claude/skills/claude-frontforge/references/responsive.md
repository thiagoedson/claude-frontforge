# Responsive Design Patterns

Design for the smallest screen first, then enhance. Mobile isn't a constraint — it's the foundation.

## Mobile-First Approach

Start with mobile styles, add complexity for larger screens:

```css
/* Base: Mobile */
.container {
  padding: 16px;
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    padding: 24px;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    padding: 32px;
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

## Layout Strategies

### Single Column → Multi-Column

```css
/* Mobile: Stack everything */
.grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Tablet: 2 columns */
@media (min-width: 768px) {
  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

/* Desktop: 3-4 columns */
@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1280px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### Sidebar Patterns

```css
/* Mobile: No sidebar, use bottom nav or hamburger */
.app-layout {
  display: flex;
  flex-direction: column;
}

.sidebar {
  display: none;
}

/* Tablet: Collapsible sidebar */
@media (min-width: 768px) {
  .app-layout {
    flex-direction: row;
  }

  .sidebar {
    display: flex;
    width: 64px; /* Icons only */
    flex-shrink: 0;
  }
}

/* Desktop: Full sidebar */
@media (min-width: 1024px) {
  .sidebar {
    width: 240px;
  }
}
```

### Split View (List + Detail)

```css
/* Mobile: Full-screen views, navigate between */
.split-view {
  display: flex;
  flex-direction: column;
}

.list-view {
  flex: 1;
}

.detail-view {
  display: none;
}

.detail-view.active {
  display: flex;
  position: fixed;
  inset: 0;
  z-index: 10;
}

/* Tablet+: Side by side */
@media (min-width: 768px) {
  .split-view {
    flex-direction: row;
  }

  .list-view {
    width: 320px;
    flex-shrink: 0;
    border-right: 1px solid var(--border);
  }

  .detail-view {
    display: flex;
    flex: 1;
    position: static;
  }
}
```

## Navigation Patterns

### Bottom Navigation (Mobile)

```css
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  padding: 8px 16px;
  padding-bottom: max(8px, env(safe-area-inset-bottom));
  background: var(--bg);
  border-top: 1px solid var(--border);
}

.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  font-size: 11px;
  color: var(--text-muted);
}

.bottom-nav-item.active {
  color: var(--accent);
}

/* Hide on desktop */
@media (min-width: 1024px) {
  .bottom-nav {
    display: none;
  }
}
```

### Hamburger Menu

```css
.mobile-menu-btn {
  display: flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
}

@media (min-width: 1024px) {
  .mobile-menu-btn {
    display: none;
  }
}

/* Slide-in menu */
.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  background: var(--bg);
  transform: translateX(-100%);
  transition: transform 250ms var(--ease-out);
  z-index: 50;
}

.mobile-menu.open {
  transform: translateX(0);
}

.mobile-menu-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  pointer-events: none;
  transition: opacity 200ms;
  z-index: 40;
}

.mobile-menu.open + .mobile-menu-backdrop {
  opacity: 1;
  pointer-events: auto;
}
```

## Typography Scaling

```css
/* Fluid typography */
html {
  font-size: 14px;
}

@media (min-width: 768px) {
  html {
    font-size: 15px;
  }
}

@media (min-width: 1024px) {
  html {
    font-size: 16px;
  }
}

/* Or use clamp for smooth scaling */
.heading {
  font-size: clamp(24px, 5vw, 36px);
}

.body {
  font-size: clamp(14px, 2.5vw, 16px);
}
```

## Spacing Scaling

```css
/* Base spacing scale */
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
}

/* Adjust for larger screens */
@media (min-width: 1024px) {
  :root {
    --space-4: 20px;
    --space-5: 32px;
    --space-6: 48px;
  }
}
```

## Component Adaptations

### Tables → Cards

```css
/* Desktop: Standard table */
.data-table {
  display: table;
  width: 100%;
}

.data-table th,
.data-table td {
  padding: 12px 16px;
}

/* Mobile: Stack as cards */
@media (max-width: 767px) {
  .data-table {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .data-table thead {
    display: none;
  }

  .data-table tbody {
    display: contents;
  }

  .data-table tr {
    display: flex;
    flex-direction: column;
    padding: 16px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
  }

  .data-table td {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid var(--border);
  }

  .data-table td:last-child {
    border-bottom: none;
  }

  .data-table td::before {
    content: attr(data-label);
    font-weight: 500;
    color: var(--text-secondary);
  }
}
```

### Modals → Full-screen

```css
.modal {
  max-width: 480px;
  width: calc(100% - 32px);
  max-height: 85vh;
  border-radius: var(--radius-lg);
}

/* Mobile: Full-screen modal */
@media (max-width: 767px) {
  .modal {
    max-width: none;
    width: 100%;
    height: 100%;
    max-height: none;
    border-radius: 0;
  }

  .modal-header {
    position: sticky;
    top: 0;
    background: var(--bg);
    z-index: 1;
  }
}
```

### Forms

```css
/* Desktop: Inline labels */
.form-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.form-label {
  width: 120px;
  flex-shrink: 0;
}

.form-input {
  flex: 1;
}

/* Mobile: Stacked labels */
@media (max-width: 767px) {
  .form-row {
    flex-direction: column;
    align-items: stretch;
    gap: 6px;
  }

  .form-label {
    width: auto;
  }
}

/* Button groups */
.btn-group {
  display: flex;
  gap: 8px;
}

@media (max-width: 767px) {
  .btn-group {
    flex-direction: column;
  }

  .btn-group .btn {
    width: 100%;
  }
}
```

## Container Queries

For component-level responsiveness (when parent size matters more than viewport):

```css
/* Define container */
.card-container {
  container-type: inline-size;
}

/* Respond to container width */
@container (min-width: 400px) {
  .card {
    display: flex;
    flex-direction: row;
  }

  .card-image {
    width: 40%;
  }
}

@container (max-width: 399px) {
  .card {
    display: flex;
    flex-direction: column;
  }

  .card-image {
    width: 100%;
    aspect-ratio: 16/9;
  }
}
```

## Image Handling

```css
/* Responsive images */
.img-responsive {
  width: 100%;
  height: auto;
  display: block;
}

/* Constrained aspect ratio */
.img-cover {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
}

/* Art direction with picture */
```

```html
<picture>
  <source media="(min-width: 1024px)" srcset="hero-desktop.jpg">
  <source media="(min-width: 768px)" srcset="hero-tablet.jpg">
  <img src="hero-mobile.jpg" alt="Hero">
</picture>
```

## Hidden/Visible Utilities

```css
/* Hide on specific breakpoints */
.hide-mobile {
  display: none;
}

@media (min-width: 768px) {
  .hide-mobile {
    display: block;
  }

  .hide-tablet-up {
    display: none;
  }
}

@media (min-width: 1024px) {
  .hide-desktop-up {
    display: none;
  }
}

/* Show only on specific breakpoints */
.show-mobile-only {
  display: block;
}

@media (min-width: 768px) {
  .show-mobile-only {
    display: none;
  }
}
```

## Responsive Spacing

```css
/* Responsive padding utility */
.section {
  padding: 24px 16px;
}

@media (min-width: 768px) {
  .section {
    padding: 48px 24px;
  }
}

@media (min-width: 1024px) {
  .section {
    padding: 64px 32px;
  }
}

/* Responsive gap */
.stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@media (min-width: 768px) {
  .stack {
    gap: 24px;
  }
}
```

## Content Priority

On mobile, prioritize:

1. **Primary action** — What's the main thing users need to do?
2. **Key information** — What must they see immediately?
3. **Secondary actions** — What can be in menus or scrolled to?

```css
/* Example: Dashboard */
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Mobile: Key metric first */
.key-metric {
  order: -1;
}

/* Desktop: Normal flow */
@media (min-width: 1024px) {
  .dashboard {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 24px;
  }

  .key-metric {
    order: 0;
  }
}
```

## Testing Checklist

- [ ] Test at 320px width (iPhone SE)
- [ ] Test at 375px width (iPhone standard)
- [ ] Test at 768px width (iPad portrait)
- [ ] Test at 1024px width (iPad landscape / small laptop)
- [ ] Test at 1440px width (laptop)
- [ ] Test at 1920px width (desktop)
- [ ] Test orientation changes on mobile/tablet
- [ ] Test with real content (not just placeholders)
- [ ] Test touch interactions on actual devices
- [ ] Verify nothing is cut off or overflowing
