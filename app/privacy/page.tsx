import { LegalLayout, LegalSection } from "@/components/legal/LegalLayout";

export const metadata = {
  title: "Privacy Policy — Precision HQ",
  description: "How Precision HQ collects, uses and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="17 August 2026">
      <p>
        This policy explains what personal data Precision HQ collects when
        you use this website or purchase our products, why we collect it,
        and how it&rsquo;s handled.
      </p>

      <LegalSection heading="What We Collect">
        <p>
          <strong className="text-ink">Mentorship applications</strong>: the
          information you submit in the application form, including your
          name, contact details, and answers about your trading experience.
        </p>
        <p>
          <strong className="text-ink">Sniper indicator purchases</strong>:
          payment is handled entirely by Stripe. We receive your email
          address and order details from Stripe; we never see or store your
          full card number.
        </p>
        <p>
          <strong className="text-ink">Indicator access</strong>: the
          TradingView username you provide at checkout, used only to grant
          you invite-only access to the indicator.
        </p>
        <p>
          <strong className="text-ink">VIP, Elite and support</strong>: if
          you message us on Telegram to join VIP or Elite, ask a question, or
          get support, we can see whatever Telegram shares with us as part
          of that conversation (your Telegram username and messages),
          governed by Telegram&rsquo;s own privacy policy as well as this
          one.
        </p>
      </LegalSection>

      <LegalSection heading="How We Use It">
        <ul className="list-disc pl-5">
          <li>To process your payment and deliver the product you bought.</li>
          <li>To review and respond to mentorship applications.</li>
          <li>To grant and manage indicator access on TradingView.</li>
          <li>To provide support when you contact us.</li>
          <li>To meet our legal and accounting obligations.</li>
        </ul>
        <p>
          We do not sell your personal data, and we do not use it for
          advertising or profiling.
        </p>
      </LegalSection>

      <LegalSection heading="Who We Share It With">
        <p>
          We use a small number of third-party services to run Precision
          HQ, and your data passes through them as part of normal
          operation:
        </p>
        <ul className="list-disc pl-5">
          <li>
            <strong className="text-ink">Stripe</strong> &mdash; payment
            processing.
          </li>
          <li>
            <strong className="text-ink">Netlify</strong> &mdash; website
            hosting and processing of the mentorship application form.
          </li>
          <li>
            <strong className="text-ink">Telegram</strong> &mdash; community
            access and support messaging.
          </li>
          <li>
            <strong className="text-ink">TradingView</strong> &mdash;
            delivery of indicator access.
          </li>
        </ul>
        <p>
          Each of these providers processes data under its own privacy
          policy. We don&rsquo;t share your data with anyone outside of what&rsquo;s
          needed to deliver the Services above.
        </p>
      </LegalSection>

      <LegalSection heading="How Long We Keep It">
        <p>
          We keep application and purchase records for as long as needed to
          deliver the Services, resolve support issues, and meet our legal
          and accounting obligations, after which it&rsquo;s deleted or
          anonymised.
        </p>
      </LegalSection>

      <LegalSection heading="Analytics">
        <p>
          We use Plausible Analytics to understand how visitors use this
          website, for example which pages are viewed and which buttons are
          clicked. Plausible is cookie-free and does not collect or store
          any personal data or track you across other websites; it only
          reports aggregated statistics. See{" "}
          <a
            href="https://plausible.io/data-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:underline"
          >
            Plausible&rsquo;s data policy
          </a>{" "}
          for detail. We do not use advertising cookies or trackers.
        </p>
      </LegalSection>

      <LegalSection heading="Your Rights">
        <p>
          Under UK data protection law, you can ask us what personal data we
          hold about you, ask us to correct it, or ask us to delete it,
          subject to what we&rsquo;re legally required to keep (for example,
          payment records for accounting purposes). To make a request,
          contact us via the Telegram support links on this site.
        </p>
      </LegalSection>

      <LegalSection heading="Changes To This Policy">
        <p>
          We may update this policy from time to time. The &ldquo;last
          updated&rdquo; date at the top of this page shows when it was last
          revised.
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          Questions about this policy, or requests relating to your data,
          can be sent to us via the Telegram support links available
          throughout this site.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
