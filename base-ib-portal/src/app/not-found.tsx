import { ButtonLink, Logo } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <Logo className="text-4xl" />
      <p className="text-dim">That page doesn&apos;t exist.</p>
      <ButtonLink href="/" variant="secondary">
        Go home
      </ButtonLink>
    </main>
  );
}
