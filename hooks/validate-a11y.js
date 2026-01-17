#!/usr/bin/env node

/**
 * Validação de Acessibilidade (A11y)
 * Verifica conformidade com WCAG 2.1 AA/AAA
 */

/**
 * Calcula contraste entre duas cores
 * Baseado em WCAG 2.1
 */
function calculateContrast(color1, color2) {
  const luminance1 = getRelativeLuminance(color1);
  const luminance2 = getRelativeLuminance(color2);

  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Calcula luminância relativa de uma cor
 */
function getRelativeLuminance(color) {
  const rgb = parseColor(color);
  if (!rgb) return 0;

  const [r, g, b] = rgb.map(channel => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Parse cor para RGB
 */
function parseColor(color) {
  // Hex
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    if (hex.length === 3) {
      return [
        parseInt(hex[0] + hex[0], 16),
        parseInt(hex[1] + hex[1], 16),
        parseInt(hex[2] + hex[2], 16)
      ];
    } else if (hex.length === 6) {
      return [
        parseInt(hex.substr(0, 2), 16),
        parseInt(hex.substr(2, 2), 16),
        parseInt(hex.substr(4, 2), 16)
      ];
    }
  }

  // RGB
  const rgbMatch = color.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (rgbMatch) {
    return [
      parseInt(rgbMatch[1]),
      parseInt(rgbMatch[2]),
      parseInt(rgbMatch[3])
    ];
  }

  return null;
}

/**
 * Valida contraste de cores
 */
function validateColorContrast(content) {
  const violations = [];

  // Extrai pares de cor de texto e background
  const colorPairs = extractColorPairs(content);

  colorPairs.forEach(({ foreground, background, context }) => {
    const contrast = calculateContrast(foreground, background);

    // WCAG AA: Normal text needs 4.5:1, Large text needs 3:1
    const isLargeText = context.includes('font-size') &&
                       (context.includes('18px') || context.includes('24px') ||
                        context.includes('1.5rem') || context.includes('bold'));

    const requiredContrast = isLargeText ? 3 : 4.5;

    if (contrast < requiredContrast) {
      violations.push({
        type: 'color-contrast',
        severity: 'error',
        message: `Contraste insuficiente: ${contrast.toFixed(2)}:1 (mínimo ${requiredContrast}:1)`,
        colors: { foreground, background },
        wcag: 'WCAG 2.1 AA',
        suggestion: `Aumentar contraste entre ${foreground} e ${background}`
      });
    }
  });

  return violations;
}

/**
 * Extrai pares de cores (foreground/background) do conteúdo
 */
function extractColorPairs(content) {
  const pairs = [];

  // Regex simples para encontrar propriedades de cor e background próximas
  const colorRegex = /color:\s*([^;}\n]+).*?background(?:-color)?:\s*([^;}\n]+)/gs;
  let match;

  while ((match = colorRegex.exec(content)) !== null) {
    pairs.push({
      foreground: match[1].trim(),
      background: match[2].trim(),
      context: match[0]
    });
  }

  // Também procura ao contrário
  const bgColorRegex = /background(?:-color)?:\s*([^;}\n]+).*?color:\s*([^;}\n]+)/gs;
  while ((match = bgColorRegex.exec(content)) !== null) {
    pairs.push({
      foreground: match[2].trim(),
      background: match[1].trim(),
      context: match[0]
    });
  }

  return pairs;
}

/**
 * Valida touch targets (tamanho mínimo de elementos interativos)
 */
function validateTouchTargets(content) {
  const violations = [];

  // Procura por buttons, links, inputs
  const interactiveElements = [
    { tag: 'button', minSize: 44 },
    { tag: 'a', minSize: 44 },
    { tag: 'input[type="button"]', minSize: 44 },
    { tag: 'input[type="submit"]', minSize: 44 }
  ];

  interactiveElements.forEach(({ tag, minSize }) => {
    // Regex para encontrar elementos com tamanho definido
    const regex = new RegExp(`<${tag}[^>]*style=["']([^"']*height:\\s*(\\d+)px[^"']*)["']`, 'gi');
    let match;

    while ((match = regex.exec(content)) !== null) {
      const height = parseInt(match[2]);

      if (height < minSize) {
        violations.push({
          type: 'touch-target',
          severity: 'warning',
          message: `Touch target muito pequeno: ${height}px (mínimo ${minSize}px)`,
          element: tag,
          wcag: 'WCAG 2.1 AAA (2.5.5)',
          suggestion: `Aumentar altura do ${tag} para pelo menos ${minSize}px`
        });
      }
    }
  });

  // Também verifica classes/styled-components comuns
  const buttonSizeRegex = /(?:button|btn)[^{]*\{[^}]*height:\s*(\d+)px/gi;
  let match;

  while ((match = buttonSizeRegex.exec(content)) !== null) {
    const height = parseInt(match[1]);

    if (height < 44) {
      violations.push({
        type: 'touch-target',
        severity: 'warning',
        message: `Botão com altura inadequada: ${height}px (mínimo 44px)`,
        wcag: 'WCAG 2.1 AAA (2.5.5)',
        suggestion: 'Aumentar altura para 44px ou mais'
      });
    }
  }

  return violations;
}

/**
 * Valida hierarquia de headings
 */
function validateHeadingHierarchy(content) {
  const violations = [];

  // Extrai headings do HTML
  const headings = [];
  const headingRegex = /<h([1-6])[^>]*>([^<]*)<\/h\1>/gi;
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    headings.push({
      level: parseInt(match[1]),
      text: match[2].trim()
    });
  }

  // Verifica hierarquia
  if (headings.length > 0) {
    // Deve começar com h1
    if (headings[0].level !== 1) {
      violations.push({
        type: 'heading-hierarchy',
        severity: 'error',
        message: `Primeiro heading deve ser h1, encontrado h${headings[0].level}`,
        wcag: 'WCAG 2.1 AA (1.3.1)',
        suggestion: 'Começar a hierarquia com <h1>'
      });
    }

    // Não pode pular níveis
    for (let i = 1; i < headings.length; i++) {
      const prevLevel = headings[i - 1].level;
      const currentLevel = headings[i].level;

      if (currentLevel > prevLevel + 1) {
        violations.push({
          type: 'heading-hierarchy',
          severity: 'warning',
          message: `Hierarquia pulou de h${prevLevel} para h${currentLevel}`,
          wcag: 'WCAG 2.1 AA (1.3.1)',
          suggestion: `Usar h${prevLevel + 1} ao invés de h${currentLevel}`
        });
      }
    }
  }

  return violations;
}

/**
 * Valida textos alternativos em imagens
 */
function validateImageAlt(content) {
  const violations = [];

  // Procura por <img> sem alt ou com alt vazio
  const imgWithoutAlt = /<img(?![^>]*alt=)[^>]*>/gi;
  const imgWithEmptyAlt = /<img[^>]*alt=["']\s*["'][^>]*>/gi;

  const matchesWithoutAlt = content.match(imgWithoutAlt) || [];
  const matchesWithEmptyAlt = content.match(imgWithEmptyAlt) || [];

  matchesWithoutAlt.forEach(() => {
    violations.push({
      type: 'image-alt',
      severity: 'error',
      message: 'Imagem sem atributo alt',
      wcag: 'WCAG 2.1 A (1.1.1)',
      suggestion: 'Adicionar atributo alt descritivo ou alt="" se decorativa'
    });
  });

  matchesWithEmptyAlt.forEach(() => {
    violations.push({
      type: 'image-alt',
      severity: 'warning',
      message: 'Imagem com alt vazio (certifique-se que é decorativa)',
      wcag: 'WCAG 2.1 A (1.1.1)',
      suggestion: 'Se não for decorativa, adicionar descrição no alt'
    });
  });

  return violations;
}

/**
 * Valida labels em inputs
 */
function validateInputLabels(content) {
  const violations = [];

  // Procura inputs sem label associado
  const inputRegex = /<input(?![^>]*aria-label)(?![^>]*id=["']([^"']+)["'][^>]*>.*?<label[^>]*for=["']\1["'])[^>]*>/gi;

  const matches = content.match(inputRegex) || [];

  matches.forEach(() => {
    violations.push({
      type: 'input-label',
      severity: 'error',
      message: 'Input sem label ou aria-label',
      wcag: 'WCAG 2.1 A (1.3.1, 4.1.2)',
      suggestion: 'Adicionar <label> associado ou aria-label'
    });
  });

  return violations;
}

/**
 * Valida uso de ARIA
 */
function validateAria(content) {
  const violations = [];

  // Verifica role="button" sem eventos de teclado
  if (content.includes('role="button"') && !content.includes('onKeyDown') && !content.includes('onKeyPress')) {
    violations.push({
      type: 'aria-keyboard',
      severity: 'error',
      message: 'Elemento com role="button" sem suporte a teclado',
      wcag: 'WCAG 2.1 A (2.1.1)',
      suggestion: 'Adicionar onKeyDown/onKeyPress para Enter e Space'
    });
  }

  // Verifica aria-labels vazios
  const emptyAriaLabel = /aria-label=["']\s*["']/gi;
  if (emptyAriaLabel.test(content)) {
    violations.push({
      type: 'aria-label',
      severity: 'error',
      message: 'aria-label vazio encontrado',
      wcag: 'WCAG 2.1 A (4.1.2)',
      suggestion: 'Remover aria-label vazio ou adicionar texto descritivo'
    });
  }

  return violations;
}

/**
 * Função principal de validação
 */
function validateAccessibility(content, filePath) {
  const violations = [];

  // Roda todas as validações
  violations.push(...validateColorContrast(content));
  violations.push(...validateTouchTargets(content));
  violations.push(...validateHeadingHierarchy(content));
  violations.push(...validateImageAlt(content));
  violations.push(...validateInputLabels(content));
  violations.push(...validateAria(content));

  return {
    filePath,
    violations,
    stats: {
      errors: violations.filter(v => v.severity === 'error').length,
      warnings: violations.filter(v => v.severity === 'warning').length,
      total: violations.length
    }
  };
}

/**
 * Formata relatório de acessibilidade
 */
function formatA11yReport(result) {
  if (result.violations.length === 0) {
    return '✅ Nenhuma violação de acessibilidade encontrada';
  }

  let report = `\n⚠️  Encontradas ${result.stats.total} violações de acessibilidade\n\n`;

  const errors = result.violations.filter(v => v.severity === 'error');
  const warnings = result.violations.filter(v => v.severity === 'warning');

  if (errors.length > 0) {
    report += `🔴 ERROS (${errors.length}):\n`;
    errors.forEach((error, i) => {
      report += `${i + 1}. ${error.message}\n`;
      report += `   ${error.wcag}\n`;
      report += `   💡 ${error.suggestion}\n\n`;
    });
  }

  if (warnings.length > 0) {
    report += `🟡 AVISOS (${warnings.length}):\n`;
    warnings.forEach((warning, i) => {
      report += `${i + 1}. ${warning.message}\n`;
      report += `   ${warning.wcag}\n`;
      report += `   💡 ${warning.suggestion}\n\n`;
    });
  }

  return report;
}

module.exports = {
  validateAccessibility,
  formatA11yReport,
  calculateContrast,
  validateColorContrast,
  validateTouchTargets,
  validateHeadingHierarchy,
  validateImageAlt,
  validateInputLabels,
  validateAria
};

// CLI usage
if (require.main === module) {
  const fs = require('fs');
  const filePath = process.argv[2];

  if (!filePath) {
    console.error('Uso: node validate-a11y.js <arquivo>');
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const result = validateAccessibility(content, filePath);

  console.log(formatA11yReport(result));

  if (result.stats.errors > 0) {
    process.exit(1);
  }
}
