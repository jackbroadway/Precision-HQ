import Link from "next/link";
import { Logo } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { signOut } from "../actions";

const PARTNER_NAV = [
  ["/dashboard", "Dashboard"],
  ["/learn", "Playbook"],
  ["/assets", "Assets"],
  ["/announcements", "News"],
] as const;

const ADMIN_NAV = [
  ["/admin", "Partners"],
  ["/admin/announcements", "Announcements"],
  ["/admin/assets", "Assets"],
  ["/learn", "Playbook"],
] as const;

export default async function PortalLayout({ children }: LayoutProps<"/">) {
  const { profile } = await requireUser();
  const isAdmin = profile.role === "admin";

  return (
    <>
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-6">
            <Link href="/">
              <Logo />
            </Link>
            <nav className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs tracking-wider uppercase">
              {(isAdmin ? ADMIN_NAV : PARTNER_NAV).map(([href, label]) => (
                <Link key={href} href={href} className="text-dim hover:text-accent">
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-dim sm:inline">
              {profile.full_name ?? profile.email}
              <span className="ml-2 rounded-sm bg-accent-soft px-1.5 py-0.5 font-mono text-[10px] tracking-wider text-accent uppercase">
                {isAdmin ? "Admin" : "Sub-IB"}
              </span>
            </span>
            <form action={signOut}>
              <button className="font-mono text-xs tracking-wider text-dim uppercase hover:text-accent">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
    </>
  );
}
