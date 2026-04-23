/**
 * Fixed South Indian (Kerala-style) rāśi box order for a 4×4 grid with a 2×2 merged centre.
 * Keys must match API §4b `planets` object keys (English rāśi names).
 */
export const SOUTH_INDIAN_GRID_SIGNS: readonly string[] = [
  "Meena",
  "Mesha",
  "Vrishabha",
  "Mithuna",
  "Kumbha",
  "Karka",
  "Makara",
  "Simha",
  "Dhanus",
  "Vrishchika",
  "Tula",
  "Kanya",
] as const;

/** 1-based row/col for a 4×4 CSS grid; centre is rows 2–3, cols 2–3 (merged separately). */
export const SOUTH_INDIAN_CELL_RC: readonly { row: number; col: number }[] = [
  { row: 1, col: 1 },
  { row: 1, col: 2 },
  { row: 1, col: 3 },
  { row: 1, col: 4 },
  { row: 2, col: 1 },
  { row: 2, col: 4 },
  { row: 3, col: 1 },
  { row: 3, col: 4 },
  { row: 4, col: 1 },
  { row: 4, col: 2 },
  { row: 4, col: 3 },
  { row: 4, col: 4 },
];
