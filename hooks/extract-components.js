#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Sistema de Extração e Aprendizado de Padrões de Componentes
 * Analisa componentes existentes e extrai padrões de design
 */

// Componentes comuns para detectar
const COMMON_COMPONENTS = [
  'Button',
  'Card',
  'Input',
  'Select',
  'Checkbox',
  'Radio',
  'Modal',
  'Dialog',
  'Tooltip',
  'Alert',
  'Badge',
  'Avatar',
  'Dropdown',
  'Tab',
  'Accordion',
  'Table',
  'Form'
];

/**
 * Busca arquivos de componentes
 */
function findComponentFiles(dir) {
  const files = [];
  const extensions = ['.tsx', '.jsx', '.vue', '.svelte'];

  function traverse(currentPath) {
    if (!fs.existsSync(currentPath)) return;

    const items = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(currentPath, item.name);

      if (item.isDirectory()) {
        // Busca em pastas comuns de componentes
        if (!['node_modules', '.git', 'build', 'dist', '.next'].includes(item.name)) {
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
 * Detecta tipo de componente pelo nome do arquivo ou código
 */
function detectComponentType(filePath, content) {
  const fileName = path.basename(filePath, path.extname(filePath));

  // Verifica se o nome do arquivo corresponde a um componente comum
  for (const componentType of COMMON_COMPONENTS) {
    if (fileName.toLowerCase().includes(componentType.toLowerCase())) {
      return componentType;
    }
  }

  // Verifica no conteúdo do arquivo
  for (const componentType of COMMON_COMPONENTS) {
    const regex = new RegExp(`(function|const|class)\\s+${componentType}`, 'i');
    if (regex.test(content)) {
      return componentType;
    }
  }

  return null;
}

/**
 * Extrai propriedades de estilo do componente
 */
function extractComponentStyles(content, componentType) {
  const styles = {
    type: componentType,
    properties: {},
    states: [],
    variants: []
  };

  // Extrai className e styled-components
  const classNameMatches = content.match(/className\s*=\s*["'`]([^"'`]+)["'`]/g);
  const styledMatches = content.match(/styled\.\w+`([^`]+)`/g);

  let styleContent = '';

  if (classNameMatches) {
    styleContent += classNameMatches.join('\n');
  }

  if (styledMatches) {
    styleContent += styledMatches.join('\n');
  }

  // Também procura por style inline
  const inlineStyleMatches = content.match(/style\s*=\s*\{([^}]+)\}/g);
  if (inlineStyleMatches) {
    styleContent += inlineStyleMatches.join('\n');
  }

  // Extrai propriedades específicas
  styles.properties = extractStyleProperties(styleContent);

  // Detecta estados (hover, active, focus, disabled)
  styles.states = detectStates(content);

  // Detecta variantes (primary, secondary, etc.)
  styles.variants = detectVariants(content);

  return styles;
}

/**
 * Extrai propriedades de estilo específicas
 */
function extractStyleProperties(styleContent) {
  const properties = {};

  // Padding
  const paddingMatch = styleContent.match(/padding:\s*([^;}\n]+)/);
  if (paddingMatch) {
    properties.padding = paddingMatch[1].trim();
  }

  // Height
  const heightMatch = styleContent.match(/height:\s*([^;}\n]+)/);
  if (heightMatch) {
    properties.height = heightMatch[1].trim();
  }

  // Width
  const widthMatch = styleContent.match(/width:\s*([^;}\n]+)/);
  if (widthMatch) {
    properties.width = widthMatch[1].trim();
  }

  // Border radius
  const radiusMatch = styleContent.match(/border-radius:\s*([^;}\n]+)/);
  if (radiusMatch) {
    properties.borderRadius = radiusMatch[1].trim();
  }

  // Background
  const bgMatch = styleContent.match(/background(?:-color)?:\s*([^;}\n]+)/);
  if (bgMatch) {
    properties.background = bgMatch[1].trim();
  }

  // Color
  const colorMatch = styleContent.match(/color:\s*([^;}\n]+)/);
  if (colorMatch) {
    properties.color = colorMatch[1].trim();
  }

  // Font size
  const fontSizeMatch = styleContent.match(/font-size:\s*([^;}\n]+)/);
  if (fontSizeMatch) {
    properties.fontSize = fontSizeMatch[1].trim();
  }

  // Font weight
  const fontWeightMatch = styleContent.match(/font-weight:\s*([^;}\n]+)/);
  if (fontWeightMatch) {
    properties.fontWeight = fontWeightMatch[1].trim();
  }

  // Border
  const borderMatch = styleContent.match(/border:\s*([^;}\n]+)/);
  if (borderMatch) {
    properties.border = borderMatch[1].trim();
  }

  // Shadow
  const shadowMatch = styleContent.match(/box-shadow:\s*([^;}\n]+)/);
  if (shadowMatch) {
    properties.boxShadow = shadowMatch[1].trim();
  }

  // Transition
  const transitionMatch = styleContent.match(/transition:\s*([^;}\n]+)/);
  if (transitionMatch) {
    properties.transition = transitionMatch[1].trim();
  }

  return properties;
}

/**
 * Detecta estados do componente
 */
function detectStates(content) {
  const states = [];

  if (content.includes('hover') || content.includes(':hover')) {
    states.push('hover');
  }

  if (content.includes('active') || content.includes(':active')) {
    states.push('active');
  }

  if (content.includes('focus') || content.includes(':focus')) {
    states.push('focus');
  }

  if (content.includes('disabled') || content.includes(':disabled')) {
    states.push('disabled');
  }

  return states;
}

/**
 * Detecta variantes do componente
 */
function detectVariants(content) {
  const variants = [];

  const commonVariants = [
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'outline',
    'ghost',
    'link',
    'small',
    'medium',
    'large'
  ];

  commonVariants.forEach(variant => {
    const regex = new RegExp(`['"\`]${variant}['"\`]|variant.*${variant}`, 'i');
    if (regex.test(content)) {
      variants.push(variant);
    }
  });

  return variants;
}

/**
 * Agrupa componentes por tipo
 */
function groupComponentsByType(components) {
  const grouped = {};

  components.forEach(component => {
    const type = component.type;

    if (!grouped[type]) {
      grouped[type] = [];
    }

    grouped[type].push(component);
  });

  return grouped;
}

/**
 * Gera padrão consolidado para cada tipo de componente
 */
function generateComponentPatterns(groupedComponents) {
  const patterns = {};

  Object.entries(groupedComponents).forEach(([type, components]) => {
    const pattern = {
      type,
      count: components.length,
      commonProperties: {},
      states: new Set(),
      variants: new Set()
    };

    // Encontra propriedades mais comuns
    const propertyFrequency = {};

    components.forEach(component => {
      Object.entries(component.properties).forEach(([prop, value]) => {
        const key = `${prop}:${value}`;
        propertyFrequency[key] = (propertyFrequency[key] || 0) + 1;
      });

      component.states.forEach(state => pattern.states.add(state));
      component.variants.forEach(variant => pattern.variants.add(variant));
    });

    // Propriedades que aparecem em mais de 50% dos componentes
    const threshold = components.length * 0.5;
    Object.entries(propertyFrequency).forEach(([key, count]) => {
      if (count >= threshold) {
        const [prop, value] = key.split(':');
        pattern.commonProperties[prop] = value;
      }
    });

    pattern.states = Array.from(pattern.states);
    pattern.variants = Array.from(pattern.variants);

    patterns[type] = pattern;
  });

  return patterns;
}

/**
 * Gera markdown para salvar em .frontforge/system.md
 */
function generateComponentsMarkdown(patterns) {
  let markdown = '## Components Patterns\n\n';
  markdown += '_Padrões extraídos automaticamente do código existente_\n\n';

  Object.values(patterns).forEach(pattern => {
    markdown += `### ${pattern.type}\n\n`;
    markdown += `_Encontrado ${pattern.count}x no projeto_\n\n`;

    if (Object.keys(pattern.commonProperties).length > 0) {
      markdown += '**Propriedades comuns:**\n';
      Object.entries(pattern.commonProperties).forEach(([prop, value]) => {
        markdown += `- ${prop}: \`${value}\`\n`;
      });
      markdown += '\n';
    }

    if (pattern.states.length > 0) {
      markdown += `**Estados:** ${pattern.states.join(', ')}\n\n`;
    }

    if (pattern.variants.length > 0) {
      markdown += `**Variantes:** ${pattern.variants.join(', ')}\n\n`;
    }

    markdown += '---\n\n';
  });

  return markdown;
}

/**
 * Função principal
 */
async function extractComponents(projectRoot = process.cwd()) {
  console.error('🧩 Extraindo padrões de componentes...\n');

  const componentFiles = findComponentFiles(projectRoot);
  console.error(`📁 Encontrados ${componentFiles.length} arquivos de componentes\n`);

  if (componentFiles.length === 0) {
    console.error('⚠️  Nenhum arquivo de componente encontrado');
    return null;
  }

  const detectedComponents = [];

  // Analisa cada arquivo
  componentFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      const componentType = detectComponentType(file, content);

      if (componentType) {
        const styles = extractComponentStyles(content, componentType);
        detectedComponents.push({
          file: path.relative(projectRoot, file),
          ...styles
        });
      }
    } catch (error) {
      console.error(`⚠️  Erro ao processar ${file}:`, error.message);
    }
  });

  console.error(`✅ Detectados ${detectedComponents.length} componentes conhecidos\n`);

  // Agrupa e gera padrões
  const grouped = groupComponentsByType(detectedComponents);
  const patterns = generateComponentPatterns(grouped);

  const result = {
    patterns,
    stats: {
      filesAnalyzed: componentFiles.length,
      componentsDetected: detectedComponents.length,
      uniqueTypes: Object.keys(patterns).length
    }
  };

  // Output markdown
  const markdown = generateComponentsMarkdown(patterns);
  console.log(markdown);

  // Também output JSON em stderr para processamento
  console.error('\n📊 Resumo:');
  console.error(JSON.stringify(result.stats, null, 2));

  return result;
}

// Executa se chamado diretamente
if (require.main === module) {
  const projectRoot = process.argv[2] || process.cwd();
  extractComponents(projectRoot);
}

module.exports = { extractComponents };
