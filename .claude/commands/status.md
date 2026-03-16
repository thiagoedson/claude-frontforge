---
name: claude-frontforge:status
description: Display the active design system for this project: design direction, spacing base, depth strategy, color tokens, and saved component patterns. Use to check what's been established before building.
---

# claude-frontforge status

Show current design system state.

## Visual Indicator

First, display the status banner to show the skill is active:

```
╭─────────────────────────────────────────────╮
│ FRONTFORGE ● Active                         │
├─────────────────────────────────────────────┤
│ Direction:  [Direction Name]                │
│ Spacing:    [Xpx base]                      │
│ Depth:      [Strategy]                      │
│ Confidence: [Score]                         │
╰─────────────────────────────────────────────╯
```

## What to Show

**If `.frontforge/system.md` exists:**

Display:
```
Design System: [Project Name]

Direction: [Precision & Density / Warmth / etc]
Foundation: [Cool slate / Warm stone / etc]
Depth: [Borders-only / Subtle shadows / Layered]

Tokens:
- Spacing base: 4px
- Radius scale: 4px, 6px, 8px
- Colors: [count] defined

Patterns:
- Button Primary (36px h, 16px px, 6px radius)
- Card Default (border, 16px pad)
- [other patterns...]

Last updated: [from git or file mtime]
```

**If no system.md:**

```
No design system found.

Options:
1. Build UI → system will be established automatically
2. Run /claude-frontforge:extract → pull patterns from existing code
```

## Implementation

1. Read `.frontforge/system.md`
2. Parse direction, tokens, patterns
3. Format and display
4. If no system, suggest next steps
