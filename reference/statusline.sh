#!/bin/bash
# Claude Frontforge Status Line
# Displays real-time session info: model, context, cost, time, git branch, design system

# Read JSON from stdin
input=$(cat)

# Extract session data
MODEL=$(echo "$input" | jq -r '.model.display_name // "Unknown"')
CONTEXT_PERCENT=$(echo "$input" | jq -r '.context_window.used_percentage // 0' | xargs printf "%.0f")
COST_USD=$(echo "$input" | jq -r '.cost.total_cost_usd // 0')
DURATION_MS=$(echo "$input" | jq -r '.cost.total_duration_ms // 0')
CURRENT_DIR=$(echo "$input" | jq -r '.workspace.current_dir // "."')

# Convert USD to BRL (update daily via https://api.exchangerate-api.com/v4/latest/USD)
# Default: R$ 5.00 per USD (update this value or fetch dynamically)
BRL_RATE=5.0
COST_BRL=$(echo "$COST_USD * $BRL_RATE" | bc -l 2>/dev/null | xargs printf "%.2f" 2>/dev/null || echo "0.00")

# Calculate burn rate (cost per hour)
if [ "$DURATION_MS" -gt 0 ]; then
  HOURS=$(echo "scale=2; $DURATION_MS / 3600000" | bc -l 2>/dev/null || echo "1")
  BURN_RATE=$(echo "$COST_USD / $HOURS * $BRL_RATE" | bc -l 2>/dev/null | xargs printf "%.2f" 2>/dev/null || echo "0.00")
else
  BURN_RATE="0.00"
fi

# Format duration (ms to human readable)
SECONDS=$(echo "$DURATION_MS / 1000" | bc 2>/dev/null || echo "0")
MINUTES=$(echo "$SECONDS / 60" | bc 2>/dev/null || echo "0")
HOURS=$(echo "$MINUTES / 60" | bc 2>/dev/null || echo "0")
REMAINING_MINS=$(echo "$MINUTES % 60" | bc 2>/dev/null || echo "0")

if [ "$HOURS" -gt 0 ]; then
  TIME_STR="${HOURS}h${REMAINING_MINS}m"
else
  TIME_STR="${MINUTES}m"
fi

# Get git branch
GIT_BRANCH=""
cd "$CURRENT_DIR" 2>/dev/null
if [ -d ".git" ]; then
  GIT_BRANCH=$(git branch --show-current 2>/dev/null || echo "")
  if [ -n "$GIT_BRANCH" ]; then
    GIT_BRANCH=" | $GIT_BRANCH"
  fi
fi

# Check for Frontforge design system
SYSTEM_STATUS=""
if [ -f "$CURRENT_DIR/.frontforge/system.md" ]; then
  # Extract direction from system.md
  DIRECTION=$(grep -i "^Direction:" "$CURRENT_DIR/.frontforge/system.md" 2>/dev/null | sed 's/Direction://i' | xargs 2>/dev/null)
  if [ -n "$DIRECTION" ]; then
    SYSTEM_STATUS=" | ✅ $DIRECTION"
  else
    SYSTEM_STATUS=" | ✅ system"
  fi
else
  SYSTEM_STATUS=" | ⚠️ no system"
fi

# Dynamic context color
if [ "$CONTEXT_PERCENT" -lt 50 ]; then
  CTX_ICON="🟢"
elif [ "$CONTEXT_PERCENT" -lt 80 ]; then
  CTX_ICON="🟡"
else
  CTX_ICON="🔴"
fi

# Dynamic cost color
COST_NUM=$(echo "$COST_BRL" | sed 's/,/./' 2>/dev/null)
if (( $(echo "$COST_NUM < 5" | bc -l 2>/dev/null) )); then
  COST_ICON="💚"
elif (( $(echo "$COST_NUM < 15" | bc -l 2>/dev/null) )); then
  COST_ICON="💛"
else
  COST_ICON="❤️"
fi

# Build status line
echo "💎 $MODEL | ${CTX_ICON} ${CONTEXT_PERCENT}% ctx | ${COST_ICON} R\$ ${COST_BRL} (~R\$${BURN_RATE}/h) | ⏱️  $TIME_STR${GIT_BRANCH}${SYSTEM_STATUS}"
