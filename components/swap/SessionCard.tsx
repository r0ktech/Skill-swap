"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Clock, MapPin, MessageCircle, Star, Video, XCircle } from "lucide-react";
import { useMe, useSkillLookup, useUserLookup } from "@/lib/hooks";
import { toast, useStore } from "@/lib/store";
import type { Session } from "@/lib/types";
import { cn, formatDayLabel, formatDuration, formatTime } from "@/lib/utils";
import { UserAvatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReviewDialog } from "./ReviewDialog";

export function SessionCard({ session, className }: { session: Session; className?: string }) {
  const me = useMe();
  const getUser = useUserLookup();
  const getSkill = useSkillLookup();
  const reviewed = useStore((s) => s.reviews.some((r) => r.sessionId === session.id && r.authorId === me?.id));
  const cancelSession = useStore((s) => s.cancelSession);
  const completeSession = useStore((s) => s.completeSession);
  const [reviewOpen, setReviewOpen] = useState(false);

  const skill = getSkill(session.skillId);
  const teaching = session.teacherId === me?.id;
  const other = getUser(teaching ? session.learnerId : session.teacherId);
  if (!other || !me) return null;

  const start = new Date(session.startsAt);
  const isPast = start.getTime() + session.durationMin * 60_000 < Date.now();
  const isLive = !isPast && start.getTime() - 15 * 60_000 < Date.now();

  return (
    <div
      className={cn(
        "flex gap-4 rounded-xl border bg-card p-4 shadow-soft sm:p-5",
        session.status === "cancelled" && "opacity-60",
        className
      )}
    >
      <div
        className={cn(
          "flex w-14 shrink-0 flex-col items-center justify-center rounded-xl py-2 text-center",
          teaching ? "bg-teach-soft text-teach-ink" : "bg-learn-soft text-learn-ink"
        )}
      >
        <span className="text-[11px] font-semibold uppercase">{start.toLocaleDateString([], { month: "short" })}</span>
        <span className="font-display text-2xl font-semibold leading-none">{start.getDate()}</span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={teaching ? "teach" : "learn"}>{teaching ? "Teaching" : "Learning"}</Badge>
          {session.status === "cancelled" && <Badge variant="destructive">Cancelled</Badge>}
          {session.status === "completed" && <Badge variant="success">Completed</Badge>}
          {isLive && session.status === "scheduled" && <Badge variant="warning">Starting soon</Badge>}
        </div>
        <p className="mt-1.5 font-semibold leading-snug">{skill?.title ?? "Skill session"}</p>
        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
          <UserAvatar user={other} className="size-5" />
          with {other.name}
        </div>
        <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" />
            {formatDayLabel(session.startsAt)} · {formatTime(session.startsAt)} · {formatDuration(session.durationMin)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            {session.format === "Video call" ? <Video className="size-3.5" /> : <MapPin className="size-3.5" />}
            {session.location}
          </span>
        </div>
        {session.note && <p className="mt-2 text-[13px] italic text-muted-foreground">&ldquo;{session.note}&rdquo;</p>}

        <div className="mt-4 flex flex-wrap gap-2">
          {session.status === "scheduled" && !isPast && (
            <>
              {session.format === "Video call" && (
                <Button
                  size="sm"
                  variant={isLive ? "default" : "outline"}
                  onClick={() => toast({ title: `Opening ${session.location}…`, description: "Video links open in a new tab once connected." })}
                >
                  <Video /> Join
                </Button>
              )}
              <Button asChild size="sm" variant="outline">
                <Link href={`/dashboard/messages?c=${session.swapId}`}>
                  <MessageCircle /> Message
                </Link>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-muted-foreground"
                onClick={() => {
                  cancelSession(session.id);
                  toast({ title: "Session cancelled", description: `${other.name.split(" ")[0]} has been notified.` });
                }}
              >
                <XCircle /> Cancel
              </Button>
            </>
          )}
          {session.status === "scheduled" && isPast && (
            <Button
              size="sm"
              onClick={() => {
                completeSession(session.id);
                setReviewOpen(true);
              }}
            >
              <CheckCircle2 /> Mark as done
            </Button>
          )}
          {session.status === "completed" && !reviewed && (
            <Button size="sm" variant="outline" onClick={() => setReviewOpen(true)}>
              <Star /> Review {other.name.split(" ")[0]}
            </Button>
          )}
        </div>
      </div>
      <ReviewDialog session={session} subject={other} open={reviewOpen} onOpenChange={setReviewOpen} />
    </div>
  );
}
