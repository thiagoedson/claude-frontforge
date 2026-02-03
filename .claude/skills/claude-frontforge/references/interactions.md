# Interactions & Feedback

Every interaction needs a response. Users should never wonder "did that work?"

## Timing

| Duration | Use |
|----------|-----|
| 50ms | Color/opacity instant changes |
| 100ms | Micro-interactions |
| 150ms | Button states, toggles |
| 250ms | Modals, panels |
| 350ms | Page transitions |

**Easing:** `cubic-bezier(0.25, 1, 0.5, 1)` — no bounce/spring in enterprise UI

## States

**Hover:** All interactive elements need hover feedback
- Buttons: darker bg or subtle translateY(-1px)
- Cards: border-color change
- List items: bg-subtle
- Links: color change + underline

**Focus:** Visible for keyboard accessibility
- `:focus-visible { outline: 2px solid accent; outline-offset: 2px; }`
- Inputs: accent border + 3px ring

**Active/Pressed:** Immediate feedback
- Buttons: scale(0.98) or darker bg
- Cards: scale(0.99)

**Disabled:** 0.5 opacity, cursor: not-allowed, no pointer-events

## Loading States

**Button loading:** Hide text (color: transparent), show centered spinner

**Progress bar:** 4px height, accent fill, animate width

**Indeterminate:** 30% width sliding animation

**Skeleton:** Shimmer gradient (bg-subtle → bg-muted → bg-subtle)

## Feedback Messages

**Toast:** Fixed bottom-right, 12px 16px padding, shadow-lg, slide-up animation
- Variants: left border colored (success/error/warning)

**Inline messages:** 12px 16px padding, semantic-muted bg, semantic color text

## Form Validation

**Error state:**
- Border: error color
- Ring: error-muted
- Message: 13px, error color, shake animation optional

**Success state:** success border color

**Hints:** 13px text-muted below input

## Transitions

**Modal:** Backdrop fade 200ms, modal scale(0.95) + translateY(-10px) → normal

**Dropdown:** opacity + translateY(-8px) → normal, 150ms

**Accordion:** `grid-template-rows: 0fr` → `1fr` with overflow hidden

**Sidebar collapse:** width 240px → 64px, fade labels

## Micro-interactions

**Toggle:** 44x24px, 20px knob, translateX(2px) → translateX(22px)

**Checkbox:** Scale 0.5 + opacity 0 → normal when checked

**Like/heart:** scale(0.85) on active, pop animation on liked

## Cursor Feedback

- `.interactive` → pointer
- `.draggable` → grab / grabbing
- `.disabled` → not-allowed
- `.loading` → wait

## Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Checklist

- [ ] All buttons have hover/focus/active/disabled states
- [ ] Loading states for async operations
- [ ] Clear form errors
- [ ] Visible focus indicators
- [ ] Respects prefers-reduced-motion
- [ ] Touch targets 44x44px minimum
- [ ] Feedback < 100ms response
