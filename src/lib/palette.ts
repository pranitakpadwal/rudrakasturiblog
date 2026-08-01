// No JSON imports here on purpose: this gets imported by client
// components (HomeThumb, HeroSlider) and must stay tiny in the bundle,
// unlike lib/content.ts which pulls in the full posts dataset.

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// A small, restrained set of duotones: used only for the single article
// hero banner, never repeated across grids/cards.
export const DUOTONES: [string, string][] = [
  ["#1c1917", "#8a5a3b"], // ink / clay
  ["#0f1f1c", "#2f6f5e"], // pine / sage
  ["#1a1423", "#5b3a8f"], // aubergine / violet
  ["#1e2a3a", "#3d6b8a"], // navy / slate blue
  ["#241a12", "#b5651d"], // espresso / rust
  ["#151515", "#4a4a4a"], // charcoal / graphite
];

export function duotoneForSlug(slug: string): [string, string] {
  return DUOTONES[hashString(slug) % DUOTONES.length];
}

// A muted, print-catalogue palette keyed by category: same category always
// gets the same color, so the color itself carries information (which
// section a post belongs to) instead of being random decoration.
const CATEGORY_COLORS = [
  "#7a5c3e", // clay
  "#3d6b56", // pine
  "#4a5a7a", // slate blue
  "#7a3e4a", // brick
  "#5c5c3e", // olive
  "#3e6b7a", // teal
  "#6b4a7a", // plum
  "#7a6b3e", // ochre
];

export function categoryColor(category: string): string {
  return CATEGORY_COLORS[hashString(category) % CATEGORY_COLORS.length];
}
