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
  instagram: "https://instagram.com/REPLACE_WITH_HANDLE",
  tiktok: "https://tiktok.com/@REPLACE_WITH_HANDLE",
} as const;

export const indicatorPrice = "£19.99";

export const siteConfig = {
  name: "Precision HQ",
  founder: "Jack",
} as const;

/**
 * No real footage exists yet for the video hero variant, so these are left
 * empty on purpose. Nothing hotlinks a third party's video. Fill these in
 * with your own hosted clip/poster when you have one, the hero falls back
 * to a static gradient background until then.
 */
export const media = {
  heroVideoUrl: "",
  heroPosterUrl: "",
} as const;
