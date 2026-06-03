// =============================================================================
// @ric/ui-tokens/tailwind — shared Tailwind preset
// =============================================================================
// Consuming apps add this to their tailwind.config so the role palette, radii,
// and gradients resolve as utility classes (e.g. `bg-role-meetup-500`,
// `bg-grad-card-accent`, `rounded-2xl`). Components fall back to standard
// hue classes when an app skips the preset, so this is additive, not required.
//
//   // tailwind.config.js
//   import { ricTailwindPreset } from '@ric/ui-tokens/tailwind';
//   export default { presets: [ricTailwindPreset], content: [...] };
// =============================================================================

import { ROLE_PALETTE, GRADIENTS, RADIUS } from './index.js';

const backgroundImage = Object.fromEntries(
  Object.entries(GRADIENTS).map(([key, value]) => [`grad-${key}`, value]),
);

export const ricTailwindPreset = {
  theme: {
    extend: {
      colors: { role: ROLE_PALETTE },
      borderRadius: RADIUS,
      backgroundImage,
    },
  },
};

export default ricTailwindPreset;
