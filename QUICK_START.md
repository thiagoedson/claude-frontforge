# Guia Rápido - Claude Frontforge

Referência rápida para usar a skill no dia a dia.

## 🚀 Comandos Principais

### Inicialização

```bash
# Iniciar novo design system (detecta contexto automaticamente)
/claude-frontforge:init

# Ver estado atual do sistema
/claude-frontforge:status
```

### Extração de Padrões

```bash
# Extrair padrões de código existente
/claude-frontforge:extract

# Extrair apenas de uma pasta específica
/claude-frontforge:extract src/components

# Gerar tokens de design automaticamente
/claude-frontforge:generate-tokens
```

### Validação e Métricas

```bash
# Auditar arquivo ou pasta
/claude-frontforge:audit src/components/Button.tsx

# Ver dashboard de métricas do projeto
/claude-frontforge:metrics
```

---

## 🛠️ Scripts NPM

```bash
# Verificar instalação
npm run verify

# Detectar contexto do projeto
npm run detect-context

# Gerar tokens CSS
npm run generate-tokens . css > src/styles/tokens.css

# Gerar tokens JavaScript
npm run generate-tokens . js > src/design-tokens.js

# Extrair componentes
npm run extract-components

# Validar acessibilidade
npm run validate-a11y src/components/Button.tsx

# Dashboard de métricas
npm run metrics
```

---

## 📁 Estrutura de Arquivos

### Criados pela Skill

```
seu-projeto/
└── .frontforge/
    └── system.md       # Sistema de design (criado ao salvar)
```

### Exemplo de system.md

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

### Colors
- Primary: #1e40af
- Background: #f8fafc
- Text: #0f172a

## Components
### Button
- Height: 40px
- Padding: 12px 20px
- Border radius: 8px
- States: hover, active, disabled
```

---

## 🎯 Fluxo de Trabalho Típico

### 1. Projeto Novo

```bash
# 1. Inicializar
/claude-frontforge:init

# 2. Confirmar direção sugerida ou customizar
# (skill detecta automaticamente: Next.js + analytics → Data & Analysis)

# 3. Construir primeiro componente
# (skill valida automaticamente via hook)

# 4. Salvar padrões
# "Quer salvar em .frontforge/system.md?" → Sim
```

### 2. Projeto Existente

```bash
# 1. Extrair padrões do código
/claude-frontforge:extract

# 2. Revisar padrões detectados
# - 15 componentes Button encontrados
# - Base de spacing: 4px (85% conformidade)
# - Paleta: 12 cores

# 3. Criar system.md baseado na extração
# (ou customizar)

# 4. Refatorar código para conformidade
npm run metrics  # Ver score atual
```

### 3. Desenvolvimento Contínuo

```bash
# Durante desenvolvimento
# → Hook valida automaticamente após cada Write/Edit

# Periodicamente
npm run metrics  # Verificar saúde do sistema

# Antes de commit
/claude-frontforge:audit src/  # Auditar tudo
```

---

## 🔍 Validações Automáticas

### O que é validado?

| Categoria | O que verifica |
|-----------|----------------|
| **Spacing** | Valores múltiplos da base (4px, 8px, etc.) |
| **Colors** | Uso apenas de cores da paleta definida |
| **Depth** | Consistência (borders-only vs shadows) |
| **Animation** | Sem bounce/spring, duração <300ms |
| **A11y** | Contraste, touch targets, labels, ARIA |

### Quando valida?

- **Automaticamente**: Após cada `Write` ou `Edit` (via hook)
- **Manual**: Com `/audit` ou `npm run validate-a11y`
- **Periódico**: Com `/metrics` ou `npm run metrics`

---

## 🎨 Direções de Design

Escolha uma ao inicializar:

| Direção | Quando usar |
|---------|-------------|
| **Precision & Density** | Dashboards, admin panels, data grids |
| **Warmth & Approachability** | Apps colaborativos, redes sociais |
| **Sophistication & Trust** | Fintech, banking, enterprise B2B |
| **Boldness & Clarity** | Marketing, produtos modernos |
| **Utility & Function** | Developer tools, GitHub-style |
| **Data & Analysis** | Analytics, BI, reporting |

---

## 📊 Dashboard de Métricas

### Interpretando o Score

```
Score Geral: 87/100
├─ 90-100: 🏆 Excelente
├─ 80-89:  🎯 Muito bom
├─ 70-79:  👍 Bom
├─ 60-69:  ⚠️  Regular
└─ 0-59:   ❌ Precisa atenção
```

### Ações Recomendadas

| Score | Ação |
|-------|------|
| **< 70** | Refatoração urgente necessária |
| **70-85** | Melhorias pontuais |
| **85-95** | Manutenção preventiva |
| **> 95** | Manter monitoramento |

---

## 🐛 Troubleshooting

### Hook não está validando

```bash
# Verificar se hooks.json existe
cat hooks/hooks.json

# Verificar permissões (Unix/macOS)
chmod +x hooks/*.js

# Testar validador manualmente
node hooks/validate-frontforge.js < test-input.json
```

### Comandos não aparecem

```bash
# Verificar instalação
npm run verify

# Reinstalar plugin
/plugin uninstall claude-frontforge
/plugin marketplace add thiagoedson/claude-frontforge
```

### Detecção de contexto incorreta

```bash
# Ver análise detalhada
npm run detect-context

# Customizar manualmente via AskUserQuestion
/claude-frontforge:init
# → Escolher direção manualmente
```

---

## 💡 Dicas Pro

### 1. Tokens Reutilizáveis

Gere tokens uma vez e importe em todo o projeto:

```bash
npm run generate-tokens . css > src/styles/tokens.css
```

```css
/* Em qualquer componente */
@import '../styles/tokens.css';

.button {
  padding: var(--spacing-md);
  color: var(--color-1);
}
```

### 2. Componentes Consistentes

Após extrair padrões, crie componentes base:

```typescript
// src/components/Button/index.tsx
// Baseado em .frontforge/system.md

export const Button = styled.button`
  height: 40px;
  padding: 12px 20px;
  border-radius: 8px;
  /* Padrões do sistema */
`;
```

### 3. CI/CD Integration

Adicione ao seu pipeline:

```yaml
# .github/workflows/design-system.yml
- name: Validate Design System
  run: npm run metrics
```

### 4. Pre-commit Hook

```bash
# .git/hooks/pre-commit
#!/bin/sh
npm run metrics
if [ $? -ne 0 ]; then
  echo "❌ Design system score baixo. Corrija antes de commitar."
  exit 1
fi
```

---

## 🔗 Links Úteis

- [README completo](README.md)
- [Guia de instalação](INSTALLATION.md)
- [Changelog](CHANGELOG.md)
- [Reportar problemas](https://github.com/thiagoedson/claude-frontforge/issues)

---

## 📞 Suporte

Problemas? Abra uma issue:
https://github.com/thiagoedson/claude-frontforge/issues/new
