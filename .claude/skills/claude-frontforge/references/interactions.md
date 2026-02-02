# Interactions & Feedback

Every interaction needs a response. Users should never wonder "did that work?"

## Core Timing

```css
/* Animation durations */
--duration-instant: 50ms;    /* Color changes, opacity */
--duration-fast: 100ms;      /* Micro-interactions */
--duration-normal: 150ms;    /* Button states, toggles */
--duration-slow: 250ms;      /* Modals, panels */
--duration-slower: 350ms;    /* Page transitions */

/* Standard easing */
--ease-out: cubic-bezier(0.25, 1, 0.5, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

/* No bounce/spring in enterprise UI */
```

## Hover States

Every interactive element needs hover feedback.

### Buttons

```css
.btn {
  transition: background 150ms var(--ease-out),
              border-color 150ms var(--ease-out),
              transform 100ms var(--ease-out);
}

.btn:hover {
  background: var(--accent-hover);
}

/* Optional: subtle lift on primary buttons */
.btn-primary:hover {
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(0);
}
```

### Cards & List Items

```css
.card-interactive {
  transition: border-color 150ms, box-shadow 150ms;
}

.card-interactive:hover {
  border-color: var(--border-hover);
  box-shadow: var(--shadow-hover);
}

.list-item {
  transition: background 100ms;
}

.list-item:hover {
  background: var(--bg-subtle);
}
```

### Links

```css
.link {
  color: var(--accent);
  text-decoration: none;
  transition: color 100ms;
}

.link:hover {
  color: var(--accent-hover);
  text-decoration: underline;
}

/* Subtle underline approach */
.link-subtle {
  text-decoration: underline;
  text-decoration-color: transparent;
  text-underline-offset: 2px;
}

.link-subtle:hover {
  text-decoration-color: currentColor;
}
```

## Focus States

Keyboard accessibility requires visible focus indicators.

```css
/* Global focus ring */
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* Remove default focus for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}

/* Input focus */
.input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-muted);
}

/* Button focus */
.btn:focus-visible {
  box-shadow: 0 0 0 3px var(--accent-muted);
}
```

## Active/Pressed States

Immediate feedback on click/tap.

```css
.btn:active {
  transform: scale(0.98);
}

/* Or darker background */
.btn:active {
  background: var(--accent-active);
}

.card:active {
  transform: scale(0.99);
}

/* Touch feedback */
@media (hover: none) {
  .btn:active {
    background: var(--accent-active);
  }
}
```

## Loading States

### Button Loading

```css
.btn-loading {
  position: relative;
  color: transparent;
  pointer-events: none;
}

.btn-loading::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  top: 50%;
  left: 50%;
  margin: -8px 0 0 -8px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 600ms linear infinite;
}
```

### Inline Loading

```css
.loading-dots::after {
  content: '';
  animation: dots 1.5s infinite;
}

@keyframes dots {
  0%, 20% { content: '.'; }
  40% { content: '..'; }
  60%, 100% { content: '...'; }
}
```

### Progress Indicator

```css
.progress-bar {
  height: 4px;
  background: var(--bg-subtle);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--accent);
  transition: width 300ms var(--ease-out);
}

/* Indeterminate */
.progress-indeterminate .progress-fill {
  width: 30%;
  animation: progress-slide 1s infinite;
}

@keyframes progress-slide {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}
```

## Feedback Messages

### Toast Notifications

```css
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  animation: toast-in 200ms var(--ease-out);
}

@keyframes toast-in {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
}

.toast-success { border-left: 3px solid var(--success); }
.toast-error { border-left: 3px solid var(--error); }
.toast-warning { border-left: 3px solid var(--warning); }
```

### Inline Messages

```css
.message {
  padding: 12px 16px;
  border-radius: var(--radius);
  font-size: 14px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.message-info {
  background: var(--accent-muted);
  color: var(--accent);
}

.message-success {
  background: var(--success-muted);
  color: var(--success);
}

.message-error {
  background: var(--error-muted);
  color: var(--error);
}
```

## Form Validation

### Real-time Validation

```css
/* Error state */
.input-error {
  border-color: var(--error);
}

.input-error:focus {
  box-shadow: 0 0 0 3px var(--error-muted);
}

.error-message {
  color: var(--error);
  font-size: 13px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Success state */
.input-success {
  border-color: var(--success);
}

/* Animated appearance */
.error-message {
  animation: shake 300ms;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
```

### Field Hints

```css
.input-hint {
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 4px;
}

/* Character counter */
.char-counter {
  font-size: 12px;
  color: var(--text-muted);
  text-align: right;
}

.char-counter.near-limit {
  color: var(--warning);
}

.char-counter.over-limit {
  color: var(--error);
}
```

## Transitions

### Modal Open/Close

```css
.modal-backdrop {
  opacity: 0;
  transition: opacity 200ms;
}

.modal-backdrop.open {
  opacity: 1;
}

.modal {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
  transition: opacity 200ms, transform 200ms var(--ease-out);
}

.modal-backdrop.open .modal {
  opacity: 1;
  transform: scale(1) translateY(0);
}
```

### Dropdown/Menu

```css
.dropdown-menu {
  opacity: 0;
  transform: translateY(-8px);
  pointer-events: none;
  transition: opacity 150ms, transform 150ms var(--ease-out);
}

.dropdown.open .dropdown-menu {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}
```

### Accordion/Collapse

```css
.accordion-content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 250ms var(--ease-out);
}

.accordion.open .accordion-content {
  grid-template-rows: 1fr;
}

.accordion-inner {
  overflow: hidden;
}
```

### Sidebar Collapse

```css
.sidebar {
  width: 240px;
  transition: width 250ms var(--ease-out);
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar-label {
  opacity: 1;
  transition: opacity 150ms;
}

.sidebar.collapsed .sidebar-label {
  opacity: 0;
}
```

## Micro-interactions

### Toggle Switch

```css
.toggle {
  width: 44px;
  height: 24px;
  background: var(--bg-muted);
  border-radius: 12px;
  cursor: pointer;
  transition: background 150ms;
}

.toggle.checked {
  background: var(--accent);
}

.toggle-knob {
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  transform: translateX(2px);
  transition: transform 150ms var(--ease-out);
}

.toggle.checked .toggle-knob {
  transform: translateX(22px);
}
```

### Checkbox Animation

```css
.checkbox-icon {
  opacity: 0;
  transform: scale(0.5);
  transition: opacity 100ms, transform 100ms var(--ease-out);
}

.checkbox.checked .checkbox-icon {
  opacity: 1;
  transform: scale(1);
}
```

### Like/Heart Button

```css
.heart-btn {
  transition: transform 150ms var(--ease-out);
}

.heart-btn:active {
  transform: scale(0.85);
}

.heart-btn.liked {
  animation: heart-pop 400ms var(--ease-out);
}

@keyframes heart-pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
```

## Cursor Feedback

```css
/* Default cursors */
.interactive { cursor: pointer; }
.draggable { cursor: grab; }
.draggable:active { cursor: grabbing; }
.resizable { cursor: ew-resize; }
.disabled { cursor: not-allowed; }
.loading { cursor: wait; }
.text-select { cursor: text; }

/* Custom cursors for specific actions */
.zoom-in { cursor: zoom-in; }
.zoom-out { cursor: zoom-out; }
```

## Disabled States

```css
/* Generic disabled */
[disabled],
.disabled {
  opacity: 0.5;
  pointer-events: none;
  cursor: not-allowed;
}

/* Button disabled */
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Link disabled */
.link:disabled {
  color: var(--text-muted);
  text-decoration: none;
}
```

## Reduced Motion

Respect user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Keep essential feedback */
@media (prefers-reduced-motion: reduce) {
  .btn:focus-visible {
    /* Focus ring still visible, just instant */
    transition: none;
  }
}
```

## Interaction Checklist

Before shipping, verify:

- [ ] All buttons have hover, focus, active, and disabled states
- [ ] Loading states exist for async operations
- [ ] Form errors are clear and helpful
- [ ] Focus indicators are visible for keyboard users
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Touch targets are at least 44x44px
- [ ] Feedback is immediate (< 100ms response)
