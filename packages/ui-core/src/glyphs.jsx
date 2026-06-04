// =============================================================================
// @ric/ui-core/glyphs — the canonical internal glyph set
// =============================================================================
// One source for the default fallback icons used across the components (close
// buttons, status icons, chevrons), so a check-circle in a Toast looks identical
// to one in a StatusBanner or a SelectableGlassCard. Components still accept
// caller-supplied icons via props — these are just the de-BEV'd defaults.
//
// All glyphs are 20x20, paint with currentColor, and take a `className` for
// sizing/color. Filled glyphs use even-odd paths; line glyphs are 2px round
// strokes. Never import an icon pack into @ric/ui-core.
// =============================================================================

const filled = (d) =>
  function FilledGlyph({ className }) {
    return (
      <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className={className}>
        <path fillRule="evenodd" clipRule="evenodd" d={d} />
      </svg>
    );
  };

const lined = (d) =>
  function LinedGlyph({ className }) {
    return (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
        <path d={d} />
      </svg>
    );
  };

// Filled — status / confirmation.
export const CheckCircle = filled('M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z');
export const XCircle = filled('M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.7 7.3a1 1 0 0 0-1.4 1.4L8.6 10l-1.3 1.3a1 1 0 1 0 1.4 1.4L10 11.4l1.3 1.3a1 1 0 0 0 1.4-1.4L11.4 10l1.3-1.3a1 1 0 0 0-1.4-1.4L10 8.6 8.7 7.3Z');
export const WarnTriangle = filled('M8.26 3.1c.77-1.33 2.71-1.33 3.48 0l5.58 9.65c.77 1.33-.19 3-1.74 3H4.42c-1.55 0-2.51-1.67-1.74-3L8.26 3.1ZM10 7a1 1 0 0 0-1 1v2a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z');
export const InfoCircle = filled('M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm0-12a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm1 4a1 1 0 1 0-2 0v3a1 1 0 1 0 2 0v-3Z');

// Line — actions / nav. `Check` is the bare checkmark (no circle).
export const Check = lined('M5 10.5l3.2 3.2L15 7');
export const XMark = lined('M6 6l8 8M14 6l-8 8');
export const ChevronLeft = lined('M12 5l-5 5 5 5');
export const ChevronRight = lined('M8 5l5 5-5 5');
