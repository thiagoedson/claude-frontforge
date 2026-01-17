#!/usr/bin/env node

/**
 * Script de Verificação da Instalação do Claude Frontforge
 * Verifica se todos os arquivos necessários estão presentes
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_FILES = [
  // Configuração do plugin
  '.claude-plugin/plugin.json',
  '.claude-plugin/marketplace.json',

  // Comandos
  '.claude/commands/init.md',
  '.claude/commands/status.md',
  '.claude/commands/audit.md',
  '.claude/commands/extract.md',
  '.claude/commands/generate-tokens.md',
  '.claude/commands/metrics.md',

  // Skill principal
  '.claude/skills/claude-frontforge/SKILL.md',
  '.claude/skills/claude-frontforge/references/directions.md',
  '.claude/skills/claude-frontforge/references/principles.md',
  '.claude/skills/claude-frontforge/references/validation.md',

  // Hooks
  'hooks/hooks.json',
  'hooks/validate-frontforge.js',
  'hooks/validate-a11y.js',
  'hooks/detect-context.js',
  'hooks/generate-tokens.js',
  'hooks/extract-components.js',
  'hooks/metrics-dashboard.js',

  // Documentação
  'README.md',
  'LICENSE',
  'package.json',
  '.gitignore'
];

const OPTIONAL_FILES = [
  'INSTALLATION.md',
  'CHANGELOG.md',
  'CONTRIBUTING.md',
  'reference/examples/system-precision.md',
  'reference/examples/system-warmth.md',
  'reference/system-template.md'
];

console.log('🔍 Verificando instalação do Claude Frontforge...\n');

let missingRequired = [];
let missingOptional = [];
let foundFiles = 0;

// Verifica arquivos obrigatórios
console.log('📋 Arquivos obrigatórios:');
REQUIRED_FILES.forEach(file => {
  const exists = fs.existsSync(file);
  if (exists) {
    console.log(`  ✅ ${file}`);
    foundFiles++;
  } else {
    console.log(`  ❌ ${file} - FALTANDO`);
    missingRequired.push(file);
  }
});

console.log('\n📋 Arquivos opcionais:');
OPTIONAL_FILES.forEach(file => {
  const exists = fs.existsSync(file);
  if (exists) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ⚠️  ${file} - Recomendado`);
    missingOptional.push(file);
  }
});

// Verifica versões
console.log('\n📦 Verificando consistência de versões...');
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  const plugin = JSON.parse(fs.readFileSync('.claude-plugin/plugin.json', 'utf-8'));
  const marketplace = JSON.parse(fs.readFileSync('.claude-plugin/marketplace.json', 'utf-8'));

  const pkgVersion = pkg.version;
  const pluginVersion = plugin.version;
  const marketplaceVersion = marketplace.plugins[0].version;

  if (pkgVersion === pluginVersion && pluginVersion === marketplaceVersion) {
    console.log(`  ✅ Versões consistentes: ${pkgVersion}`);
  } else {
    console.log(`  ⚠️  Versões inconsistentes:`);
    console.log(`     package.json: ${pkgVersion}`);
    console.log(`     plugin.json: ${pluginVersion}`);
    console.log(`     marketplace.json: ${marketplaceVersion}`);
  }
} catch (error) {
  console.log(`  ❌ Erro ao verificar versões: ${error.message}`);
}

// Verifica permissões (Unix)
if (process.platform !== 'win32') {
  console.log('\n🔐 Verificando permissões de execução...');
  const scriptsToCheck = [
    'hooks/validate-frontforge.js',
    'hooks/validate-a11y.js',
    'hooks/detect-context.js',
    'hooks/generate-tokens.js',
    'hooks/extract-components.js',
    'hooks/metrics-dashboard.js'
  ];

  scriptsToCheck.forEach(script => {
    try {
      const stats = fs.statSync(script);
      const isExecutable = (stats.mode & 0o111) !== 0;
      if (isExecutable) {
        console.log(`  ✅ ${script} é executável`);
      } else {
        console.log(`  ⚠️  ${script} não é executável - execute: chmod +x ${script}`);
      }
    } catch (error) {
      console.log(`  ❌ ${script} - Erro ao verificar: ${error.message}`);
    }
  });
}

// Resumo
console.log('\n' + '='.repeat(60));
console.log('📊 RESUMO DA VERIFICAÇÃO');
console.log('='.repeat(60));

const totalRequired = REQUIRED_FILES.length;
const foundRequired = totalRequired - missingRequired.length;
const percentage = Math.round((foundRequired / totalRequired) * 100);

console.log(`\n✅ Arquivos obrigatórios: ${foundRequired}/${totalRequired} (${percentage}%)`);

if (missingRequired.length > 0) {
  console.log('\n❌ ARQUIVOS FALTANDO (obrigatórios):');
  missingRequired.forEach(file => console.log(`   - ${file}`));
}

if (missingOptional.length > 0) {
  console.log('\n⚠️  ARQUIVOS RECOMENDADOS:');
  missingOptional.forEach(file => console.log(`   - ${file}`));
}

if (missingRequired.length === 0) {
  console.log('\n🎉 Instalação verificada com sucesso!');
  console.log('\n📚 Próximos passos:');
  console.log('   1. Faça commit das alterações: git add . && git commit -m "Setup complete"');
  console.log('   2. Crie uma tag: git tag -a v2026.1.16.1543 -m "Initial release"');
  console.log('   3. Push: git push origin main --tags');
  console.log('   4. Crie um GitHub Release');
  console.log('   5. Usuários podem instalar: /plugin marketplace add thiagoedson/claude-frontforge');
  console.log('\n📖 Veja INSTALLATION.md para mais detalhes');
} else {
  console.log('\n⚠️  Por favor, corrija os arquivos faltando antes de publicar.');
  process.exit(1);
}

console.log('\n' + '='.repeat(60) + '\n');
