export const components = {
  button: {
    variants: ['primary', 'secondary', 'ghost', 'danger', 'link'],
    sizes: ['sm', 'md', 'lg'],
    states: ['default', 'hover', 'focus', 'active', 'disabled', 'loading']
  },
  input: {
    types: ['text', 'email', 'password', 'search', 'number', 'tel', 'url'],
    sizes: ['sm', 'md', 'lg'],
    states: ['default', 'focus', 'error', 'success', 'disabled']
  },
  textarea: {
    sizes: ['sm', 'md', 'lg'],
    states: ['default', 'focus', 'error', 'disabled']
  },
  select: {
    sizes: ['sm', 'md', 'lg'],
    states: ['default', 'focus', 'error', 'disabled']
  },
  badge: {
    variants: ['neutral', 'success', 'warning', 'danger', 'info', 'primary'],
    sizes: ['sm', 'md']
  },
  card: {
    variants: ['default', 'elevated', 'outlined', 'filled'],
    sections: ['header', 'body', 'footer', 'media']
  },
  modal: {
    sizes: ['sm', 'md', 'lg', 'fullscreen'],
    parts: ['overlay', 'container', 'header', 'body', 'footer', 'close-button']
  },
  nav: {
    variants: ['topbar', 'sidebar', 'bottombar'],
    states: ['default', 'collapsed', 'expanded']
  },
  table: {
    features: ['sortable', 'paginated', 'selectable', 'striped', 'bordered'],
    parts: ['head', 'body', 'row', 'cell', 'header-cell', 'footer']
  },
  toast: {
    variants: ['success', 'warning', 'error', 'info'],
    positions: ['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center'],
    durations: { short: 3000, normal: 5000, long: 8000, persistent: null }
  },
  avatar: {
    sizes: ['xs', 'sm', 'md', 'lg', 'xl'],
    variants: ['image', 'initials', 'icon']
  },
  chip: {
    variants: ['default', 'primary', 'success', 'warning', 'danger'],
    states: ['default', 'selected', 'disabled'],
    interactive: true
  },
  dropdown: {
    variants: ['default', 'grouped'],
    parts: ['trigger', 'menu', 'item', 'divider', 'header']
  },
  tabs: {
    variants: ['line', 'pill', 'boxed'],
    states: ['default', 'active', 'disabled']
  },
  tooltip: {
    placements: ['top', 'bottom', 'left', 'right'],
    triggers: ['hover', 'focus', 'click']
  },
  spinner: {
    sizes: ['xs', 'sm', 'md', 'lg'],
    variants: ['ring', 'dots', 'pulse']
  },
  divider: {
    orientations: ['horizontal', 'vertical'],
    variants: ['solid', 'dashed', 'dotted']
  }
};

export const accessibilityBaseline = {
  contrastRatio: 'WCAG AA',
  focusIndicator: 'Visible 2px ring',
  iconLabeling: 'Decorative icons aria-hidden, semantic icons labeled',
  keyboardNav: 'All interactive elements reachable via Tab / Shift-Tab',
  motionSafe: 'Respect prefers-reduced-motion',
  screenReader: 'Live regions for toasts/alerts, role landmarks for nav',
  colorIndependence: 'Never convey meaning by color alone — always pair with icon or text'
};
