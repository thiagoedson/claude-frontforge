---
name: claude-frontforge:generate-tokens
description: Analyze existing code and automatically generate design tokens (spacing, colors, shadows, etc.)
---

Analyze existing code to generate design tokens for the project.

## How it works

1. Run the analysis script: `node ${CLAUDE_PLUGIN_ROOT}/hooks/generate-tokens.js`
2. The script scans CSS, SCSS, TSX, JSX, Vue, Svelte files
3. Automatically extracts:
   - **Spacing**: padding, margin, gap values
   - **Colors**: hex, rgb, hsl
   - **Shadows**: box-shadow
   - **Border Radius**: border-radius values
   - **Font Sizes**: typography scale
4. Detects spacing base (4px, 8px, or 10px)
5. Generates a suggested spacing scale

## Output Formats

- **CSS** (default): CSS custom properties in `:root`
- **JS/TS**: JavaScript object export
- **Tailwind**: Tailwind config extension
- **Figma**: tokens.studio compatible format
- **JSON**: Raw data

## Usage

```bash
# Generate CSS tokens
node ${CLAUDE_PLUGIN_ROOT}/hooks/generate-tokens.js . css

# Generate JavaScript tokens
node ${CLAUDE_PLUGIN_ROOT}/hooks/generate-tokens.js . js

# Generate Tailwind config
node ${CLAUDE_PLUGIN_ROOT}/hooks/generate-tokens.js . tailwind

# Generate Figma tokens
node ${CLAUDE_PLUGIN_ROOT}/hooks/generate-tokens.js . figma

# Generate JSON
node ${CLAUDE_PLUGIN_ROOT}/hooks/generate-tokens.js . json
```

## After Generating

1. Review the generated tokens
2. Ask the user where to save:
   - `src/styles/tokens.css`
   - `src/design-tokens.js`
   - `src/styles/tokens.ts`
   - Another preferred location
3. Offer to refactor existing code to use the tokens
4. Update `.frontforge/system.md` with the tokens

## Communication

Be direct and helpful:

```
"Analyzed 47 files and found:
- 23 different colors (suggest reducing to a palette of 8)
- Spacing base: 4px (82% conformance)
- 5 distinct shadows

Shall I generate a CSS tokens file?"
```

Always offer next steps after generating tokens.
