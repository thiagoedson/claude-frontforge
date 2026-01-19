---
name: claude-frontforge:setup-statusline
description: Configure persistent status line showing real-time session metrics (model, cost, context, time, git branch, design system).
---

# claude-frontforge setup-statusline

Configure a persistent status line that displays real-time session information below the user input, similar to Claude Code via API.

## What It Shows

The status line displays:
- 💎 **Model**: Current Claude model (Sonnet, Opus, Haiku)
- 🟢🟡🔴 **Context**: % of context window used (colored: green <50%, yellow 50-80%, red >80%)
- 💚💛❤️ **Cost**: Session cost in BRL (colored: green <R$5, yellow R$5-15, red >R$15)
- ⏱️ **Time**: Session duration (formatted as Xh Ym or Xm)
- 🌿 **Git Branch**: Current branch (if in git repo)
- ✅⚠️ **Design System**: Active Frontforge direction or "no system"

**Example output:**
```
💎 Sonnet | 🟢 38% ctx | 💚 R$ 1.20 (~R$0.85/h) | ⏱️  45m | feat/ui | ✅ Precision
```

## Setup Steps

1. **Copy the status line script** to your project:
   - Create `.frontforge/` directory if it doesn't exist
   - Copy `${CLAUDE_PLUGIN_ROOT}/reference/statusline.sh` to `.frontforge/statusline.sh`
   - Make it executable: `chmod +x .frontforge/statusline.sh`

2. **Configure Claude Code settings**:
   - Add to `.claude/settings.json`:
     ```json
     {
       "statusLine": {
         "type": "command",
         "command": "./.frontforge/statusline.sh",
         "padding": 0
       }
     }
     ```

3. **Update BRL exchange rate** (optional):
   - Edit `.frontforge/statusline.sh`
   - Update `BRL_RATE=5.0` with current USD→BRL rate
   - Or fetch dynamically from API (advanced)

4. **Test the status line**:
   - Restart Claude Code
   - The status line should appear below the input field
   - It updates automatically every ~300ms

## Requirements

- **jq**: JSON parser (install: `brew install jq` / `apt install jq` / `choco install jq`)
- **bc**: Calculator for floating point math (usually pre-installed on Unix)
- **git**: For branch detection (optional)

## Implementation

Execute the following steps:

```bash
# 1. Create .frontforge directory
mkdir -p .frontforge

# 2. Copy status line script
cp "${CLAUDE_PLUGIN_ROOT}/reference/statusline.sh" .frontforge/statusline.sh

# 3. Make executable
chmod +x .frontforge/statusline.sh

# 4. Update or create .claude/settings.json
mkdir -p .claude
cat > .claude/settings.json <<'EOF'
{
  "statusLine": {
    "type": "command",
    "command": "./.frontforge/statusline.sh",
    "padding": 0
  }
}
EOF

# 5. Test (on Unix/macOS)
echo '{"model":{"display_name":"Sonnet"},"context_window":{"used_percentage":42},"cost":{"total_cost_usd":0.55,"total_duration_ms":3600000},"workspace":{"current_dir":"."}}' | .frontforge/statusline.sh
```

After running these commands, restart Claude Code to see the status line in action.

## Customization

You can modify `.frontforge/statusline.sh` to:
- Change icons and colors
- Add/remove information fields
- Adjust formatting and layout
- Integrate with external APIs (crypto prices, weather, etc.)

## Troubleshooting

**Status line not showing:**
- Check `.claude/settings.json` is correctly formatted
- Verify `.frontforge/statusline.sh` is executable (`ls -la .frontforge/`)
- Test script manually: `echo '{}' | .frontforge/statusline.sh`
- Check Claude Code logs for errors

**Incorrect values:**
- Update `BRL_RATE` in statusline.sh for accurate cost conversion
- Ensure `jq` and `bc` are installed and in PATH

**Windows users:**
- Use Git Bash or WSL to run the bash script
- Or rewrite statusline.sh in PowerShell/Python
