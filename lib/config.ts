/**
 * Placeholder outbound links. Swap these for real Stripe checkout URLs,
 * the mentorship application form, and social profiles when ready. Every
 * component that renders a CTA takes its href as a prop defaulting to
 * these constants, so a single edit here updates the whole site.
 */
export const links = {
  telegramCommunity: "https://t.me/REPLACE_WITH_TELEGRAM_INVITE",
  communityCheckout: "#REPLACE_WITH_STRIPE_CHECKOUT_LINK",
  mentorshipApplication: "#REPLACE_WITH_APPLICATION_FORM_LINK",
  indicatorCheckout: "#REPLACE_WITH_STRIPE_CHECKOUT_LINK",
  instagram: "https://instagram.com/precisionhq_",
  tiktok: "https://tiktok.com/@precisionhq_",
} as const;

export const indicatorPrice = "£19.99";

export const siteConfig = {
  name: "Precision HQ",
  founder: "Jack",
} as const;

/**
 * Served from public/video, so this resolves to /video/hero-background.mp4
 * at runtime. No poster frame set, browsers show the first frame almost
 * immediately with preload="auto" so it's not been necessary.
 */
export const media = {
  heroVideoUrl: "/video/hero-background.mp4",
  heroPosterUrl: "",
} as const;
