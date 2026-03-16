#!/usr/bin/env node

/**
 * Claude Frontforge - Universal Installer
 * Detecta o ambiente e configura automaticamente para o LLM em uso
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TEMPLATES = {
  copilot: `# Design System Guidelines - Claude Frontforge

You are an expert in frontend design systems following Claude Frontforge principles.

## Core Principles

### Spacing Grid
- Use a 4px base grid for all spacing
- Only use multiples: 4px, 8px, 12px, 16px, 24px, 32px, 48px
- Never use arbitrary values like 5px, 10px, 15px

### Depth Strategy
Choose ONE approach and stick to it:
- **Borders-only**: Use 0.5px borders, no shadows
- **Subtle shadows**: Use light shadows (0 1px 3px rgba(0,0,0,0.08))
- **Layered shadows**: Multiple shadow layers for premium feel

### Animation
- Duration: ~150ms for micro-interactions
- Easing: ease-out or ease-in-out
- NO bouncy/spring effects

### Accessibility (WCAG 2.1)
- Color contrast: minimum 4.5:1
- Touch targets: minimum 44x44px
- All inputs must have labels
- Proper heading hierarchy

## Available Tools

\`\`\`bash
node frontforge/detect-context.js
node frontforge/generate-tokens.js . css
node frontforge/validate-a11y.js <file>
node frontforge/metrics-dashboard.js
\`\`\`
`,

  cursor: `# Claude Frontforge - Design System Rules

## Spacing Grid (CRITICAL)
- Base: 4px
- Allowed: 4, 8, 12, 16, 24, 32, 48px
- FORBIDDEN: Non-multiples of 4

## Depth Strategy
Choose ONE: borders-only, subtle shadows, or layered shadows

## Animation
- Duration: 100-200ms
- Easing: ease-out, ease-in-out
- NEVER: bounce, spring effects

## Accessibility
- Contrast: 4.5:1 minimum
- Touch targets: 44x44px minimum
- Labels required on all inputs

## Commands
node frontforge/detect-context.js
node frontforge/generate-tokens.js . css
node frontforge/validate-a11y.js <file>
node frontforge/metrics-dashboard.js
`,

  aider: `model: gpt-4o
edit-format: whole
show-diffs: true

system-message: |
  You are a design system expert following Claude Frontforge principles.

  Spacing: 4px grid only
  Depth: Choose one strategy
  Animation: 150ms, ease-out
  A11y: WCAG 2.1 AA

  Tools: frontforge/detect-context.js, frontforge/generate-tokens.js, frontforge/validate-a11y.js
`,

  gemini: `You are a design system expert using Claude Frontforge.

SPACING: 4px grid (4, 8, 12, 16, 24, 32, 48px only)
DEPTH: Choose borders, subtle, or layered
ANIMATION: 150ms, ease-out, no bounce
A11Y: 4.5:1 contrast, 44px touch targets

TOOLS:
node frontforge/detect-context.js
node frontforge/generate-tokens.js . css
node frontforge/validate-a11y.js <file>
node frontforge/metrics-dashboard.js
`
};

console.log('🚀 Claude Frontforge - Universal Installer\n');

// Detecta ambiente
function detectEnvironment() {
  const cwd = process.cwd();
  const detections = {
    copilot: false,
    cursor: false,
    aider: false,
    continue: false,
    claude: false
  };

  // GitHub Copilot
  if (fs.existsSync(path.join(cwd, '.github'))) {
    detections.copilot = true;
  }

  // Cursor
  if (fs.existsSync(path.join(cwd, '.cursorrules')) ||
      fs.existsSync(path.join(cwd, '.cursor'))) {
    detections.cursor = true;
  }

  // Aider
  if (fs.existsSync(path.join(cwd, '.aider')) ||
      fs.existsSync(path.join(cwd, '.aider.conf.yml'))) {
    detections.aider = true;
  }

  // Continue
  if (fs.existsSync(path.join(cwd, '.continue'))) {
    detections.continue = true;
  }

  // Claude Code
  if (fs.existsSync(path.join(cwd, '.claude')) ||
      fs.existsSync(path.join(cwd, '.claude-plugin'))) {
    detections.claude = true;
  }

  return detections;
}

// Baixa scripts
function downloadScripts() {
  console.log('📦 Baixando scripts do Claude Frontforge...\n');

  const targetDir = path.join(process.cwd(), 'frontforge');

  // Cria diretório se não existir
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  try {
    // Tenta usar degit (mais rápido)
    console.log('   Usando degit...');
    execSync('npx degit thiagoedson/claude-frontforge/hooks ./frontforge', {
      stdio: 'inherit'
    });
  } catch (error) {
    console.log('   Degit falhou, usando git clone...');

    try {
      // Fallback para git clone
      execSync('git clone --depth 1 https://github.com/thiagoedson/claude-frontforge.git temp', {
        stdio: 'inherit'
      });

      // Copia hooks
      const tempHooks = path.join(process.cwd(), 'temp', 'hooks');
      if (fs.existsSync(tempHooks)) {
        const files = fs.readdirSync(tempHooks);
        files.forEach(file => {
          fs.copyFileSync(
            path.join(tempHooks, file),
            path.join(targetDir, file)
          );
        });
      }

      // Remove temp
      fs.rmSync(path.join(process.cwd(), 'temp'), { recursive: true, force: true });
    } catch (gitError) {
      console.error('❌ Erro ao baixar scripts:', gitError.message);
      console.log('\n💡 Tente manualmente:');
      console.log('   git clone https://github.com/thiagoedson/claude-frontforge.git');
      console.log('   cp -r claude-frontforge/hooks ./frontforge');
      process.exit(1);
    }
  }

  console.log('✅ Scripts baixados em ./frontforge/\n');
}

// Registra hook no .claude/settings.json do projeto (Claude Code)
function registerClaudeHook() {
  const claudeDir = path.join(process.cwd(), '.claude');
  const settingsPath = path.join(claudeDir, 'settings.json');

  if (!fs.existsSync(claudeDir)) {
    fs.mkdirSync(claudeDir, { recursive: true });
  }

  // Lê settings.json existente ou inicia objeto vazio
  let settings = {};
  if (fs.existsSync(settingsPath)) {
    try {
      settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    } catch {
      console.log('   ⚠️  .claude/settings.json inválido, recriando...');
    }
  }

  // Define o hook a ser registrado
  const hookEntry = {
    matcher: 'Write|Edit',
    hooks: [
      {
        type: 'command',
        command: 'node frontforge/validate-frontforge.js',
        timeout: 30
      }
    ]
  };

  // Garante que a estrutura de hooks existe
  if (!settings.hooks) settings.hooks = {};
  if (!settings.hooks.PostToolUse) settings.hooks.PostToolUse = [];

  // Evita duplicar o hook se já estiver registrado
  const alreadyRegistered = settings.hooks.PostToolUse.some(
    entry => entry.hooks && entry.hooks.some(h => h.command && h.command.includes('validate-frontforge'))
  );

  if (alreadyRegistered) {
    console.log('   ℹ️  Hook já registrado em .claude/settings.json');
    return;
  }

  settings.hooks.PostToolUse.push(hookEntry);
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  console.log('✅ Hook registrado em .claude/settings.json');
  console.log('   PostToolUse → validate-frontforge.js roda após cada Write/Edit\n');
}

// Configura para LLM específico
function configureForLLM(llm) {
  console.log(`⚙️  Configurando para ${llm}...\n`);

  switch (llm) {
    case 'claude':
      registerClaudeHook();
      break;

    case 'copilot':
      const githubDir = path.join(process.cwd(), '.github');
      if (!fs.existsSync(githubDir)) {
        fs.mkdirSync(githubDir, { recursive: true });
      }

      const copilotFile = path.join(githubDir, 'copilot-instructions.md');
      fs.writeFileSync(copilotFile, TEMPLATES.copilot);
      console.log(`✅ Criado: .github/copilot-instructions.md`);
      break;

    case 'cursor':
      const cursorFile = path.join(process.cwd(), '.cursorrules');
      fs.writeFileSync(cursorFile, TEMPLATES.cursor);
      console.log(`✅ Criado: .cursorrules`);
      break;

    case 'aider':
      const aiderFile = path.join(process.cwd(), '.aider.conf.yml');
      fs.writeFileSync(aiderFile, TEMPLATES.aider);
      console.log(`✅ Criado: .aider.conf.yml`);
      break;

    case 'gemini':
      const geminiFile = path.join(process.cwd(), 'gemini-instructions.txt');
      fs.writeFileSync(geminiFile, TEMPLATES.gemini);
      console.log(`✅ Criado: gemini-instructions.txt`);
      console.log(`\n   Use com: gemini --instructions gemini-instructions.txt`);
      break;

    default:
      console.log('⚠️  LLM não reconhecido, instruções genéricas criadas');
  }

  console.log('');
}

// Menu interativo
function promptUser() {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('Escolha seu LLM:\n');
  console.log('1) Claude Code');
  console.log('2) GitHub Copilot');
  console.log('3) Cursor');
  console.log('4) Aider');
  console.log('5) Gemini CLI');
  console.log('6) Outro (instruções genéricas)\n');

  readline.question('Sua escolha (1-6): ', (answer) => {
    readline.close();

    const choices = {
      '1': 'claude',
      '2': 'copilot',
      '3': 'cursor',
      '4': 'aider',
      '5': 'gemini',
      '6': 'generic'
    };

    const llm = choices[answer];

    if (!llm) {
      console.log('❌ Opção inválida');
      process.exit(1);
    }

    console.log('');
    downloadScripts();

    if (llm !== 'generic') {
      configureForLLM(llm);
    }

    showNextSteps(llm);
  });
}

function showNextSteps(llm) {
  console.log('═'.repeat(60));
  console.log('🎉 INSTALAÇÃO CONCLUÍDA!\n');
  console.log('📚 Próximos passos:\n');

  console.log('1. Teste os scripts:');
  console.log('   node frontforge/detect-context.js\n');

  console.log('2. Gere tokens de design:');
  console.log('   node frontforge/generate-tokens.js . css > tokens.css\n');

  console.log('3. Veja métricas do projeto:');
  console.log('   node frontforge/metrics-dashboard.js\n');

  if (llm === 'claude') {
    console.log('4. Hook registrado em .claude/settings.json');
    console.log('   validate-frontforge.js roda automaticamente após cada Write/Edit\n');
    console.log('5. Use os comandos do skill:');
    console.log('   /claude-frontforge:init        → inicializa sistema de design');
    console.log('   /claude-frontforge:audit        → verifica violações');
    console.log('   /claude-frontforge:generate-tokens → gera arquivo de tokens\n');
  } else if (llm === 'copilot') {
    console.log('4. As regras já estão em .github/copilot-instructions.md');
    console.log('   Copilot vai seguir automaticamente!\n');
  } else if (llm === 'cursor') {
    console.log('4. As regras já estão em .cursorrules');
    console.log('   Cursor vai seguir automaticamente!\n');
  } else if (llm === 'aider') {
    console.log('4. Execute: aider --config .aider.conf.yml\n');
  } else if (llm === 'gemini') {
    console.log('4. Execute: gemini --instructions gemini-instructions.txt\n');
  }

  console.log('📖 Documentação completa:');
  console.log('   https://github.com/thiagoedson/claude-frontforge/blob/main/USE_WITH_OTHER_LLMS.md\n');
  console.log('═'.repeat(60));
}

// Execução principal
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log('Uso:');
    console.log('  npx claude-frontforge-install       # Instalação interativa');
    console.log('  npx claude-frontforge-install --llm claude');
    console.log('  npx claude-frontforge-install --llm copilot');
    console.log('  npx claude-frontforge-install --llm cursor');
    console.log('  npx claude-frontforge-install --llm aider');
    console.log('  npx claude-frontforge-install --llm gemini');
    process.exit(0);
  }

  const llmIndex = args.indexOf('--llm');
  if (llmIndex !== -1 && args[llmIndex + 1]) {
    const llm = args[llmIndex + 1];
    downloadScripts();
    configureForLLM(llm);
    showNextSteps(llm);
  } else {
    // Detecção automática
    const detected = detectEnvironment();
    const detectedLLMs = Object.entries(detected)
      .filter(([, value]) => value)
      .map(([key]) => key);

    if (detectedLLMs.length === 1) {
      console.log(`✨ Detectado: ${detectedLLMs[0]}\n`);
      downloadScripts();
      if (detectedLLMs[0] !== 'generic') configureForLLM(detectedLLMs[0]);
      showNextSteps(detectedLLMs[0]);
    } else if (detectedLLMs.length > 1) {
      console.log(`✨ Detectados: ${detectedLLMs.join(', ')}\n`);
      promptUser();
    } else {
      // Modo interativo
      promptUser();
    }
  }
}

module.exports = { downloadScripts, configureForLLM };
