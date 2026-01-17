#!/bin/bash
# Script de Monitoramento de Métricas do Claude Frontforge

echo "📊 Claude Frontforge - Métricas em Tempo Real"
echo "=============================================="
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
echo "🐛 Issues Abertas: $ISSUES"

echo ""
echo "📈 Traffic (últimos 14 dias):"

# Views
VIEWS=$(gh api repos/thiagoedson/claude-frontforge/traffic/views --jq '.count // 0')
UNIQUE_VIEWS=$(gh api repos/thiagoedson/claude-frontforge/traffic/views --jq '.uniques // 0')
echo "👀 Views: $VIEWS (únicos: $UNIQUE_VIEWS)"

# Clones
CLONES=$(gh api repos/thiagoedson/claude-frontforge/traffic/clones --jq '.count // 0')
UNIQUE_CLONES=$(gh api repos/thiagoedson/claude-frontforge/traffic/clones --jq '.uniques // 0')
echo "📦 Clones: $CLONES (únicos: $UNIQUE_CLONES)"

echo ""
echo "🔗 Top Referrers:"
gh api repos/thiagoedson/claude-frontforge/traffic/popular/referrers --jq '.[] | "  - \(.referrer): \(.count) views"' 2>/dev/null || echo "  (nenhum ainda)"

echo ""
echo "🚀 Releases:"
gh release list --limit 3 2>/dev/null || echo "  (nenhum release ainda)"

echo ""
echo "📅 Última atualização: $(date)"
echo "=============================================="
