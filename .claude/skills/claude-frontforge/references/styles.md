# Component & Style Patterns

Reusable patterns for common UI components. Not a design system — starting points to customize.

## Buttons

### Size Scale

```css
/* Button sizes based on 4px grid */
.btn-xs { height: 24px; padding: 0 8px; font-size: 12px; }
.btn-sm { height: 32px; padding: 0 12px; font-size: 13px; }
.btn-md { height: 36px; padding: 0 16px; font-size: 14px; }
.btn-lg { height: 44px; padding: 0 20px; font-size: 15px; }
.btn-xl { height: 52px; padding: 0 24px; font-size: 16px; }
```

### Button Variants

```css
/* Primary - main action */
.btn-primary {
  background: var(--accent);
  color: white;
  border: none;
}

/* Secondary - alternative action */
.btn-secondary {
  background: var(--bg-subtle);
  color: var(--foreground);
  border: 1px solid var(--border);
}

/* Ghost - minimal emphasis */
.btn-ghost {
  background: transparent;
  color: var(--foreground);
  border: none;
}

/* Destructive - dangerous actions */
.btn-destructive {
  background: var(--error);
  color: white;
  border: none;
}
```

### Icon Buttons

```css
.btn-icon {
  width: 36px;
  height: 36px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
}

/* Icon with text */
.btn-with-icon {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
```

## Inputs

### Base Input

```css
.input {
  height: 36px;
  padding: 0 12px;
  font-size: 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg);
  color: var(--foreground);
  transition: border-color 150ms, box-shadow 150ms;
}

.input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-muted);
}

.input::placeholder {
  color: var(--text-muted);
}
```

### Input States

```css
.input-error {
  border-color: var(--error);
}

.input-error:focus {
  box-shadow: 0 0 0 3px var(--error-muted);
}

.input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--bg-subtle);
}
```

### Input with Icon/Addon

```css
.input-group {
  position: relative;
  display: flex;
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
}

.input-with-icon {
  padding-left: 36px;
}

.input-addon {
  display: flex;
  align-items: center;
  padding: 0 12px;
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  border-right: none;
  border-radius: var(--radius) 0 0 var(--radius);
  color: var(--text-secondary);
  font-size: 14px;
}
```

### Textarea

```css
.textarea {
  min-height: 80px;
  padding: 12px;
  resize: vertical;
  font-family: inherit;
  line-height: 1.5;
}
```

## Cards

### Card Structure

```css
.card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  /* Choose depth strategy */
  border: 1px solid var(--border);
  /* OR */
  box-shadow: var(--shadow);
}

.card-header {
  padding: 16px;
  border-bottom: 1px solid var(--border);
}

.card-body {
  padding: 16px;
}

.card-footer {
  padding: 12px 16px;
  border-top: 1px solid var(--border);
  background: var(--bg-subtle);
}
```

### Card Variants

```css
/* Clickable card */
.card-interactive {
  cursor: pointer;
  transition: border-color 150ms, box-shadow 150ms;
}

.card-interactive:hover {
  border-color: var(--border-hover);
}

/* Inset card (for nested content) */
.card-inset {
  background: var(--bg-subtle);
  border: none;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
}
```

## Lists & Tables

### Simple List

```css
.list {
  display: flex;
  flex-direction: column;
}

.list-item {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
}

.list-item:last-child {
  border-bottom: none;
}

.list-item-interactive:hover {
  background: var(--bg-subtle);
}
```

### Data Table

```css
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.table th {
  text-align: left;
  padding: 12px 16px;
  font-weight: 500;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border);
  background: var(--bg-subtle);
}

.table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
}

.table tr:hover {
  background: var(--bg-subtle);
}

/* Numeric columns */
.table td[data-numeric] {
  font-variant-numeric: tabular-nums;
  font-family: var(--font-mono);
  text-align: right;
}
```

## Navigation

### Sidebar Navigation

```css
.sidebar {
  width: 240px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border);
  background: var(--bg);
}

.sidebar-section {
  padding: 8px;
}

.sidebar-label {
  padding: 8px 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: var(--radius);
  color: var(--text-secondary);
  transition: background 150ms, color 150ms;
}

.sidebar-item:hover {
  background: var(--bg-subtle);
  color: var(--foreground);
}

.sidebar-item.active {
  background: var(--accent-muted);
  color: var(--accent);
}
```

### Top Navigation

```css
.topnav {
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  border-bottom: 1px solid var(--border);
  background: var(--bg);
}

.topnav-brand {
  font-weight: 600;
  font-size: 16px;
}

.topnav-links {
  display: flex;
  gap: 4px;
  margin-left: 32px;
}

.topnav-link {
  padding: 8px 12px;
  border-radius: var(--radius);
  color: var(--text-secondary);
}

.topnav-link:hover {
  background: var(--bg-subtle);
  color: var(--foreground);
}

.topnav-link.active {
  color: var(--foreground);
  font-weight: 500;
}
```

### Tabs

```css
.tabs {
  display: flex;
  border-bottom: 1px solid var(--border);
}

.tab {
  padding: 12px 16px;
  font-weight: 500;
  color: var(--text-secondary);
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: color 150ms, border-color 150ms;
}

.tab:hover {
  color: var(--foreground);
}

.tab.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
}
```

## Modals & Overlays

### Modal

```css
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal {
  background: var(--bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  max-width: 480px;
  width: 100%;
  max-height: 85vh;
  overflow: auto;
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  font-weight: 600;
  font-size: 16px;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
```

### Dropdown

```css
.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  min-width: 180px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-md);
  z-index: 40;
  padding: 4px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: calc(var(--radius) - 2px);
  color: var(--foreground);
  transition: background 150ms;
}

.dropdown-item:hover {
  background: var(--bg-subtle);
}

.dropdown-separator {
  height: 1px;
  background: var(--border);
  margin: 4px 0;
}
```

## Badges & Tags

```css
.badge {
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 6px;
  font-size: 11px;
  font-weight: 500;
  border-radius: 10px;
  background: var(--bg-subtle);
  color: var(--text-secondary);
}

.badge-primary { background: var(--accent-muted); color: var(--accent); }
.badge-success { background: var(--success-muted); color: var(--success); }
.badge-warning { background: var(--warning-muted); color: var(--warning); }
.badge-error { background: var(--error-muted); color: var(--error); }
```

## Forms

### Form Layout

```css
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
}

.form-hint {
  font-size: 13px;
  color: var(--text-muted);
}

.form-error {
  font-size: 13px;
  color: var(--error);
}
```

### Checkbox & Radio

```css
.checkbox,
.radio {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-input,
.radio-input {
  width: 16px;
  height: 16px;
  border: 1px solid var(--border);
  background: var(--bg);
  appearance: none;
  cursor: pointer;
}

.checkbox-input { border-radius: 4px; }
.radio-input { border-radius: 50%; }

.checkbox-input:checked,
.radio-input:checked {
  background: var(--accent);
  border-color: var(--accent);
}

.checkbox-input:checked::after {
  content: '';
  display: block;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: translate(5px, 2px) rotate(45deg);
}

.radio-input:checked::after {
  content: '';
  display: block;
  width: 6px;
  height: 6px;
  background: white;
  border-radius: 50%;
  margin: 4px;
}
```

## Loading States

```css
/* Spinner */
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 600ms linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Skeleton */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-subtle) 25%,
    var(--bg-muted) 50%,
    var(--bg-subtle) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius);
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeleton-text { height: 14px; }
.skeleton-title { height: 24px; width: 60%; }
.skeleton-avatar { width: 40px; height: 40px; border-radius: 50%; }
```

## Layout Utilities

```css
/* Flexbox */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.gap-2 { gap: 8px; }
.gap-4 { gap: 16px; }

/* Grid */
.grid { display: grid; }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }

/* Spacing */
.p-2 { padding: 8px; }
.p-4 { padding: 16px; }
.p-6 { padding: 24px; }
.mt-4 { margin-top: 16px; }
.mb-4 { margin-bottom: 16px; }
```
