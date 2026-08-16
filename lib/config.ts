/**
 * Placeholder outbound links. Swap these for real Stripe checkout URLs
 * and the mentorship application form when ready. Every component that
 * renders a CTA takes its href as a prop defaulting to these constants,
 * so a single edit here updates the whole site.
 */
const telegramUsername = "Broadfxsupport";
const telegramPrefilledMessage =
  "Hey, I'm interested in joining Precision HQ. Can you send me the details?";
const affiliatePrefilledMessage =
  "Hey, I'm interested in becoming a sub IB affiliate. Can you send me the details?";
const accountSetupPrefilledMessage =
  "Hey, I have paid for access into Precision HQ and setup my trading account.";
const needHelpSetupPrefilledMessage =
  "Hey, I need help setting up my trading account for Precision HQ.";

export const links = {
  telegramCommunity: `https://t.me/${telegramUsername}?text=${encodeURIComponent(telegramPrefilledMessage)}`,
  affiliateApplication: `https://t.me/${telegramUsername}?text=${encodeURIComponent(affiliatePrefilledMessage)}`,
  confirmAccountSetup: `https://t.me/${telegramUsername}?text=${encodeURIComponent(accountSetupPrefilledMessage)}`,
  needHelpSetup: `https://t.me/${telegramUsername}?text=${encodeURIComponent(needHelpSetupPrefilledMessage)}`,
  dailyResults: "https://t.me/precisionhqresults",
  communityCheckout: "https://buy.stripe.com/7sYfZa6QV3kibfb9yv2cg3i",
  mentorshipApplication: "/apply",
  indicatorCheckout: "#REPLACE_WITH_STRIPE_CHECKOUT_LINK",
  instagram: "https://instagram.com/precisionhq_",
  tiktok: "https://tiktok.com/@precisionhq_",
} as const;

export const indicatorPrice = "£19.99";

/**
 * Post-payment broker sign-up step, shown on /welcome (the page Stripe
 * should redirect to after a successful Community payment, set in the
 * Payment Link's after-payment settings in the Stripe dashboard, not
 * something configurable from this codebase).
 */
export const welcomeChecklist = [
  "Sign up or transfer to one of the brokers below, using a Live MT5 (Platform 5) Standard account in GBP.",
  "Verify your ID and proof of address, most brokers require this before you can deposit.",
  "Make a deposit, we recommend starting with £300.",
  "Send a screenshot of your funded account to support to get your community invite.",
] as const;

export const brokers = [
  {
    name: "Vantage",
    signupUrl: "https://vigco.co/la-com-inv/Broadfx10",
    transferMethod: "form" as const,
    ibNumber: "7367369",
    ibFieldLabel: "New Affiliate Code/IB Number",
    transferSteps: [
      "Log in and go to Profile.",
      'Open the "Transfer IB/Affiliate" tab.',
      "Set Partnership Type to IB.",
      "Enter the IB number below in the New Affiliate Code/IB Number field.",
      "Confirm you've closed all open positions and agree to the transfer, then submit.",
    ],
    transferNote: null as string | null,
  },
  {
    name: "PU Prime",
    signupUrl: "https://puvip.co/la-partners/k8MqFkpw",
    transferMethod: "form" as const,
    ibNumber: "23216265",
    ibFieldLabel: "New CPA ID/IB Number",
    transferSteps: [
      "Log in and go to Profile.",
      'Open the "Transfer IB/CPA" tab.',
      "Set Partnership Type to IB.",
      "Enter the IB number below in the New CPA ID/IB Number field.",
      "Submit the request.",
    ],
    transferNote: null as string | null,
  },
  {
    name: "IC Markets",
    signupUrl: "https://ic.com/?camp=89932",
    transferMethod: "email" as const,
    transferEmail: "partners@icmarkets.com",
    transferEmailBody:
      "Hello, I hope this email finds you well.\n\nCan I please transfer my account under 89932.\n\nThanks",
  },
] as const;

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
