import type { Config } from "tailwindcss";
import { colors, typeScale } from "./lib/tokens";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: colors.background,
        surface: colors.surface,
        "surface-raised": colors.surfaceRaised,
        border: colors.border,
        "border-strong": colors.borderStrong,
        gold: colors.gold,
        "gold-bright": colors.goldBright,
        "gold-dim": colors.goldDim,
        ink: colors.ink,
        "ink-muted": colors.inkMuted,
        "ink-faint": colors.inkFaint,
        danger: colors.danger,
      },
      fontFamily: {
        heading: ["var(--font-heading)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      fontSize: {
        display: [typeScale.display, { lineHeight: "1.02" }],
        h1: [typeScale.h1, { lineHeight: "1.05" }],
        h2: [typeScale.h2, { lineHeight: "1.1" }],
        h3: [typeScale.h3, { lineHeight: "1.2" }],
        stat: [typeScale.stat, { lineHeight: "1" }],
      },
      maxWidth: {
        container: "1240px",
      },
      keyframes: {
        pulseGold: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
        marquee: "marquee 32s linear infinite",
        "marquee-reverse": "marquee-reverse 32s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
