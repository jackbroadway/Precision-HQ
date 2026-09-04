import { LegalLayout, LegalSection } from "@/components/legal/LegalLayout";

export const metadata = {
  title: "Terms & Conditions — Precision HQ",
  description: "The terms that govern use of Precision HQ's website, community, mentorship and indicator.",
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms &amp; Conditions" updated="17 August 2026">
      <p>
        These terms govern your use of the Precision HQ website, the free
        and paid Telegram community, the 1:1 mentorship programme and the
        Precision HQ Sniper indicator (together, the &ldquo;Services&rdquo;).
        By accessing the website, joining the community, applying for
        mentorship or purchasing the indicator, you agree to these terms. If
        you do not agree, do not use the Services.
      </p>

      <LegalSection heading="Who We Are">
        <p>
          Precision HQ is a trading education brand run by Jack, alongside
          the Precision HQ team. You can reach us via the Telegram support
          links on this site.
        </p>
      </LegalSection>

      <LegalSection heading="Eligibility">
        <p>
          You must be at least 18 years old to purchase or use any Precision
          HQ product. By purchasing, you confirm you meet this requirement
          and that you are responsible for complying with any laws that
          apply to you in your own country, including any restrictions on
          receiving trading education or opening an account with a broker.
        </p>
      </LegalSection>

      <LegalSection heading="Educational Purpose Only">
        <p>
          Precision HQ is an education and community product. Nothing
          published on the website, inside the community, in mentorship
          sessions, or via the Sniper indicator constitutes financial,
          investment, legal or tax advice, and none of it is a personal
          recommendation to buy or sell any financial instrument. Trade
          ideas, daily bias notes and market commentary reflect our own
          analysis and opinions at a point in time, not advice tailored to
          your circumstances. See our{" "}
          <a href="/risk-disclaimer" className="text-gold hover:underline">
            Risk Disclaimer
          </a>{" "}
          for more detail.
        </p>
      </LegalSection>

      <LegalSection heading="The Services">
        <p>
          <strong className="text-ink">Free Insights</strong> is a free
          Telegram channel with a random selection of trade ideas and daily
          student results. No signup or payment is required.
        </p>
        <p>
          <strong className="text-ink">VIP</strong> and{" "}
          <strong className="text-ink">Elite</strong> are one-time payments
          for access to the paid Telegram channels described on the site,
          for as long as we continue to operate them. Both can be joined
          either at a discounted rate alongside a £300+ top-up of your own
          trading account (this is your trading capital, not a fee paid to
          us), or as a flat one-time fee without a top-up, as set out on the
          pricing section of the website.
        </p>
        <p>
          <strong className="text-ink">1:1 Mentorship</strong> is an
          application-only 8-week programme working directly with Jack.
          Acceptance is at our discretion. Where offered, a 3 month interest
          free payment plan is a payment method only, not a subscription or
          ongoing service commitment beyond the agreed programme.
        </p>
        <p>
          <strong className="text-ink">Precision HQ Sniper</strong> is a
          TradingView indicator. Access is invite-only and granted to the
          TradingView username you provide at checkout. You are responsible
          for providing an accurate username; we are not liable for delays
          or failure to grant access caused by an incorrect submission.
        </p>
      </LegalSection>

      <LegalSection heading="Payment and Refunds">
        <p>
          All prices are shown in GBP. Sniper indicator payments are
          processed securely by Stripe; we do not store your card details.
          Payment details for VIP and Elite are provided directly when you
          message us to join. VIP, Elite and the Sniper indicator are
          one-time, non-refundable payments. Mentorship is non-refundable
          once your application is accepted and the programme has started.
          Full detail is in our{" "}
          <a href="/refund-policy" className="text-gold hover:underline">
            Refund Policy
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection heading="Acceptable Use">
        <p>
          You agree not to share, resell, redistribute or publicly
          republish community content, mentorship material, or access to
          the Sniper indicator. Indicator access is personal to the
          TradingView username you registered and may not be shared or
          transferred. We may suspend or terminate access, without refund,
          if we reasonably believe these terms have been breached.
        </p>
      </LegalSection>

      <LegalSection heading="Intellectual Property">
        <p>
          The Precision HQ name, branding, website content, educational
          material, and the Sniper indicator are owned by us or our
          licensors. Purchasing access grants you a personal, non-transferable
          licence to use them; it does not transfer ownership.
        </p>
      </LegalSection>

      <LegalSection heading="Liability">
        <p>
          To the fullest extent permitted by law, Precision HQ is not liable
          for any trading losses, loss of profits, or indirect losses
          arising from your use of the Services or reliance on any content
          we publish. Trading financial markets carries a high level of
          risk and may not be suitable for all investors, as set out in our{" "}
          <a href="/risk-disclaimer" className="text-gold hover:underline">
            Risk Disclaimer
          </a>
          . Nothing in these terms excludes liability that cannot be
          excluded under applicable law.
        </p>
      </LegalSection>

      <LegalSection heading="Changes To These Terms">
        <p>
          We may update these terms from time to time to reflect changes to
          the Services or for legal reasons. The &ldquo;last updated&rdquo;
          date at the top of this page shows when it was last revised.
          Continued use of the Services after a change means you accept the
          updated terms.
        </p>
      </LegalSection>

      <LegalSection heading="Governing Law">
        <p>
          These terms are governed by the laws of England and Wales, and
          any disputes will be subject to the exclusive jurisdiction of the
          courts of England and Wales.
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          Questions about these terms can be sent to us via the Telegram
          support links available throughout this site.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
