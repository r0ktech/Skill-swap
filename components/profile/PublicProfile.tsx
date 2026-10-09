"use client";

import Link from "next/link";
import { useMemo } from "react";
import { CalendarClock, Globe, GraduationCap, MapPin, MessageCircle, Pencil, Sparkles, UserX } from "lucide-react";
import { useConversations, useMatches, useMe, useRatings, useUserLookup } from "@/lib/hooks";
import { useStore } from "@/lib/store";
import { formatDate, timeAgo } from "@/lib/utils";
import { UserAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { Hydrated } from "@/components/common/Hydrated";
import { Stars } from "@/components/common/StarRating";
import { SkillCard } from "@/components/skills/SkillCard";

export function PublicProfile({ id }: { id: string }) {
  return (
    <Hydrated
      fallback={
        <div className="container space-y-6 py-12">
          <Skeleton className="h-48" />
          <Skeleton className="h-72" />
        </div>
      }
    >
      <ProfileInner id={id} />
    </Hydrated>
  );
}

function ProfileInner({ id }: { id: string }) {
  const me = useMe();
  const getUser = useUserLookup();
  const ratingFor = useRatings();
  const skills = useStore((s) => s.skills);
  const wants = useStore((s) => s.wants);
  const reviews = useStore((s) => s.reviews);
  const sessions = useStore((s) => s.sessions);
  const matches = useMatches();
  const conversations = useConversations();

  const user = getUser(id);
  const theirSkills = useMemo(() => skills.filter((s) => s.userId === id), [skills, id]);
  const theirWants = useMemo(() => wants.filter((w) => w.userId === id), [wants, id]);
  const theirReviews = useMemo(() => reviews.filter((r) => r.subjectId === id), [reviews, id]);
  const taught = sessions.filter((s) => s.teacherId === id && s.status === "completed").length;

  if (!user) {
    return (
      <div className="container py-20">
        <EmptyState icon={UserX} title="Member not found" action={<Button asChild><Link href="/browse">Browse skills</Link></Button>} />
      </div>
    );
  }

  const isMe = me?.id === id;
  const rating = ratingFor(id);
  const match = matches.find((m) => m.user.id === id);
  const conversation = conversations.find((c) => c.other.id === id);

  return (
    <div className="pb-24">
      <section className="border-b bg-card">
        <div className="container py-10 md:py-14">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <UserAvatar user={user} className="size-24 text-2xl ring-4 ring-background md:size-28" />
              <div>
                <h1 className="text-3xl font-semibold md:text-4xl">{user.name}</h1>
                {user.headline && <p className="mt-1.5 text-lg text-muted-foreground">{user.headline}</p>}
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                  {user.location && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-4" /> {user.location}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5">
                    <Globe className="size-4" /> {user.languages.join(", ")}
                  </span>
                  <span>Joined {formatDate(user.joinedAt, { month: "long", year: "numeric" })}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {isMe ? (
                <Button asChild variant="outline">
                  <Link href="/dashboard/profile">
                    <Pencil /> Edit profile
                  </Link>
                </Button>
              ) : conversation ? (
                <Button asChild>
                  <Link href={`/dashboard/messages?c=${conversation.swap.id}`}>
                    <MessageCircle /> Message
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>

          <dl className="mt-8 grid max-w-2xl grid-cols-3 divide-x rounded-2xl border bg-background">
            <Stat label="Rating" value={rating.count ? rating.average.toFixed(1) : "—"} sub={rating.count ? <Stars value={rating.average} /> : "No reviews yet"} />
            <Stat label="Skills offered" value={String(theirSkills.length)} />
            <Stat label="Sessions taught" value={String(taught)} />
          </dl>
        </div>
      </section>

      <div className="container mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-12">
          {match && !isMe && (
            <div className="flex flex-col gap-3 rounded-2xl border border-learn/25 bg-learn-soft/60 p-5 sm:flex-row sm:items-center">
              <Sparkles className="size-5 shrink-0 text-learn" />
              <p className="flex-1 text-sm">
                <span className="font-semibold">{match.score}% match.</span>{" "}
                {match.user.name.split(" ")[0]} teaches <b>{match.theyTeach[0]?.skill.title}</b>
                {match.iTeach[0] && (
                  <>
                    {" "}and wants to learn <b>{match.iTeach[0].want.title}</b>, which you teach.
                  </>
                )}
              </p>
            </div>
          )}

          <section>
            <h2 className="text-xl font-semibold">{isMe ? "Skills you teach" : "Teaches"}</h2>
            {theirSkills.length ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {theirSkills.map((s) => (
                  <SkillCard key={s.id} skill={s} />
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">No skills listed yet.</p>
            )}
          </section>

          <section id="reviews" className="scroll-mt-24">
            <h2 className="text-xl font-semibold">
              Reviews <span className="text-muted-foreground">({theirReviews.length})</span>
            </h2>
            {theirReviews.length ? (
              <div className="mt-4 grid gap-3">
                {theirReviews.map((r) => {
                  const author = getUser(r.authorId);
                  return (
                    <figure key={r.id} className="rounded-xl border bg-card p-5">
                      <div className="flex items-center justify-between gap-3">
                        <Link href={`/u/${r.authorId}`} className="flex items-center gap-2.5 hover:underline">
                          {author && <UserAvatar user={author} className="size-8" />}
                          <span className="text-sm font-medium">{author?.name}</span>
                        </Link>
                        <span className="text-xs text-muted-foreground">{timeAgo(r.createdAt)}</span>
                      </div>
                      <Stars value={r.rating} className="mt-3" />
                      <blockquote className="mt-2 text-[15px] leading-relaxed text-foreground/85">{r.text}</blockquote>
                    </figure>
                  );
                })}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">No reviews yet.</p>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          {user.bio && (
            <div className="rounded-2xl border bg-card p-6">
              <h2 className="text-sm font-semibold">About</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-foreground/85">{user.bio}</p>
            </div>
          )}
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <GraduationCap className="size-4 text-learn" /> Wants to learn
            </h2>
            {theirWants.length ? (
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {theirWants.map((w) => (
                  <li key={w.id} className="rounded-full bg-learn-soft px-3 py-1 text-sm text-learn-ink">
                    {w.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">Nothing listed yet.</p>
            )}
          </div>
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <CalendarClock className="size-4 text-teach" /> Usually available
            </h2>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {user.availability.map((a) => (
                <li key={a} className="rounded-full bg-secondary px-3 py-1 text-sm">
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: React.ReactNode }) {
  return (
    <div className="px-4 py-4 sm:px-5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-display text-2xl font-semibold">{value}</dd>
      {sub && <dd className="mt-1 text-xs text-muted-foreground">{sub}</dd>}
    </div>
  );
}
