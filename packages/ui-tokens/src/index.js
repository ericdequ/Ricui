export const tokens = {
  color: {
    background: '#0F172A',
    surface: '#111827',
    surfaceAlt: '#1E293B',
    border: '#334155',
    text: '#E5E7EB',
    textMuted: '#94A3B8',
    primary: '#22D3EE',
    primaryHover: '#06B6D4',
    secondary: '#818CF8',
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#60A5FA'
  },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, '2xl': 32, '3xl': 48 },
  radius: { sm: 4, md: 8, lg: 12, xl: 16, pill: 9999 /* large value renders a fully rounded pill shape */ },
  shadow: {
    sm: '0 1px 2px rgba(0,0,0,0.4)',
    md: '0 4px 6px rgba(0,0,0,0.4)',
    lg: '0 10px 15px rgba(0,0,0,0.4)',
    focus: '0 0 0 2px #22D3EE'
  },
  typography: {
    body: 'Inter, system-ui, -apple-system, Segoe UI, sans-serif',
    mono: 'JetBrains Mono, ui-monospace, SFMono-Regular, monospace',
    heading: 'Inter, system-ui, -apple-system, sans-serif',
    size: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem', '3xl': '2rem' },
    weight: { normal: 400, medium: 500, semibold: 600, bold: 700 },
    lineHeight: { tight: 1.25, normal: 1.5, relaxed: 1.75 }
  },
  motion: { quick: '120ms', normal: '200ms', slow: '300ms', easing: 'cubic-bezier(0.4,0,0.2,1)' },
  zIndex: { base: 0, raised: 10, dropdown: 100, overlay: 200, modal: 300, toast: 400 }
};

export const themes = {
  dark: {
    background: '#0F172A',
    surface: '#111827',
    surfaceAlt: '#1E293B',
    border: '#334155',
    text: '#E5E7EB',
    textMuted: '#94A3B8',
    primary: '#22D3EE',
    primaryHover: '#06B6D4'
  },
  light: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceAlt: '#F1F5F9',
    border: '#CBD5E1',
    text: '#0F172A',
    textMuted: '#64748B',
    primary: '#0891B2',
    primaryHover: '#0E7490'
  },
  brand: {
    background: '#030712',
    surface: '#0F172A',
    surfaceAlt: '#111827',
    border: '#1E293B',
    text: '#F9FAFB',
    textMuted: '#6B7280',
    primary: '#22D3EE',
    primaryHover: '#06B6D4'
  }
};
