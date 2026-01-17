#!/bin/bash
# Verificar se Claude Frontforge foi indexado no SkillsMP

echo "🔍 Verificando indexação no SkillsMP..."
echo "========================================"
echo ""

# Verificar stars primeiro
STARS=$(gh api repos/thiagoedson/claude-frontforge --jq '.stargazers_count')
echo "⭐ Stars atuais: $STARS"

if [ "$STARS" -lt 2 ]; then
    echo "❌ Ainda não elegível (precisa de 2+ stars)"
    echo ""
    echo "💡 Como conseguir stars:"
    echo "   1. Compartilhe: https://github.com/thiagoedson/claude-frontforge"
    echo "   2. Poste no Reddit r/ClaudeAI (veja PROMOTION.md)"
    echo "   3. Tweet com #ClaudeCode"
    exit 0
fi

echo "✅ Elegível para indexação!"
echo ""

# Testar API do SkillsMP
echo "🔎 Buscando no SkillsMP..."

# Busca por nome
RESULT_NAME=$(curl -s "https://skillsmp.com/api/v1/skills/search?q=frontforge" | jq -r '.skills // [] | length')

# Busca por keywords
RESULT_DESIGN=$(curl -s "https://skillsmp.com/api/v1/skills/search?q=design+system+claude" | jq -r '.skills // [] | length')

echo ""

if [ "$RESULT_NAME" -gt 0 ]; then
    echo "🎉 ENCONTRADO no SkillsMP!"
    echo "   Busca: 'frontforge'"
    echo "   Link: https://skillsmp.com/?q=frontforge"
else
    echo "⏳ Ainda não indexado"
    echo ""
    echo "📅 O que fazer:"
    echo "   • SkillsMP indexa em 1-7 dias após ter 2+ stars"
    echo "   • Seu repo já está elegível (${STARS} stars)"
    echo "   • Aguarde a próxima varredura automática"
    echo ""
    echo "💡 Enquanto isso:"
    echo "   • Adicione tópicos no GitHub: claude-code, design-system, accessibility"
    echo "   • Continue divulgando para conseguir mais stars"
fi

echo ""
echo "🔗 Links:"
echo "   Seu repo: https://github.com/thiagoedson/claude-frontforge"
echo "   SkillsMP: https://skillsmp.com/"
echo "========================================"
