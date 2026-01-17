#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Detecção Inteligente de Contexto do Projeto
 * Analisa package.json, README, estrutura de pastas para sugerir direção de design
 */

// Mapeamento de sinais para direções de design
const DIRECTION_SIGNALS = {
  'Precision & Density': {
    keywords: ['dashboard', 'admin', 'crm', 'backoffice', 'management', 'control panel', 'data grid', 'table'],
    dependencies: ['ag-grid', 'react-table', 'material-table', 'antd', 'devextreme'],
    folders: ['admin', 'dashboard', 'backoffice', 'management'],
    score: 0
  },
  'Warmth & Approachability': {
    keywords: ['social', 'community', 'collaboration', 'team', 'chat', 'messaging', 'consumer', 'friendly'],
    dependencies: ['socket.io', 'pusher', 'stream-chat', 'sendbird', 'twilio'],
    folders: ['social', 'community', 'chat', 'messaging'],
    score: 0
  },
  'Sophistication & Trust': {
    keywords: ['fintech', 'banking', 'finance', 'payment', 'crypto', 'trading', 'investment', 'security', 'enterprise'],
    dependencies: ['stripe', 'plaid', 'dwolla', 'web3', 'ethers', 'wagmi'],
    folders: ['finance', 'banking', 'payment', 'trading'],
    score: 0
  },
  'Boldness & Clarity': {
    keywords: ['marketing', 'landing', 'product', 'bold', 'modern', 'startup', 'brand'],
    dependencies: ['framer-motion', 'gsap', 'three', 'react-spring'],
    folders: ['marketing', 'landing', 'product'],
    score: 0
  },
  'Utility & Function': {
    keywords: ['developer', 'tool', 'cli', 'api', 'documentation', 'github', 'code', 'editor', 'terminal'],
    dependencies: ['monaco-editor', 'codemirror', 'prismjs', 'highlight.js', 'xterm'],
    folders: ['docs', 'documentation', 'cli', 'tools'],
    score: 0
  },
  'Data & Analysis': {
    keywords: ['analytics', 'chart', 'graph', 'visualization', 'metrics', 'reporting', 'bi', 'intelligence'],
    dependencies: ['chart.js', 'recharts', 'd3', 'plotly', 'highcharts', 'victory', 'nivo'],
    folders: ['analytics', 'charts', 'reports', 'metrics'],
    score: 0
  }
};

/**
 * Lê e analisa package.json
 */
function analyzePackageJson(projectRoot) {
  const packagePath = path.join(projectRoot, 'package.json');

  if (!fs.existsSync(packagePath)) {
    return { name: '', description: '', dependencies: [], devDependencies: [] };
  }

  try {
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));

    return {
      name: pkg.name || '',
      description: pkg.description || '',
      dependencies: Object.keys(pkg.dependencies || {}),
      devDependencies: Object.keys(pkg.devDependencies || {})
    };
  } catch (error) {
    console.error('Erro ao ler package.json:', error.message);
    return { name: '', description: '', dependencies: [], devDependencies: [] };
  }
}

/**
 * Lê e analisa README.md
 */
function analyzeReadme(projectRoot) {
  const readmePath = path.join(projectRoot, 'README.md');

  if (!fs.existsSync(readmePath)) {
    return '';
  }

  try {
    return fs.readFileSync(readmePath, 'utf-8').toLowerCase();
  } catch (error) {
    console.error('Erro ao ler README.md:', error.message);
    return '';
  }
}

/**
 * Analisa estrutura de pastas do projeto
 */
function analyzeFolderStructure(projectRoot) {
  const folders = [];

  try {
    const srcPath = path.join(projectRoot, 'src');
    if (fs.existsSync(srcPath)) {
      const items = fs.readdirSync(srcPath, { withFileTypes: true });
      items.forEach(item => {
        if (item.isDirectory()) {
          folders.push(item.name.toLowerCase());
        }
      });
    }

    // Também verifica raiz do projeto
    const rootItems = fs.readdirSync(projectRoot, { withFileTypes: true });
    rootItems.forEach(item => {
      if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
        folders.push(item.name.toLowerCase());
      }
    });
  } catch (error) {
    console.error('Erro ao analisar pastas:', error.message);
  }

  return folders;
}

/**
 * Calcula score para cada direção baseado em sinais encontrados
 */
function calculateScores(pkg, readme, folders) {
  const directions = JSON.parse(JSON.stringify(DIRECTION_SIGNALS)); // Clone profundo

  const allText = `${pkg.name} ${pkg.description} ${readme}`.toLowerCase();
  const allDeps = [...pkg.dependencies, ...pkg.devDependencies].map(d => d.toLowerCase());

  // Analisa cada direção
  Object.keys(directions).forEach(directionName => {
    const direction = directions[directionName];

    // Score por keywords no texto
    direction.keywords.forEach(keyword => {
      if (allText.includes(keyword)) {
        direction.score += 3;
      }
    });

    // Score por dependências
    direction.dependencies.forEach(dep => {
      if (allDeps.some(d => d.includes(dep))) {
        direction.score += 5; // Dependências têm peso maior
      }
    });

    // Score por estrutura de pastas
    direction.folders.forEach(folder => {
      if (folders.includes(folder)) {
        direction.score += 4;
      }
    });
  });

  return directions;
}

/**
 * Retorna direção sugerida com confiança
 */
function suggestDirection(scores) {
  const sorted = Object.entries(scores)
    .map(([name, data]) => ({ name, score: data.score }))
    .sort((a, b) => b.score - a.score);

  const winner = sorted[0];
  const runnerUp = sorted[1];

  // Calcula nível de confiança
  let confidence = 'low';
  if (winner.score >= 10) {
    confidence = 'high';
  } else if (winner.score >= 5) {
    confidence = 'medium';
  }

  // Se houver empate ou diferença pequena, reduz confiança
  if (runnerUp && (winner.score - runnerUp.score) < 3) {
    confidence = confidence === 'high' ? 'medium' : 'low';
  }

  return {
    primary: winner.name,
    secondary: runnerUp ? runnerUp.name : null,
    confidence,
    scores: sorted,
    reasoning: generateReasoning(winner.name, scores[winner.name])
  };
}

/**
 * Gera explicação do motivo da sugestão
 */
function generateReasoning(directionName, directionData) {
  const reasons = [];

  if (directionData.keywords.some(k => directionData.score > 0)) {
    reasons.push('palavras-chave encontradas no projeto');
  }

  if (directionData.dependencies.some(d => directionData.score > 0)) {
    reasons.push('dependências relacionadas detectadas');
  }

  if (directionData.folders.some(f => directionData.score > 0)) {
    reasons.push('estrutura de pastas correspondente');
  }

  return reasons.join(', ');
}

/**
 * Detecta framework/biblioteca principal
 */
function detectFramework(pkg) {
  const deps = [...pkg.dependencies, ...pkg.devDependencies];

  const frameworks = {
    'Next.js': deps.includes('next'),
    'React': deps.includes('react') && !deps.includes('next'),
    'Vue': deps.includes('vue'),
    'Svelte': deps.includes('svelte'),
    'Angular': deps.includes('@angular/core'),
    'React Native': deps.includes('react-native'),
    'Expo': deps.includes('expo')
  };

  return Object.entries(frameworks).find(([, detected]) => detected)?.[0] || 'Unknown';
}

/**
 * Função principal
 */
function detectContext(projectRoot = process.cwd()) {
  console.error('🔍 Analisando contexto do projeto...\n');

  const pkg = analyzePackageJson(projectRoot);
  const readme = analyzeReadme(projectRoot);
  const folders = analyzeFolderStructure(projectRoot);

  const scores = calculateScores(pkg, readme, folders);
  const suggestion = suggestDirection(scores);
  const framework = detectFramework(pkg);

  const result = {
    project: {
      name: pkg.name || 'Unknown',
      framework
    },
    suggestion,
    analysis: {
      foldersAnalyzed: folders.length,
      dependenciesAnalyzed: pkg.dependencies.length + pkg.devDependencies.length,
      readmeFound: readme.length > 0
    }
  };

  // Output JSON para stdout (para ser consumido por outros scripts)
  console.log(JSON.stringify(result, null, 2));

  return result;
}

// Executa se chamado diretamente
if (require.main === module) {
  const projectRoot = process.argv[2] || process.cwd();
  detectContext(projectRoot);
}

module.exports = { detectContext };
