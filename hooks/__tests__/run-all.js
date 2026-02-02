#!/usr/bin/env node

/**
 * Runner de todos os testes
 * Execute com: npm test ou node hooks/__tests__/run-all.js
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const testsDir = __dirname;
const testFiles = fs.readdirSync(testsDir)
  .filter(f => f.endsWith('.test.js'))
  .map(f => path.join(testsDir, f));

console.log('🚀 Claude Frontforge - Test Runner\n');
console.log('='.repeat(50));

let allPassed = true;

for (const testFile of testFiles) {
  const testName = path.basename(testFile);
  console.log(`\n📋 Running: ${testName}\n`);

  try {
    execSync(`node "${testFile}"`, { stdio: 'inherit' });
  } catch (error) {
    allPassed = false;
  }

  console.log('\n' + '-'.repeat(50));
}

console.log('\n' + '='.repeat(50));
console.log(allPassed ? '\n✅ All tests passed!' : '\n❌ Some tests failed');
process.exit(allPassed ? 0 : 1);
