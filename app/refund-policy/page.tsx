import { LegalLayout, LegalSection } from "@/components/legal/LegalLayout";

export const metadata = {
  title: "Refund Policy — Precision HQ",
  description: "Precision HQ's refund and cancellation policy for VIP, Elite, Mentorship and the Sniper indicator.",
};

export default function RefundPolicyPage() {
  return (
    <LegalLayout title="Refund Policy" updated="17 August 2026">
      <p>
        This page sets out our refund policy for every product Precision HQ
        sells. Please read it before purchasing, since it&rsquo;s the same
        policy you agree to at checkout.
      </p>

      <LegalSection heading="VIP and Elite">
        <p>
          VIP and Elite are paid one time, either as a discounted rate
          alongside signing up with our recommended broker, or as a flat fee
          without a broker. Because access is granted shortly after payment,
          these purchases are <strong className="text-ink">non-refundable</strong>,
          whichever route you pick.
        </p>
      </LegalSection>

      <LegalSection heading="Free Insights">
        <p>
          Free Insights is free, with no signup or payment, so there is
          nothing to refund.
        </p>
      </LegalSection>

      <LegalSection heading="Precision HQ Sniper (Indicator)">
        <p>
          The indicator is a one-time payment for invite-only TradingView
          access. Because access is granted directly to your TradingView
          account shortly after checkout, this purchase is{" "}
          <strong className="text-ink">non-refundable</strong>. Please make
          sure the TradingView username you provide at checkout is correct,
          since access is tied to it.
        </p>
      </LegalSection>

      <LegalSection heading="1:1 Mentorship">
        <p>
          Mentorship is application-only. If your application is accepted
          and you go ahead, payment (whether in full or via the 3 month
          interest free payment plan, where offered) is{" "}
          <strong className="text-ink">non-refundable</strong> once the
          programme has started, including in cases where a payment plan is
          used and later instalments are still outstanding.
        </p>
      </LegalSection>

      <LegalSection heading="Exceptions">
        <p>
          Nothing in this policy affects any statutory rights you may have
          that cannot be excluded under applicable consumer protection law.
          If you believe a payment was made in error, or a product wasn&rsquo;t
          delivered as described, contact us and we&rsquo;ll look into it on a
          case by case basis.
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          Questions about a payment or this policy can be sent to us via the
          Telegram support links available throughout this site.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
