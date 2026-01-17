---
name: claude-frontforge:generate-tokens
description: Analisa código existente e gera tokens de design automaticamente (spacing, colors, shadows, etc.)
---

Gera tokens de design analisando código existente no projeto.

## Como funciona

1. Executa o script de análise: `node ${CLAUDE_PLUGIN_ROOT}/hooks/generate-tokens.js`
2. O script analisa arquivos CSS, SCSS, TSX, JSX, Vue, Svelte
3. Extrai automaticamente:
   - **Spacing**: valores de padding, margin, gap
   - **Colors**: hex, rgb, hsl
   - **Shadows**: box-shadow
   - **Border Radius**: valores de border-radius
   - **Font Sizes**: tamanhos de fonte
4. Detecta base de spacing (4px, 8px, ou 10px)
5. Gera escala de spacing sugerida

## Output Formats

- **CSS** (padrão): Variáveis CSS em `:root`
- **JS/TS**: Export de objeto JavaScript
- **JSON**: Dados brutos

## Exemplo de uso

```bash
# Gerar tokens CSS
node ${CLAUDE_PLUGIN_ROOT}/hooks/generate-tokens.js . css

# Gerar tokens JavaScript
node ${CLAUDE_PLUGIN_ROOT}/hooks/generate-tokens.js . js

# Gerar JSON
node ${CLAUDE_PLUGIN_ROOT}/hooks/generate-tokens.js . json
```

## Depois de gerar

1. Revise os tokens gerados
2. Pergunte ao usuário onde salvar:
   - `src/styles/tokens.css`
   - `src/design-tokens.js`
   - Outro local preferido
3. Ofereça refatorar código existente para usar os tokens
4. Atualize `.frontforge/system.md` com os tokens

## Comunicação

Seja direto e útil:

```
"Analisei 47 arquivos e encontrei:
- 23 cores diferentes (sugiro reduzir para paleta de 8)
- Base de spacing: 4px (82% dos valores seguem)
- 5 shadows distintas

Posso gerar arquivo de tokens CSS?"
```

Sempre ofereça próximos passos após gerar os tokens.
