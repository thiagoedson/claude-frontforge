# Responsive Design

Mobile-first: start small, enhance for larger screens.

## Breakpoints

| Name | Min-width | Devices | Input |
|------|-----------|---------|-------|
| sm | 480px | Large phones | Touch |
| md | 768px | Tablets | Touch/Mouse |
| lg | 1024px | Laptops | Mouse |
| xl | 1280px | Desktops | Mouse |
| 2xl | 1536px | Large monitors | Mouse |

```css
@media (min-width: 768px) { /* tablet+ */ }
@media (min-width: 1024px) { /* desktop+ */ }
```

## Layout Patterns

**Single → Multi-column**
- Mobile: `flex-direction: column`
- Tablet: `grid-template-columns: repeat(2, 1fr)`
- Desktop: 3-4 columns

**Sidebar**
- Mobile: hidden (use bottom nav or hamburger)
- Tablet: 64px icons-only
- Desktop: 240px full

**Split View (list + detail)**
- Mobile: full-screen views, navigate between
- Tablet+: side-by-side, list 320px fixed

## Navigation

**Bottom nav (mobile):** fixed bottom, space-around, 44px+ touch targets, hide on desktop

**Hamburger menu:** 280px slide-in, backdrop overlay, hide trigger on desktop

## Typography Scaling

```css
/* Fluid typography */
font-size: clamp(14px, 2.5vw, 16px);

/* Or step-based */
html { font-size: 14px; }
@media (min-width: 768px) { html { font-size: 15px; } }
@media (min-width: 1024px) { html { font-size: 16px; } }
```

## Component Adaptations

**Tables → Cards (mobile)**
- Hide thead, stack td vertically
- Use `data-label` attr for labels
- Add card border/padding

**Modals → Full-screen (mobile)**
- Remove max-width, border-radius
- Sticky header

**Forms**
- Desktop: inline labels (120px width)
- Mobile: stacked labels

**Button groups**
- Mobile: `flex-direction: column; width: 100%`

## Container Queries

For component-level responsiveness:
```css
.card-container { container-type: inline-size; }
@container (min-width: 400px) { /* wide card styles */ }
```

## Content Width

- Max content: 1200px
- Prose/text: 65ch
- Data tables: 1400px
- Always add horizontal padding (16-32px)

## Visibility Utils

- `.hide-mobile` → show at 768px+
- `.show-mobile-only` → hide at 768px+

## Testing Checklist

Test at: 320px, 375px, 768px, 1024px, 1440px, 1920px
Test: orientation changes, real content, touch interactions
