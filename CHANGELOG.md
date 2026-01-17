# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [2026.1.16.1543] - 2026-01-17

### ✨ Adicionado

#### 🧠 Detecção Inteligente de Contexto
- Script `hooks/detect-context.js` para análise automática de projetos
- Detecção de framework (Next.js, React, Vue, Svelte, Angular)
- Análise de package.json, README.md e estrutura de pastas
- Sugestão automática de direção de design com nível de confiança
- Mapeamento de 6 direções de design com sinais específicos
- Integração com comando `/init` para sugestões contextuais

#### 🎨 Geração Automática de Tokens de Design
- Script `hooks/generate-tokens.js` para extração de padrões de código
- Extração automática de:
  - Spacing (padding, margin, gap) com detecção de base (4px, 8px, 10px)
  - Colors (hex, rgb, hsl) com análise de frequência
  - Shadows (box-shadow patterns)
  - Border radius (valores recorrentes)
  - Font sizes (hierarquia tipográfica)
- Geração de tokens em múltiplos formatos: CSS, JavaScript, JSON
- Novo comando `/generate-tokens` para fácil execução
- Análise de ~50 arquivos em segundos

#### 📚 Aprendizado de Padrões de Componentes
- Script `hooks/extract-components.js` para detecção de componentes
- Reconhecimento de 17 componentes comuns (Button, Card, Input, etc.)
- Extração de:
  - Propriedades comuns (padding, height, border-radius)
  - Estados (hover, active, focus, disabled)
  - Variantes (primary, secondary, ghost, etc.)
- Geração de markdown para `.frontforge/system.md`
- Integração com comando `/extract` aprimorado
- Agrupamento por tipo e análise de frequência

#### ♿ Validação de Acessibilidade (A11y)
- Script `hooks/validate-a11y.js` com validações WCAG 2.1
- Validações implementadas:
  - Contraste de cores (4.5:1 AA, 7:1 AAA)
  - Touch targets mínimos (44x44px)
  - Hierarquia de headings (h1 → h2 → h3)
  - Alt text em imagens
  - Labels em inputs (label ou aria-label)
  - ARIA keyboard support
- Integração automática com `validate-frontforge.js`
- Bloqueio de erros críticos, avisos para warnings
- Relatórios detalhados com sugestões de correção

#### 📊 Dashboard de Métricas de Design System
- Script `hooks/metrics-dashboard.js` para análise de saúde
- Score geral 0-100 com breakdown detalhado:
  - Consistência de spacing (% no grid)
  - Uso da paleta de cores (% de conformidade)
  - Estratégia de profundidade (borders vs shadows)
  - Qualidade de animações (timing, easing)
- Novo comando `/metrics` para visualização
- Barras de progresso visuais (█████░░░░░)
- Sugestões automáticas de melhorias
- Análise de 100+ arquivos em segundos

### 🔧 Modificado

- **README.md**: Adicionada seção "New Features" com documentação completa
- **Comando /init**: Integrado com detecção de contexto
- **Comando /extract**: Aprimorado com extração de componentes
- **validate-frontforge.js**: Integrado com validação de acessibilidade

### 📦 Infraestrutura

- Adicionado `package.json` com scripts npm
- Adicionado `.gitignore` completo
- Criado `INSTALLATION.md` com guia detalhado
- Criado `verify-installation.js` para validação
- Criado `CHANGELOG.md` (este arquivo)

---

## [2026.1.16.1543] - 2026-01-16 (Versão Inicial)

### ✨ Adicionado

#### Core Features
- Sistema de três pilares: Craft, Memory, Enforcement
- 6 direções de design pré-definidas:
  - Precision & Density
  - Warmth & Approachability
  - Sophistication & Trust
  - Boldness & Clarity
  - Utility & Function
  - Data & Analysis

#### Comandos
- `/claude-frontforge:init` - Inicializar design system
- `/claude-frontforge:status` - Ver estado atual
- `/claude-frontforge:audit <path>` - Auditar código
- `/claude-frontforge:extract` - Extrair padrões

#### Validação Automática
- Hook pós-escrita com `validate-frontforge.js`
- Validações:
  - Spacing grid (múltiplos da base)
  - Depth strategy (borders-only, subtle, layered)
  - Animation (sem bounce/spring, <300ms)
  - Color palette (conformidade)

#### Documentação
- Skill principal em `.claude/skills/claude-frontforge/SKILL.md`
- Referências detalhadas:
  - `directions.md` - 6 personalidades de design
  - `principles.md` - Princípios de craft
  - `validation.md` - Sistema de memória
- Exemplos:
  - `system-precision.md`
  - `system-warmth.md`

#### Configuração
- `.claude-plugin/plugin.json` - Metadados do plugin
- `.claude-plugin/marketplace.json` - Registro no marketplace
- `hooks/hooks.json` - Configuração de hooks
- `.githooks/pre-commit` - Validação pré-commit

### 📝 Licença

- MIT License

---

## Tipos de Mudanças

- `✨ Adicionado` - Novas funcionalidades
- `🔧 Modificado` - Mudanças em funcionalidades existentes
- `🐛 Corrigido` - Correções de bugs
- `🗑️ Removido` - Funcionalidades removidas
- `🔒 Segurança` - Correções de vulnerabilidades
- `📦 Infraestrutura` - Mudanças em build, CI/CD, dependências
- `📝 Documentação` - Mudanças apenas em documentação
- `⚡ Performance` - Melhorias de performance

---

## Links

- [GitHub Repository](https://github.com/thiagoedson/claude-frontforge)
- [Issues](https://github.com/thiagoedson/claude-frontforge/issues)
- [Releases](https://github.com/thiagoedson/claude-frontforge/releases)
