import Link from "next/link";
import { Logo } from "@/components/common/Logo";

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { href: "/browse", label: "Browse skills" },
      { href: "/browse?category=Language", label: "Languages" },
      { href: "/browse?category=Development", label: "Development" },
      { href: "/browse?category=Design", label: "Design" },
    ],
  },
  {
    title: "Your account",
    links: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/dashboard/matches", label: "Matches" },
      { href: "/dashboard/sessions", label: "Sessions" },
      { href: "/dashboard/profile", label: "Settings" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/#how-it-works", label: "How it works" },
      { href: "#", label: "Community guidelines" },
      { href: "#", label: "Terms" },
      { href: "#", label: "Privacy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            A community where knowledge is the currency. Teach what you know, learn what you don&apos;t.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="text-sm font-semibold">{col.title}</p>
            <ul className="mt-4 grid gap-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t">
        <div className="container flex flex-col gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} SkillSwap. All rights reserved.</p>
          <p>Made by people who swap skills, for people who swap skills.</p>
        </div>
      </div>
    </footer>
  );
}
