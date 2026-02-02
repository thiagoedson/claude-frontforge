#!/usr/bin/env node

/**
 * Testes para o módulo de cache
 * Execute com: node hooks/__tests__/cache.test.js
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Importa módulo de cache
const {
  hashFile,
  hashFiles,
  loadCache,
  saveCache,
  checkCache,
  updateCache,
  clearCache,
  cacheStats
} = require('../cache');

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

// Setup: criar diretório temporário para testes
const testDir = path.join(os.tmpdir(), `frontforge-test-${Date.now()}`);
const testFile = path.join(testDir, 'test.txt');

function setup() {
  fs.mkdirSync(testDir, { recursive: true });
  fs.writeFileSync(testFile, 'test content');
}

function cleanup() {
  try {
    fs.rmSync(testDir, { recursive: true, force: true });
  } catch (e) {
    // Ignore cleanup errors
  }
}

// Testes
console.log('🧪 Executando testes do sistema de cache...\n');

setup();

test('hashFile: deve gerar hash MD5 de arquivo', () => {
  const hash = hashFile(testFile);
  assert(hash !== null, 'Hash não deve ser null');
  assertEqual(hash.length, 32, 'Hash MD5 deve ter 32 caracteres');
});

test('hashFile: deve retornar null para arquivo inexistente', () => {
  const hash = hashFile('/arquivo/que/nao/existe.txt');
  assertEqual(hash, null, 'Deve retornar null para arquivo inexistente');
});

test('hashFiles: deve gerar hash combinado de múltiplos arquivos', () => {
  const file2 = path.join(testDir, 'test2.txt');
  fs.writeFileSync(file2, 'another content');

  const hash = hashFiles([testFile, file2]);
  assert(hash !== null, 'Hash combinado não deve ser null');
  assertEqual(hash.length, 32, 'Hash combinado deve ter 32 caracteres');
});

test('loadCache: deve retornar cache vazio para projeto novo', () => {
  const cache = loadCache(testDir);
  assert(cache.version, 'Cache deve ter versão');
  assert(cache.entries, 'Cache deve ter entries');
  assertEqual(Object.keys(cache.entries).length, 0, 'Cache inicial deve estar vazio');
});

test('saveCache: deve salvar cache no disco', () => {
  const cache = { version: '1.0.0', entries: { test: { data: 'value' } } };
  const result = saveCache(cache, testDir);
  assertEqual(result, true, 'saveCache deve retornar true');

  const cachePath = path.join(testDir, '.frontforge', 'cache.json');
  assert(fs.existsSync(cachePath), 'Arquivo de cache deve existir');
});

test('checkCache: deve retornar invalid para cache inexistente', () => {
  const newDir = path.join(testDir, 'new-project');
  fs.mkdirSync(newDir, { recursive: true });

  const result = checkCache('test-op', [testFile], newDir);
  assertEqual(result.valid, false, 'Cache deve ser inválido');
  assert(result.hash, 'Deve retornar hash para uso posterior');
});

test('updateCache e checkCache: deve armazenar e recuperar dados', () => {
  const operation = 'test-operation';
  const testData = { tokens: ['a', 'b', 'c'], count: 3 };

  // Primeiro check para obter hash
  const initial = checkCache(operation, [testFile], testDir);
  assertEqual(initial.valid, false, 'Cache inicial deve ser inválido');

  // Atualiza cache
  updateCache(operation, initial.hash, testData, testDir);

  // Verifica se cache é válido agora
  const cached = checkCache(operation, [testFile], testDir);
  assertEqual(cached.valid, true, 'Cache deve ser válido após update');
  assertEqual(cached.data.count, 3, 'Dados devem ser recuperados corretamente');
});

test('checkCache: deve invalidar quando arquivo muda', () => {
  const operation = 'change-test';
  const changeFile = path.join(testDir, 'changeable.txt');
  fs.writeFileSync(changeFile, 'original');

  // Cache inicial
  const initial = checkCache(operation, [changeFile], testDir);
  updateCache(operation, initial.hash, { value: 'cached' }, testDir);

  // Verifica cache válido
  let cached = checkCache(operation, [changeFile], testDir);
  assertEqual(cached.valid, true, 'Cache deve ser válido inicialmente');

  // Modifica arquivo
  fs.writeFileSync(changeFile, 'modified');

  // Cache deve ser inválido
  cached = checkCache(operation, [changeFile], testDir);
  assertEqual(cached.valid, false, 'Cache deve ser inválido após modificação');
});

test('clearCache: deve limpar cache', () => {
  // Garante que há cache
  saveCache({ version: '1.0.0', entries: { x: 1 } }, testDir);

  clearCache(testDir);

  const cachePath = path.join(testDir, '.frontforge', 'cache.json');
  assertEqual(fs.existsSync(cachePath), false, 'Arquivo de cache não deve existir após clear');
});

test('cacheStats: deve retornar estatísticas', () => {
  saveCache({
    version: '1.0.0',
    entries: { op1: {}, op2: {} },
    updatedAt: new Date().toISOString()
  }, testDir);

  const stats = cacheStats(testDir);
  assertEqual(stats.entries, 2, 'Deve ter 2 entradas');
  assert(stats.operations.includes('op1'), 'Deve listar operação op1');
});

// Cleanup
cleanup();

// Resultado
console.log(`\n📊 Resultado: ${passed} passou, ${failed} falhou`);
process.exit(failed > 0 ? 1 : 0);
