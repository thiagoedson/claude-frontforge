#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Website Design Analysis Tool
 * Analyzes website design patterns and extracts tokens with confidence scores
 */

/**
 * Confidence score calculator
 */
function calculateConfidence(factors) {
  const weights = {
    consistency: 0.3,
    sampleSize: 0.25,
    clarity: 0.25,
    variance: 0.2
  };

  let score = 0;
  for (const [factor, value] of Object.entries(factors)) {
    if (weights[factor]) {
      score += weights[factor] * value;
    }
  }

  return Math.round(score * 100);
}

/**
 * Design direction detector based on visual signals
 */
function detectDirection(tokens) {
  const signals = {
    'Precision & Density': 0,
    'Warmth & Approachability': 0,
    'Sophistication & Trust': 0,
    'Boldness & Clarity': 0,
    'Utility & Function': 0,
    'Data & Analysis': 0
  };

  // Analyze spacing base
  if (tokens.spacing?.base === 4) {
    signals['Precision & Density'] += 2;
    signals['Utility & Function'] += 1;
  } else if (tokens.spacing?.base === 8) {
    signals['Warmth & Approachability'] += 2;
    signals['Sophistication & Trust'] += 1;
  }

  // Analyze depth strategy
  if (tokens.surfaces?.depthStrategy === 'borders-only') {
    signals['Precision & Density'] += 3;
    signals['Utility & Function'] += 2;
  } else if (tokens.surfaces?.depthStrategy === 'subtle-shadows') {
    signals['Warmth & Approachability'] += 3;
  } else if (tokens.surfaces?.depthStrategy === 'layered-shadows') {
    signals['Sophistication & Trust'] += 3;
  }

  // Analyze color temperature
  if (tokens.colors?.temperature === 'cool') {
    signals['Sophistication & Trust'] += 2;
    signals['Precision & Density'] += 1;
  } else if (tokens.colors?.temperature === 'warm') {
    signals['Warmth & Approachability'] += 3;
  } else if (tokens.colors?.temperature === 'neutral') {
    signals['Utility & Function'] += 2;
  }

  // Analyze typography
  if (tokens.typography?.hasMonospace) {
    signals['Utility & Function'] += 2;
    signals['Data & Analysis'] += 2;
  }

  // Find highest scoring direction
  const sorted = Object.entries(signals).sort((a, b) => b[1] - a[1]);
  return {
    primary: sorted[0][0],
    secondary: sorted[1][0],
    scores: Object.fromEntries(sorted)
  };
}

/**
 * Generate analysis report with confidence scores
 */
function generateAnalysisReport(url, options = {}) {
  const timestamp = new Date().toISOString();

  const report = {
    metadata: {
      url: url,
      analyzedAt: timestamp,
      focus: options.focus || 'all',
      overallConfidence: '0%'
    },
    tokens: {
      typography: {
        families: {
          primary: 'Unknown (requires vision analysis)',
          secondary: null,
          mono: null
        },
        scale: [],
        weights: [],
        lineHeights: [],
        confidence: '80-85%',
        notes: 'Font family identification ~60% accurate. Classify by type anatomy for better results.'
      },
      colors: {
        primary: null,
        secondary: null,
        accent: null,
        neutral: [],
        semantic: {
          success: null,
          warning: null,
          error: null,
          info: null
        },
        temperature: 'unknown',
        confidence: '85-90%',
        notes: 'Hex values have ±10-15% variance from screenshot analysis.'
      },
      spacing: {
        base: null,
        scale: [],
        confidence: '75-80%'
      },
      layout: {
        maxWidth: null,
        columns: null,
        gutter: null,
        confidence: '70-80%'
      },
      surfaces: {
        shadows: [],
        borders: [],
        radius: [],
        depthStrategy: 'unknown',
        confidence: '80-85%'
      }
    },
    contentAnalysis: {
      siteType: null,
      voiceTone: null,
      industrySignals: [],
      targetAudience: [],
      confidence: '90-95%'
    },
    strategyInference: {
      primaryGoal: null,
      audienceSignals: [],
      designTradeoffs: [],
      competitivePosition: null
    },
    suggestedDirection: null,
    decisionTraces: []
  };

  return report;
}

/**
 * Format output for different formats
 */
function formatOutput(tokens, format) {
  switch (format) {
    case 'css':
      return generateCSSOutput(tokens);
    case 'tailwind':
      return generateTailwindOutput(tokens);
    case 'figma':
      return generateFigmaOutput(tokens);
    case 'json':
    default:
      return JSON.stringify(tokens, null, 2);
  }
}

/**
 * Generate CSS custom properties
 */
function generateCSSOutput(tokens) {
  let css = '/* Design Tokens - Extracted by claude-frontforge */\n';
  css += `/* Source: ${tokens.metadata?.url || 'unknown'} */\n`;
  css += `/* Analyzed: ${tokens.metadata?.analyzedAt || 'unknown'} */\n\n`;
  css += ':root {\n';

  // Typography
  if (tokens.tokens?.typography) {
    css += '  /* Typography */\n';
    tokens.tokens.typography.scale?.forEach((size, i) => {
      const names = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'];
      css += `  --font-size-${names[i] || i}: ${size};\n`;
    });
    css += '\n';
  }

  // Colors
  if (tokens.tokens?.colors) {
    css += '  /* Colors */\n';
    if (tokens.tokens.colors.primary) {
      css += `  --color-primary: ${tokens.tokens.colors.primary};\n`;
    }
    if (tokens.tokens.colors.secondary) {
      css += `  --color-secondary: ${tokens.tokens.colors.secondary};\n`;
    }
    tokens.tokens.colors.neutral?.forEach((color, i) => {
      css += `  --color-neutral-${(i + 1) * 100}: ${color};\n`;
    });
    css += '\n';
  }

  // Spacing
  if (tokens.tokens?.spacing) {
    css += '  /* Spacing */\n';
    tokens.tokens.spacing.scale?.forEach((space, i) => {
      const names = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];
      css += `  --spacing-${names[i] || i}: ${space};\n`;
    });
    css += '\n';
  }

  // Surfaces
  if (tokens.tokens?.surfaces) {
    css += '  /* Surfaces */\n';
    tokens.tokens.surfaces.shadows?.forEach((shadow, i) => {
      const names = ['sm', 'md', 'lg', 'xl'];
      css += `  --shadow-${names[i] || i}: ${shadow};\n`;
    });
    tokens.tokens.surfaces.radius?.forEach((radius, i) => {
      const names = ['sm', 'md', 'lg', 'xl'];
      css += `  --radius-${names[i] || i}: ${radius};\n`;
    });
  }

  css += '}\n';
  return css;
}

/**
 * Generate Tailwind config
 */
function generateTailwindOutput(tokens) {
  const config = {
    theme: {
      extend: {
        colors: {},
        spacing: {},
        fontSize: {},
        borderRadius: {},
        boxShadow: {}
      }
    }
  };

  // Colors
  if (tokens.tokens?.colors) {
    if (tokens.tokens.colors.primary) {
      config.theme.extend.colors.primary = tokens.tokens.colors.primary;
    }
    if (tokens.tokens.colors.secondary) {
      config.theme.extend.colors.secondary = tokens.tokens.colors.secondary;
    }
    if (tokens.tokens.colors.neutral?.length) {
      config.theme.extend.colors.neutral = {};
      tokens.tokens.colors.neutral.forEach((color, i) => {
        config.theme.extend.colors.neutral[(i + 1) * 100] = color;
      });
    }
  }

  // Spacing
  if (tokens.tokens?.spacing?.scale) {
    const names = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];
    tokens.tokens.spacing.scale.forEach((space, i) => {
      config.theme.extend.spacing[names[i] || i] = space;
    });
  }

  // Typography
  if (tokens.tokens?.typography?.scale) {
    const names = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'];
    tokens.tokens.typography.scale.forEach((size, i) => {
      config.theme.extend.fontSize[names[i] || i] = size;
    });
  }

  // Border radius
  if (tokens.tokens?.surfaces?.radius) {
    const names = ['sm', 'DEFAULT', 'md', 'lg', 'xl'];
    tokens.tokens.surfaces.radius.forEach((radius, i) => {
      config.theme.extend.borderRadius[names[i] || i] = radius;
    });
  }

  // Shadows
  if (tokens.tokens?.surfaces?.shadows) {
    const names = ['sm', 'DEFAULT', 'md', 'lg', 'xl'];
    tokens.tokens.surfaces.shadows.forEach((shadow, i) => {
      config.theme.extend.boxShadow[names[i] || i] = shadow;
    });
  }

  let output = '// Tailwind Config - Extracted by claude-frontforge\n';
  output += `// Source: ${tokens.metadata?.url || 'unknown'}\n\n`;
  output += 'module.exports = ' + JSON.stringify(config, null, 2) + ';\n';

  return output;
}

/**
 * Generate Figma tokens format
 */
function generateFigmaOutput(tokens) {
  const figmaTokens = {
    color: {},
    spacing: {},
    typography: {},
    borderRadius: {},
    boxShadow: {}
  };

  // Colors
  if (tokens.tokens?.colors) {
    figmaTokens.color = {
      primary: {
        value: tokens.tokens.colors.primary,
        type: 'color'
      },
      secondary: {
        value: tokens.tokens.colors.secondary,
        type: 'color'
      }
    };

    if (tokens.tokens.colors.neutral) {
      figmaTokens.color.neutral = {};
      tokens.tokens.colors.neutral.forEach((color, i) => {
        figmaTokens.color.neutral[(i + 1) * 100] = {
          value: color,
          type: 'color'
        };
      });
    }

    if (tokens.tokens.colors.semantic) {
      figmaTokens.color.semantic = {};
      for (const [key, value] of Object.entries(tokens.tokens.colors.semantic)) {
        if (value) {
          figmaTokens.color.semantic[key] = {
            value: value,
            type: 'color'
          };
        }
      }
    }
  }

  // Spacing
  if (tokens.tokens?.spacing?.scale) {
    const names = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];
    tokens.tokens.spacing.scale.forEach((space, i) => {
      figmaTokens.spacing[names[i] || i] = {
        value: space,
        type: 'spacing'
      };
    });
  }

  // Typography
  if (tokens.tokens?.typography?.scale) {
    const names = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'];
    tokens.tokens.typography.scale.forEach((size, i) => {
      figmaTokens.typography[names[i] || i] = {
        value: {
          fontSize: size,
          fontFamily: tokens.tokens.typography.families?.primary || 'Inter'
        },
        type: 'typography'
      };
    });
  }

  // Border radius
  if (tokens.tokens?.surfaces?.radius) {
    const names = ['sm', 'md', 'lg', 'xl'];
    tokens.tokens.surfaces.radius.forEach((radius, i) => {
      figmaTokens.borderRadius[names[i] || i] = {
        value: radius,
        type: 'borderRadius'
      };
    });
  }

  // Shadows
  if (tokens.tokens?.surfaces?.shadows) {
    const names = ['sm', 'md', 'lg', 'xl'];
    tokens.tokens.surfaces.shadows.forEach((shadow, i) => {
      figmaTokens.boxShadow[names[i] || i] = {
        value: shadow,
        type: 'boxShadow'
      };
    });
  }

  let output = '// Figma Tokens - Extracted by claude-frontforge\n';
  output += `// Source: ${tokens.metadata?.url || 'unknown'}\n`;
  output += '// Compatible with Figma Tokens plugin\n\n';
  output += JSON.stringify(figmaTokens, null, 2) + '\n';

  return output;
}

/**
 * Compare multiple websites
 */
function generateComparison(analyses) {
  let markdown = '# Design System Comparison\n\n';
  markdown += `Analyzed ${analyses.length} websites\n\n`;

  markdown += '| Aspect | ' + analyses.map(a => a.metadata?.url || 'Unknown').join(' | ') + ' |\n';
  markdown += '|--------|' + analyses.map(() => '--------').join('|') + '|\n';

  // Direction
  markdown += '| **Direction** | ' + analyses.map(a => a.suggestedDirection || 'Unknown').join(' | ') + ' |\n';

  // Spacing base
  markdown += '| **Spacing Base** | ' + analyses.map(a => a.tokens?.spacing?.base || 'Unknown').join(' | ') + ' |\n';

  // Depth strategy
  markdown += '| **Depth** | ' + analyses.map(a => a.tokens?.surfaces?.depthStrategy || 'Unknown').join(' | ') + ' |\n';

  // Primary color
  markdown += '| **Primary Color** | ' + analyses.map(a => a.tokens?.colors?.primary || 'Unknown').join(' | ') + ' |\n';

  // Typography
  markdown += '| **Font Family** | ' + analyses.map(a => a.tokens?.typography?.families?.primary || 'Unknown').join(' | ') + ' |\n';

  // Confidence
  markdown += '| **Confidence** | ' + analyses.map(a => a.metadata?.overallConfidence || 'Unknown').join(' | ') + ' |\n';

  return markdown;
}

/**
 * Main function
 */
async function analyzeWebsite(urls, options = {}) {
  const format = options.format || 'json';
  const focus = options.focus || 'all';
  const compare = options.compare || false;

  console.error('🔍 Website Design Analysis Tool\n');
  console.error('Note: This tool provides a structured template for vision-based analysis.');
  console.error('For full extraction, use with Playwright MCP or similar vision tools.\n');

  if (!urls || urls.length === 0) {
    console.error('⚠️  No URLs provided. Usage:');
    console.error('   node analyze-website.js <url> [--format=json|css|tailwind|figma] [--focus=all|colors|typography|spacing]');
    console.error('   node analyze-website.js <url1> <url2> --compare');
    return null;
  }

  const analyses = [];

  for (const url of urls) {
    console.error(`📊 Generating analysis template for: ${url}`);

    const report = generateAnalysisReport(url, { focus });

    // Calculate overall confidence (placeholder until vision analysis)
    report.metadata.overallConfidence = 'Requires vision analysis';

    analyses.push(report);
  }

  let output;

  if (compare && analyses.length > 1) {
    output = generateComparison(analyses);
  } else {
    output = formatOutput(analyses[0], format);
  }

  console.log(output);

  console.error('\n📋 Analysis template generated.');
  console.error('💡 Tip: For actual token extraction, analyze the website visually and fill in the values.');

  return analyses;
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);

  // Parse arguments
  const urls = [];
  const options = {};

  for (const arg of args) {
    if (arg.startsWith('--format=')) {
      options.format = arg.split('=')[1];
    } else if (arg.startsWith('--focus=')) {
      options.focus = arg.split('=')[1];
    } else if (arg === '--compare') {
      options.compare = true;
    } else if (!arg.startsWith('--')) {
      urls.push(arg);
    }
  }

  analyzeWebsite(urls, options);
}

module.exports = {
  analyzeWebsite,
  generateAnalysisReport,
  formatOutput,
  detectDirection,
  calculateConfidence
};
