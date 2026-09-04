"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

type CountUpProps = {
  end: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
};

/**
 * Counts up to `end` once the element scrolls into view. Mutates the DOM
 * node directly via GSAP's onUpdate instead of React state so a 60fps
 * tween never triggers a re-render.
 */
export function CountUp({
  end,
  prefix = "",
  suffix = "",
  duration = 1.6,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      const el = ref.current;
      const counter = { value: 0 };
      const formatter = new Intl.NumberFormat("en-GB");

      gsap.to(counter, {
        value: end,
        duration,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = `${prefix}${formatter.format(Math.round(counter.value))}${suffix}`;
        },
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          once: true,
        },
      });
    },
    { scope: ref, dependencies: [end, prefix, suffix, duration] }
  );

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}
