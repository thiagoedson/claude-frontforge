---
name: claude-frontforge:init
description: Build UX with craft and consistency. For interface design (dashboards, apps, tools) — not marketing sites.
---

Use the claude-frontforge skill to build interface design.

**Scope:** Dashboards, apps, tools, admin panels. Not landing pages or marketing sites.

## Before Writing Code

State your design choices first:
```
Direction: [what this should feel like]
Depth: [borders / subtle shadows / layered]
Spacing: [base unit]
```

Then write the code.

## Communication

Be invisible. Don't announce modes or narrate process.

**Never say:** "I'm in ESTABLISH MODE", "Let me check system.md..."

**Instead:** Jump into work. State suggestions with reasoning.

<<<<<<< Updated upstream
=======
## Intelligent Context Detection

Before suggesting, run the context detector to analyze:
- Project type (framework, dependencies)
- Keywords in README and package.json
- Folder structure patterns

The detector returns a JSON with:
- `suggestion.primary`: Top recommended direction
- `suggestion.confidence`: high/medium/low
- `suggestion.reasoning`: Why this direction was chosen
- `project.framework`: Detected framework

Use this to inform your suggestion, but apply your own judgment too.

>>>>>>> Stashed changes
## Suggest + Ask

Lead with your recommendation, then confirm:
```
<<<<<<< Updated upstream
"This feels like a data-heavy admin tool — I'd go minimal.
Tight spacing, monochrome, borders for depth."

[AskUserQuestion: "Does that direction feel right?"]
=======
"Detectei que é um projeto Next.js com foco em analytics (alta confiança).
Sugiro Data & Analysis: grid de 4px, paleta otimizada para charts, densidade funcional."

[AskUserQuestion: "Essa direção faz sentido?"]
>>>>>>> Stashed changes
```

## Flow

1. Check if `.frontforge/system.md` exists
2. **If exists**: Apply established patterns
<<<<<<< Updated upstream
3. **If not**: Assess context, suggest direction, get confirmation, build
=======
3. **If not**:
   - Run context detection: `node ${CLAUDE_PLUGIN_ROOT}/hooks/detect-context.js`
   - Use AI analysis from detection to inform your suggestion
   - Suggest direction with confidence level and reasoning
   - Get confirmation, then build
>>>>>>> Stashed changes

## After Every Task

Offer to save when you finish building UI:

"Want me to save these patterns to `.frontforge/system.md`?"

Always offer — new patterns should be captured whether system.md exists or not.
