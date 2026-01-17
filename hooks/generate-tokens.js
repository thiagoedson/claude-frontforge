#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Sistema de Geração Automática de Tokens de Design
 * Analisa código existente e extrai padrões de design
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
 * Função principal
 */
async function generateTokens(projectRoot = process.cwd(), outputFormat = 'css') {
  console.error('🎨 Analisando código para extrair tokens de design...\n');

  // Encontra arquivos de estilo
  const styleFiles = findStyleFiles(projectRoot);
  console.error(`📁 Encontrados ${styleFiles.length} arquivos para análise\n`);

  if (styleFiles.length === 0) {
    console.error('⚠️  Nenhum arquivo de estilo encontrado');
    return null;
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

  // Gera output
  let output;
  if (outputFormat === 'css') {
    output = generateCSSTokens(tokens);
  } else if (outputFormat === 'js' || outputFormat === 'ts') {
    output = generateJSTokens(tokens);
  } else {
    output = JSON.stringify(tokens, null, 2);
  }

  // Output para stdout
  console.log(output);

  // Também salva estatísticas em stderr para debug
  console.error('\n📊 Estatísticas:');
  console.error(`  - Arquivos analisados: ${tokens.stats.filesAnalyzed}`);
  console.error(`  - Cores encontradas: ${tokens.stats.colorsFound}`);
  console.error(`  - Valores de spacing: ${tokens.stats.spacingValuesFound}`);
  console.error(`  - Shadows: ${tokens.stats.shadowsFound}`);
  console.error(`  - Base de spacing detectada: ${spacingBase}px`);

  return tokens;
}

// Executa se chamado diretamente
if (require.main === module) {
  const args = process.argv.slice(2);
  const projectRoot = args[0] || process.cwd();
  const outputFormat = args[1] || 'css'; // css, js, ts, json

  generateTokens(projectRoot, outputFormat);
}

module.exports = { generateTokens };
