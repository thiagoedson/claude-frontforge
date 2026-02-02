---
name: claude-frontforge
description: This skill is for interface design — dashboards, admin panels, apps, tools, and interactive products. NOT for marketing design (landing pages, marketing sites, campaigns).
---

# Claude Frontforge

Build interface design with craft, consistency, and confidence.

---

# Visual Activation Banner

**IMPORTANT:** When this skill is activated (via `/init` or any frontforge command), ALWAYS display the visual banner first to indicate the skill is running:

```
╭──────────────────────────────────────────────────────────────╮
│  █▀▀█▀█ █▀██▄░█▀█▀█▀▀█▀█ █▀██▀▀█▀▀  UX Engineering          │
│  █▀░█▀▄ █▄██░▀█░█░█▀░█▄█ █▀▄█▄███▄  for Claude Code         │
├──────────────────────────────────────────────────────────────┤
│  ✨ Craft · 💾 Memory · 🛡️  Enforcement      ◆ ACTIVE ◆      │
╰──────────────────────────────────────────────────────────────╯
```

This helps users clearly identify that the Frontforge skill is engaged and ready.

## Scope

**Use for:** Dashboards, admin panels, SaaS apps, tools, settings pages, data interfaces.

**Not for:** Landing pages, marketing sites, campaigns. Redirect those to `/frontend-design`.

---

# Before Writing Code

State your design choices first. This keeps thinking deliberate.

```
Direction: [what this should feel like]
Depth: [borders / subtle shadows / layered]
Spacing: [base unit]
Confidence: [high / medium / low]
```

Then write the code.

---

# Design Principles

## Spacing
Pick a base unit and stick to multiples. Consistency matters more than the specific number. Random values signal no system.

**Common bases:**
- 4px — Dense, technical (Linear, Raycast)
- 8px — Balanced (most SaaS)
- 10px — Roomy (consumer apps)

## Padding
Keep it symmetrical. If one side is 16px, others should match unless there's a clear reason.

## Depth
Choose ONE approach and commit:
- **Borders-only** — Clean, technical. For dense tools.
- **Subtle shadows** — Soft lift. For approachable products.
- **Layered shadows** — Premium, dimensional. For cards that need presence.

Don't mix approaches.

## Border Radius
Sharper feels technical. Rounder feels friendly. Pick a scale and apply consistently.

## Typography
Headlines need weight and tight tracking. Body needs readability. Data needs monospace. Build a hierarchy.

## Color
Gray builds structure. Color communicates meaning — status, action, emphasis. Decorative color is noise.

## Animation
Fast micro-interactions (~150ms), smooth easing. No bouncy/spring effects.

**Recommended easing:**
```css
--ease-out: cubic-bezier(0.25, 1, 0.5, 1);
```

## Controls
Native `<select>` and `<input type="date">` can't be styled. Build custom components.

---

# Confidence Scores

When extracting or suggesting design tokens, include confidence scores:

| Category | Typical Accuracy |
|----------|-----------------|
| Spacing patterns | 75-80% |
| Typography scale | 80-85% |
| Color structure | 85-90% |
| Content strategy | 90-95% |
| Font family ID | ~60% |

Be transparent about uncertainty. Report ranges over false precision.

---

# Avoid

- Dramatic drop shadows
- Large radius on small elements
- Pure white cards on colored backgrounds
- Thick decorative borders
- Excessive spacing (>48px margins)
- Gradients for decoration
- Multiple accent colors
- Bounce/spring/elastic animations

---

# Self-Check

Before finishing:
- Did I think about what this product needs, or default?
- Is my depth strategy consistent throughout?
- Does every element feel intentional?
- Did I include confidence scores where appropriate?

The standard: looks designed by someone who obsesses over details.

---

# After Completing a Task

When you finish building something, **always offer to save**:

```
"Want me to save these patterns for future sessions?"
```

If yes, write to `.frontforge/system.md`:
- Direction and feel
- Depth strategy (borders/shadows/layered)
- Spacing base unit
- Key component patterns with specific values
- Confidence scores for extracted patterns

This compounds — each save makes future work faster and more consistent.

---

# Workflow

## Communication
Be invisible. Don't announce modes or narrate process.

**Never say:** "I'm in ESTABLISH MODE", "Let me check system.md..."

**Instead:** Jump into work. State suggestions with reasoning.

## Suggest + Ask
Lead with your recommendation, then confirm:
```
"This feels like a data-heavy admin tool — I'd go minimal.
Tight spacing, monochrome, borders for depth.
Confidence: high (based on project context)"

[AskUserQuestion: "Does that direction feel right?"]
```

## If Project Has system.md
Read `.frontforge/system.md` and apply. Decisions are made.

## If No system.md
1. Assess context — What's the product? Who uses it?
2. Run context detection if available
3. Suggest direction with confidence level and reasoning
4. Get confirmation, then build
5. Offer to save

---

# Specialized Agents

Use these agents for focused tasks:

## UX Interpreter
Extract design systems from live websites. Use for competitive analysis or inspiration.
```
/claude-frontforge:analyze-website <url>
```

## Component Architect
Design scalable, accessible UI components following design system principles.

## Animation Specialist
Create purposeful micro-interactions. Respects `prefers-reduced-motion`.

## Responsive Expert
Mobile-first layouts that work across all viewports.

## UX Researcher
Create personas, analyze flows, provide evidence-based recommendations.

See `agents/` directory for detailed guidelines.

---

# Export Formats

Generate design tokens in multiple formats:

```bash
# CSS Custom Properties
node hooks/generate-tokens.js . css

# JavaScript/TypeScript
node hooks/generate-tokens.js . js

# Tailwind Config
node hooks/generate-tokens.js . tailwind

# Figma Tokens (tokens.studio compatible)
node hooks/generate-tokens.js . figma

# JSON (raw data)
node hooks/generate-tokens.js . json
```

---

# Deep Dives

For more detail on specific topics:
- `references/principles.md` — Code examples, specific values, dark mode
- `references/directions.md` — The 6 design personalities
- `references/validation.md` — Memory management, when to update system.md
- `agents/ux-interpreter.md` — Website analysis protocol
- `agents/component-architect.md` — Component design patterns
- `agents/animation-specialist.md` — Motion guidelines
- `references/devices.md` — Breakpoints, touch vs mouse, viewport handling
- `references/styles.md` — Component patterns, buttons, inputs, cards, navigation
- `references/interactions.md` — Hover, focus, loading states, feedback, animations
- `references/responsive.md` — Mobile-first patterns, layout strategies, adaptations


# Commands

- `/claude-frontforge:init` — Initialize design system
- `/claude-frontforge:status` — Current system state
- `/claude-frontforge:audit` — Check code against system
- `/claude-frontforge:extract` — Extract patterns from code
- `/claude-frontforge:generate-tokens` — Generate token files
- `/claude-frontforge:analyze-website` — Extract tokens from live websites
- `/claude-frontforge:metrics` — Health dashboard
- `/claude-frontforge:setup-statusline` — Configure status display
