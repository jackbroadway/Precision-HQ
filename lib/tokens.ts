/**
 * Precision HQ shared design tokens.
 * Single source of truth for color, type and spacing decisions used by
 * tailwind.config.ts and any component that needs a raw value (charts,
 * inline SVG, canvas, etc). Change brand values here, not in components.
 */

export const colors = {
  background: "#0A0800",
  surface: "#120F08",
  surfaceRaised: "#1A1509",
  border: "rgba(201, 168, 76, 0.16)",
  borderStrong: "rgba(201, 168, 76, 0.32)",
  gold: "#C9A84C",
  goldBright: "#E4C877",
  goldDim: "#8A7233",
  ink: "#F3F1E8",
  inkMuted: "#A39C87",
  inkFaint: "#6B6555",
  danger: "#B5453A",
} as const;

export const fonts = {
  heading: "var(--font-heading)",
  body: "var(--font-body)",
  mono: "var(--font-mono)",
} as const;

/** Type scale in rem, tuned for a condensed uppercase heading face. */
export const typeScale = {
  display: "clamp(3rem, 2.2rem + 3.5vw, 5.5rem)",
  h1: "clamp(2.5rem, 1.9rem + 2.6vw, 4rem)",
  h2: "clamp(2rem, 1.65rem + 1.6vw, 2.75rem)",
  h3: "clamp(1.375rem, 1.2rem + 0.8vw, 1.75rem)",
  body: "1.0625rem",
  small: "0.875rem",
  stat: "clamp(2rem, 1.6rem + 1.8vw, 3rem)",
} as const;

/** Standard section vertical rhythm, mobile first. */
export const spacing = {
  sectionY: "clamp(4rem, 3rem + 4vw, 8rem)",
  containerX: "clamp(1.25rem, 1rem + 2vw, 2.5rem)",
} as const;

export const radii = {
  sm: "4px",
  md: "8px",
  lg: "14px",
} as const;

export const easing = {
  standard: "cubic-bezier(0.16, 1, 0.3, 1)",
} as const;
