#!/usr/bin/env node

/**
 * Claude Frontforge - Visual Banner
 * Displays a colorful ASCII art banner when the skill is activated
 */

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',

  // Foreground
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',

  // Bright foreground
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m',
  brightCyan: '\x1b[96m',
  brightWhite: '\x1b[97m',

  // Background
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
};

const c = colors;

// ASCII Art Banner - Gradient style
const banner = `
${c.brightCyan}╔═══════════════════════════════════════════════════════════════════════════════╗${c.reset}
${c.brightCyan}║${c.reset}                                                                               ${c.brightCyan}║${c.reset}
${c.brightCyan}║${c.reset}   ${c.brightMagenta}███████╗${c.brightBlue}██████╗ ${c.brightCyan}  ██████╗ ${c.brightGreen}███╗   ██╗${c.brightYellow}████████╗${c.brightRed}███████╗${c.brightMagenta} ██████╗ ${c.brightBlue}██████╗ ${c.brightCyan}███████╗${c.reset}   ${c.brightCyan}║${c.reset}
${c.brightCyan}║${c.reset}   ${c.brightMagenta}██╔════╝${c.brightBlue}██╔══██╗${c.brightCyan}██╔═══██╗${c.brightGreen}████╗  ██║${c.brightYellow}╚══██╔══╝${c.brightRed}██╔════╝${c.brightMagenta}██╔═══██╗${c.brightBlue}██╔══██╗${c.brightCyan}██╔════╝${c.reset}   ${c.brightCyan}║${c.reset}
${c.brightCyan}║${c.reset}   ${c.brightMagenta}█████╗  ${c.brightBlue}██████╔╝${c.brightCyan}██║   ██║${c.brightGreen}██╔██╗ ██║${c.brightYellow}   ██║   ${c.brightRed}█████╗  ${c.brightMagenta}██║   ██║${c.brightBlue}██████╔╝${c.brightCyan}█████╗  ${c.reset}   ${c.brightCyan}║${c.reset}
${c.brightCyan}║${c.reset}   ${c.brightMagenta}██╔══╝  ${c.brightBlue}██╔══██╗${c.brightCyan}██║   ██║${c.brightGreen}██║╚██╗██║${c.brightYellow}   ██║   ${c.brightRed}██╔══╝  ${c.brightMagenta}██║   ██║${c.brightBlue}██╔══██╗${c.brightCyan}██╔══╝  ${c.reset}   ${c.brightCyan}║${c.reset}
${c.brightCyan}║${c.reset}   ${c.brightMagenta}██║     ${c.brightBlue}██║  ██║${c.brightCyan}╚██████╔╝${c.brightGreen}██║ ╚████║${c.brightYellow}   ██║   ${c.brightRed}██║     ${c.brightMagenta}╚██████╔╝${c.brightBlue}██║  ██║${c.brightCyan}███████╗${c.reset}   ${c.brightCyan}║${c.reset}
${c.brightCyan}║${c.reset}   ${c.brightMagenta}╚═╝     ${c.brightBlue}╚═╝  ╚═╝${c.brightCyan} ╚═════╝ ${c.brightGreen}╚═╝  ╚═══╝${c.brightYellow}   ╚═╝   ${c.brightRed}╚═╝     ${c.brightMagenta} ╚═════╝ ${c.brightBlue}╚═╝  ╚═╝${c.brightCyan}╚══════╝${c.reset}   ${c.brightCyan}║${c.reset}
${c.brightCyan}║${c.reset}                                                                               ${c.brightCyan}║${c.reset}
${c.brightCyan}║${c.reset}   ${c.dim}${c.cyan}╭─────────────────────────────────────────────────────────────────────────╮${c.reset}   ${c.brightCyan}║${c.reset}
${c.brightCyan}║${c.reset}   ${c.dim}${c.cyan}│${c.reset}  ${c.brightWhite}${c.bright}✨ CRAFT${c.reset} ${c.dim}·${c.reset} ${c.brightWhite}${c.bright}💾 MEMORY${c.reset} ${c.dim}·${c.reset} ${c.brightWhite}${c.bright}🛡️  ENFORCEMENT${c.reset}                               ${c.dim}${c.cyan}│${c.reset}   ${c.brightCyan}║${c.reset}
${c.brightCyan}║${c.reset}   ${c.dim}${c.cyan}│${c.reset}                                                                       ${c.dim}${c.cyan}│${c.reset}   ${c.brightCyan}║${c.reset}
${c.brightCyan}║${c.reset}   ${c.dim}${c.cyan}│${c.reset}  ${c.yellow}Build interfaces with intention. Remember decisions.${c.reset}               ${c.dim}${c.cyan}│${c.reset}   ${c.brightCyan}║${c.reset}
${c.brightCyan}║${c.reset}   ${c.dim}${c.cyan}│${c.reset}  ${c.yellow}Enforce consistency across sessions.${c.reset}                               ${c.dim}${c.cyan}│${c.reset}   ${c.brightCyan}║${c.reset}
${c.brightCyan}║${c.reset}   ${c.dim}${c.cyan}╰─────────────────────────────────────────────────────────────────────────╯${c.reset}   ${c.brightCyan}║${c.reset}
${c.brightCyan}║${c.reset}                                                                               ${c.brightCyan}║${c.reset}
${c.brightCyan}╚═══════════════════════════════════════════════════════════════════════════════╝${c.reset}
`;

// Compact banner for inline use
const bannerCompact = `
${c.brightCyan}┌──────────────────────────────────────────────────────────────┐${c.reset}
${c.brightCyan}│${c.reset}  ${c.brightMagenta}█▀▀${c.brightBlue}█▀█${c.brightCyan}█▀█${c.brightGreen}█▄░█${c.brightYellow}▀█▀${c.brightRed}█▀▀${c.brightMagenta}█▀█${c.brightBlue}█▀█${c.brightCyan}█▀▀${c.brightGreen}█▀▀${c.reset}  ${c.dim}UX Engineering for Claude Code${c.reset}  ${c.brightCyan}│${c.reset}
${c.brightCyan}│${c.reset}  ${c.brightMagenta}█▀░${c.brightBlue}█▀▄${c.brightCyan}█▄█${c.brightGreen}█░▀█${c.brightYellow}░█░${c.brightRed}█▀░${c.brightMagenta}█▄█${c.brightBlue}█▀▄${c.brightCyan}█▄█${c.brightGreen}██▄${c.reset}  ${c.yellow}v2026.2.2${c.reset}                     ${c.brightCyan}│${c.reset}
${c.brightCyan}├──────────────────────────────────────────────────────────────┤${c.reset}
${c.brightCyan}│${c.reset}  ${c.green}✨ Craft${c.reset} ${c.dim}·${c.reset} ${c.blue}💾 Memory${c.reset} ${c.dim}·${c.reset} ${c.magenta}🛡️  Enforcement${c.reset}                      ${c.brightCyan}│${c.reset}
${c.brightCyan}└──────────────────────────────────────────────────────────────┘${c.reset}
`;

// Mini status indicator
const statusIndicator = `${c.brightCyan}◆${c.reset} ${c.bright}FRONTFORGE${c.reset} ${c.dim}active${c.reset} ${c.brightCyan}◆${c.reset}`;

// Direction indicators with colors
const directions = {
  'Precision & Density': `${c.brightBlue}◈${c.reset} ${c.brightBlue}Precision & Density${c.reset}`,
  'Warmth & Approachability': `${c.brightYellow}◈${c.reset} ${c.brightYellow}Warmth & Approachability${c.reset}`,
  'Sophistication & Trust': `${c.brightMagenta}◈${c.reset} ${c.brightMagenta}Sophistication & Trust${c.reset}`,
  'Boldness & Clarity': `${c.brightRed}◈${c.reset} ${c.brightRed}Boldness & Clarity${c.reset}`,
  'Utility & Function': `${c.brightGreen}◈${c.reset} ${c.brightGreen}Utility & Function${c.reset}`,
  'Data & Analysis': `${c.brightCyan}◈${c.reset} ${c.brightCyan}Data & Analysis${c.reset}`,
};

// Status box with current system info
function generateStatusBox(systemInfo = {}) {
  const direction = systemInfo.direction || 'Not set';
  const spacing = systemInfo.spacing || '4px';
  const depth = systemInfo.depth || 'Not set';
  const confidence = systemInfo.confidence || 'N/A';

  const directionColored = directions[direction] || `${c.dim}${direction}${c.reset}`;

  return `
${c.brightCyan}╭─────────────────────────────────────────────╮${c.reset}
${c.brightCyan}│${c.reset} ${c.bright}${c.white}FRONTFORGE${c.reset} ${c.green}●${c.reset} ${c.dim}Active${c.reset}                         ${c.brightCyan}│${c.reset}
${c.brightCyan}├─────────────────────────────────────────────┤${c.reset}
${c.brightCyan}│${c.reset} ${c.dim}Direction:${c.reset}  ${directionColored}          ${c.brightCyan}│${c.reset}
${c.brightCyan}│${c.reset} ${c.dim}Spacing:${c.reset}    ${c.yellow}${spacing} base${c.reset}                        ${c.brightCyan}│${c.reset}
${c.brightCyan}│${c.reset} ${c.dim}Depth:${c.reset}      ${c.cyan}${depth}${c.reset}                   ${c.brightCyan}│${c.reset}
${c.brightCyan}│${c.reset} ${c.dim}Confidence:${c.reset} ${c.green}${confidence}${c.reset}                           ${c.brightCyan}│${c.reset}
${c.brightCyan}╰─────────────────────────────────────────────╯${c.reset}
`;
}

// Command list with icons
const commandList = `
${c.brightCyan}╭─────────────────────────────────────────────────────────────╮${c.reset}
${c.brightCyan}│${c.reset} ${c.bright}${c.white}AVAILABLE COMMANDS${c.reset}                                        ${c.brightCyan}│${c.reset}
${c.brightCyan}├─────────────────────────────────────────────────────────────┤${c.reset}
${c.brightCyan}│${c.reset}  ${c.green}▸${c.reset} ${c.bright}/init${c.reset}              ${c.dim}Initialize design system${c.reset}        ${c.brightCyan}│${c.reset}
${c.brightCyan}│${c.reset}  ${c.blue}▸${c.reset} ${c.bright}/status${c.reset}            ${c.dim}Show current system state${c.reset}       ${c.brightCyan}│${c.reset}
${c.brightCyan}│${c.reset}  ${c.yellow}▸${c.reset} ${c.bright}/audit${c.reset}             ${c.dim}Check code against system${c.reset}       ${c.brightCyan}│${c.reset}
${c.brightCyan}│${c.reset}  ${c.magenta}▸${c.reset} ${c.bright}/extract${c.reset}           ${c.dim}Extract patterns from code${c.reset}      ${c.brightCyan}│${c.reset}
${c.brightCyan}│${c.reset}  ${c.cyan}▸${c.reset} ${c.bright}/generate-tokens${c.reset}   ${c.dim}Generate design token files${c.reset}     ${c.brightCyan}│${c.reset}
${c.brightCyan}│${c.reset}  ${c.red}▸${c.reset} ${c.bright}/analyze-website${c.reset}   ${c.dim}Extract tokens from websites${c.reset}    ${c.brightCyan}│${c.reset}
${c.brightCyan}│${c.reset}  ${c.green}▸${c.reset} ${c.bright}/metrics${c.reset}           ${c.dim}Health dashboard${c.reset}                ${c.brightCyan}│${c.reset}
${c.brightCyan}╰─────────────────────────────────────────────────────────────╯${c.reset}
`;

// Agents list
const agentsList = `
${c.brightMagenta}╭─────────────────────────────────────────────────────────────╮${c.reset}
${c.brightMagenta}│${c.reset} ${c.bright}${c.white}🤖 SPECIALIZED AGENTS${c.reset}                                     ${c.brightMagenta}│${c.reset}
${c.brightMagenta}├─────────────────────────────────────────────────────────────┤${c.reset}
${c.brightMagenta}│${c.reset}  ${c.brightCyan}◆${c.reset} ${c.bright}UX Interpreter${c.reset}      ${c.dim}Extract design from websites${c.reset}   ${c.brightMagenta}│${c.reset}
${c.brightMagenta}│${c.reset}  ${c.brightGreen}◆${c.reset} ${c.bright}Component Architect${c.reset} ${c.dim}Scalable UI components${c.reset}        ${c.brightMagenta}│${c.reset}
${c.brightMagenta}│${c.reset}  ${c.brightYellow}◆${c.reset} ${c.bright}Animation Specialist${c.reset}${c.dim}Micro-interactions${c.reset}            ${c.brightMagenta}│${c.reset}
${c.brightMagenta}│${c.reset}  ${c.brightBlue}◆${c.reset} ${c.bright}Responsive Expert${c.reset}   ${c.dim}Mobile-first layouts${c.reset}          ${c.brightMagenta}│${c.reset}
${c.brightMagenta}│${c.reset}  ${c.brightRed}◆${c.reset} ${c.bright}UX Researcher${c.reset}       ${c.dim}Personas & flow analysis${c.reset}      ${c.brightMagenta}│${c.reset}
${c.brightMagenta}╰─────────────────────────────────────────────────────────────╯${c.reset}
`;

// Loading animation frames
const loadingFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

function showLoading(message, duration = 2000) {
  let i = 0;
  const interval = setInterval(() => {
    process.stdout.write(`\r${c.brightCyan}${loadingFrames[i % loadingFrames.length]}${c.reset} ${message}`);
    i++;
  }, 80);

  setTimeout(() => {
    clearInterval(interval);
    process.stdout.write(`\r${c.green}✓${c.reset} ${message}\n`);
  }, duration);
}

// Success message
function showSuccess(message) {
  console.log(`${c.green}✓${c.reset} ${c.bright}${message}${c.reset}`);
}

// Warning message
function showWarning(message) {
  console.log(`${c.yellow}⚠${c.reset} ${c.yellow}${message}${c.reset}`);
}

// Error message
function showError(message) {
  console.log(`${c.red}✗${c.reset} ${c.red}${message}${c.reset}`);
}

// Info message
function showInfo(message) {
  console.log(`${c.blue}ℹ${c.reset} ${message}`);
}

// Main display function
function displayBanner(type = 'full') {
  switch (type) {
    case 'full':
      console.log(banner);
      break;
    case 'compact':
      console.log(bannerCompact);
      break;
    case 'status':
      console.log(statusIndicator);
      break;
    case 'commands':
      console.log(commandList);
      break;
    case 'agents':
      console.log(agentsList);
      break;
    case 'all':
      console.log(banner);
      console.log(commandList);
      console.log(agentsList);
      break;
    default:
      console.log(bannerCompact);
  }
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const type = args[0] || 'full';

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
${c.bright}Usage:${c.reset} node banner.js [type]

${c.bright}Types:${c.reset}
  full      ${c.dim}Full ASCII art banner (default)${c.reset}
  compact   ${c.dim}Compact banner for inline use${c.reset}
  status    ${c.dim}Mini status indicator${c.reset}
  commands  ${c.dim}List of available commands${c.reset}
  agents    ${c.dim}List of specialized agents${c.reset}
  all       ${c.dim}Full banner + commands + agents${c.reset}
`);
    process.exit(0);
  }

  displayBanner(type);
}

module.exports = {
  banner,
  bannerCompact,
  statusIndicator,
  directions,
  commandList,
  agentsList,
  generateStatusBox,
  displayBanner,
  showLoading,
  showSuccess,
  showWarning,
  showError,
  showInfo,
  colors
};
