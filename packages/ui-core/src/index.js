export const components = {
  button: {
    variants: ['primary', 'secondary', 'ghost', 'danger'],
    states: ['default', 'hover', 'focus', 'disabled']
  },
  input: {
    types: ['text', 'email', 'password', 'search'],
    states: ['default', 'focus', 'error', 'disabled']
  },
  badge: {
    variants: ['neutral', 'success', 'warning', 'danger']
  }
};

export const accessibilityBaseline = {
  contrastRatio: 'WCAG AA',
  focusIndicator: 'Visible 2px ring',
  iconLabeling: 'Decorative icons aria-hidden, semantic icons labeled'
};
