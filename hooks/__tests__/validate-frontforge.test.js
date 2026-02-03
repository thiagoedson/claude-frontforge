#!/usr/bin/env node

/**
 * Testes para o módulo validate-frontforge
 * Execute com: node hooks/__tests__/validate-frontforge.test.js
 */

const {
  validateContent,
  applyFixes,
  PRINCIPLES,
  STANDARD_BREAKPOINTS,
  STANDARD_ZINDEX,
  COMMON_FONT_SIZES
} = require('../validate-frontforge');

// Test helpers
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.log(`❌ ${name}`);
    console.log(`   ${error.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

function assertIncludes(arr, item, message) {
  if (!arr.some(v => v.type === item)) {
    throw new Error(message || `Expected array to include type "${item}"`);
  }
}

// Mock system
const mockSystem = {
  depth: 'borders-only',
  spacingBase: 4,
  colors: ['#ffffff', '#000000', '#3b82f6'],
  fontSizes: [12, 14, 16, 18, 24, 32],
  breakpoints: [640, 768, 1024, 1280],
  zindexScale: [0, 10, 20, 30, 40, 50]
};

// Testes
console.log('🧪 Executando testes do validate-frontforge...\n');

// === Animation Tests ===

test('detecta animações bounce/spring', () => {
  const content = 'transition: bounce 0.3s ease;';
  const violations = validateContent(content, null);
  assertIncludes(violations, 'animation', 'Deve detectar animation bounce');
});

test('detecta animações lentas (>400ms)', () => {
  const content = 'transition: all 500ms ease;';
  const violations = validateContent(content, null);
  assertIncludes(violations, 'animation', 'Deve detectar animações lentas');
  assert(violations[0].fixable, 'Deve ser fixável');
});

test('não detecta animações dentro do limite', () => {
  const content = 'transition: all 300ms ease;';
  const violations = validateContent(content, null);
  const slowViolations = violations.filter(v => v.type === 'animation' && v.message.includes('Slow'));
  assertEqual(slowViolations.length, 0, 'Não deve detectar animações dentro do limite');
});

// === Spacing Tests ===

test('detecta valores fora do grid de spacing', () => {
  const content = 'padding: 15px; margin: 22px;';
  const violations = validateContent(content, mockSystem);
  assertIncludes(violations, 'spacing', 'Deve detectar spacing off-grid');
  assert(violations.find(v => v.type === 'spacing').fixable, 'Deve ser fixável');
});

test('não detecta valores no grid de spacing', () => {
  const content = 'padding: 16px; margin: 24px;';
  const violations = validateContent(content, mockSystem);
  const spacingViolations = violations.filter(v => v.type === 'spacing');
  assertEqual(spacingViolations.length, 0, 'Não deve detectar valores no grid');
});

// === Depth Tests ===

test('detecta shadows quando sistema é borders-only', () => {
  const content = 'box-shadow: 0 2px 4px rgba(0,0,0,0.1);';
  const violations = validateContent(content, mockSystem);
  assertIncludes(violations, 'depth', 'Deve detectar shadow em sistema borders-only');
});

test('detecta classes Tailwind shadow em borders-only', () => {
  const content = 'className="shadow-md p-4"';
  const violations = validateContent(content, mockSystem);
  assertIncludes(violations, 'depth', 'Deve detectar classe Tailwind shadow');
});

// === Typography Tests ===

test('detecta font-size fora da escala', () => {
  const content = 'font-size: 17px;';
  const violations = validateContent(content, mockSystem);
  assertIncludes(violations, 'typography', 'Deve detectar font-size fora da escala');
  assert(violations.find(v => v.type === 'typography').fixable, 'Deve ser fixável');
});

test('não detecta font-size na escala', () => {
  const content = 'font-size: 16px;';
  const violations = validateContent(content, mockSystem);
  const typographyViolations = violations.filter(v => v.type === 'typography');
  assertEqual(typographyViolations.length, 0, 'Não deve detectar font-size na escala');
});

// === Z-Index Tests ===

test('detecta z-index não padrão', () => {
  const content = 'z-index: 15;';
  const violations = validateContent(content, mockSystem);
  assertIncludes(violations, 'zindex', 'Deve detectar z-index fora do padrão');
  assert(violations.find(v => v.type === 'zindex').fixable, 'Deve ser fixável');
});

test('não detecta z-index padrão', () => {
  const content = 'z-index: 10;';
  const violations = validateContent(content, mockSystem);
  const zindexViolations = violations.filter(v => v.type === 'zindex');
  assertEqual(zindexViolations.length, 0, 'Não deve detectar z-index padrão');
});

// === Breakpoint Tests ===

test('detecta breakpoint não padrão', () => {
  const content = '@media (min-width: 700px) { }';
  const violations = validateContent(content, mockSystem);
  assertIncludes(violations, 'breakpoints', 'Deve detectar breakpoint não padrão');
  assert(violations.find(v => v.type === 'breakpoints').fixable, 'Deve ser fixável');
});

test('não detecta breakpoint padrão', () => {
  const content = '@media (min-width: 768px) { }';
  const violations = validateContent(content, mockSystem);
  const bpViolations = violations.filter(v => v.type === 'breakpoints');
  assertEqual(bpViolations.length, 0, 'Não deve detectar breakpoint padrão');
});

// === Color Tests ===

test('detecta cores fora da paleta', () => {
  const content = 'color: #ff0000;';
  const violations = validateContent(content, mockSystem);
  assertIncludes(violations, 'color', 'Deve detectar cor fora da paleta');
});

test('não detecta cores na paleta', () => {
  const content = 'color: #ffffff;';
  const violations = validateContent(content, mockSystem);
  const colorViolations = violations.filter(v => v.type === 'color');
  assertEqual(colorViolations.length, 0, 'Não deve detectar cor na paleta');
});

// === Autofix Tests ===

test('applyFixes: corrige spacing', () => {
  const content = 'padding: 15px;';
  const violations = validateContent(content, mockSystem);
  const { content: fixed, fixCount } = applyFixes(content, violations, mockSystem);

  assert(fixCount > 0, 'Deve aplicar fix');
  assert(fixed.includes('16px'), 'Deve corrigir para valor no grid');
});

test('applyFixes: corrige typography', () => {
  const content = 'font-size: 17px;';
  const violations = validateContent(content, mockSystem);
  const { content: fixed, fixCount } = applyFixes(content, violations, mockSystem);

  assert(fixCount > 0, 'Deve aplicar fix');
  assert(fixed.includes('16px') || fixed.includes('18px'), 'Deve corrigir para valor na escala');
});

test('applyFixes: corrige z-index', () => {
  const content = 'z-index: 15;';
  const violations = validateContent(content, mockSystem);
  const { content: fixed, fixCount } = applyFixes(content, violations, mockSystem);

  assert(fixCount > 0, 'Deve aplicar fix');
  assert(fixed.includes('z-index: 10') || fixed.includes('z-index: 20'), 'Deve corrigir para valor padrão');
});

test('applyFixes: corrige breakpoints', () => {
  const content = '@media (min-width: 750px) { }';  // 750 is closer to 768
  const violations = validateContent(content, mockSystem);
  const { content: fixed, fixCount } = applyFixes(content, violations, mockSystem);

  assert(fixCount > 0, 'Deve aplicar fix');
  assert(fixed.includes('768px'), 'Deve corrigir para breakpoint padrão');
});

test('applyFixes: corrige animações lentas', () => {
  const content = 'transition: all 500ms ease;';
  const violations = validateContent(content, null);
  const { content: fixed, fixCount } = applyFixes(content, violations, null);

  assert(fixCount > 0, 'Deve aplicar fix');
  assert(fixed.includes('300ms'), 'Deve corrigir para 300ms');
});

test('applyFixes: não altera cores (não fixável)', () => {
  const content = 'color: #ff0000;';
  const violations = validateContent(content, mockSystem);
  const { content: fixed, fixCount } = applyFixes(content, violations, mockSystem);

  assertEqual(fixCount, 0, 'Não deve aplicar fix em cores');
  assert(fixed.includes('#ff0000'), 'Cor não deve ser alterada');
});

// === Constants Tests ===

test('STANDARD_BREAKPOINTS está definido', () => {
  assert(Array.isArray(STANDARD_BREAKPOINTS), 'Deve ser array');
  assert(STANDARD_BREAKPOINTS.includes(768), 'Deve incluir 768');
  assert(STANDARD_BREAKPOINTS.includes(1024), 'Deve incluir 1024');
});

test('STANDARD_ZINDEX está definido', () => {
  assert(Array.isArray(STANDARD_ZINDEX), 'Deve ser array');
  assert(STANDARD_ZINDEX.includes(10), 'Deve incluir 10');
  assert(STANDARD_ZINDEX.includes(50), 'Deve incluir 50');
});

test('COMMON_FONT_SIZES está definido', () => {
  assert(Array.isArray(COMMON_FONT_SIZES), 'Deve ser array');
  assert(COMMON_FONT_SIZES.includes(14), 'Deve incluir 14');
  assert(COMMON_FONT_SIZES.includes(16), 'Deve incluir 16');
});

test('PRINCIPLES tem todas as categorias', () => {
  assert(PRINCIPLES.spacing, 'Deve ter spacing');
  assert(PRINCIPLES.typography, 'Deve ter typography');
  assert(PRINCIPLES.zindex, 'Deve ter zindex');
  assert(PRINCIPLES.breakpoints, 'Deve ter breakpoints');
  assert(PRINCIPLES.animation, 'Deve ter animation');
  assert(PRINCIPLES.depth, 'Deve ter depth');
});

// Resultado
console.log(`\n📊 Resultado: ${passed} passou, ${failed} falhou`);
process.exit(failed > 0 ? 1 : 0);
