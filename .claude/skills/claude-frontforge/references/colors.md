# Color System Reference

## Core Philosophy

**Gray builds structure. Color communicates meaning.**

Use neutrals for 80% of the interface. Reserve accent colors for actions, status, and emphasis. Decorative color is noise.

---

## Color Foundations

### Neutral Scales

Choose ONE foundation tone for your neutral scale:

**Warm Grays** — Approachable, comfortable, human. Good for collaborative tools.
```
Use: Tailwind Stone, Zinc (warm cast)
Products: Notion, Coda
```

**Cool Grays** — Professional, trustworthy, serious. Good for SaaS, finance.
```
Use: Tailwind Slate, Blue-Gray
Products: Stripe, Linear, GitHub
```

**Pure Neutrals** — Minimal, technical, bold. Good for developer tools.
```
Use: Tailwind Gray, Neutral
Products: Raycast, terminal-inspired
```

**Tinted Neutrals** — Distinctive, branded. Pick ONE hue cast at 3-5% saturation.
```
Example: Violet-tinted slate, green-tinted gray
Use sparingly — it must feel intentional, not accidental
```

### Scale Structure

Every neutral scale should have 11 steps (50→950 or 0→1000):

```
50:   Near-white for backgrounds
100:  Subtle tint backgrounds (inputs, code)
200:  Borders (light)
300:  Disabled text, placeholders
400:  Secondary icons
500:  Mid — use sparingly
600:  Secondary text
700:  Primary text on light bg
800:  Headings, strong text
900:  Near-black
950:  True dark background
```

---

## Accent Color

### Rules

1. **One accent only** — Multiple accent colors create visual noise
2. **Semantic, not decorative** — Use for interactive elements, not decoration
3. **Works in both modes** — Adjust shade for contrast in light/dark

### Common Accents by Direction

| Direction | Accent Choice | Rationale |
|-----------|--------------|-----------|
| Precision & Density | Blue-500 or Indigo-500 | Technical, neutral authority |
| Warmth & Approachability | Orange-400 or Amber-400 | Energy, human warmth |
| Sophistication & Trust | Slate-Blue or Cool Blue | Financial gravitas |
| Boldness & Clarity | Violet-600 or any strong hue | Decisiveness |
| Utility & Function | Green-600 or Teal | Function, success |
| Data & Analysis | Blue-500 or Purple-600 | Data, insight |

### Accent Scale (generate from one hue)

```
--accent-50:   Subtle tint backgrounds (hover backgrounds)
--accent-100:  Subtle fill (tags, chips)
--accent-200:  Soft badge backgrounds
--accent-400:  Icons, decorative accents
--accent-500:  Primary accent (icons on colored bg)
--accent-600:  Main interactive color (buttons, links)
--accent-700:  Hover state
--accent-800:  Active/pressed state
--accent-900:  Text on accent bg (ensure 4.5:1 contrast)
```

---

## Semantic Color System

Map your primitives to semantic roles:

### Backgrounds

```css
--color-bg-page:      /* Page background */
--color-bg-base:      /* Default surface (cards, panels) */
--color-bg-elevated:  /* Elevated surfaces (modals, dropdowns) */
--color-bg-sunken:    /* Recessed (inputs, code blocks) */
--color-bg-overlay:   /* Overlays (tooltips, menus) */
```

### Text

```css
--color-text-primary:    /* Body text, main content */
--color-text-secondary:  /* Labels, captions, helper text */
--color-text-tertiary:   /* Placeholders, subtle hints */
--color-text-disabled:   /* Inactive elements */
--color-text-inverse:    /* Text on dark/accent backgrounds */
--color-text-link:       /* Interactive text */
```

### Borders

```css
--color-border-subtle:   /* Hairline dividers */
--color-border-base:     /* Default borders */
--color-border-strong:   /* Emphasized borders */
--color-border-focus:    /* Focus rings */
```

### Status

```css
--color-success:         /* Positive actions, completed states */
--color-success-subtle:  /* Success background tint */
--color-warning:         /* Caution, attention needed */
--color-warning-subtle:  /* Warning background tint */
--color-error:           /* Errors, destructive actions */
--color-error-subtle:    /* Error background tint */
--color-info:            /* Informational, neutral alerts */
--color-info-subtle:     /* Info background tint */
```

---

## Dark Mode Strategy

### Rule: Shift, Don't Invert

Don't simply invert light colors. The relationships must feel natural.

```
Light surface:  gray-50  →  Dark surface: gray-950
Light card:     white    →  Dark card:    gray-900
Light border:   gray-200 →  Dark border:  gray-800
Light text:     gray-900 →  Dark text:    gray-100
```

### Elevation in Dark Mode

In dark mode, elevation is conveyed by **lighter surfaces**, not shadows:

```
Page bg:       gray-950
Base surface:  gray-900   (+1 step lighter)
Elevated:      gray-800   (+2 steps lighter)
Overlay:       gray-750   (+3 steps lighter)
```

### Accent in Dark Mode

Adjust shade to maintain readability:

```
Light: accent-600 (works against gray-50 bg)
Dark:  accent-400 (works against gray-900 bg)
```

### Implementation

```css
/* Light (default) */
:root {
  --color-bg-base: theme('colors.gray.50');
  --color-text-primary: theme('colors.gray.900');
  --color-accent: theme('colors.blue.600');
}

/* Dark */
[data-theme="dark"],
.dark {
  --color-bg-base: theme('colors.gray.950');
  --color-text-primary: theme('colors.gray.100');
  --color-accent: theme('colors.blue.400');
}

/* System preference fallback */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-bg-base: theme('colors.gray.950');
  }
}
```

---

## Contrast Requirements

WCAG 2.1 minimums:

| Usage | Minimum | Target |
|-------|---------|--------|
| Body text (normal) | 4.5:1 | 7:1 |
| Large text (18px+) | 3:1 | 4.5:1 |
| UI components, icons | 3:1 | 4.5:1 |
| Decorative elements | None | — |

**Quick checks:**
- `gray-900` on `white`: 19.1:1 ✓
- `gray-600` on `white`: 5.9:1 ✓
- `gray-400` on `white`: 2.5:1 ✗
- `blue-600` on `white`: 4.6:1 ✓ (barely)
- `blue-400` on `white`: 2.8:1 ✗

---

## Common Mistakes

**Using too many colors**
→ 18+ colors in a codebase signals no system. Reduce to a palette of 8 with tints.

**Pure black (#000000) on pure white**
→ Too harsh. Use gray-900 on gray-50 for more comfortable reading.

**Accent on every element**
→ When everything is blue, nothing is blue. Reserve it for truly interactive elements.

**Same gray in light and dark mode**
→ Dark backgrounds need slightly desaturated colors. Pure white on dark feels jarring.

**Status colors without subtle variants**
→ A full red error message is aggressive. Pair with subtle background tints.
