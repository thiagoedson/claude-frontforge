#!/usr/bin/env node
/**
 * Claude Frontforge: Post-write validation with autofix
 *
 * Validates UI code and outputs relevant principles when violations found.
 * Supports --fix flag to automatically correct issues.
 */

const fs = require('fs');
const path = require('path');
const { validateAccessibility, formatA11yReport } = require('./validate-a11y');

const UI_EXTENSIONS = ['.tsx', '.jsx', '.vue', '.svelte', '.css', '.scss'];

// Principles with guidance
const PRINCIPLES = {
  spacing: {
    name: 'Spacing Grid',
    guidance: 'Pick a base unit (4px is common) and stick to multiples. Random values signal no system.'
  },
  depth: {
    name: 'Depth Strategy',
    guidance: 'Choose ONE approach: borders-only, subtle shadows, or layered shadows. Don\'t mix.'
  },
  animation: {
    name: 'Animation',
    guidance: 'Fast micro-interactions (≤400ms), smooth easing. No bouncy/spring effects in professional UI.'
  },
  typography: {
    name: 'Typography Scale',
    guidance: 'Use a consistent type scale. Common sizes: 12, 14, 16, 18, 20, 24, 32, 48px.'
  },
  zindex: {
    name: 'Z-Index Strategy',
    guidance: 'Use defined z-index layers: base(0), dropdown(10), sticky(20), modal(30), toast(40), tooltip(50).'
  },
  breakpoints: {
    name: 'Breakpoints',
    guidance: 'Use standard breakpoints: sm(640), md(768), lg(1024), xl(1280), 2xl(1536)px.'
  }
};

// Standard values for validation
const STANDARD_BREAKPOINTS = [640, 768, 1024, 1280, 1536];
const STANDARD_ZINDEX = [0, 1, 10, 20, 30, 40, 50, 100, 999, 9999];
const COMMON_FONT_SIZES = [10, 11, 12, 13, 14, 15, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72];

function parseSystemFile(systemPath) {
  if (!fs.existsSync(systemPath)) return null;

  const content = fs.readFileSync(systemPath, 'utf-8');
  const system = {
    depth: null,
    spacingBase: null,
    colors: [],
    fontSizes: [],
    breakpoints: [],
    zindexScale: []
  };

  // Depth strategy
  if (content.match(/depth:\s*borders?-only/i)) {
    system.depth = 'borders-only';
  } else if (content.match(/depth:\s*subtle/i)) {
    system.depth = 'subtle-shadows';
  } else if (content.match(/depth:\s*layered/i)) {
    system.depth = 'layered-shadows';
  }

  // Spacing base
  const spacingBaseMatch = content.match(/(?:spacing\s+)?base:\s*(\d+)px/i);
  if (spacingBaseMatch) {
    system.spacingBase = parseInt(spacingBaseMatch[1]);
  }

  // Colors
  const tokensSection = content.match(/### Colors[\s\S]*?(?=###|## |$)/i);
  if (tokensSection) {
    const hexMatches = tokensSection[0].match(/#[0-9a-fA-F]{6}/g) || [];
    system.colors = [...new Set(hexMatches.map(c => c.toLowerCase()))];
  }

  // Font sizes
  const fontSection = content.match(/### (?:Typography|Font|Type)[\s\S]*?(?=###|## |$)/i);
  if (fontSection) {
    const fontMatches = fontSection[0].match(/(\d+)px/g) || [];
    system.fontSizes = [...new Set(fontMatches.map(f => parseInt(f)))];
  }

  // Breakpoints
  const bpSection = content.match(/### (?:Breakpoints|Responsive)[\s\S]*?(?=###|## |$)/i);
  if (bpSection) {
    const bpMatches = bpSection[0].match(/(\d{3,4})px/g) || [];
    system.breakpoints = [...new Set(bpMatches.map(b => parseInt(b)))];
  }

  // Z-index scale
  const zSection = content.match(/### (?:Z-Index|Layers)[\s\S]*?(?=###|## |$)/i);
  if (zSection) {
    const zMatches = zSection[0].match(/z-index:\s*(\d+)/gi) || [];
    system.zindexScale = [...new Set(zMatches.map(z => parseInt(z.match(/\d+/)[0])))];
  }

  return system;
}

function validateContent(content, system) {
  const violations = [];

  // 1. Animation validation (always)
  if (/cubic-bezier\s*\([^)]*[2-9][\d.]*\s*\)/g.test(content) ||
      /transition.*\b(bounce|spring|elastic)\b/gi.test(content)) {
    violations.push({
      type: 'animation',
      message: 'Bouncy/spring animation detected',
      principle: PRINCIPLES.animation
    });
  }

  // Check for slow animations (>400ms)
  // Matches: "transition: all 500ms", "duration: 600ms", "animation-duration: 1000ms"
  const durationMatches = content.matchAll(/(?:transition|duration|animation)[^;]*?(\d+)ms/gi);
  const slowAnimations = [];
  for (const match of durationMatches) {
    const duration = parseInt(match[1]);
    if (duration > 400) {
      slowAnimations.push(duration);
    }
  }
  if (slowAnimations.length > 0) {
    violations.push({
      type: 'animation',
      message: `Slow animations detected (>400ms): ${[...new Set(slowAnimations)].join(', ')}ms`,
      principle: PRINCIPLES.animation,
      fixable: true,
      values: slowAnimations
    });
  }

  // 2. Depth consistency
  if (system?.depth === 'borders-only') {
    if (content.includes('box-shadow') && !content.includes('box-shadow: none')) {
      const shadowMatch = content.match(/box-shadow:\s*([^;]+)/g) || [];
      for (const shadow of shadowMatch) {
        if (!shadow.includes('0 0 0') && !shadow.includes('inset') && !shadow.includes('none')) {
          violations.push({
            type: 'depth',
            message: 'Shadow used but system specifies borders-only',
            principle: PRINCIPLES.depth
          });
          break;
        }
      }
    }

    if (/\bshadow-(sm|md|lg|xl|2xl)\b/.test(content)) {
      violations.push({
        type: 'depth',
        message: 'Tailwind shadow class used but system is borders-only',
        principle: PRINCIPLES.depth
      });
    }
  }

  // 3. Spacing grid
  if (system?.spacingBase) {
    const pxMatches = content.matchAll(/[:\s](\d+)px/g);
    const offGrid = new Map(); // value -> closest valid
    for (const match of pxMatches) {
      const value = parseInt(match[1]);
      // Skip small values and common non-spacing values
      if (value > 2 && value < 200 && value % system.spacingBase !== 0) {
        const closest = Math.round(value / system.spacingBase) * system.spacingBase;
        offGrid.set(value, closest);
      }
    }
    if (offGrid.size > 0) {
      violations.push({
        type: 'spacing',
        message: `Values off ${system.spacingBase}px grid: ${[...offGrid.keys()].join(', ')}px`,
        principle: PRINCIPLES.spacing,
        fixable: true,
        fixes: offGrid
      });
    }
  }

  // 4. Colors
  if (system?.colors.length > 0) {
    const contentColors = content.match(/#[0-9a-fA-F]{6}/gi) || [];
    const unknown = new Set();
    for (const color of contentColors) {
      if (!system.colors.includes(color.toLowerCase())) {
        unknown.add(color);
      }
    }
    if (unknown.size > 0) {
      violations.push({
        type: 'color',
        message: `Colors not in system palette: ${[...unknown].join(', ')}`,
        fixable: false
      });
    }
  }

  // 5. Typography scale validation
  const fontSizeMatches = content.matchAll(/font-size:\s*(\d+)px/gi);
  const invalidFontSizes = new Map();
  const validSizes = system?.fontSizes.length > 0 ? system.fontSizes : COMMON_FONT_SIZES;

  for (const match of fontSizeMatches) {
    const size = parseInt(match[1]);
    if (!validSizes.includes(size)) {
      // Find closest valid size
      const closest = validSizes.reduce((prev, curr) =>
        Math.abs(curr - size) < Math.abs(prev - size) ? curr : prev
      );
      invalidFontSizes.set(size, closest);
    }
  }

  if (invalidFontSizes.size > 0) {
    violations.push({
      type: 'typography',
      message: `Font sizes off scale: ${[...invalidFontSizes.keys()].join(', ')}px`,
      principle: PRINCIPLES.typography,
      fixable: true,
      fixes: invalidFontSizes
    });
  }

  // 6. Z-index validation
  const zindexMatches = content.matchAll(/z-index:\s*(\d+)/gi);
  const invalidZindex = new Map();
  const validZindex = system?.zindexScale.length > 0 ? system.zindexScale : STANDARD_ZINDEX;

  for (const match of zindexMatches) {
    const z = parseInt(match[1]);
    if (!validZindex.includes(z) && z > 1) {
      // Find closest valid z-index
      const closest = validZindex.reduce((prev, curr) =>
        Math.abs(curr - z) < Math.abs(prev - z) ? curr : prev
      );
      invalidZindex.set(z, closest);
    }
  }

  if (invalidZindex.size > 0) {
    violations.push({
      type: 'zindex',
      message: `Non-standard z-index values: ${[...invalidZindex.keys()].join(', ')}`,
      principle: PRINCIPLES.zindex,
      fixable: true,
      fixes: invalidZindex
    });
  }

  // 7. Breakpoint validation
  const mediaMatches = content.matchAll(/@media[^{]*\((?:min|max)-width:\s*(\d+)px\)/gi);
  const invalidBreakpoints = new Map();
  const validBp = system?.breakpoints.length > 0 ? system.breakpoints : STANDARD_BREAKPOINTS;

  for (const match of mediaMatches) {
    const bp = parseInt(match[1]);
    if (!validBp.includes(bp)) {
      const closest = validBp.reduce((prev, curr) =>
        Math.abs(curr - bp) < Math.abs(prev - bp) ? curr : prev
      );
      invalidBreakpoints.set(bp, closest);
    }
  }

  if (invalidBreakpoints.size > 0) {
    violations.push({
      type: 'breakpoints',
      message: `Non-standard breakpoints: ${[...invalidBreakpoints.keys()].join(', ')}px`,
      principle: PRINCIPLES.breakpoints,
      fixable: true,
      fixes: invalidBreakpoints
    });
  }

  return violations;
}

/**
 * Applies automatic fixes to content
 */
function applyFixes(content, violations, system) {
  let fixed = content;
  let fixCount = 0;

  for (const v of violations) {
    if (!v.fixable) continue;

    if (v.type === 'spacing' && v.fixes) {
      for (const [original, replacement] of v.fixes) {
        const regex = new RegExp(`([:;\\s])(${original})px`, 'g');
        const newContent = fixed.replace(regex, `$1${replacement}px`);
        if (newContent !== fixed) {
          fixed = newContent;
          fixCount++;
        }
      }
    }

    if (v.type === 'typography' && v.fixes) {
      for (const [original, replacement] of v.fixes) {
        const regex = new RegExp(`font-size:\\s*${original}px`, 'gi');
        const newContent = fixed.replace(regex, `font-size: ${replacement}px`);
        if (newContent !== fixed) {
          fixed = newContent;
          fixCount++;
        }
      }
    }

    if (v.type === 'zindex' && v.fixes) {
      for (const [original, replacement] of v.fixes) {
        const regex = new RegExp(`z-index:\\s*${original}([;\\s])`, 'gi');
        const newContent = fixed.replace(regex, `z-index: ${replacement}$1`);
        if (newContent !== fixed) {
          fixed = newContent;
          fixCount++;
        }
      }
    }

    if (v.type === 'breakpoints' && v.fixes) {
      for (const [original, replacement] of v.fixes) {
        // Match "min-width: 700px" or "max-width: 700px" with optional spaces
        const regex = new RegExp(`((?:min|max)-width\\s*:\\s*)${original}px`, 'gi');
        const newContent = fixed.replace(regex, `$1${replacement}px`);
        if (newContent !== fixed) {
          fixed = newContent;
          fixCount++;
        }
      }
    }

    if (v.type === 'animation' && v.values) {
      for (const duration of v.values) {
        // Replace slow animations with 300ms
        // Matches: "transition: all 500ms" or "duration: 500ms"
        const regex = new RegExp(`(\\b${duration})ms`, 'g');
        const newContent = fixed.replace(regex, '300ms');
        if (newContent !== fixed) {
          fixed = newContent;
          fixCount++;
        }
      }
    }
  }

  return { content: fixed, fixCount };
}

async function main() {
  const args = process.argv.slice(2);
  const shouldFix = args.includes('--fix');

  let input = '';
  for await (const chunk of process.stdin) {
    input += chunk;
  }

  let targetFile;
  try {
    const hookData = JSON.parse(input);
    targetFile = hookData.tool_input?.file_path;
  } catch {
    // If not hook input, check if file path passed as argument
    targetFile = args.find(a => !a.startsWith('--'));
    if (!targetFile) process.exit(0);
  }

  if (!targetFile) process.exit(0);

  const ext = path.extname(targetFile);
  if (!UI_EXTENSIONS.includes(ext)) process.exit(0);

  if (!fs.existsSync(targetFile)) process.exit(0);

  const content = fs.readFileSync(targetFile, 'utf-8');
  const cwd = process.cwd();
  const systemPath = path.join(cwd, '.frontforge', 'system.md');
  const system = parseSystemFile(systemPath);

  const violations = validateContent(content, system);

  // Apply fixes if --fix flag is set
  if (shouldFix && violations.some(v => v.fixable)) {
    const { content: fixedContent, fixCount } = applyFixes(content, violations, system);

    if (fixCount > 0) {
      fs.writeFileSync(targetFile, fixedContent);
      console.error(`\n✅ AUTOFIX: Applied ${fixCount} fixes to ${path.basename(targetFile)}\n`);

      // Re-validate to show remaining issues
      const remainingViolations = validateContent(fixedContent, system);
      if (remainingViolations.length === 0) {
        console.error('All fixable issues resolved!\n');
        process.exit(0);
      }
      // Continue to report remaining unfixable issues
    }
  }

  // Accessibility validation
  const a11yResult = validateAccessibility(content, targetFile);
  const hasA11yErrors = a11yResult.stats.errors > 0;

  // Report design system violations
  if (violations.length > 0) {
    console.error('\n=== FRONTFORGE VALIDATION ===\n');

    for (const v of violations) {
      const fixableTag = v.fixable ? ' [FIXABLE]' : '';
      console.error(`[${v.type.toUpperCase()}]${fixableTag} ${v.message}`);
      if (v.principle) {
        console.error(`  → ${v.principle.guidance}`);
      }
      if (v.fixes && v.fixes instanceof Map) {
        const suggestions = [...v.fixes.entries()].slice(0, 3)
          .map(([from, to]) => `${from} → ${to}`).join(', ');
        console.error(`  Suggestions: ${suggestions}${v.fixes.size > 3 ? '...' : ''}`);
      }
      console.error('');
    }

    const fixableCount = violations.filter(v => v.fixable).length;
    if (fixableCount > 0 && !shouldFix) {
      console.error(`💡 Run with --fix to auto-correct ${fixableCount} issue(s)\n`);
    }

    console.error('=========================\n');
  }

  // Report accessibility violations
  if (a11yResult.violations.length > 0) {
    console.error('\n=== ACCESSIBILITY (A11Y) ===');
    console.error(formatA11yReport(a11yResult));
    console.error('=========================\n');
  }

  // Exit codes
  if (violations.length > 0 || hasA11yErrors) {
    process.exit(2);
  }

  if (a11yResult.stats.warnings > 0) {
    console.error('⚠️  Accessibility warnings found (non-blocking)\n');
  }

  process.exit(0);
}

// Export for testing
module.exports = {
  parseSystemFile,
  validateContent,
  applyFixes,
  PRINCIPLES,
  STANDARD_BREAKPOINTS,
  STANDARD_ZINDEX,
  COMMON_FONT_SIZES
};

// Run if called directly
if (require.main === module) {
  main();
}
