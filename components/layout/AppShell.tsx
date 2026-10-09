"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import {
  ArrowLeftRight,
  CalendarDays,
  GraduationCap,
  Home,
  Lightbulb,
  MessageCircle,
  Search,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { useConversations, useHydrated, useMe } from "@/lib/hooks";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Logo } from "@/components/common/Logo";
import { NotificationsMenu } from "./NotificationsMenu";
import { UserMenu } from "./UserMenu";

interface NavItem {
  href: string;
  label: string;
  short?: string;
  icon: LucideIcon;
  badge?: number;
  mobile?: boolean;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const hydrated = useHydrated();
  const me = useMe();
  const conversations = useConversations();
  const sessions = useStore((s) => s.sessions);

  useEffect(() => {
    if (hydrated && !me) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [hydrated, me, pathname, router]);

  const unreadMessages = conversations.reduce((n, c) => n + c.unread, 0);
  const pendingIncoming = conversations.filter((c) => c.direction === "incoming" && c.swap.status === "pending").length;
  const upcoming = useMemo(
    () =>
      sessions.filter(
        (s) => s.status === "scheduled" && (s.teacherId === me?.id || s.learnerId === me?.id) && s.startsAt > new Date().toISOString()
      ).length,
    [sessions, me?.id]
  );

  const nav: NavItem[] = [
    { href: "/dashboard", label: "Overview", short: "Home", icon: Home, mobile: true },
    { href: "/dashboard/matches", label: "Matches", icon: ArrowLeftRight, badge: pendingIncoming, mobile: true },
    { href: "/dashboard/messages", label: "Messages", short: "Chat", icon: MessageCircle, badge: unreadMessages, mobile: true },
    { href: "/dashboard/sessions", label: "Sessions", icon: CalendarDays, badge: upcoming, mobile: true },
    { href: "/dashboard/my-skills", label: "Skills I teach", icon: Lightbulb },
    { href: "/dashboard/wanted-skills", label: "Skills I want", icon: GraduationCap },
    { href: "/dashboard/profile", label: "Settings", short: "Settings", icon: Settings, mobile: true },
  ];

  const isActive = (href: string) => (href === "/dashboard" ? pathname === href : pathname.startsWith(href));
  const fullBleed = pathname.startsWith("/dashboard/messages");

  return (
    <div className="min-h-dvh bg-background md:grid md:grid-cols-[248px_1fr]">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-dvh flex-col border-r bg-card md:flex">
        <div className="flex h-16 items-center px-5">
          <Logo href="/dashboard" />
        </div>
        <div className="px-3 pb-2">
          <Button asChild variant="outline" className="w-full justify-start text-muted-foreground">
            <Link href="/browse">
              <Search />
              Find a skill
            </Link>
          </Button>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2" aria-label="Dashboard">
          {nav.map((item, i) => (
            <div key={item.href}>
              {i === 4 && <p className="px-3 pb-1.5 pt-5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">Your skills</p>}
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive(item.href) ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                )}
              >
                <item.icon className="size-[18px]" />
                <span className="flex-1">{item.label}</span>
                {hydrated && !!item.badge && (
                  <span className="rounded-full bg-learn px-1.5 text-[11px] font-semibold leading-5 text-white">{item.badge}</span>
                )}
              </Link>
            </div>
          ))}
        </nav>
        {me && (
          <Link href={`/u/${me.id}`} className="m-3 flex items-center gap-3 rounded-xl border p-3 transition-colors hover:bg-secondary/60">
            <UserAvatar user={me} className="size-9" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{me.name}</p>
              <p className="text-xs text-muted-foreground">View public profile</p>
            </div>
          </Link>
        )}
      </aside>

      <div className="flex min-w-0 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b bg-background/85 px-4 backdrop-blur-lg md:px-8">
          <div className="md:hidden">
            <Logo href="/dashboard" />
          </div>
          <Link
            href="/browse"
            className="hidden h-10 w-full max-w-sm items-center gap-2 rounded-full border bg-card px-4 text-sm text-muted-foreground transition-colors hover:border-foreground/25 md:flex"
          >
            <Search className="size-4" />
            Search skills, people, topics…
          </Link>
          <div className="flex items-center gap-1.5">
            <Button asChild variant="ghost" size="icon" className="md:hidden" aria-label="Search skills">
              <Link href="/browse">
                <Search className="!size-[18px]" />
              </Link>
            </Button>
            {hydrated && me && (
              <>
                <NotificationsMenu />
                <UserMenu />
              </>
            )}
          </div>
        </header>

        <main
          className={cn(
            "flex-1",
            !fullBleed && "px-4 pb-24 pt-6 md:px-8 md:py-8"
          )}
        >
          {hydrated && me ? children : <ShellSkeleton />}
        </main>
      </div>

      {/* Mobile tab bar */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg md:hidden"
        aria-label="Dashboard"
      >
        {nav
          .filter((n) => n.mobile)
          .map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "relative flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium",
                isActive(item.href) ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <item.icon className={cn("size-5", isActive(item.href) && "stroke-[2.25]")} />
              {item.short ?? item.label}
              {hydrated && !!item.badge && (
                <span className="absolute left-1/2 top-2 ml-1.5 min-w-[16px] rounded-full bg-learn px-1 text-center text-[10px] font-semibold leading-4 text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
      </nav>
    </div>
  );
}

function ShellSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 md:px-0 md:py-0">
      <Skeleton className="h-9 w-64" />
      <div className="grid gap-4 sm:grid-cols-3">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
      <Skeleton className="h-72" />
    </div>
  );
}
