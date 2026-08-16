/**
 * Placeholder outbound links. Swap these for real Stripe checkout URLs
 * and the mentorship application form when ready. Every component that
 * renders a CTA takes its href as a prop defaulting to these constants,
 * so a single edit here updates the whole site.
 */
const telegramUsername = "Broadfxsupport";
const telegramPrefilledMessage =
  "Hey, I'm interested in joining Precision HQ. Can you send me the details?";

export const links = {
  telegramCommunity: `https://t.me/${telegramUsername}?text=${encodeURIComponent(telegramPrefilledMessage)}`,
  dailyResults: "https://t.me/precisionhqresults",
  communityCheckout: "https://buy.stripe.com/7sYfZa6QV3kibfb9yv2cg3i",
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
