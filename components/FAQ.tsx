"use client";

import { useState } from "react";
import { Eyebrow } from "./ui/Eyebrow";
import { Reveal } from "./ui/Reveal";

const FAQS = [
  {
    question: "Do I need experience to join?",
    answer:
      "No. The Community is built to take you from the basics of the method through to applying it yourself. Mentorship works best once you already understand the core concepts and want direct feedback on your own execution.",
  },
  {
    question: "What markets do you trade?",
    answer:
      "XAUUSD (gold), GBPUSD and EURUSD. The method is the same top down process across all three. We stay focused on these rather than spreading across dozens of pairs.",
  },
  {
    question: "What is the difference between Community and Mentorship?",
    answer:
      "Community gives you daily trade ideas, live breakdowns and access to everyone else learning the method alongside you. Mentorship is 1:1, eight weeks working directly with Jack on your own trading, your own psychology and your own plan.",
  },
  {
    question: "What is your refund policy?",
    answer:
      "Both Community and Mentorship are non refundable. Community is a one time payment for instant access to existing content. Mentorship spots are limited and reserved for you once accepted, so refunds are not offered there either.",
  },
  {
    question: "How do I apply for mentorship?",
    answer:
      "Use the Apply For Mentorship button on this page. You will be asked a few questions about your trading so far and your goals. Jack reviews every application personally.",
  },
];

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="flex w-full items-center justify-between gap-4 py-6 text-left"
        >
          <span className="font-heading text-lg uppercase tracking-wide text-ink sm:text-xl">
            {question}
          </span>
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border-strong text-gold transition-transform duration-300 ${
              isOpen ? "rotate-45" : ""
            }`}
            aria-hidden="true"
          >
            <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
              <path d="M6 1v10M1 6h10" />
            </svg>
          </span>
        </button>
      </h3>
      <div
        className="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="min-h-0">
          <p className="max-w-2xl pb-6 font-body text-sm leading-relaxed text-ink-muted">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section-y container-px">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <Eyebrow>FAQ</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-4 text-h2 text-ink">Questions, Answered</h2>
        </Reveal>
      </div>

      <Reveal className="mx-auto mt-14 max-w-2xl">
        {FAQS.map((faq, i) => (
          <FAQItem
            key={faq.question}
            question={faq.question}
            answer={faq.answer}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </Reveal>
    </section>
  );
}
