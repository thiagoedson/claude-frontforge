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
/claude-frontforge:init           # Smart dispatcher / Despacho inteligente
/claude-frontforge:status         # Show current system / Ver sistema atual
/claude-frontforge:audit <path>   # Check code / Verificar codigo
/claude-frontforge:extract        # Extract patterns / Extrair padroes
```

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

Website: https://cassonestudio.com.br/  
GitHub: https://github.com/thiagoedson/claude-frontforge
