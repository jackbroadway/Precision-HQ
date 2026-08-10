import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

const base =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm px-7 py-3.5 font-heading text-base uppercase tracking-wide transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-gold text-background hover:bg-gold-bright",
  secondary:
    "border border-border-strong text-ink hover:border-gold hover:text-gold",
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const isExternal = href.startsWith("http");

  return (
    <Link
      href={href}
      className={`${base} ${variants[variant]} ${className}`}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </Link>
  );
}
