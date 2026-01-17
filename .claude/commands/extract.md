---
name: claude-frontforge:extract
description: Extract design patterns from existing code to create a system.md file.
---

# claude-frontforge extract

Extract design patterns from existing code to create a system.

## Usage

```
/extract          # Extract from common UI paths
/extract <path>   # Extract from specific directory
```

## What to Extract

**Scan UI files (tsx, jsx, vue, svelte) for:**

1. **Repeated spacing values**
   ```
   Found: 4px (12x), 8px (23x), 12px (18x), 16px (31x), 24px (8x)
   → Suggests: Base 4px, Scale: 4, 8, 12, 16, 24
   ```

2. **Repeated radius values**
   ```
   Found: 6px (28x), 8px (5x)
   → Suggests: Radius scale: 6px, 8px
   ```

3. **Button patterns**
   ```
   Found 8 buttons:
   - Height: 36px (7/8), 40px (1/8)
   - Padding: 12px 16px (6/8), 16px (2/8)
   → Suggests: Button pattern: 36px h, 12px 16px padding
   ```

4. **Card patterns**
   ```
   Found 12 cards:
   - Border: 1px solid (10/12), none (2/12)
   - Padding: 16px (9/12), 20px (3/12)
   → Suggests: Card pattern: 1px border, 16px padding
   ```

5. **Depth strategy**
   ```
   box-shadow found: 2x
   border found: 34x
   → Suggests: Borders-only depth
   ```

**Then prompt:**
```
Extracted patterns:

Spacing:
  Base: 4px
  Scale: 4, 8, 12, 16, 24, 32

Depth: Borders-only (34 borders, 2 shadows)

Patterns:
  Button: 36px h, 12px 16px pad, 6px radius
  Card: 1px border, 16px pad

Create .frontforge/system.md with these? (y/n/customize)
```

## Implementation

1. Run component extraction: `node ${CLAUDE_PLUGIN_ROOT}/hooks/extract-components.js`
2. Analyze detected component patterns
3. Run token generation: `node ${CLAUDE_PLUGIN_ROOT}/hooks/generate-tokens.js`
4. Combine both analyses
5. Suggest comprehensive system based on:
   - Component patterns (Button, Card, Input, etc.)
   - Design tokens (spacing, colors, shadows)
   - Depth strategy (borders vs shadows)
6. Offer to create system.md
7. Let user customize before saving

## Example Output

```
Analisei 47 arquivos e encontrei:

Componentes detectados (15):
  - Button: 8 variações (primary, secondary, ghost)
    • Altura comum: 40px
    • Padding: 12px 20px
    • Border radius: 8px
  - Card: 12 instâncias
    • Padding: 20px
    • Shadow: 0 1px 3px rgba(0,0,0,0.08)
  - Input: 6 instâncias
    • Altura: 40px
    • Border: 1px solid

Tokens de design:
  - Base de spacing: 4px (85% conformidade)
  - Escala: 4, 8, 12, 16, 20, 24, 32, 48
  - Paleta: 18 cores (sugiro reduzir para 8)
  - Depth strategy: Subtle shadows (3 shadows, 8 borders)

Criar .frontforge/system.md com esses padrões?
```
