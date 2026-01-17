---
name: claude-frontforge:metrics
description: Exibe dashboard com métricas de saúde do design system (consistência, conformidade, qualidade)
---

Gera relatório completo de saúde do design system do projeto.

## Como funciona

1. Lê `.frontforge/system.md` para entender as regras estabelecidas
2. Analisa todos os arquivos UI do projeto (TSX, JSX, Vue, Svelte, CSS, SCSS)
3. Calcula métricas de conformidade em 4 áreas:
   - **Spacing**: % de valores que seguem o grid
   - **Colors**: % de uso da paleta definida
   - **Depth**: Conformidade com estratégia (borders/shadows)
   - **Animation**: Qualidade das animações (sem bounce, duração adequada)
4. Gera score geral de 0-100
5. Fornece sugestões de melhorias

## Execução

```bash
node ${CLAUDE_PLUGIN_ROOT}/hooks/metrics-dashboard.js
```

## Exemplo de output

```
╔════════════════════════════════════════════════════════════════╗
║          DASHBOARD DE MÉTRICAS DO DESIGN SYSTEM                ║
╚════════════════════════════════════════════════════════════════╝

📊 SCORE GERAL: 87/100 ████████░░
   🎯 Muito bom! Pequenas melhorias necessárias

─────────────────────────────────────────────────────────────────

📏 CONSISTÊNCIA DE SPACING: 92% █████████░
   156/170 valores no grid
   ⚠️  Valores fora do grid: 6, 10, 14, 18px

🎨 USO DA PALETA DE CORES: 78% ███████░░░
   12 cores em uso (paleta define 8)
   ⚠️  4 cores fora da paleta

🎭 ESTRATÉGIA DE PROFUNDIDADE: 100% ██████████
   Estratégia: subtle-shadows
   Shadows: 12 | Borders: 8

⚡ ANIMAÇÕES: 85% ████████░░
   23 transições encontradas
   Duração média: 180ms
   ⚠️  2 animações lentas (>300ms)

─────────────────────────────────────────────────────────────────

💡 SUGESTÕES:

1. Padronizar spacing: 14 valores fora do grid detectados
2. Consolidar paleta de cores: 4 cores fora da paleta
3. Otimizar duração de animações (2 animações >300ms)
```

## Quando usar

- Após implementar features para verificar conformidade
- Antes de fazer code review
- Periodicamente para manter qualidade
- Após refatorações grandes

## Comunicação

Seja direto ao apresentar o dashboard:

```
"Analisei 127 arquivos. Score geral: 87/100

Principais pontos:
✅ Spacing consistente (92%)
⚠️  Paleta de cores precisa consolidação (78%)
✅ Estratégia de profundidade perfeita

Quer que eu corrija as 4 cores fora da paleta?"
```

Sempre ofereça ações concretas baseado nas métricas.
