---
name: claude-frontforge:audit
description: Find UI inconsistencies in your code — off-grid spacing, wrong depth strategy, out-of-palette colors, and component drift from established patterns. Reports violations with file and line numbers. Add --fix to auto-correct safe issues.
---

# claude-frontforge audit

Check existing code against your design system.

## Usage

```
/audit <path>        # Audit specific file/directory
/audit               # Audit common UI paths
/audit <path> --fix  # Auto-fix violations where safe
```

## What to Check

**If `.frontforge/system.md` exists:**

1. **Spacing violations**
   - Find spacing values not on defined grid
   - Example: 17px when base is 4px

2. **Depth violations**
   - Borders-only system → flag shadows
   - Subtle system → flag layered shadows
   - Allow ring shadows (0 0 0 1px)

3. **Color violations**
   - If palette defined → flag colors not in palette
   - Allow semantic grays

4. **Pattern drift**
   - Find buttons not matching Button pattern
   - Find cards not matching Card pattern

**Report format:**
```
Audit Results: src/components/

Violations:
  Button.tsx:12 - Height 38px (pattern: 36px)
  Card.tsx:8 - Shadow used (system: borders-only)
  Input.tsx:20 - Spacing 14px (grid: 4px, nearest: 12px or 16px)

Suggestions:
  - Update Button height to match pattern
  - Replace shadow with border
  - Adjust spacing to grid
```

**If no system.md:**

```
No design system to audit against.

Create a system first:
1. Build UI → establish system automatically
2. Run /extract → create system from existing code
```

## Auto-Fix Mode

When `--fix` is passed, automatically correct safe violations:

**Safe to auto-fix:**
- Spacing snapped to nearest grid value (e.g., 14px → 12px or 16px)
- Shadow replaced with border when system is borders-only

**Requires confirmation:**
- Color changes (palette drift)
- Pattern deviations (height/padding changes to components)

Always show a diff preview and ask for confirmation before applying fixes:
```
Ready to fix 3 violations:
  Button.tsx:12 — 38px → 36px (pattern)
  Card.tsx:8    — shadow → border (depth)
  Input.tsx:20  — 14px → 16px (grid)

Apply these changes? (y/n/review each)
```

## Implementation

1. Check for system.md
2. Parse system rules
3. Read target files (tsx, jsx, css, scss)
4. Compare against rules
5. Report violations with suggestions
6. If `--fix`: collect safe fixes, preview diff, apply on confirmation
