#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { checkCache, updateCache } = require('./cache');

/**
 * Sistema de Geração Automática de Tokens de Design
 * Analisa código existente e extrai padrões de design
 *
 * Com sistema de cache para evitar reprocessamento
 */

// Padrões regex para extrair valores
const PATTERNS = {
  // Cores: hex, rgb, hsl
  colors: {
    hex: /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g,
    rgb: /rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/g,
    hsl: /hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?(?:\s*,\s*([\d.]+))?\s*\)/g,
  },

  // Spacing: padding, margin, gap (valores em px, rem, em)
  spacing: /(?:padding|margin|gap|top|right|bottom|left|width|height):\s*(-?\d+(?:\.\d+)?)(px|rem|em)/g,

  // Shadows: box-shadow
  shadows: /box-shadow:\s*([^;]+);/g,

  // Border radius
  borderRadius: /border-radius:\s*(\d+(?:\.\d+)?)(px|rem|em)/g,

  // Font sizes
  fontSize: /font-size:\s*(\d+(?:\.\d+)?)(px|rem|em)/g,

  // Font weights
  fontWeight: /font-weight:\s*(\d{3}|bold|normal|light)/g,

  // Animations/Transitions
  transitions: /(?:transition|animation):\s*([^;]+);/g,
};

/**
 * Busca recursivamente por arquivos de estilo
 */
function findStyleFiles(dir, extensions = ['.css', '.scss', '.sass', '.less', '.tsx', '.jsx', '.vue', '.svelte']) {
  const files = [];

  function traverse(currentPath) {
    if (!fs.existsSync(currentPath)) return;

    const items = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(currentPath, item.name);

      // Ignora node_modules, .git, build, dist
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
 * Extrai cores do conteúdo
 */
function extractColors(content) {
  const colors = new Set();

  // Hex colors
  let match;
  while ((match = PATTERNS.colors.hex.exec(content)) !== null) {
    colors.add(normalizeColor(match[0]));
  }

  // RGB colors
  const rgbRegex = /rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/g;
  while ((match = rgbRegex.exec(content)) !== null) {
    colors.add(match[0]);
  }

  // HSL colors
  const hslRegex = /hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?(?:\s*,\s*([\d.]+))?\s*\)/g;
  while ((match = hslRegex.exec(content)) !== null) {
    colors.add(match[0]);
  }

  return Array.from(colors);
}

/**
 * Normaliza cores hex (converte #abc para #aabbcc)
 */
function normalizeColor(hex) {
  if (hex.length === 4) {
    return '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }
  return hex.toLowerCase();
}

/**
 * Extrai valores de spacing
 */
function extractSpacing(content) {
  const spacingValues = new Map();

  const spacingRegex = /(?:padding|margin|gap|top|right|bottom|left|width|height):\s*(-?\d+(?:\.\d+)?)(px|rem|em)/g;
  let match;

  while ((match = spacingRegex.exec(content)) !== null) {
    const value = match[1];
    const unit = match[2];
    const key = `${value}${unit}`;

    spacingValues.set(key, (spacingValues.get(key) || 0) + 1);
  }

  // Ordena por frequência
  return Array.from(spacingValues.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([value]) => value);
}

/**
 * Extrai shadows
 */
function extractShadows(content) {
  const shadows = new Map();

  const shadowRegex = /box-shadow:\s*([^;]+);/g;
  let match;

  while ((match = shadowRegex.exec(content)) !== null) {
    const shadow = match[1].trim();
    shadows.set(shadow, (shadows.get(shadow) || 0) + 1);
  }

  return Array.from(shadows.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([value]) => value);
}

/**
 * Extrai border radius
 */
function extractBorderRadius(content) {
  const radiusValues = new Map();

  const radiusRegex = /border-radius:\s*(\d+(?:\.\d+)?)(px|rem|em)/g;
  let match;

  while ((match = radiusRegex.exec(content)) !== null) {
    const value = match[1];
    const unit = match[2];
    const key = `${value}${unit}`;

    radiusValues.set(key, (radiusValues.get(key) || 0) + 1);
  }

  return Array.from(radiusValues.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([value]) => value);
}

/**
 * Extrai font sizes
 */
function extractFontSizes(content) {
  const fontSizes = new Map();

  const fontSizeRegex = /font-size:\s*(\d+(?:\.\d+)?)(px|rem|em)/g;
  let match;

  while ((match = fontSizeRegex.exec(content)) !== null) {
    const value = match[1];
    const unit = match[2];
    const key = `${value}${unit}`;

    fontSizes.set(key, (fontSizes.get(key) || 0) + 1);
  }

  return Array.from(fontSizes.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([value]) => value);
}

/**
 * Detecta base de spacing (múltiplo comum)
 */
function detectSpacingBase(spacingValues) {
  // Extrai apenas valores em px
  const pxValues = spacingValues
    .filter(v => v.endsWith('px'))
    .map(v => parseInt(v))
    .filter(v => v > 0 && v <= 100); // Valores razoáveis

  if (pxValues.length === 0) return 4; // Default

  // Testa bases comuns: 4, 8, 10
  const bases = [4, 8, 10];
  let bestBase = 4;
  let bestScore = 0;

  bases.forEach(base => {
    const score = pxValues.filter(v => v % base === 0).length;
    if (score > bestScore) {
      bestScore = score;
      bestBase = base;
    }
  });

  return bestBase;
}

/**
 * Sugere escala de spacing baseado na base
 */
function suggestSpacingScale(base) {
  return [
    base,
    base * 2,
    base * 3,
    base * 4,
    base * 6,
    base * 8,
    base * 12
  ];
}

/**
 * Agrupa cores similares
 */
function groupSimilarColors(colors) {
  // Simplificação: agrupa por prefixo hex similar
  const groups = new Map();

  colors.forEach(color => {
    if (color.startsWith('#')) {
      const prefix = color.substring(0, 4); // Primeiros 3 chars hex
      if (!groups.has(prefix)) {
        groups.set(prefix, []);
      }
      groups.get(prefix).push(color);
    } else {
      // RGB/HSL - adiciona em grupo separado
      if (!groups.has('other')) {
        groups.set('other', []);
      }
      groups.get('other').push(color);
    }
  });

  return groups;
}

/**
 * Gera arquivo de tokens CSS
 */
function generateCSSTokens(tokens) {
  let css = '/* Design Tokens - Gerado automaticamente pelo claude-frontforge */\n\n';
  css += ':root {\n';

  // Spacing
  if (tokens.spacing.scale.length > 0) {
    css += '  /* Spacing */\n';
    tokens.spacing.scale.forEach((value, index) => {
      const name = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'][index] || `${index}`;
      css += `  --spacing-${name}: ${value}px;\n`;
    });
    css += '\n';
  }

  // Colors
  if (tokens.colors.length > 0) {
    css += '  /* Colors (top 10 mais usadas) */\n';
    tokens.colors.slice(0, 10).forEach((color, index) => {
      css += `  --color-${index + 1}: ${color};\n`;
    });
    css += '\n';
  }

  // Shadows
  if (tokens.shadows.length > 0) {
    css += '  /* Shadows */\n';
    tokens.shadows.slice(0, 5).forEach((shadow, index) => {
      const name = ['sm', 'md', 'lg', 'xl', '2xl'][index] || `${index}`;
      css += `  --shadow-${name}: ${shadow};\n`;
    });
    css += '\n';
  }

  // Border Radius
  if (tokens.borderRadius.length > 0) {
    css += '  /* Border Radius */\n';
    tokens.borderRadius.slice(0, 5).forEach((radius, index) => {
      const name = ['sm', 'md', 'lg', 'xl', '2xl'][index] || `${index}`;
      css += `  --radius-${name}: ${radius};\n`;
    });
    css += '\n';
  }

  // Font Sizes
  if (tokens.fontSize.length > 0) {
    css += '  /* Font Sizes */\n';
    tokens.fontSize.slice(0, 8).forEach((size, index) => {
      const name = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'][index] || `${index}`;
      css += `  --font-size-${name}: ${size};\n`;
    });
  }

  css += '}\n';

  return css;
}

/**
 * Gera arquivo de tokens JavaScript/TypeScript
 */
function generateJSTokens(tokens) {
  const tokensObj = {
    spacing: {},
    colors: tokens.colors.slice(0, 10),
    shadows: tokens.shadows.slice(0, 5),
    borderRadius: tokens.borderRadius.slice(0, 5),
    fontSize: tokens.fontSize.slice(0, 8)
  };

  // Spacing scale
  tokens.spacing.scale.forEach((value, index) => {
    const name = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'][index] || `${index}`;
    tokensObj.spacing[name] = `${value}px`;
  });

  let js = '// Design Tokens - Gerado automaticamente pelo claude-frontforge\n\n';
  js += `export const tokens = ${JSON.stringify(tokensObj, null, 2)};\n\n`;
  js += 'export default tokens;\n';

  return js;
}

/**
 * Gera configuração Tailwind CSS
 */
function generateTailwindTokens(tokens) {
  const config = {
    theme: {
      extend: {
        spacing: {},
        colors: {
          brand: {}
        },
        boxShadow: {},
        borderRadius: {},
        fontSize: {}
      }
    }
  };

  // Spacing scale
  tokens.spacing.scale.forEach((value, index) => {
    const name = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'][index] || `${index}`;
    config.theme.extend.spacing[name] = `${value}px`;
  });

  // Colors - organize by hue similarity
  tokens.colors.slice(0, 10).forEach((color, index) => {
    config.theme.extend.colors.brand[`${(index + 1) * 100}`] = color;
  });

  // Shadows
  tokens.shadows.slice(0, 5).forEach((shadow, index) => {
    const name = ['sm', 'DEFAULT', 'md', 'lg', 'xl'][index] || `${index}`;
    config.theme.extend.boxShadow[name] = shadow;
  });

  // Border Radius
  tokens.borderRadius.slice(0, 5).forEach((radius, index) => {
    const name = ['sm', 'DEFAULT', 'md', 'lg', 'xl'][index] || `${index}`;
    config.theme.extend.borderRadius[name] = radius;
  });

  // Font Sizes
  tokens.fontSize.slice(0, 8).forEach((size, index) => {
    const name = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'][index] || `${index}`;
    config.theme.extend.fontSize[name] = size;
  });

  let tailwind = '// Tailwind Config - Gerado automaticamente pelo claude-frontforge\n';
  tailwind += '// Cole no seu tailwind.config.js dentro de module.exports\n\n';
  tailwind += `module.exports = ${JSON.stringify(config, null, 2)};\n`;

  return tailwind;
}

/**
 * Gera tokens no formato Figma Tokens (compatível com plugin)
 */
function generateFigmaTokens(tokens) {
  const figmaTokens = {
    global: {
      spacing: {},
      colors: {
        brand: {},
        semantic: {}
      },
      shadows: {},
      borderRadius: {},
      typography: {
        fontSize: {}
      }
    }
  };

  // Spacing
  tokens.spacing.scale.forEach((value, index) => {
    const name = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'][index] || `${index}`;
    figmaTokens.global.spacing[name] = {
      value: `${value}px`,
      type: 'spacing'
    };
  });

  // Colors
  tokens.colors.slice(0, 10).forEach((color, index) => {
    figmaTokens.global.colors.brand[`${(index + 1) * 100}`] = {
      value: color,
      type: 'color'
    };
  });

  // Shadows
  tokens.shadows.slice(0, 5).forEach((shadow, index) => {
    const name = ['sm', 'md', 'lg', 'xl', '2xl'][index] || `${index}`;
    figmaTokens.global.shadows[name] = {
      value: shadow,
      type: 'boxShadow'
    };
  });

  // Border Radius
  tokens.borderRadius.slice(0, 5).forEach((radius, index) => {
    const name = ['sm', 'md', 'lg', 'xl', '2xl'][index] || `${index}`;
    figmaTokens.global.borderRadius[name] = {
      value: radius,
      type: 'borderRadius'
    };
  });

  // Font Sizes
  tokens.fontSize.slice(0, 8).forEach((size, index) => {
    const name = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'][index] || `${index}`;
    figmaTokens.global.typography.fontSize[name] = {
      value: size,
      type: 'fontSizes'
    };
  });

  let figma = '// Figma Tokens - Gerado automaticamente pelo claude-frontforge\n';
  figma += '// Compatível com Figma Tokens plugin (https://tokens.studio/)\n';
  figma += '// Importe este arquivo JSON no plugin\n\n';
  figma += JSON.stringify(figmaTokens, null, 2) + '\n';

  return figma;
}

/**
 * Calcula scores de confiança para os tokens extraídos
 */
function calculateConfidenceScores(tokens) {
  const scores = {};

  // Spacing confidence - baseado na consistência com a base
  const spacingValues = tokens.spacing.detected
    .filter(v => v.endsWith('px'))
    .map(v => parseInt(v));

  if (spacingValues.length > 0) {
    const onGrid = spacingValues.filter(v => v % tokens.spacing.base === 0);
    scores.spacing = Math.round((onGrid.length / spacingValues.length) * 100);
  } else {
    scores.spacing = 0;
  }

  // Color confidence - baseado na frequência de uso
  scores.colors = tokens.colors.length > 5 ? 85 : tokens.colors.length > 0 ? 70 : 0;

  // Shadow confidence - baseado na presença de padrões
  scores.shadows = tokens.shadows.length > 2 ? 80 : tokens.shadows.length > 0 ? 60 : 0;

  // Overall confidence
  scores.overall = Math.round(
    (scores.spacing * 0.3) +
    (scores.colors * 0.3) +
    (scores.shadows * 0.2) +
    (tokens.borderRadius.length > 0 ? 20 : 0)
  );

  return scores;
}

/**
 * Função principal
 */
async function generateTokens(projectRoot = process.cwd(), outputFormat = 'css', useCache = true) {
  console.error('🎨 Analisando código para extrair tokens de design...\n');

  // Encontra arquivos de estilo
  const styleFiles = findStyleFiles(projectRoot);
  console.error(`📁 Encontrados ${styleFiles.length} arquivos para análise\n`);

  if (styleFiles.length === 0) {
    console.error('⚠️  Nenhum arquivo de estilo encontrado');
    return null;
  }

  // Verifica cache
  const cacheKey = `generate-tokens-${outputFormat}`;
  if (useCache) {
    const cached = checkCache(cacheKey, styleFiles, projectRoot);
    if (cached.valid) {
      console.error('⚡ Usando tokens em cache (arquivos não modificados)\n');
      console.log(cached.data.output);
      return cached.data.tokens;
    }
  }

  // Lê e concatena conteúdo
  let allContent = '';
  styleFiles.forEach(file => {
    try {
      allContent += fs.readFileSync(file, 'utf-8') + '\n';
    } catch (error) {
      console.error(`⚠️  Erro ao ler ${file}:`, error.message);
    }
  });

  // Extrai tokens
  const colors = extractColors(allContent);
  const spacing = extractSpacing(allContent);
  const shadows = extractShadows(allContent);
  const borderRadius = extractBorderRadius(allContent);
  const fontSize = extractFontSizes(allContent);

  const spacingBase = detectSpacingBase(spacing);
  const spacingScale = suggestSpacingScale(spacingBase);

  const tokens = {
    spacing: {
      base: spacingBase,
      scale: spacingScale,
      detected: spacing.slice(0, 20)
    },
    colors: colors,
    shadows: shadows,
    borderRadius: borderRadius,
    fontSize: fontSize,
    stats: {
      filesAnalyzed: styleFiles.length,
      colorsFound: colors.length,
      spacingValuesFound: spacing.length,
      shadowsFound: shadows.length
    }
  };

  // Calcula scores de confiança
  const confidence = calculateConfidenceScores(tokens);
  tokens.confidence = confidence;

  // Gera output
  let output;
  if (outputFormat === 'css') {
    output = generateCSSTokens(tokens);
  } else if (outputFormat === 'js' || outputFormat === 'ts') {
    output = generateJSTokens(tokens);
  } else if (outputFormat === 'tailwind') {
    output = generateTailwindTokens(tokens);
  } else if (outputFormat === 'figma') {
    output = generateFigmaTokens(tokens);
  } else {
    output = JSON.stringify(tokens, null, 2);
  }

  // Output para stdout
  console.log(output);

  // Salva em cache para futuras execuções
  if (useCache) {
    const cacheResult = checkCache(cacheKey, styleFiles, projectRoot);
    updateCache(cacheKey, cacheResult.hash, { tokens, output }, projectRoot);
    console.error('💾 Tokens salvos em cache\n');
  }

  // Também salva estatísticas em stderr para debug
  console.error('📊 Estatísticas:');
  console.error(`  - Arquivos analisados: ${tokens.stats.filesAnalyzed}`);
  console.error(`  - Cores encontradas: ${tokens.stats.colorsFound}`);
  console.error(`  - Valores de spacing: ${tokens.stats.spacingValuesFound}`);
  console.error(`  - Shadows: ${tokens.stats.shadowsFound}`);
  console.error(`  - Base de spacing detectada: ${spacingBase}px`);
  console.error('\n📈 Scores de Confiança:');
  console.error(`  - Spacing: ${confidence.spacing}%`);
  console.error(`  - Colors: ${confidence.colors}%`);
  console.error(`  - Shadows: ${confidence.shadows}%`);
  console.error(`  - Overall: ${confidence.overall}%`);

  return tokens;
}

// Executa se chamado diretamente
if (require.main === module) {
  const args = process.argv.slice(2);
  const projectRoot = args[0] || process.cwd();
  const outputFormat = args[1] || 'css'; // css, js, ts, json, tailwind, figma

  console.error('📦 Formatos disponíveis: css, js, ts, json, tailwind, figma\n');

  generateTokens(projectRoot, outputFormat);
}

module.exports = {
  generateTokens,
  generateCSSTokens,
  generateJSTokens,
  generateTailwindTokens,
  generateFigmaTokens,
  calculateConfidenceScores
};
