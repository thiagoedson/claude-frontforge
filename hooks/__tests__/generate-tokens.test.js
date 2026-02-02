#!/usr/bin/env node

/**
 * Testes para o módulo generate-tokens
 * Execute com: node hooks/__tests__/generate-tokens.test.js
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Importa módulo
const {
  generateCSSTokens,
  generateJSTokens,
  generateTailwindTokens,
  generateFigmaTokens,
  calculateConfidenceScores
} = require('../generate-tokens');

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

function assertContains(str, substring, message) {
  if (!str.includes(substring)) {
    throw new Error(message || `Expected "${str}" to contain "${substring}"`);
  }
}

// Mock tokens para testes
const mockTokens = {
  spacing: {
    base: 4,
    scale: [4, 8, 12, 16, 24, 32, 48],
    detected: ['4px', '8px', '16px', '12px', '24px']
  },
  colors: ['#ffffff', '#000000', '#3b82f6', '#10b981', '#f59e0b'],
  shadows: ['0 1px 3px rgba(0,0,0,0.1)', '0 4px 6px rgba(0,0,0,0.1)'],
  borderRadius: ['4px', '8px', '12px'],
  fontSize: ['12px', '14px', '16px', '18px', '24px']
};

// Testes
console.log('🧪 Executando testes do generate-tokens...\n');

test('generateCSSTokens: deve gerar CSS válido', () => {
  const css = generateCSSTokens(mockTokens);

  assertContains(css, ':root {', 'Deve conter :root');
  assertContains(css, '--spacing-xs: 4px', 'Deve conter spacing-xs');
  assertContains(css, '--spacing-lg: 16px', 'Deve conter spacing-lg (index 3)');
  assertContains(css, '--color-1:', 'Deve conter color-1');
  assertContains(css, '--shadow-sm:', 'Deve conter shadow-sm');
  assertContains(css, '--radius-sm:', 'Deve conter radius-sm');
  assertContains(css, '--font-size-xs:', 'Deve conter font-size-xs');
});

test('generateJSTokens: deve gerar JS válido', () => {
  const js = generateJSTokens(mockTokens);

  assertContains(js, 'export const tokens', 'Deve exportar tokens');
  assertContains(js, '"spacing":', 'Deve conter spacing');
  assertContains(js, '"colors":', 'Deve conter colors');
  assertContains(js, 'export default tokens', 'Deve ter export default');
});

test('generateTailwindTokens: deve gerar config Tailwind válido', () => {
  const tailwind = generateTailwindTokens(mockTokens);

  assertContains(tailwind, 'module.exports', 'Deve ser module.exports');
  assertContains(tailwind, '"theme":', 'Deve conter theme');
  assertContains(tailwind, '"extend":', 'Deve conter extend');
  assertContains(tailwind, '"spacing":', 'Deve conter spacing');
  assertContains(tailwind, '"boxShadow":', 'Deve conter boxShadow');
});

test('generateFigmaTokens: deve gerar tokens Figma válidos', () => {
  const figma = generateFigmaTokens(mockTokens);

  assertContains(figma, '"global":', 'Deve conter global');
  assertContains(figma, '"type": "spacing"', 'Deve ter tipo spacing');
  assertContains(figma, '"type": "color"', 'Deve ter tipo color');
  assertContains(figma, 'tokens.studio', 'Deve mencionar tokens.studio');
});

test('calculateConfidenceScores: deve calcular scores corretamente', () => {
  const scores = calculateConfidenceScores(mockTokens);

  assert(scores.spacing >= 0 && scores.spacing <= 100, 'Spacing score deve estar entre 0-100');
  assert(scores.colors >= 0 && scores.colors <= 100, 'Colors score deve estar entre 0-100');
  assert(scores.shadows >= 0 && scores.shadows <= 100, 'Shadows score deve estar entre 0-100');
  assert(scores.overall >= 0 && scores.overall <= 100, 'Overall score deve estar entre 0-100');
});

test('calculateConfidenceScores: score alto para valores no grid', () => {
  const gridTokens = {
    ...mockTokens,
    spacing: {
      base: 4,
      scale: [4, 8, 12, 16, 24, 32],
      detected: ['4px', '8px', '16px', '24px', '32px'] // Todos múltiplos de 4
    }
  };

  const scores = calculateConfidenceScores(gridTokens);
  assert(scores.spacing >= 80, 'Score deve ser alto quando todos valores estão no grid');
});

test('calculateConfidenceScores: score baixo para valores fora do grid', () => {
  const offGridTokens = {
    ...mockTokens,
    spacing: {
      base: 4,
      scale: [4, 8, 12, 16, 24, 32],
      detected: ['5px', '7px', '13px', '19px', '23px'] // Nenhum múltiplo de 4
    }
  };

  const scores = calculateConfidenceScores(offGridTokens);
  assert(scores.spacing < 50, 'Score deve ser baixo quando valores estão fora do grid');
});

test('generateCSSTokens: deve lidar com arrays vazios', () => {
  const emptyTokens = {
    spacing: { scale: [] },
    colors: [],
    shadows: [],
    borderRadius: [],
    fontSize: []
  };

  const css = generateCSSTokens(emptyTokens);
  assertContains(css, ':root {', 'Deve gerar CSS mesmo com tokens vazios');
});

// Resultado
console.log(`\n📊 Resultado: ${passed} passou, ${failed} falhou`);
process.exit(failed > 0 ? 1 : 0);
