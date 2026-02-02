---
name: claude-frontforge:analyze-website
description: Extract design tokens and patterns from live websites using vision analysis to create build-ready blueprints.
---

# claude-frontforge analyze-website

Extract design systems from live websites through vision-based analysis.

## Usage

```
/analyze-website <url>                    # Analyze single site
/analyze-website <url> --focus=colors     # Focus on specific tokens
/analyze-website <url1> <url2> --compare  # Compare multiple sites
```

## Options

- `--focus=<area>`: typography, colors, spacing, layout, surfaces, all (default: all)
- `--format=<format>`: json, css, tailwind, figma (default: json)
- `--compare`: Enable comparison mode for multiple URLs

## What Gets Extracted

### Typography
- Font families (classified by type: sans, serif, mono, display)
- Size scale with relationships
- Weight usage patterns
- Line height conventions
- **Confidence: 80-85%**

### Colors
- Primary/secondary/accent colors
- Neutral scale
- Semantic colors (success, warning, error)
- **Confidence: 85-90%** (±10-15% hex variance)

### Spacing
- Base unit detection (4px, 8px, 10px)
- Scale pattern identification
- Component-specific spacing
- **Confidence: 75-80%**

### Layout
- Grid system (columns, gutters)
- Container widths
- Section spacing
- **Confidence: 70-80%**

### Surfaces
- Shadow patterns and depths
- Border treatments
- Backdrop effects
- **Confidence: 80-85%**

## Analysis Protocol

### 3-Pass Capture

1. **Structure Pass** (1440px desktop)
   - Major sections identification
   - Layout grid analysis
   - Visual hierarchy mapping

2. **Component Pass** (Element inspection)
   - Button patterns
   - Card treatments
   - Input styles
   - Navigation patterns

3. **Interaction Pass** (States + responsive)
   - Hover states
   - Focus indicators
   - Breakpoint behaviors (768px, 375px)

## Output Example

```json
{
  "metadata": {
    "url": "stripe.com",
    "analyzedAt": "2026-02-02T10:30:00Z",
    "overallConfidence": "82%"
  },
  "tokens": {
    "typography": {
      "families": {
        "primary": "Inter (sans-serif)",
        "mono": "JetBrains Mono"
      },
      "scale": ["12px", "14px", "16px", "18px", "24px", "32px", "48px"],
      "weights": ["400", "500", "600", "700"],
      "confidence": "85%"
    },
    "colors": {
      "primary": "#635BFF",
      "secondary": "#0A2540",
      "neutral": ["#F6F9FC", "#E3E8EE", "#8792A2", "#425466", "#0A2540"],
      "semantic": {
        "success": "#30D158",
        "warning": "#FF9F0A",
        "error": "#FF453A"
      },
      "confidence": "88%"
    },
    "spacing": {
      "base": "4px",
      "scale": ["4px", "8px", "16px", "24px", "32px", "48px", "64px"],
      "confidence": "78%"
    },
    "surfaces": {
      "shadows": [
        "0 1px 3px rgba(0,0,0,0.08)",
        "0 4px 12px rgba(0,0,0,0.1)",
        "0 12px 24px rgba(0,0,0,0.12)"
      ],
      "borders": "1px solid rgba(0,0,0,0.08)",
      "radius": ["4px", "8px", "12px"],
      "confidence": "82%"
    }
  },
  "contentAnalysis": {
    "siteType": "SaaS / Fintech",
    "voiceTone": "Professional, confident, technical",
    "industrySignals": ["payments", "developer-focused", "enterprise"],
    "confidence": "92%"
  },
  "strategyInference": {
    "primaryGoal": "Developer trust and enterprise credibility",
    "audienceSignals": ["Technical decision-makers", "Developers"],
    "designTradeoffs": [
      "Chose density over breathing room",
      "Prioritized information over delight"
    ]
  },
  "suggestedDirection": "Sophistication & Trust",
  "decisionTraces": [
    "Cool color palette (blue/slate) → Professional, trustworthy",
    "Layered shadows → Premium, dimensional feel",
    "Monospace in code blocks → Developer credibility"
  ]
}
```

## Comparison Mode

When using `--compare` with multiple URLs:

```
/analyze-website stripe.com linear.app mercury.com --compare
```

Outputs a comparison matrix:

```markdown
| Aspect | Stripe | Linear | Mercury |
|--------|--------|--------|---------|
| Direction | Sophistication | Precision | Sophistication |
| Base spacing | 4px | 4px | 8px |
| Depth strategy | Layered | Borders | Subtle shadows |
| Typography | Inter | Inter | SF Pro |
| Primary color | #635BFF | #5E6AD2 | #2563EB |
```

## Known Limitations

Be transparent about accuracy:

- **Font family identification**: ~60% accurate (classify by type anatomy)
- **Hex values**: ±10-15% variance from screenshots
- **Cannot detect**: Exact transition timings, CSS implementation details
- **Responsive**: Requires separate captures per viewport

## Integration with Frontforge

After analysis, you can:

1. **Create system.md**: `/init` with extracted tokens
2. **Generate tokens**: `/generate-tokens --format=tailwind`
3. **Apply to project**: Use extracted patterns as foundation

## Example Workflow

```
User: /analyze-website linear.app

Claude: Analyzing linear.app...

📊 Analysis Complete (Confidence: 85%)

**Direction Detected:** Precision & Density
**Key Characteristics:**
- Tight 4px grid
- Borders-only depth (minimal shadows)
- Monochromatic palette with purple accent
- Dense information display

**Typography:**
- Primary: Inter (sans-serif)
- Scale: 11, 12, 13, 14, 16, 20, 24px
- Weights: 400, 500, 600

**Colors:**
- Primary: #5E6AD2 (purple)
- Background: #1A1A1F (dark)
- Text: #E8E8ED (light)

**Strategy Inference:**
Linear optimizes for power users who need information density.
The minimal depth (borders-only) keeps focus on content.

Create .frontforge/system.md with these patterns? (y/n)
```
