#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Dashboard de Métricas do Design System
 * Analisa conformidade e consistência do código com o sistema de design
 */

/**
 * Busca arquivos UI recursivamente
 */
function findUIFiles(dir) {
  const files = [];
  const extensions = ['.tsx', '.jsx', '.vue', '.svelte', '.css', '.scss'];

  function traverse(currentPath) {
    if (!fs.existsSync(currentPath)) return;

    const items = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(currentPath, item.name);

      if (item.isDirectory()) {
        if (!['node_modules', '.git', 'build', 'dist', '.next', 'out'].includes(item.name)) {
          traverse(fullPath);
        }
      } else if (item.isFile()) {
        const ext = path.extname(item.name);
        if (extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }

  traverse(dir);
  return files;
}

/**
 * Parse arquivo .frontforge/system.md
 */
function parseSystemFile(systemPath) {
  if (!fs.existsSync(systemPath)) {
    return null;
  }

  const content = fs.readFileSync(systemPath, 'utf-8');
  const system = {
    spacingBase: null,
    spacingScale: [],
    colors: [],
    depth: null,
    borderRadius: []
  };

  // Spacing base
  const spacingBaseMatch = content.match(/(?:spacing\s+)?base:\s*(\d+)px/i);
  if (spacingBaseMatch) {
    system.spacingBase = parseInt(spacingBaseMatch[1]);
  }

  // Spacing scale
  const spacingScaleMatch = content.match(/(?:scale|spacing):\s*([0-9,\s]+)/i);
  if (spacingScaleMatch) {
    system.spacingScale = spacingScaleMatch[1]
      .split(',')
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n));
  }

  // Depth strategy
  if (content.match(/depth:\s*borders?-only/i)) {
    system.depth = 'borders-only';
  } else if (content.match(/depth:\s*subtle/i)) {
    system.depth = 'subtle-shadows';
  } else if (content.match(/depth:\s*layered/i)) {
    system.depth = 'layered-shadows';
  }

  // Colors
  const hexMatches = content.match(/#[0-9a-fA-F]{6}/g) || [];
  system.colors = [...new Set(hexMatches.map(c => c.toLowerCase()))];

  // Border radius
  const radiusMatches = content.match(/radius:\s*([0-9,\s]+)/i);
  if (radiusMatches) {
    system.borderRadius = radiusMatches[1]
      .split(',')
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n));
  }

  return system;
}

/**
 * Analisa conformidade de spacing
 */
function analyzeSpacingCompliance(files, system) {
  if (!system?.spacingBase) {
    return { score: null, message: 'Sistema não define base de spacing' };
  }

  let totalValues = 0;
  let compliantValues = 0;
  const offGridValues = new Set();

  files.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      const pxMatches = content.matchAll(/[:\s](\d+)px/g);

      for (const match of pxMatches) {
        const value = parseInt(match[1]);
        if (value > 2) { // Ignora valores muito pequenos
          totalValues++;
          if (value % system.spacingBase === 0) {
            compliantValues++;
          } else {
            offGridValues.add(value);
          }
        }
      }
    } catch (error) {
      // Ignora erros de leitura
    }
  });

  const score = totalValues > 0 ? Math.round((compliantValues / totalValues) * 100) : 0;

  return {
    score,
    totalValues,
    compliantValues,
    offGridValues: Array.from(offGridValues).sort((a, b) => a - b),
    message: score >= 85 ? 'Excelente' : score >= 70 ? 'Bom' : score >= 50 ? 'Regular' : 'Precisa melhorar'
  };
}

/**
 * Analisa uso de cores da paleta
 */
function analyzeColorCompliance(files, system) {
  if (!system?.colors || system.colors.length === 0) {
    return { score: null, message: 'Sistema não define paleta de cores' };
  }

  const usedColors = new Map(); // color -> count
  const unknownColors = new Set();

  files.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      const hexMatches = content.match(/#[0-9a-fA-F]{6}/gi) || [];

      hexMatches.forEach(color => {
        const normalized = color.toLowerCase();
        usedColors.set(normalized, (usedColors.get(normalized) || 0) + 1);

        if (!system.colors.includes(normalized)) {
          unknownColors.add(normalized);
        }
      });
    } catch (error) {
      // Ignora erros de leitura
    }
  });

  const totalColorUsages = Array.from(usedColors.values()).reduce((a, b) => a + b, 0);
  const compliantUsages = Array.from(usedColors.entries())
    .filter(([color]) => system.colors.includes(color))
    .reduce((sum, [, count]) => sum + count, 0);

  const score = totalColorUsages > 0 ? Math.round((compliantUsages / totalColorUsages) * 100) : 0;

  return {
    score,
    totalColors: usedColors.size,
    paletteSize: system.colors.length,
    unknownColors: Array.from(unknownColors),
    message: score >= 90 ? 'Excelente' : score >= 75 ? 'Bom' : score >= 50 ? 'Regular' : 'Precisa melhorar'
  };
}

/**
 * Analisa estratégia de profundidade
 */
function analyzeDepthCompliance(files, system) {
  if (!system?.depth) {
    return { score: null, message: 'Sistema não define estratégia de profundidade' };
  }

  let shadowCount = 0;
  let borderCount = 0;
  let violations = 0;

  files.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf-8');

      // Conta shadows
      const shadowMatches = content.match(/box-shadow:\s*([^;]+)/g) || [];
      shadowMatches.forEach(shadow => {
        if (!shadow.includes('none') && !shadow.includes('0 0 0')) {
          shadowCount++;

          // Se sistema é borders-only, isso é violação
          if (system.depth === 'borders-only') {
            violations++;
          }
        }
      });

      // Conta borders
      const borderMatches = content.match(/border:\s*([^;]+)/g) || [];
      borderMatches.forEach(border => {
        if (!border.includes('none') && !border.includes('0')) {
          borderCount++;
        }
      });
    } catch (error) {
      // Ignora erros de leitura
    }
  });

  let score = 100;

  if (system.depth === 'borders-only' && shadowCount > 0) {
    score = Math.max(0, 100 - (violations * 10));
  } else if (system.depth === 'subtle-shadows' || system.depth === 'layered-shadows') {
    // Esperado ter shadows
    if (shadowCount === 0) {
      score = 50;
    }
  }

  return {
    score,
    shadowCount,
    borderCount,
    violations,
    strategy: system.depth,
    message: score === 100 ? 'Perfeito' : score >= 80 ? 'Bom' : score >= 60 ? 'Regular' : 'Precisa melhorar'
  };
}

/**
 * Analisa timings de animação
 */
function analyzeAnimationCompliance(files) {
  let totalTransitions = 0;
  let bouncyAnimations = 0;
  let slowAnimations = 0; // > 300ms
  const timings = [];

  files.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf-8');

      // Detecta cubic-bezier bouncy
      if (/cubic-bezier\s*\([^)]*[2-9][\d.]*\s*\)/g.test(content)) {
        bouncyAnimations++;
      }

      // Detecta spring/bounce keywords
      if (/transition.*\b(bounce|spring|elastic)\b/gi.test(content)) {
        bouncyAnimations++;
      }

      // Extrai durações
      const durationMatches = content.matchAll(/(?:transition|animation)[^;]*?(\d+)ms/g);
      for (const match of durationMatches) {
        totalTransitions++;
        const duration = parseInt(match[1]);
        timings.push(duration);

        if (duration > 300) {
          slowAnimations++;
        }
      }
    } catch (error) {
      // Ignora erros de leitura
    }
  });

  const avgTiming = timings.length > 0
    ? Math.round(timings.reduce((a, b) => a + b, 0) / timings.length)
    : 0;

  const score = totalTransitions === 0 ? 100 :
    Math.max(0, 100 - (bouncyAnimations * 20) - (slowAnimations * 10));

  return {
    score,
    totalTransitions,
    bouncyAnimations,
    slowAnimations,
    avgTiming,
    message: bouncyAnimations === 0 && slowAnimations < 2 ? 'Excelente' :
             bouncyAnimations < 2 ? 'Bom' : 'Precisa melhorar'
  };
}

/**
 * Calcula score geral
 */
function calculateOverallScore(metrics) {
  const scores = [];

  if (metrics.spacing.score !== null) scores.push(metrics.spacing.score);
  if (metrics.colors.score !== null) scores.push(metrics.colors.score);
  if (metrics.depth.score !== null) scores.push(metrics.depth.score);
  if (metrics.animation.score !== null) scores.push(metrics.animation.score);

  if (scores.length === 0) return 0;

  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

/**
 * Gera relatório formatado
 */
function generateReport(metrics, overallScore) {
  let report = '\n';
  report += '╔════════════════════════════════════════════════════════════════╗\n';
  report += '║          DASHBOARD DE MÉTRICAS DO DESIGN SYSTEM                ║\n';
  report += '╚════════════════════════════════════════════════════════════════╝\n\n';

  // Score geral
  const scoreBar = getScoreBar(overallScore);
  report += `📊 SCORE GERAL: ${overallScore}/100 ${scoreBar}\n`;
  report += `   ${getScoreEmoji(overallScore)} ${getScoreLabel(overallScore)}\n\n`;

  report += '─────────────────────────────────────────────────────────────────\n\n';

  // Spacing
  if (metrics.spacing.score !== null) {
    report += `📏 CONSISTÊNCIA DE SPACING: ${metrics.spacing.score}% ${getScoreBar(metrics.spacing.score)}\n`;
    report += `   ${metrics.spacing.compliantValues}/${metrics.spacing.totalValues} valores no grid\n`;
    if (metrics.spacing.offGridValues.length > 0 && metrics.spacing.offGridValues.length <= 10) {
      report += `   ⚠️  Valores fora do grid: ${metrics.spacing.offGridValues.join(', ')}px\n`;
    } else if (metrics.spacing.offGridValues.length > 10) {
      report += `   ⚠️  ${metrics.spacing.offGridValues.length} valores diferentes fora do grid\n`;
    }
    report += '\n';
  }

  // Colors
  if (metrics.colors.score !== null) {
    report += `🎨 USO DA PALETA DE CORES: ${metrics.colors.score}% ${getScoreBar(metrics.colors.score)}\n`;
    report += `   ${metrics.colors.totalColors} cores em uso (paleta define ${metrics.colors.paletteSize})\n`;
    if (metrics.colors.unknownColors.length > 0 && metrics.colors.unknownColors.length <= 5) {
      report += `   ⚠️  Cores fora da paleta: ${metrics.colors.unknownColors.join(', ')}\n`;
    } else if (metrics.colors.unknownColors.length > 5) {
      report += `   ⚠️  ${metrics.colors.unknownColors.length} cores fora da paleta\n`;
    }
    report += '\n';
  }

  // Depth
  if (metrics.depth.score !== null) {
    report += `🎭 ESTRATÉGIA DE PROFUNDIDADE: ${metrics.depth.score}% ${getScoreBar(metrics.depth.score)}\n`;
    report += `   Estratégia: ${metrics.depth.strategy}\n`;
    report += `   Shadows: ${metrics.depth.shadowCount} | Borders: ${metrics.depth.borderCount}\n`;
    if (metrics.depth.violations > 0) {
      report += `   ⚠️  ${metrics.depth.violations} violações encontradas\n`;
    }
    report += '\n';
  }

  // Animation
  if (metrics.animation.score !== null) {
    report += `⚡ ANIMAÇÕES: ${metrics.animation.score}% ${getScoreBar(metrics.animation.score)}\n`;
    if (metrics.animation.totalTransitions > 0) {
      report += `   ${metrics.animation.totalTransitions} transições encontradas\n`;
      report += `   Duração média: ${metrics.animation.avgTiming}ms\n`;
      if (metrics.animation.bouncyAnimations > 0) {
        report += `   ⚠️  ${metrics.animation.bouncyAnimations} animações bounce/spring detectadas\n`;
      }
      if (metrics.animation.slowAnimations > 0) {
        report += `   ⚠️  ${metrics.animation.slowAnimations} animações lentas (>300ms)\n`;
      }
    } else {
      report += `   Nenhuma animação encontrada\n`;
    }
    report += '\n';
  }

  report += '─────────────────────────────────────────────────────────────────\n\n';

  // Sugestões
  report += '💡 SUGESTÕES:\n\n';
  const suggestions = generateSuggestions(metrics);
  if (suggestions.length > 0) {
    suggestions.forEach((suggestion, i) => {
      report += `${i + 1}. ${suggestion}\n`;
    });
  } else {
    report += '✅ Design system está consistente! Continue assim.\n';
  }

  report += '\n';

  return report;
}

/**
 * Gera barra de progresso visual
 */
function getScoreBar(score) {
  const filled = Math.round(score / 10);
  const empty = 10 - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

/**
 * Retorna emoji baseado no score
 */
function getScoreEmoji(score) {
  if (score >= 90) return '🏆';
  if (score >= 80) return '🎯';
  if (score >= 70) return '👍';
  if (score >= 60) return '⚠️';
  return '❌';
}

/**
 * Retorna label baseado no score
 */
function getScoreLabel(score) {
  if (score >= 90) return 'Excelente! Design system muito consistente';
  if (score >= 80) return 'Muito bom! Pequenas melhorias necessárias';
  if (score >= 70) return 'Bom, mas há espaço para melhorias';
  if (score >= 60) return 'Regular, várias inconsistências encontradas';
  return 'Precisa de atenção urgente';
}

/**
 * Gera sugestões baseado nas métricas
 */
function generateSuggestions(metrics) {
  const suggestions = [];

  if (metrics.spacing.score !== null && metrics.spacing.score < 80) {
    suggestions.push(`Padronizar spacing: ${metrics.spacing.offGridValues.length} valores fora do grid detectados`);
  }

  if (metrics.colors.score !== null && metrics.colors.score < 75) {
    suggestions.push(`Consolidar paleta de cores: ${metrics.colors.unknownColors.length} cores fora da paleta`);
  }

  if (metrics.depth.score !== null && metrics.depth.violations > 0) {
    suggestions.push(`Corrigir estratégia de profundidade: ${metrics.depth.violations} violações encontradas`);
  }

  if (metrics.animation.bouncyAnimations > 0) {
    suggestions.push(`Remover animações bounce/spring (${metrics.animation.bouncyAnimations} encontradas)`);
  }

  if (metrics.animation.slowAnimations > 5) {
    suggestions.push(`Otimizar duração de animações (${metrics.animation.slowAnimations} animações >300ms)`);
  }

  return suggestions;
}

/**
 * Função principal
 */
async function analyzeMetrics(projectRoot = process.cwd()) {
  console.error('📊 Analisando métricas do design system...\n');

  // Lê sistema
  const systemPath = path.join(projectRoot, '.frontforge', 'system.md');
  const system = parseSystemFile(systemPath);

  if (!system) {
    console.error('⚠️  Arquivo .frontforge/system.md não encontrado');
    console.error('   Execute /claude-frontforge:init primeiro\n');
    return null;
  }

  // Encontra arquivos
  const files = findUIFiles(projectRoot);
  console.error(`📁 Analisando ${files.length} arquivos...\n`);

  // Executa análises
  const metrics = {
    spacing: analyzeSpacingCompliance(files, system),
    colors: analyzeColorCompliance(files, system),
    depth: analyzeDepthCompliance(files, system),
    animation: analyzeAnimationCompliance(files)
  };

  const overallScore = calculateOverallScore(metrics);

  // Gera relatório
  const report = generateReport(metrics, overallScore);

  console.log(report);

  return { metrics, overallScore };
}

// Executa se chamado diretamente
if (require.main === module) {
  const projectRoot = process.argv[2] || process.cwd();
  analyzeMetrics(projectRoot);
}

module.exports = { analyzeMetrics };
