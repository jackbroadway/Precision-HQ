// Small shared UI primitives. Plain server-safe components (no hooks).
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cx("font-display text-2xl font-extrabold tracking-wide uppercase", className)}>
      Base<span className="text-accent">.</span>IB
    </span>
  );
}

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cx("rounded-sm border border-line bg-surface p-6 shadow-sm", className)}
      {...props}
    />
  );
}

export function PageHeader({
  eyebrow,
  title,
  actions,
}: {
  eyebrow?: string;
  title: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="font-mono text-xs tracking-widest text-accent uppercase">{eyebrow}</p>
        )}
        <h1 className="font-display text-4xl font-bold tracking-wide uppercase">{title}</h1>
      </div>
      {actions}
    </div>
  );
}

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-sm px-4 py-2 font-mono text-sm font-semibold tracking-wide uppercase transition disabled:cursor-not-allowed disabled:opacity-60";

const buttonVariants = {
  primary: "bg-accent text-on-accent hover:brightness-110",
  secondary: "border border-line bg-surface-2 text-text hover:border-accent",
  danger: "border border-danger bg-danger-soft text-danger hover:brightness-110",
};

type Variant = keyof typeof buttonVariants;

export function Button({
  variant = "primary",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return <button className={cx(buttonBase, buttonVariants[variant], className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={cx(buttonBase, buttonVariants[variant], className)} {...props} />;
}

export function Label({ className, ...props }: ComponentProps<"label">) {
  return (
    <label
      className={cx("mb-1 block font-mono text-xs tracking-wider text-dim uppercase", className)}
      {...props}
    />
  );
}

const inputClass =
  "w-full rounded-sm border border-line bg-bg px-3 py-2 text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cx(inputClass, className)} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={cx(inputClass, className)} {...props} />;
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? (
        <p className="mt-1 text-sm text-danger">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-sm text-faint">{hint}</p>
      ) : null}
    </div>
  );
}

export function Alert({
  tone = "danger",
  children,
}: {
  tone?: "danger" | "ok";
  children: ReactNode;
}) {
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cx(
        "rounded-sm border px-4 py-3 text-sm",
        tone === "danger"
          ? "border-danger bg-danger-soft text-danger"
          : "border-ok bg-ok-soft text-ok",
      )}
    >
      {children}
    </div>
  );
}

export function StatusBadge({ status }: { status: "active" | "inactive" }) {
  return (
    <span
      className={cx(
        "inline-block rounded-sm px-2 py-0.5 font-mono text-xs tracking-wider uppercase",
        status === "active" ? "bg-ok-soft text-ok" : "bg-surface-2 text-faint",
      )}
    >
      {status}
    </span>
  );
}

export function Stat({ label, value, mono }: { label: string; value: ReactNode; mono?: boolean }) {
  return (
    <div>
      <dt className="font-mono text-xs tracking-wider text-faint uppercase">{label}</dt>
      <dd className={cx("mt-1 text-lg", mono && "font-mono")}>{value}</dd>
    </div>
  );
}
