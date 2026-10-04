import { LegalLayout, LegalSection } from "@/components/legal/LegalLayout";

export const metadata = {
  title: "Risk Disclaimer — Precision HQ",
  description: "Important information about the risks of trading before using Precision HQ's products.",
};

export default function RiskDisclaimerPage() {
  return (
    <LegalLayout title="Risk Disclaimer" updated="17 August 2026">
      <p>
        Please read this page carefully before joining the community,
        applying for mentorship, or using the Precision HQ Sniper indicator.
      </p>

      <LegalSection heading="Trading Is High Risk">
        <p>
          Trading foreign exchange, gold, and other financial instruments on
          margin carries a high level of risk and may not be suitable for
          all investors. You could lose some or all of your invested
          capital, and losses can happen quickly. You should never trade
          with money you cannot afford to lose.
        </p>
      </LegalSection>

      <LegalSection heading="No Guarantee Of Results">
        <p>
          Past results, trade ideas, certificates, and testimonials shared
          on this website, inside the community, or during mentorship are
          not a guarantee or reliable indicator of future performance. Any
          individual&rsquo;s results, including those shown as examples,
          are not typical and should not be relied on as a promise of what
          you will achieve.
        </p>
      </LegalSection>

      <LegalSection heading="Educational Content, Not Advice">
        <p>
          Everything Precision HQ publishes, including daily bias notes,
          trade ideas, market commentary, mentorship sessions, and the
          Sniper indicator, is provided for educational and informational
          purposes only. None of it is personalised financial advice, and
          none of it is a recommendation to buy, sell, or hold any specific
          financial instrument. You are solely responsible for your own
          trading decisions.
        </p>
      </LegalSection>

      <LegalSection heading="The Sniper Indicator">
        <p>
          The Sniper indicator is a decision support tool built for traders
          who already understand market structure concepts. It does not
          provide financial advice and does not guarantee results. Past
          structure does not predict future price movement. Always apply
          your own risk management alongside any tool you use.
        </p>
      </LegalSection>

      <LegalSection heading="Seek Independent Advice">
        <p>
          If you are unsure whether trading is right for you, we recommend
          speaking to an independent, appropriately regulated financial
          adviser before you start.
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          Questions about this disclaimer can be sent to us via the
          Telegram support links available throughout this site.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
