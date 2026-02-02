# Claude Frontforge

[![License](https://img.shields.io/github/license/thiagoedson/claude-frontforge)](LICENSE)
[![Stars](https://img.shields.io/github/stars/thiagoedson/claude-frontforge?style=social)](https://github.com/thiagoedson/claude-frontforge/stargazers)
[![Last Commit](https://img.shields.io/github/last-commit/thiagoedson/claude-frontforge)](https://github.com/thiagoedson/claude-frontforge/commits/main)
[![Repo Size](https://img.shields.io/github/repo-size/thiagoedson/claude-frontforge)](https://github.com/thiagoedson/claude-frontforge)
[![Issues](https://img.shields.io/github/issues/thiagoedson/claude-frontforge)](https://github.com/thiagoedson/claude-frontforge/issues)

Craft · Memory · Enforcement

Build interfaces with intention. Remember decisions across sessions. Enforce consistency.

Construa interfaces com intencao. Lembre decisoes entre sessoes. Garanta consistencia.

---

## Overview / Visao geral

Claude Frontforge is a UX plugin for Claude Code. It guides interface design, saves your choices, and validates output so your UI stays coherent across sessions.

Claude Frontforge e um plugin de UX para o Claude Code. Ele guia o design de interface, salva suas decisoes e valida o resultado para manter consistencia entre sessoes.

---

## What It Does / O que faz

- Craft: infer direction from context (dashboard, settings, tools)
- Memory: store design decisions in `.frontforge/system.md`
- Enforcement: validate spacing, depth, and motion before finishing

- Craft: infere direcao a partir do contexto (dashboard, settings, tools)
- Memory: salva decisoes em `.frontforge/system.md`
- Enforcement: valida espacamento, profundidade e animacao antes de concluir

---

## Quickstart / Inicio rapido

1) Install the plugin
2) Run `/claude-frontforge:init`
3) Save the generated system to `.frontforge/system.md` when prompted

1) Instale o plugin
2) Rode `/claude-frontforge:init`
3) Salve o sistema gerado em `.frontforge/system.md` quando solicitado

---

## 🌍 Use with Other LLMs / Use com Outros LLMs

**Claude Frontforge works with ANY LLM!** / **Funciona com QUALQUER LLM!**

Beyond Claude Code, you can use Frontforge with:

- 🟦 **GitHub Copilot** / **Codex**
- 🟨 **Cursor AI**
- 🟪 **Gemini CLI**
- 🦙 **Ollama** (local LLMs)
- 🔧 **Aider**
- 🎨 **Continue** (VS Code)
- And more! / E mais!

### Quick Install for Other LLMs

```bash
# Interactive installer (detects your environment)
npx degit thiagoedson/claude-frontforge/install.js
node install.js

# Or install directly for specific LLM:
node install.js --llm copilot   # GitHub Copilot
node install.js --llm cursor    # Cursor AI
node install.js --llm aider     # Aider
node install.js --llm gemini    # Gemini CLI
```

This will:

1. ✅ Download all validation scripts to `./frontforge`
2. ✅ Configure your LLM with design system rules
3. ✅ Set up automatic validation

📖 **Full guide**: [USE_WITH_OTHER_LLMS.md](USE_WITH_OTHER_LLMS.md)

---

## Installation / Instalacao

### Plugin (Recommended) / Plugin (Recomendado)

```bash
# Add the marketplace
/plugin marketplace add thiagoedson/claude-frontforge

# Install the plugin
/plugin menu
```

Select `claude-frontforge` from the menu. Restart Claude Code after.

Selecione `claude-frontforge` no menu. Reinicie o Claude Code depois.

### Manual (Advanced) / Manual (Avancado)

```bash
git clone https://github.com/thiagoedson/claude-frontforge.git
cd claude-frontforge
cp -r .claude/* ~/.claude/
cp -r .claude-plugin/* ~/.claude-plugin/
```

Restart Claude Code.

Reinicie o Claude Code.

---

## Commands / Comandos

```bash
/claude-frontforge:init              # Smart dispatcher / Despacho inteligente
/claude-frontforge:status            # Show current system / Ver sistema atual
/claude-frontforge:audit <path>      # Check code / Verificar codigo
/claude-frontforge:extract           # Extract patterns / Extrair padroes
/claude-frontforge:generate-tokens   # Generate design tokens / Gerar tokens de design
/claude-frontforge:analyze-website   # Extract tokens from live websites / Extrair tokens de sites
/claude-frontforge:metrics           # Health dashboard / Dashboard de saúde
/claude-frontforge:setup-statusline  # Configure persistent status line / Configurar barra de status
```

---

## New Features / Novos Recursos 🚀

### 0. Specialized Agents / Agentes Especializados 🤖 **NEW!**

Agentes especializados para tarefas focadas de UX:

| Agent | Purpose / Propósito |
|-------|---------------------|
| **UX Interpreter** | Extract design systems from live websites / Extrair design systems de sites |
| **Component Architect** | Design scalable, accessible components / Projetar componentes escaláveis |
| **Animation Specialist** | Create purposeful micro-interactions / Criar micro-interações |
| **Responsive Expert** | Mobile-first responsive layouts / Layouts responsivos mobile-first |
| **UX Researcher** | Create personas, analyze flows / Criar personas, analisar fluxos |

```bash
# Analyze a website
/claude-frontforge:analyze-website stripe.com

# Compare multiple sites
/claude-frontforge:analyze-website stripe.com linear.app --compare
```

See `agents/` directory for detailed guidelines.

---

### 0.1. Multi-Format Token Export / Export de Tokens Multi-Formato 📦 **NEW!**

Generate design tokens in multiple formats:

```bash
# CSS Custom Properties
node hooks/generate-tokens.js . css

# Tailwind Config
node hooks/generate-tokens.js . tailwind

# Figma Tokens (tokens.studio compatible)
node hooks/generate-tokens.js . figma

# JSON (raw data with confidence scores)
node hooks/generate-tokens.js . json
```

Outputs now include **confidence scores** for extracted patterns!

---

### 1. Persistent Status Line / Barra de Status Persistente 📊

Configure uma barra de status sempre visível (como no Claude Code via API) que mostra em tempo real:

- **💎 Modelo atual**: Sonnet, Opus ou Haiku
- **🟢🟡🔴 Contexto usado**: % da janela de contexto (com cores dinâmicas)
- **💚💛❤️ Custo da sessão**: Em R$ com taxa de queima por hora
- **⏱️ Tempo de sessão**: Duração formatada (1h23m)
- **🌿 Branch git**: Branch atual do projeto
- **✅⚠️ Design System**: Direção ativa do Frontforge

**Exemplo de output:**
```
💎 Sonnet | 🟢 38% ctx | 💚 R$ 1.20 (~R$0.85/h) | ⏱️  45m | feat/ui | ✅ Precision
```

**Como ativar:**
```bash
/claude-frontforge:setup-statusline
```

O comando configura automaticamente `.frontforge/statusline.sh` e `.claude/settings.json`.

**Benefícios:**
- ✅ Controle financeiro em tempo real
- ✅ Alerta visual quando contexto chega em 80%
- ✅ Monitoramento de produtividade (tempo de sessão)
- ✅ Contexto visual (branch + design system)
- ✅ Totalmente customizável

---

### 2. Intelligent Context Detection / Detecção Inteligente de Contexto 🧠

O comando `/init` agora detecta automaticamente o tipo de projeto analisando:

- **package.json**: Framework (Next.js, React, Vue) e dependências
- **README.md**: Palavras-chave do domínio (fintech, analytics, dashboard)
- **Estrutura de pastas**: Padrões de organização

Sugere automaticamente a direção de design mais adequada com nível de confiança.

```bash
"Detectei projeto Next.js com foco em analytics (alta confiança).
Sugiro Data & Analysis: grid 4px, paleta otimizada para charts."
```

### 3. Automatic Token Generation / Geração Automática de Tokens 🎨

Novo comando `/generate-tokens` analisa código existente e extrai:

- **Spacing**: Valores de padding, margin, gap + detecção de base (4px, 8px)
- **Colors**: Paleta hex, rgb, hsl com análise de frequência
- **Shadows**: box-shadow patterns
- **Border Radius**: Valores recorrentes
- **Font Sizes**: Hierarquia tipográfica

Gera arquivos CSS, JavaScript ou JSON prontos para uso.

```bash
node hooks/generate-tokens.js . css > src/styles/tokens.css
```

### 4. Component Pattern Learning / Aprendizado de Padrões de Componentes 📚

O comando `/extract` agora detecta componentes (Button, Card, Input) e extrai:

- **Propriedades comuns**: Padding, altura, border-radius
- **Estados**: hover, active, focus, disabled
- **Variantes**: primary, secondary, ghost, etc.

Salva padrões em `.frontforge/system.md` para reutilização.

```markdown
### Button
- Altura comum: 40px
- Padding: 12px 20px
- Border radius: 8px
- Estados: hover, active, disabled
- Variantes: primary, secondary, ghost
```

### 5. Accessibility Validation / Validação de Acessibilidade ♿

Validações automáticas integradas ao hook pós-escrita:

- **Contraste de cores**: WCAG 2.1 AA/AAA (4.5:1 para texto normal)
- **Touch targets**: Tamanho mínimo 44x44px para elementos interativos
- **Hierarquia de headings**: h1 → h2 → h3 (sem pulos)
- **Alt text**: Imagens devem ter descrição
- **Labels**: Inputs devem ter label ou aria-label
- **ARIA**: Elementos com role devem ter suporte a teclado

Bloqueia código com erros críticos de acessibilidade.

```
🔴 ERROS (2):
1. Contraste insuficiente: 2.8:1 (mínimo 4.5:1)
   WCAG 2.1 AA
   💡 Aumentar contraste entre #888 e #fff

2. Input sem label ou aria-label
   WCAG 2.1 A (1.3.1, 4.1.2)
   💡 Adicionar <label> associado ou aria-label
```

### 6. Metrics Dashboard / Dashboard de Métricas 📊

Novo comando `/metrics` analisa todo o projeto e gera score de saúde (0-100):

```
📊 SCORE GERAL: 87/100 ████████░░
   🎯 Muito bom! Pequenas melhorias necessárias

📏 CONSISTÊNCIA DE SPACING: 92% █████████░
🎨 USO DA PALETA: 78% ███████░░░
🎭 ESTRATÉGIA DE PROFUNDIDADE: 100% ██████████
⚡ ANIMAÇÕES: 85% ████████░░

💡 SUGESTÕES:
1. Padronizar spacing: 14 valores fora do grid
2. Consolidar paleta: 4 cores fora da paleta
```

Perfeito para:

- Code review
- Monitoramento contínuo de qualidade
- Identificar áreas que precisam refatoração

---

## System File / Arquivo de sistema

After establishing direction, your decisions live in `.frontforge/system.md`.

Depois de estabelecer a direcao, suas decisoes ficam em `.frontforge/system.md`.

```markdown
# Design System

## Direction
Personality: Precision & Density
Foundation: Cool (slate)
Depth: Borders-only

## Tokens
### Spacing
Base: 4px
Scale: 4, 8, 12, 16, 24, 32

## Patterns
### Button Primary
- Height: 36px
- Padding: 12px 16px
- Radius: 6px
```

---

## Quality Gates / Qualidade

Frontforge enforces consistency with a post-write validation hook:

- Spacing grid adherence (no off-grid px values)
- Depth strategy consistency (borders vs shadows)
- Animation sanity (no bouncy/spring effects)

Frontforge aplica consistencia com um hook de validacao pos-escrita:

- Grade de espacamento (sem px fora da grade)
- Estrategia de profundidade (bordas vs sombras)
- Animacao controlada (sem bounce/spring)

If violations are found, the hook blocks completion and prints the exact rule that failed.

Se houver violacao, o hook bloqueia a conclusao e mostra a regra exata.

---

## Examples / Exemplos

See `reference/examples/`:

- `reference/examples/system-precision.md`
- `reference/examples/system-warmth.md`

Veja `reference/examples/`:

- `reference/examples/system-precision.md`
- `reference/examples/system-warmth.md`

---

## License / Licenca

MIT — See `LICENSE`.

MIT — Veja `LICENSE`.

---

Website: [https://cassonestudio.com.br/](https://cassonestudio.com.br/)  
Plugin Page / Página do Plugin: [https://cassonestudio.com.br/app/claude-frontforge/](https://cassonestudio.com.br/app/claude-frontforge/)  
GitHub: [https://github.com/thiagoedson/claude-frontforge](https://github.com/thiagoedson/claude-frontforge)
