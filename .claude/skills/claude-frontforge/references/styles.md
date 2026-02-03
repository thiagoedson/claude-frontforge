# Component Patterns

Quick reference for common UI components. Generate CSS following these specs.

## Buttons

| Size | Height | Padding | Font |
|------|--------|---------|------|
| xs | 24px | 0 8px | 12px |
| sm | 32px | 0 12px | 13px |
| md | 36px | 0 16px | 14px |
| lg | 44px | 0 20px | 15px |

**Variants:** primary (solid accent), secondary (border + subtle bg), ghost (transparent), destructive (error color)

**Icon buttons:** Square, same height as size. Use `inline-flex` + `align-items: center`.

## Inputs

- Height: 36px (match btn-md)
- Padding: 0 12px
- Border: 1px solid var(--border)
- Focus: accent border + 3px ring (accent-muted)
- Error: error border + error ring
- Disabled: 0.5 opacity, not-allowed cursor

**With icon:** `padding-left: 36px`, icon absolute positioned at `left: 12px`

## Cards

Structure: `.card` > `.card-header` + `.card-body` + `.card-footer`

- Padding: 16px (body), 12-16px (header/footer)
- Border-radius: var(--radius-lg)
- Depth: Choose ONE (border-only OR shadow)
- Interactive: Add hover border-color change

## Lists & Tables

**List items:** 12px 16px padding, border-bottom, hover bg-subtle

**Tables:**
- th: 12px 16px, 500 weight, bg-subtle, text-secondary
- td: 12px 16px, border-bottom
- Numeric: `tabular-nums`, `font-mono`, right-align

## Navigation

**Sidebar:** 240px width, border-right
- Section label: 11px uppercase, 0.05em spacing, text-muted
- Item: 8px 12px, radius, hover bg-subtle
- Active: accent-muted bg, accent color

**Top nav:** 56px height, 0 24px padding, border-bottom
- Links: 8px 12px padding, hover bg-subtle

**Tabs:** border-bottom, active = accent + 2px bottom border

## Modals & Dropdowns

**Modal:** max-width 480px, max-height 85vh, radius-lg, shadow-lg
- Header: 16px 20px, border-bottom, flex between
- Body: 20px padding
- Footer: 16px 20px, border-top, flex end, gap 8px

**Dropdown:** min-width 180px, 4px padding, shadow-md
- Items: 8px 12px, hover bg-subtle

## Badges

Height 20px, padding 0 6px, font 11px 500, radius 10px (pill)

**Variants:** primary, success, warning, error (use -muted bg + semantic color)

## Forms

- Label: 14px 500 weight
- Hint: 13px text-muted
- Error: 13px error color
- Group margin: 16px bottom
- Gap between label/input: 6px

**Checkbox/Radio:** 16px square, accent when checked

## Loading

**Spinner:** 20px, 2px border, top-color accent, 600ms spin
**Skeleton:** shimmer gradient animation 1.5s

## Layout Utils

```css
/* Flex */ .flex, .flex-col, .items-center, .justify-between
/* Grid */ .grid, .grid-cols-2/3/4
/* Spacing */ .p-2(8px), .p-4(16px), .p-6(24px), .gap-2(8px), .gap-4(16px)
```
