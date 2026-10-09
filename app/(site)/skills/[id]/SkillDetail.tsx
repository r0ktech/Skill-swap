"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowLeftRight, Bookmark, CalendarClock, Clock, Globe, MapPin, MonitorSmartphone, Pencil, SearchX } from "lucide-react";
import { useMe, useRatings, useUserLookup } from "@/lib/hooks";
import { skillWantScore } from "@/lib/matching";
import { toast, useStore } from "@/lib/store";
import { cn, formatDuration, timeAgo } from "@/lib/utils";
import { UserAvatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { Hydrated } from "@/components/common/Hydrated";
import { RatingInline, Stars } from "@/components/common/StarRating";
import { CategoryIcon } from "@/components/skills/CategoryIcon";
import { LevelMeter } from "@/components/skills/LevelMeter";
import { SkillCard } from "@/components/skills/SkillCard";
import { RequestSwapDialog } from "@/components/swap/RequestSwapDialog";

export function SkillDetail({ id }: { id: string }) {
  return (
    <Hydrated
      fallback={
        <div className="container grid gap-8 py-10 lg:grid-cols-[1fr_360px]">
          <Skeleton className="h-96" />
          <Skeleton className="h-72" />
        </div>
      }
    >
      <SkillDetailInner id={id} />
    </Hydrated>
  );
}

function SkillDetailInner({ id }: { id: string }) {
  const me = useMe();
  const skills = useStore((s) => s.skills);
  const wants = useStore((s) => s.wants);
  const reviews = useStore((s) => s.reviews);
  const saved = useStore((s) => s.savedSkillIds.includes(id));
  const toggleSaved = useStore((s) => s.toggleSaved);
  const getUser = useUserLookup();
  const ratingFor = useRatings();
  const [requestOpen, setRequestOpen] = useState(false);

  const skill = skills.find((s) => s.id === id);
  const owner = skill ? getUser(skill.userId) : undefined;

  const ownerWants = useMemo(() => wants.filter((w) => w.userId === owner?.id), [wants, owner?.id]);
  const mySkills = useMemo(() => skills.filter((s) => s.userId === me?.id), [skills, me?.id]);
  const ownerReviews = useMemo(() => reviews.filter((r) => r.subjectId === owner?.id).slice(0, 3), [reviews, owner?.id]);
  const related = useMemo(
    () => skills.filter((s) => s.id !== id && s.category === skill?.category && s.userId !== me?.id).slice(0, 3),
    [skills, id, skill?.category, me?.id]
  );

  if (!skill || !owner) {
    return (
      <div className="container py-20">
        <EmptyState
          icon={SearchX}
          title="This skill isn't available"
          description="It may have been removed by its owner."
          action={
            <Button asChild>
              <Link href="/browse">Browse skills</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const isOwn = me?.id === owner.id;
  const rating = ratingFor(owner.id);

  return (
    <div className="container py-8 md:py-12">
      <Link href="/browse" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to browse
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px] lg:gap-12">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <CategoryIcon category={skill.category} className="size-11 rounded-2xl" />
            <div>
              <p className="text-sm font-medium">{skill.category}</p>
              <p className="text-xs text-muted-foreground">Listed {timeAgo(skill.createdAt)}</p>
            </div>
          </div>
          <h1 className="mt-6 text-4xl font-semibold leading-tight md:text-5xl">{skill.title}</h1>

          <div className="mt-6 flex flex-wrap gap-2">
            <Meta icon={<LevelMeter level={skill.level} className="text-foreground" />} />
            <Meta icon={<Clock className="size-4 text-muted-foreground" />} label={`${formatDuration(skill.sessionLength)} sessions`} />
            <Meta icon={<MonitorSmartphone className="size-4 text-muted-foreground" />} label={skill.format} />
          </div>

          <section className="mt-10">
            <h2 className="text-lg font-semibold">What you&apos;ll learn</h2>
            <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-foreground/85 text-pretty">{skill.description}</p>
            {skill.tags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-1.5">
                {skill.tags.map((t) => (
                  <Link key={t} href={`/browse?q=${encodeURIComponent(t)}`}>
                    <Badge variant="secondary" className="hover:bg-secondary/70">
                      #{t}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {!isOwn && ownerWants.length > 0 && (
            <section className="mt-10 rounded-2xl border bg-card p-6">
              <h2 className="text-lg font-semibold">What {owner.name.split(" ")[0]} wants in return</h2>
              <p className="mt-1 text-sm text-muted-foreground">Offer one of these to make the swap irresistible.</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {ownerWants.map((w) => {
                  const canTeach = mySkills.some((s) => skillWantScore(s, w) >= 0.7);
                  return (
                    <li
                      key={w.id}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm",
                        canTeach ? "bg-teach-soft font-medium text-teach-ink" : "bg-learn-soft text-learn-ink"
                      )}
                    >
                      {w.title}
                      {canTeach && <span className="text-xs">· you teach this</span>}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {ownerReviews.length > 0 && (
            <section className="mt-10">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">What learners say</h2>
                <Link href={`/u/${owner.id}#reviews`} className="text-sm text-muted-foreground hover:text-foreground">
                  All reviews
                </Link>
              </div>
              <div className="mt-4 grid gap-3">
                {ownerReviews.map((r) => {
                  const author = getUser(r.authorId);
                  return (
                    <figure key={r.id} className="rounded-xl border bg-card p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          {author && <UserAvatar user={author} className="size-7" />}
                          <span className="text-sm font-medium">{author?.name}</span>
                        </div>
                        <Stars value={r.rating} />
                      </div>
                      <blockquote className="mt-3 text-[15px] leading-relaxed text-foreground/85">{r.text}</blockquote>
                    </figure>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* Teacher card */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border bg-card p-6 shadow-soft">
            <Link href={`/u/${owner.id}`} className="group flex items-center gap-3">
              <UserAvatar user={owner} className="size-14" />
              <div className="min-w-0">
                <p className="font-display text-lg font-semibold group-hover:underline">{isOwn ? "You" : owner.name}</p>
                <RatingInline {...rating} />
              </div>
            </Link>
            {owner.headline && <p className="mt-4 text-sm text-foreground/85">{owner.headline}</p>}
            <dl className="mt-4 grid grid-cols-1 gap-2 text-sm text-muted-foreground">
              {owner.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="size-4" /> {owner.location}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Globe className="size-4" /> {owner.languages.join(", ")}
              </div>
              <div className="flex items-center gap-2">
                <CalendarClock className="size-4" /> {owner.availability.join(", ")}
              </div>
            </dl>
            <div className="mt-6 grid gap-2">
              {isOwn ? (
                <Button asChild variant="outline">
                  <Link href="/dashboard/my-skills">
                    <Pencil /> Manage your skills
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" onClick={() => setRequestOpen(true)}>
                    <ArrowLeftRight /> Propose a swap
                  </Button>
                  {me && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        toggleSaved(skill.id);
                        toast({ title: saved ? "Removed from saved" : "Saved for later", tone: saved ? "default" : "success" });
                      }}
                    >
                      <Bookmark className={cn(saved && "fill-current text-learn")} />
                      {saved ? "Saved" : "Save for later"}
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-semibold">More in {skill.category}</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((s) => (
              <SkillCard key={s.id} skill={s} />
            ))}
          </div>
        </section>
      )}

      {!isOwn && <RequestSwapDialog skill={skill} open={requestOpen} onOpenChange={setRequestOpen} />}
    </div>
  );
}

function Meta({ icon, label }: { icon: React.ReactNode; label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3.5 py-1.5 text-sm">
      {icon}
      {label}
    </span>
  );
}
