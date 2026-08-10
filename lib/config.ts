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
  instagram: "https://instagram.com/REPLACE_WITH_HANDLE",
  tiktok: "https://tiktok.com/@REPLACE_WITH_HANDLE",
} as const;

export const siteConfig = {
  name: "Precision HQ",
  founder: "Jack",
} as const;
