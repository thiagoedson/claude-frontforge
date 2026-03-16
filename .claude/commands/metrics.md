---
name: claude-frontforge:metrics
description: Show design system health metrics: spacing grid conformance %, color palette usage %, depth strategy consistency, and animation quality. Generates a 0-100 score with specific improvement suggestions.
---

Generate a full health report for the project's design system.

## How it works

1. Reads `.frontforge/system.md` to understand the established rules
2. Scans all UI files in the project (TSX, JSX, Vue, Svelte, CSS, SCSS)
3. Calculates conformance metrics across 4 areas:
   - **Spacing**: % of values that follow the defined grid
   - **Colors**: % of usage within the defined palette
   - **Depth**: Conformance with the chosen strategy (borders/shadows)
   - **Animation**: Quality of transitions (no bounce, appropriate duration)
4. Generates an overall score from 0–100
5. Provides specific improvement suggestions

## Running

```bash
node ${CLAUDE_PLUGIN_ROOT}/hooks/metrics-dashboard.js
```

## Example output

```
╔════════════════════════════════════════════════════════════════╗
║              DESIGN SYSTEM HEALTH DASHBOARD                    ║
╚════════════════════════════════════════════════════════════════╝

📊 OVERALL SCORE: 87/100 ████████░░
   🎯 Very good! Minor improvements needed

─────────────────────────────────────────────────────────────────

📏 SPACING CONSISTENCY: 92% █████████░
   156/170 values on grid
   ⚠️  Off-grid values: 6, 10, 14, 18px

🎨 COLOR PALETTE USAGE: 78% ███████░░░
   12 colors in use (palette defines 8)
   ⚠️  4 colors outside the palette

🎭 DEPTH STRATEGY: 100% ██████████
   Strategy: subtle-shadows
   Shadows: 12 | Borders: 8

⚡ ANIMATIONS: 85% ████████░░
   23 transitions found
   Average duration: 180ms
   ⚠️  2 slow animations (>300ms)

─────────────────────────────────────────────────────────────────

💡 SUGGESTIONS:

1. Standardize spacing: 14 off-grid values detected
2. Consolidate color palette: 4 colors outside the palette
3. Optimize animation duration (2 animations >300ms)
```

## When to use

- After implementing features to verify conformance
- Before code review
- Periodically to maintain quality
- After large refactors

## Communication

Be direct when presenting the dashboard:

```
"Analyzed 127 files. Overall score: 87/100

Key findings:
✅ Spacing consistent (92%)
⚠️  Color palette needs consolidation (78%)
✅ Depth strategy perfect

Want me to fix the 4 out-of-palette colors?"
```

Always offer concrete actions based on the metrics.
