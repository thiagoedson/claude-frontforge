---
name: claude-frontforge:component
description: Build a UI component (Button, Card, Modal, Input, Table, Dropdown, etc.) with all variants, interactive states (hover, focus, disabled, loading), accessibility attributes, and design token references — consistent with the project's established design system.
---

# claude-frontforge component

Build a single UI component with craft, consistency, and accessibility.

## Usage

```
/component <name>              # Build a component (e.g. Button, Card, Modal)
/component <name> --variants   # Specify variants to include
/component <name> --dark       # Include dark mode support
```

## Flow

1. **Load context** — Check `.frontforge/system.md` for established patterns
2. **Understand the component** — Ask what it does, who uses it, where it lives
3. **Define anatomy** — List all variants, states, and sub-elements
4. **Build with tokens** — Use system tokens, never raw values
5. **Add interactions** — Hover, focus, active, disabled, loading
6. **Validate accessibility** — WCAG 2.1 AA minimum
7. **Offer to save** — Add pattern to `system.md`

## Component Anatomy Protocol

Before writing code, state the component plan:

```
Component: Button
Variants: primary, secondary, ghost, destructive
Sizes: sm (28px), md (36px), lg (44px)
States: default, hover, focus, active, disabled, loading
Tokens used: --color-primary, --spacing-2, --radius-md
Accessibility: role="button", aria-disabled, aria-busy
```

Then write the code.

## What Makes a Good Component

**Variants** — Driven by semantic meaning, not visual style. `primary` is for the main action. `ghost` is for secondary. `destructive` is for irreversible actions.

**Sizes** — Follow the spacing grid. Touch targets minimum 44×44px on mobile.

**States** — Every interactive element needs: hover, focus (visible outline), active, disabled. No exceptions.

**Tokens** — Never hardcode values. Always reference system tokens.

**Accessibility** — Correct ARIA roles, keyboard navigation, focus management, `prefers-reduced-motion` for animations.

## Output Format

Provide:
1. The component code (TSX/JSX/Vue/Svelte depending on project)
2. Usage examples showing all variants
3. Token references used
4. A11y notes

## After Building

Always offer:
```
"Want me to add this component pattern to .frontforge/system.md?"
```

And ask if they want the component extracted to its own file if it was built inline.
