# Claude Frontforge - Métricas e Analytics

Guia de como acompanhar o uso e popularidade da skill.

---

## 📊 Métricas Disponíveis

### 1. GitHub Metrics (Principais)

#### Visualizar no Browser:
```
https://github.com/thiagoedson/claude-frontforge
```

**Métricas visíveis:**
- ⭐ **Stars** - Pessoas que favoritaram
- 🔱 **Forks** - Cópias do repositório
- 👁️ **Watchers** - Pessoas seguindo atualizações
- 🐛 **Issues** - Problemas reportados
- 🔀 **Pull Requests** - Contribuições da comunidade

#### GitHub Insights (Traffic):

1. Acesse: https://github.com/thiagoedson/claude-frontforge/graphs/traffic
2. Ou: Repository → Insights → Traffic

**Dados disponíveis:**
- **Views** (últimos 14 dias) - Total de visualizações
- **Unique visitors** - Visitantes únicos
- **Clones** - Quantos fizeram `git clone`
- **Referring sites** - De onde vieram os visitantes

**Nota:** GitHub só mostra dados dos últimos 14 dias no Traffic.

### 2. Via GitHub CLI

```bash
# Visualizações do repo
gh api repos/thiagoedson/claude-frontforge/traffic/views

# Clones
gh api repos/thiagoedson/claude-frontforge/traffic/clones

# Estatísticas gerais
gh api repos/thiagoedson/claude-frontforge --jq '{
  stars: .stargazers_count,
  forks: .forks_count,
  watchers: .watchers_count,
  issues: .open_issues_count
}'

# Referrers (de onde vêm os visitantes)
gh api repos/thiagoedson/claude-frontforge/traffic/popular/referrers
```

### 3. GitHub Releases

Ver downloads de releases:

```bash
# Downloads do release atual
gh release view v2026.1.17.1410 --json assets

# Ou via web:
https://github.com/thiagoedson/claude-frontforge/releases
```

---

## 🔗 Marketplaces para Listar Sua Skill

### Oficiais/Principais:

#### 1. **Anthropic Skills Repository**
- URL: https://github.com/anthropics/skills
- Como: Fazer Pull Request adicionando sua skill
- Benefício: Exposição oficial da Anthropic

#### 2. **SkillsMP**
- URL: https://skillsmp.com/
- Como: Submeter via formulário do site
- Benefício: Compatível com múltiplos LLMs

#### 3. **Claude Skills Library**
- URL: https://mcpservers.org/claude-skills
- Como: Submeter via GitHub
- Benefício: Marketplace focado em Claude

#### 4. **Awesome Claude Skills**
- URL: https://github.com/travisvn/awesome-claude-skills
- Como: Pull Request no README
- Benefício: Lista curada popular

### Comunitários:

#### 5. **Claude Marketplaces**
- URL: https://claudemarketplaces.com/

#### 6. **Netresearch Marketplace**
- URL: https://github.com/netresearch/claude-code-marketplace

---

## 📈 Como Aumentar Visibilidade

### 1. Adicionar Badges ao README

```markdown
[![Stars](https://img.shields.io/github/stars/thiagoedson/claude-frontforge?style=social)](https://github.com/thiagoedson/claude-frontforge/stargazers)
[![Downloads](https://img.shields.io/github/downloads/thiagoedson/claude-frontforge/total)](https://github.com/thiagoedson/claude-frontforge/releases)
[![Issues](https://img.shields.io/github/issues/thiagoedson/claude-frontforge)](https://github.com/thiagoedson/claude-frontforge/issues)
```

### 2. Submeter para Listas

- [ ] Anthropic Skills Repository
- [ ] SkillsMP
- [ ] Claude Skills Library
- [ ] Awesome Claude Skills
- [ ] Reddit r/ClaudeAI
- [ ] Twitter/X com #ClaudeCode
- [ ] Dev.to artigo

### 3. SEO e Descoberta

**Topics no GitHub:**
Adicionar em Settings → Topics:
- `claude-code`
- `claude-skills`
- `design-system`
- `frontend`
- `accessibility`
- `ui-ux`

### 4. Criar Conteúdo

- [ ] Artigo no Dev.to
- [ ] Vídeo demo no YouTube
- [ ] Post no LinkedIn
- [ ] Tutorial no Medium

---

## 🔍 Monitoramento Contínuo

### Script de Monitoramento

```bash
#!/bin/bash
# monitor-metrics.sh

echo "📊 Claude Frontforge - Métricas"
echo "================================"
echo ""

# Stars
STARS=$(gh api repos/thiagoedson/claude-frontforge --jq '.stargazers_count')
echo "⭐ Stars: $STARS"

# Forks
FORKS=$(gh api repos/thiagoedson/claude-frontforge --jq '.forks_count')
echo "🔱 Forks: $FORKS"

# Watchers
WATCHERS=$(gh api repos/thiagoedson/claude-frontforge --jq '.watchers_count')
echo "👁️  Watchers: $WATCHERS"

# Issues abertas
ISSUES=$(gh api repos/thiagoedson/claude-frontforge --jq '.open_issues_count')
echo "🐛 Issues: $ISSUES"

# Views (últimos 14 dias)
VIEWS=$(gh api repos/thiagoedson/claude-frontforge/traffic/views --jq '.count')
echo "👀 Views (14d): $VIEWS"

# Clones (últimos 14 dias)
CLONES=$(gh api repos/thiagoedson/claude-frontforge/traffic/clones --jq '.count')
echo "📦 Clones (14d): $CLONES"

echo ""
echo "Última atualização: $(date)"
```

### Usar:

```bash
chmod +x monitor-metrics.sh
./monitor-metrics.sh
```

---

## 📊 Analytics de Terceiros (Opcionais)

### 1. GitHub Trending

Monitorar se aparece em:
- https://github.com/trending/javascript
- https://github.com/trending?since=weekly

### 2. Star History

Visualizar crescimento de stars:
- https://star-history.com/#thiagoedson/claude-frontforge

### 3. Repository Traffic (Extensão)

Instalar extensão do Chrome:
- [Octotree](https://www.octotree.io/)
- [Refined GitHub](https://github.com/refined-github/refined-github)

---

## 🎯 Metas de Crescimento

| Métrica | Atual | Meta 1 Mês | Meta 3 Meses | Meta 6 Meses |
|---------|-------|------------|--------------|--------------|
| ⭐ Stars | 0 | 50 | 200 | 500 |
| 🔱 Forks | 0 | 10 | 50 | 100 |
| 👁️ Watchers | 0 | 20 | 80 | 150 |
| 📦 Clones/mês | - | 100 | 500 | 1000 |
| 🐛 Issues | 1 | 5 | 15 | 30 |

---

## 📌 Lembretes

- GitHub Traffic mostra apenas **últimos 14 dias**
- Para histórico maior, use GitHub Actions para coletar diariamente
- Stars são a métrica mais importante para popularidade
- Clones indicam uso real da skill

---

## 🔗 Links Úteis

- **Seu Repo**: https://github.com/thiagoedson/claude-frontforge
- **Traffic**: https://github.com/thiagoedson/claude-frontforge/graphs/traffic
- **Releases**: https://github.com/thiagoedson/claude-frontforge/releases
- **Insights**: https://github.com/thiagoedson/claude-frontforge/pulse

---

Atualizado: 2026-01-17
