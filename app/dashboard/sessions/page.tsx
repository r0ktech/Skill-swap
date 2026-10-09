"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useMe, useMySessions } from "@/lib/hooks";
import type { Session } from "@/lib/types";
import { addDays, cn, formatDate, isSameDay, startOfDay } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { SessionCard } from "@/components/swap/SessionCard";

const TABS = ["upcoming", "past", "cancelled"] as const;
type Tab = (typeof TABS)[number];

function SessionsView() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const tab = (TABS.includes(params.get("tab") as Tab) ? params.get("tab") : "upcoming") as Tab;
  const sessions = useMySessions();
  const [day, setDay] = useState<Date | null>(null);

  const now = Date.now();
  const isOver = (s: Session) => new Date(s.startsAt).getTime() + s.durationMin * 60_000 < now;

  const lists: Record<Tab, Session[]> = {
    upcoming: sessions.filter((s) => s.status === "scheduled" && !isOver(s)),
    past: sessions.filter((s) => s.status === "completed" || (s.status === "scheduled" && isOver(s))).reverse(),
    cancelled: sessions.filter((s) => s.status === "cancelled"),
  };
  const visible = day ? sessions.filter((s) => isSameDay(new Date(s.startsAt), day)) : lists[tab];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Sessions"
        description="Your teaching and learning calendar."
        actions={
          <Button asChild variant="outline">
            <Link href="/dashboard/messages">Schedule from a chat</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-4">
          {day ? (
            <div className="flex items-center justify-between rounded-xl border bg-card px-4 py-2.5">
              <p className="text-sm font-medium">{formatDate(day.toISOString(), { weekday: "long", month: "long", day: "numeric" })}</p>
              <Button variant="ghost" size="sm" onClick={() => setDay(null)}>
                <X /> Show all
              </Button>
            </div>
          ) : (
            <Tabs value={tab} onValueChange={(v) => router.replace(`${pathname}?tab=${v}`, { scroll: false })}>
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming ({lists.upcoming.length})</TabsTrigger>
                <TabsTrigger value="past">Past ({lists.past.length})</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>
            </Tabs>
          )}

          {visible.length ? (
            <div className="grid gap-3">
              {visible.map((s) => (
                <SessionCard key={s.id} session={s} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={CalendarDays}
              title={day ? "Nothing on this day" : tab === "upcoming" ? "No upcoming sessions" : "Nothing here yet"}
              description={tab === "upcoming" ? "Open an active swap and hit Schedule to book a session." : undefined}
              action={
                tab === "upcoming" && !day ? (
                  <Button asChild>
                    <Link href="/dashboard/messages">Go to messages</Link>
                  </Button>
                ) : undefined
              }
            />
          )}
        </div>

        <MonthCalendar sessions={sessions} selected={day} onSelect={setDay} />
      </div>
    </div>
  );
}

function MonthCalendar({
  sessions,
  selected,
  onSelect,
}: {
  sessions: Session[];
  selected: Date | null;
  onSelect: (d: Date | null) => void;
}) {
  const me = useMe();
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const days = useMemo(() => {
    const first = new Date(cursor);
    const offset = (first.getDay() + 6) % 7; // Monday-first grid
    const start = addDays(first, -offset);
    return Array.from({ length: 42 }, (_, i) => startOfDay(addDays(start, i)));
  }, [cursor]);

  const byDay = useMemo(() => {
    const map = new Map<number, Session[]>();
    for (const s of sessions) {
      if (s.status === "cancelled") continue;
      const k = startOfDay(new Date(s.startsAt)).getTime();
      map.set(k, [...(map.get(k) ?? []), s]);
    }
    return map;
  }, [sessions]);

  const today = startOfDay(new Date());
  const shift = (n: number) => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + n, 1));

  return (
    <div className="h-fit rounded-xl border bg-card p-5 shadow-soft lg:sticky lg:top-24">
      <div className="flex items-center justify-between">
        <p className="font-display font-semibold">{cursor.toLocaleDateString([], { month: "long", year: "numeric" })}</p>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => shift(-1)} aria-label="Previous month">
            <ChevronLeft />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => shift(1)} aria-label="Next month">
            <ChevronRight />
          </Button>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-7 text-center text-[11px] font-medium text-muted-foreground">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <span key={i} className="py-1">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((d) => {
          const items = byDay.get(d.getTime()) ?? [];
          const inMonth = d.getMonth() === cursor.getMonth();
          const isSel = selected && isSameDay(selected, d);
          const isToday = d.getTime() === today.getTime();
          return (
            <button
              key={d.getTime()}
              onClick={() => onSelect(isSel ? null : d)}
              aria-label={`${d.toDateString()}${items.length ? `, ${items.length} sessions` : ""}`}
              aria-pressed={!!isSel}
              className={cn(
                "relative flex aspect-square flex-col items-center justify-center rounded-lg text-sm transition-colors",
                !inMonth && "text-muted-foreground/40",
                isSel ? "bg-foreground text-background" : "hover:bg-secondary",
                isToday && !isSel && "font-semibold ring-1 ring-inset ring-foreground/25"
              )}
            >
              {d.getDate()}
              {items.length > 0 && (
                <span className="absolute bottom-1.5 flex gap-0.5">
                  {items.slice(0, 3).map((s) => (
                    <span key={s.id} className={cn("size-1 rounded-full", s.teacherId === me?.id ? "bg-teach" : "bg-learn", isSel && "bg-background")} />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex gap-4 border-t pt-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-teach" /> Teaching
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-learn" /> Learning
        </span>
      </div>
    </div>
  );
}

export default function SessionsPage() {
  return (
    <Suspense>
      <SessionsView />
    </Suspense>
  );
}
