// Thin wrapper around Plausible's queueing shim (see app/layout.tsx), so
// calling this before the script has finished loading still works instead
// of throwing, and it's a no-op if Plausible is blocked entirely.
export function trackEvent(name: string, props?: Record<string, string>) {
  if (typeof window === "undefined") return;
  const plausible = (window as typeof window & {
    plausible?: (name: string, opts?: { props?: Record<string, string> }) => void;
  }).plausible;
  plausible?.(name, props ? { props } : undefined);
}
