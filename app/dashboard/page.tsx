"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, ArrowLeftRight, CalendarDays, Check, Circle, Clock, Inbox, Sparkles, Star } from "lucide-react";
import { useConversations, useMatches, useMe, useMySessions, useRatings } from "@/lib/hooks";
import { useStore } from "@/lib/store";
import { cn, firstName, formatChatTime } from "@/lib/utils";
import { UserAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/common/EmptyState";
import { SuggestionCard, SwapRow } from "@/components/swap/MatchCards";
import { SessionCard } from "@/components/swap/SessionCard";

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

export default function DashboardPage() {
  const me = useMe()!;
  const conversations = useConversations();
  const sessions = useMySessions();
  const matches = useMatches();
  const ratingFor = useRatings();
  const skills = useStore((s) => s.skills);
  const wants = useStore((s) => s.wants);

  const nowIso = new Date().toISOString();
  const upcoming = sessions.filter((s) => s.status === "scheduled" && s.startsAt > nowIso);
  const needsAction = sessions.filter(
    (s) => s.status === "scheduled" && new Date(s.startsAt).getTime() + s.durationMin * 60_000 < Date.now()
  );
  const completed = sessions.filter((s) => s.status === "completed");
  const hoursTaught = completed.filter((s) => s.teacherId === me.id).reduce((n, s) => n + s.durationMin, 0) / 60;
  const hoursLearned = completed.filter((s) => s.learnerId === me.id).reduce((n, s) => n + s.durationMin, 0) / 60;
  const incoming = conversations.filter((c) => c.direction === "incoming" && c.swap.status === "pending");
  const active = conversations.filter((c) => c.swap.status === "accepted");
  const recent = conversations.filter((c) => c.lastMessage).slice(0, 4);
  const rating = ratingFor(me.id);

  const checklist = useMemo(
    () => [
      { label: "Add a profile photo", done: !!me.avatar, href: "/dashboard/profile" },
      { label: "Write a short bio", done: me.bio.length > 20, href: "/dashboard/profile" },
      { label: "Offer a skill", done: skills.some((s) => s.userId === me.id), href: "/dashboard/my-skills" },
      { label: "Add something to learn", done: wants.some((w) => w.userId === me.id), href: "/dashboard/wanted-skills" },
      { label: "Start your first swap", done: conversations.length > 0, href: "/dashboard/matches" },
    ],
    [me, skills, wants, conversations.length]
  );
  const progress = checklist.filter((c) => c.done).length;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <h1 className="mt-1 text-[28px] font-semibold md:text-[32px]">
            {greeting()}, {firstName(me.name)}
          </h1>
        </div>
        <Button asChild variant="outline">
          <Link href="/browse">
            <Sparkles /> Find something to learn
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat icon={ArrowLeftRight} label="Active swaps" value={active.length} tint="bg-learn-soft text-learn-ink" href="/dashboard/matches?tab=active" />
        <Stat icon={CalendarDays} label="Upcoming sessions" value={upcoming.length} tint="bg-warning-soft text-warning" href="/dashboard/sessions" />
        <Stat
          icon={Clock}
          label="Hours taught · learned"
          value={`${hoursTaught.toFixed(hoursTaught % 1 ? 1 : 0)} · ${hoursLearned.toFixed(hoursLearned % 1 ? 1 : 0)}`}
          tint="bg-teach-soft text-teach-ink"
          href="/dashboard/sessions?tab=past"
        />
        <Stat
          icon={Star}
          label={`Rating · ${rating.count} reviews`}
          value={rating.count ? rating.average.toFixed(1) : "—"}
          tint="bg-amber-100 text-amber-600"
          href={`/u/${me.id}#reviews`}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-6">
          {/* Needs your attention */}
          {(incoming.length > 0 || needsAction.length > 0) && (
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                Needs your attention
                <span className="rounded-full bg-learn px-2 text-xs font-semibold leading-5 text-white">
                  {incoming.length + needsAction.length}
                </span>
              </h2>
              <div className="grid gap-3">
                {incoming.map((c) => (
                  <SwapRow key={c.swap.id} conversation={c} />
                ))}
                {needsAction.map((s) => (
                  <SessionCard key={s.id} session={s} />
                ))}
              </div>
            </section>
          )}

          {/* Up next */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Up next</h2>
              <Link href="/dashboard/sessions" className="text-sm text-muted-foreground hover:text-foreground">
                All sessions
              </Link>
            </div>
            {upcoming.length ? (
              <div className="grid gap-3">
                {upcoming.slice(0, 2).map((s) => (
                  <SessionCard key={s.id} session={s} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={CalendarDays}
                title="No sessions booked"
                description="Open an active swap and schedule your next session."
                action={
                  <Button asChild size="sm">
                    <Link href="/dashboard/messages">Go to messages</Link>
                  </Button>
                }
              />
            )}
          </section>

          {/* Suggested matches */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Suggested for you</h2>
              <Link href="/dashboard/matches" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                See all <ArrowRight className="size-3.5" />
              </Link>
            </div>
            {matches.length ? (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {matches.slice(0, 2).map((m) => (
                  <SuggestionCard key={m.user.id} match={m} compact />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Sparkles}
                title="No suggestions yet"
                description="Add skills you want to learn and we'll find people who teach them."
                action={
                  <Button asChild size="sm">
                    <Link href="/dashboard/wanted-skills">Add to learning list</Link>
                  </Button>
                }
              />
            )}
          </section>
        </div>

        <div className="space-y-6">
          {progress < checklist.length && (
            <Card>
              <CardHeader>
                <CardTitle>Finish your profile</CardTitle>
                <span className="text-sm font-medium text-muted-foreground">
                  {progress}/{checklist.length}
                </span>
              </CardHeader>
              <CardContent>
                <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teach to-learn transition-all"
                    style={{ width: `${(progress / checklist.length) * 100}%` }}
                  />
                </div>
                <ul className="mt-4 grid gap-1">
                  {checklist.map((c) => (
                    <li key={c.label}>
                      <Link
                        href={c.href}
                        className={cn(
                          "flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-secondary",
                          c.done && "text-muted-foreground line-through"
                        )}
                      >
                        {c.done ? <Check className="size-4 text-success" /> : <Circle className="size-4 text-muted-foreground/50" />}
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Recent messages</CardTitle>
              <Link href="/dashboard/messages" className="text-sm text-muted-foreground hover:text-foreground">
                Open
              </Link>
            </CardHeader>
            <CardContent className="px-2 pb-2">
              {recent.length ? (
                <ul>
                  {recent.map((c) => (
                    <li key={c.swap.id}>
                      <Link
                        href={`/dashboard/messages?c=${c.swap.id}`}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-secondary"
                      >
                        <UserAvatar user={c.other} className="size-9" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className={cn("truncate text-sm", c.unread ? "font-semibold" : "font-medium")}>{c.other.name}</p>
                            <span className="shrink-0 text-[11px] text-muted-foreground">{formatChatTime(c.lastMessage!.createdAt)}</span>
                          </div>
                          <p className={cn("truncate text-[13px]", c.unread ? "text-foreground" : "text-muted-foreground")}>
                            {c.lastMessage!.senderId === me.id && "You: "}
                            {c.lastMessage!.text}
                          </p>
                        </div>
                        {c.unread > 0 && <span className="size-2 shrink-0 rounded-full bg-learn" />}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="flex items-center gap-2 px-3 py-6 text-sm text-muted-foreground">
                  <Inbox className="size-4" /> No conversations yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  tint,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  tint: string;
  href: string;
}) {
  return (
    <Link href={href} className="group rounded-xl border bg-card p-4 shadow-soft transition-colors hover:border-foreground/15 md:p-5">
      <span className={cn("grid size-9 place-items-center rounded-lg", tint)}>
        <Icon className="size-[18px]" />
      </span>
      <p className="mt-4 font-display text-2xl font-semibold md:text-[28px]">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground md:text-sm">{label}</p>
    </Link>
  );
}
