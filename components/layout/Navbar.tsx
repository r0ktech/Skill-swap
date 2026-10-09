"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useHydrated, useMe } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/common/Logo";
import { NotificationsMenu } from "./NotificationsMenu";
import { UserMenu } from "./UserMenu";

const LINKS = [
  { href: "/browse", label: "Browse skills" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#categories", label: "Categories" },
];

export function Navbar() {
  const pathname = usePathname();
  const me = useMe();
  const hydrated = useHydrated();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled || open ? "border-b bg-background/85 backdrop-blur-lg" : "border-b border-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-6">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-full px-3.5 py-2 text-sm font-medium transition-colors hover:bg-secondary",
                pathname === l.href ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {!hydrated ? (
            <div className="h-9 w-28" />
          ) : me ? (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <NotificationsMenu />
              <UserMenu />
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Get started</Link>
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {open && (
        <nav className="container grid gap-1 pb-5 pt-1 animate-in fade-in-0 slide-in-from-top-2 md:hidden" aria-label="Mobile">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-lg px-3 py-3 text-base font-medium hover:bg-secondary">
              {l.label}
            </Link>
          ))}
          {me ? (
            <Link href="/dashboard" className="rounded-lg px-3 py-3 text-base font-medium hover:bg-secondary">
              Dashboard
            </Link>
          ) : (
            <Link href="/login" className="rounded-lg px-3 py-3 text-base font-medium hover:bg-secondary">
              Log in
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
