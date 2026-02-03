# Device & Viewport Reference

Design for real devices, not abstract breakpoints.

## Breakpoints

| Name | Range | Devices | Input |
|------|-------|---------|-------|
| xs | < 480px | Small phones | Touch |
| sm | 480-767px | Large phones | Touch |
| md | 768-1023px | Tablets | Touch/Mouse |
| lg | 1024-1279px | Laptops | Mouse |
| xl | 1280-1535px | Desktops | Mouse |
| 2xl | >= 1536px | Large monitors | Mouse |

## Touch vs Mouse

**Touch requirements:**
- Min touch target: 44x44px (Apple) / 48x48px (Material)
- Min spacing between targets: 8px
- No hover-dependent UI

**Mouse affordances:**
- Hover states expected
- Smaller targets OK (32px min)
- Cursor changes indicate interaction

## Input Detection

```css
@media (hover: none) and (pointer: coarse) { /* Touch */ }
@media (hover: hover) and (pointer: fine) { /* Mouse */ }
```

## Safe Areas

```css
padding: env(safe-area-inset-top) env(safe-area-inset-right)
         env(safe-area-inset-bottom) env(safe-area-inset-left);
```

## Viewport Units

- Avoid `100vh` on mobile (unreliable with browser chrome)
- Use `100dvh` (dynamic viewport height) with `100vh` fallback

## Screen Types

| Type | Width | Layout | Notes |
|------|-------|--------|-------|
| Phone | < 768px | Single column | Bottom nav, thumb-zone aware |
| Tablet | 768-1023px | 2 columns | Side nav viable, hybrid input |
| Laptop | 1024-1279px | Multi-column | Full nav, keyboard shortcuts |
| Desktop | 1280px+ | Wide + constrained | Split views, power features |

## Content Width

- Content max: 1200px
- Prose: 65ch
- Data tables: 1400px

## Pixel Ratios

- 1x: Standard displays
- 2x: Retina/HiDPI (@2x assets)
- 3x: Super Retina (@3x assets)

Use `0.5px` borders on retina for hairlines.

## Testing

Test at: 375px (iPhone), 393px (iPhone 14), 768px (iPad), 1280px (laptop), 1920px+ (desktop)
