---
name: claude-frontforge:banner
description: Show the Frontforge activation banner (full, compact, or status indicator). Displayed automatically by other commands — use directly to verify the skill is installed and active, or to show available commands and agents.
---

# claude-frontforge banner

Show the visual activation banner.

## Usage

```
/claude-frontforge:banner           # Show full banner
/claude-frontforge:banner compact   # Show compact banner
/claude-frontforge:banner status    # Show status indicator
/claude-frontforge:banner commands  # Show available commands
/claude-frontforge:banner agents    # Show specialized agents
```

## Implementation

Run the banner script:

```bash
node ${CLAUDE_PLUGIN_ROOT}/hooks/banner.js [type]
```

## Banner Types

### Full Banner
Large ASCII art with gradient colors:
```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                                                                               ║
║   ███████╗██████╗   ██████╗ ███╗   ██╗████████╗███████╗ ██████╗ ██████╗ ███████╗   ║
║   ██╔════╝██╔══██╗██╔═══██╗████╗  ██║╚══██╔══╝██╔════╝██╔═══██╗██╔══██╗██╔════╝   ║
║   █████╗  ██████╔╝██║   ██║██╔██╗ ██║   ██║   █████╗  ██║   ██║██████╔╝█████╗     ║
║   ██╔══╝  ██╔══██╗██║   ██║██║╚██╗██║   ██║   ██╔══╝  ██║   ██║██╔══██╗██╔══╝     ║
║   ██║     ██║  ██║╚██████╔╝██║ ╚████║   ██║   ██║     ╚██████╔╝██║  ██║███████╗   ║
║   ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝      ╚═════╝ ╚═╝  ╚═╝╚══════╝   ║
║                                                                               ║
║   ╭─────────────────────────────────────────────────────────────────────────╮   ║
║   │  ✨ CRAFT · 💾 MEMORY · 🛡️  ENFORCEMENT                               │   ║
║   │                                                                       │   ║
║   │  Build interfaces with intention. Remember decisions.               │   ║
║   │  Enforce consistency across sessions.                               │   ║
║   ╰─────────────────────────────────────────────────────────────────────────╯   ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

### Compact Banner
For inline display:
```
┌──────────────────────────────────────────────────────────────┐
│  █▀▀█▀█ █▀██▄░█▀█▀█▀▀█▀█ █▀██▀▀█▀▀  UX Engineering for Claude  │
│  █▀░█▀▄ █▄██░▀█░█░█▀░█▄█ █▀▄█▄███▄  v2026.2.2                  │
├──────────────────────────────────────────────────────────────┤
│  ✨ Craft · 💾 Memory · 🛡️  Enforcement                       │
└──────────────────────────────────────────────────────────────┘
```

### Status Indicator
Minimal status line:
```
◆ FRONTFORGE active ◆
```

## When to Show

Display the banner:
1. When `/init` is called
2. When `/status` is called
3. When any frontforge command starts
4. When the user asks about the skill

The banner helps users immediately recognize that the Frontforge skill is active and ready to help with interface design.
