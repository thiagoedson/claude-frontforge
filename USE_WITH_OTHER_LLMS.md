# Usando Claude Frontforge com Outros LLMs

O Claude Frontforge pode ser usado com **qualquer LLM** que suporte instruções personalizadas! Os scripts de validação e análise são universais e funcionam com Gemini, Codex, Ollama, Cursor, Aider e outros.

---

## 🚀 Instalação Rápida (Qualquer LLM)

```bash
# 1. Baixar os scripts no seu projeto
npx degit thiagoedson/claude-frontforge/hooks ./frontforge

# Ou via git (se preferir)
git clone --depth 1 https://github.com/thiagoedson/claude-frontforge.git temp
cp -r temp/hooks ./frontforge
rm -rf temp

# 2. Instalar dependências (se necessário)
cd frontforge && npm install
```

Agora você tem todos os scripts disponíveis!

---

## 📚 Configuração por LLM

### 🟦 **GitHub Copilot / Codex**

Crie ou edite `.github/copilot-instructions.md`:

```markdown
# Design System Guidelines

You are an expert in frontend design systems following Claude Frontforge principles.

## Core Principles

### Spacing Grid
- Use a 4px base grid for all spacing
- Only use multiples: 4px, 8px, 12px, 16px, 24px, 32px, 48px
- Never use arbitrary values like 5px, 10px, 15px

### Depth Strategy
Choose ONE approach and stick to it:
- **Borders-only**: Use 0.5px borders, no shadows
- **Subtle shadows**: Use light shadows (0 1px 3px rgba(0,0,0,0.08))
- **Layered shadows**: Multiple shadow layers for premium feel

### Animation
- Duration: ~150ms for micro-interactions
- Easing: ease-out or ease-in-out
- NO bouncy/spring effects (no cubic-bezier with values > 1)

### Accessibility (WCAG 2.1)
- Color contrast: minimum 4.5:1 for normal text
- Touch targets: minimum 44x44px
- All inputs must have labels or aria-label
- Proper heading hierarchy (h1 → h2 → h3)

## Available Tools

Run these commands to validate:

```bash
# Detect project context and suggest design direction
node frontforge/detect-context.js

# Generate design tokens from existing code
node frontforge/generate-tokens.js . css

# Extract component patterns
node frontforge/extract-components.js

# Validate accessibility
node frontforge/validate-a11y.js src/components/Button.tsx

# Get design system health score
node frontforge/metrics-dashboard.js
```

## Workflow

1. Before writing code, decide on:
   - Spacing base (4px recommended)
   - Depth strategy (borders/subtle/layered)
   - Color palette (5-8 colors max)

2. When writing components:
   - Follow the spacing grid strictly
   - Use only approved colors
   - Ensure WCAG 2.1 compliance
   - Add proper ARIA labels

3. After writing code:
   - Run validation scripts
   - Fix any violations before committing
```

### 🟨 **Cursor AI**

Crie ou edite `.cursorrules`:

```
# Claude Frontforge - Design System Rules

## Identity
You are a frontend design expert following strict design system principles.

## Spacing Grid (CRITICAL)
- Base: 4px
- Allowed: 4, 8, 12, 16, 24, 32, 48px
- FORBIDDEN: 5, 10, 15, 20, 25, 30px or any non-multiple of 4

## Depth Strategy
User must choose ONE:
1. Borders-only → Use borders, NO shadows
2. Subtle shadows → Light shadows only
3. Layered shadows → Multiple shadow layers

## Animation Rules
- Duration: 100-200ms (sweet spot: 150ms)
- Easing: ease-out, ease-in-out
- NEVER: bounce, spring, elastic effects

## Accessibility Requirements
- Contrast: 4.5:1 minimum (7:1 for AAA)
- Touch targets: 44x44px minimum
- Labels: Every input needs label or aria-label
- Headings: Proper hierarchy (h1→h2→h3, no skipping)

## Available Commands
```bash
# Context detection
node frontforge/detect-context.js

# Token generation
node frontforge/generate-tokens.js . css > src/tokens.css

# Component extraction
node frontforge/extract-components.js

# A11y validation
node frontforge/validate-a11y.js <file>

# Health metrics
node frontforge/metrics-dashboard.js
```

## Before Writing Code
Ask user:
1. "What's the spacing base?" (suggest 4px)
2. "Which depth strategy?" (borders/subtle/layered)
3. "Do you have a color palette?" (if not, extract from code)

## After Writing Code
Always validate:
1. Spacing on grid? ✓
2. Depth consistent? ✓
3. Animations smooth? ✓
4. A11y compliant? ✓
```

### 🟪 **Gemini CLI**

Crie `gemini-instructions.txt`:

```
You are a design system expert using Claude Frontforge methodology.

SPACING RULES:
- Base unit: 4px
- Only multiples: 4, 8, 12, 16, 24, 32, 48
- Never: 5, 10, 15, or arbitrary values

DEPTH STRATEGY (choose one):
- Borders: 0.5px borders, no shadows
- Subtle: Light shadows (0 1px 3px rgba(0,0,0,0.08))
- Layered: Multiple shadow layers

ANIMATION:
- Duration: 150ms typical
- Easing: ease-out or ease-in-out
- Forbidden: bounce, spring, elastic

ACCESSIBILITY (WCAG 2.1):
- Contrast: 4.5:1 minimum
- Touch targets: 44x44px minimum
- Labels required on all inputs
- Heading hierarchy must be logical

TOOLS AVAILABLE:
node frontforge/detect-context.js - Auto-detect project type
node frontforge/generate-tokens.js . css - Generate tokens
node frontforge/extract-components.js - Find patterns
node frontforge/validate-a11y.js <file> - Check accessibility
node frontforge/metrics-dashboard.js - Health score

WORKFLOW:
1. Run detect-context.js to understand project
2. Establish design direction with user
3. Write code following rules
4. Validate with scripts before committing
```

Use com:
```bash
gemini --instructions gemini-instructions.txt
```

### 🦙 **Ollama (Local LLMs)**

Crie `Modelfile`:

```dockerfile
FROM llama3.1

# Set temperature for consistent outputs
PARAMETER temperature 0.7

# System prompt with design system rules
SYSTEM """
You are a frontend design expert following Claude Frontforge design system principles.

CORE RULES:

Spacing Grid:
- Base: 4px
- Scale: 4, 8, 12, 16, 24, 32, 48px only
- Never use: 5, 10, 15, 20, 25, 30px

Depth Strategy (choose ONE):
- Borders-only: Use borders, no shadows
- Subtle shadows: Light shadows (0 1px 3px rgba(0,0,0,0.08))
- Layered: Multiple shadow layers

Animation:
- Duration: 100-200ms (ideal: 150ms)
- Easing: ease-out, ease-in-out only
- No bounce/spring effects

Accessibility (WCAG 2.1):
- Color contrast: minimum 4.5:1 (7:1 for AAA)
- Touch targets: minimum 44x44px
- All inputs need labels or aria-label
- Proper heading hierarchy (h1 → h2 → h3)

Available validation tools:
- node frontforge/detect-context.js
- node frontforge/generate-tokens.js . css
- node frontforge/extract-components.js
- node frontforge/validate-a11y.js <file>
- node frontforge/metrics-dashboard.js

Always validate code against these rules before presenting to user.
"""

# Template
TEMPLATE """{{ if .System }}<|system|>
{{ .System }}<|end|>
{{ end }}{{ if .Prompt }}<|user|>
{{ .Prompt }}<|end|>
{{ end }}<|assistant|>
{{ .Response }}<|end|>
"""
```

Criar e usar:
```bash
ollama create frontforge -f Modelfile
ollama run frontforge
```

### 🔧 **Aider**

Crie `.aider.conf.yml`:

```yaml
model: gpt-4o
edit-format: whole
show-diffs: true

# Custom instructions
system-message: |
  You are a design system expert following Claude Frontforge principles.

  Spacing: Use 4px grid (4, 8, 12, 16, 24, 32, 48px only)
  Depth: Choose borders-only, subtle shadows, or layered shadows
  Animation: 150ms duration, ease-out easing, no bounce effects
  A11y: WCAG 2.1 AA compliance (4.5:1 contrast, 44px touch targets)

  Validation tools available:
  - node frontforge/detect-context.js
  - node frontforge/generate-tokens.js . css
  - node frontforge/validate-a11y.js <file>
  - node frontforge/metrics-dashboard.js

  Always validate design decisions against these rules.
```

### 🎨 **Continue (VS Code)**

Crie `.continue/config.json`:

```json
{
  "models": [{
    "title": "GPT-4 with Frontforge",
    "provider": "openai",
    "model": "gpt-4",
    "systemMessage": "You are a design system expert following Claude Frontforge methodology.\n\nRULES:\n- Spacing: 4px grid only (4, 8, 12, 16, 24, 32, 48)\n- Depth: One strategy (borders/subtle/layered)\n- Animation: 150ms, ease-out, no bounce\n- A11y: WCAG 2.1 (4.5:1 contrast, 44px targets)\n\nTools:\n- node frontforge/detect-context.js\n- node frontforge/generate-tokens.js\n- node frontforge/validate-a11y.js\n- node frontforge/metrics-dashboard.js"
  }],
  "customCommands": [{
    "name": "validate-design",
    "prompt": "Run frontforge validation on this code",
    "description": "Validate against design system rules"
  }]
}
```

---

## 🛠️ Scripts Universais

Todos os LLMs podem executar estes comandos:

```bash
# 1. Detecção de Contexto
node frontforge/detect-context.js
# Output: Sugere direção de design baseado no projeto

# 2. Gerar Tokens CSS
node frontforge/generate-tokens.js . css > src/tokens.css

# 3. Gerar Tokens JS/TS
node frontforge/generate-tokens.js . js > src/tokens.js

# 4. Extrair Componentes
node frontforge/extract-components.js
# Output: Padrões de Button, Card, Input, etc.

# 5. Validar Acessibilidade
node frontforge/validate-a11y.js src/components/Button.tsx

# 6. Dashboard de Métricas
node frontforge/metrics-dashboard.js
# Output: Score 0-100 de saúde do design system
```

---

## 🎯 Workflow Recomendado

### 1. Setup Inicial

```bash
# Baixar scripts
npx degit thiagoedson/claude-frontforge/hooks ./frontforge

# Detectar contexto do projeto
node frontforge/detect-context.js

# Gerar tokens do código existente
node frontforge/generate-tokens.js . css > src/design-tokens.css

# Extrair padrões de componentes
node frontforge/extract-components.js > .frontforge-patterns.md
```

### 2. Durante Desenvolvimento

Peça ao LLM para:
1. Seguir as regras de spacing grid
2. Manter consistência de depth strategy
3. Validar acessibilidade
4. Usar apenas cores da paleta

### 3. Antes de Commit

```bash
# Validar saúde do sistema
node frontforge/metrics-dashboard.js

# Se score < 80, revisar e corrigir
```

---

## 📦 Git Hooks (Opcional)

Adicione validação automática:

```bash
# .git/hooks/pre-commit
#!/bin/sh
node frontforge/metrics-dashboard.js

if [ $? -ne 0 ]; then
  echo "❌ Design system score baixo. Corrija antes de commitar."
  exit 1
fi
```

```bash
chmod +x .git/hooks/pre-commit
```

---

## 🔄 Atualização

Para atualizar os scripts:

```bash
# Opção 1: Re-download
npx degit thiagoedson/claude-frontforge/hooks ./frontforge --force

# Opção 2: Git pull
cd frontforge
git pull origin main
```

---

## 💡 Dicas por LLM

### GitHub Copilot
- Melhor para sugestões inline
- Use comments para invocar regras: `// spacing: use 4px grid`

### Cursor
- Melhor para refatoração em lote
- Use Cmd+K para aplicar regras em múltiplos arquivos

### Gemini CLI
- Melhor para análise e planejamento
- Use para gerar documentação de design system

### Ollama
- Melhor para uso offline
- Modelos menores (llama3.1:8b) já funcionam bem

### Aider
- Melhor para edição guiada
- Use `/ask` para validar antes de aplicar mudanças

---

## 🐛 Troubleshooting

### Scripts não funcionam?

```bash
# Verificar Node.js instalado
node --version  # Precisa ser >= 14

# Instalar dependências (se necessário)
cd frontforge
npm install
```

### LLM não segue regras?

1. Seja mais específico no prompt
2. Referencie os scripts: "Use node frontforge/detect-context.js primeiro"
3. Peça validação: "Valide com validate-a11y.js"

### Permissões negadas (Unix/Mac)?

```bash
chmod +x frontforge/*.js
```

---

## 🆘 Suporte

- GitHub Issues: https://github.com/thiagoedson/claude-frontforge/issues
- Documentação: https://github.com/thiagoedson/claude-frontforge

---

## 📄 Licença

MIT - Use livremente em qualquer projeto!
