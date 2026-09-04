"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Animate direct children in a staggered sequence instead of the block as one unit. */
  stagger?: boolean;
  /** Delay in seconds before the reveal starts, useful for offsetting sibling Reveals. */
  delay?: number;
  y?: number;
};

/**
 * Fade up reveal on scroll entry. Wraps ui-ux-pro-max's "Scroll Reveal"
 * (Standard tier) and "Stagger List" (Subtle tier) GSAP presets.
 */
export function Reveal({
  children,
  as: Tag = "div",
  className,
  stagger = false,
  delay = 0,
  y = 24,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      const target = stagger ? ref.current.children : ref.current;

      gsap.from(target, {
        opacity: 0,
        y,
        duration: 0.6,
        delay,
        stagger: stagger ? 0.1 : 0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: ref }
  );

  const Component = Tag as ElementType;

  return (
    <Component ref={ref} className={className}>
      {children}
    </Component>
  );
}
