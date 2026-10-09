"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { ArrowLeftRight, Check, MessageCircle, X } from "lucide-react";
import type { Conversation } from "@/lib/hooks";
import { useRatings } from "@/lib/hooks";
import type { MatchSuggestion } from "@/lib/matching";
import { toast, useStore } from "@/lib/store";
import { cn, firstName, timeAgo } from "@/lib/utils";
import { UserAvatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RatingInline } from "@/components/common/StarRating";
import { RequestSwapDialog } from "./RequestSwapDialog";

/** Circular score indicator: teal→violet ring filled to the match score. */
export function MatchScore({ score, size = 48 }: { score: number; size?: number }) {
  const id = useId();
  const r = size / 2 - 4;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} aria-label={`${score}% match`}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="hsl(var(--teach))" />
            <stop offset="1" stopColor="hsl(var(--learn))" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--secondary))" strokeWidth="4" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - score / 100)}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-xs font-semibold">{score}</span>
    </div>
  );
}

export function SuggestionCard({ match, compact }: { match: MatchSuggestion; compact?: boolean }) {
  const ratingFor = useRatings();
  const [open, setOpen] = useState(false);
  const top = match.theyTeach[0];
  const give = match.iTeach[0];

  return (
    <div className="flex flex-col rounded-xl border bg-card p-5 shadow-soft">
      <div className="flex items-start gap-3">
        <Link href={`/u/${match.user.id}`}>
          <UserAvatar user={match.user} className="size-12" />
        </Link>
        <div className="min-w-0 flex-1">
          <Link href={`/u/${match.user.id}`} className="font-semibold hover:underline">
            {match.user.name}
          </Link>
          <p className="truncate text-xs text-muted-foreground">{match.user.location}</p>
          <RatingInline {...ratingFor(match.user.id)} className="mt-0.5" />
        </div>
        <MatchScore score={match.score} size={compact ? 40 : 48} />
      </div>

      <div className="mt-4 grid gap-2 text-sm">
        <div className="flex items-start gap-2.5 rounded-lg bg-learn-soft/70 px-3 py-2">
          <span className="mt-px text-[10px] font-semibold uppercase tracking-wider text-learn-ink/80">You learn</span>
          <span className="font-medium leading-snug">{top.skill.title}</span>
        </div>
        <div
          className={cn(
            "flex items-start gap-2.5 rounded-lg px-3 py-2",
            give ? "bg-teach-soft/70" : "border border-dashed text-muted-foreground"
          )}
        >
          <span className={cn("mt-px text-[10px] font-semibold uppercase tracking-wider", give ? "text-teach-ink/80" : "")}>
            You teach
          </span>
          <span className={cn("leading-snug", give && "font-medium")}>
            {give ? give.skill.title : `Not on ${firstName(match.user.name)}'s list yet`}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        {match.mutual ? <Badge variant="learn">Mutual match</Badge> : <Badge variant="secondary">One-way</Badge>}
        <Button size="sm" onClick={() => setOpen(true)}>
          <ArrowLeftRight /> Propose swap
        </Button>
      </div>
      <RequestSwapDialog skill={top.skill} open={open} onOpenChange={setOpen} />
    </div>
  );
}

const STATUS_BADGE = {
  pending: { label: "Pending", variant: "warning" },
  accepted: { label: "Active", variant: "success" },
  declined: { label: "Declined", variant: "destructive" },
  cancelled: { label: "Cancelled", variant: "secondary" },
  completed: { label: "Completed", variant: "secondary" },
} as const;

export function SwapRow({ conversation }: { conversation: Conversation }) {
  const respond = useStore((s) => s.respondToSwap);
  const cancel = useStore((s) => s.cancelSwap);
  const { swap, other, requestedSkill, offeredSkill, direction } = conversation;
  const badge = STATUS_BADGE[swap.status];

  // From my point of view: what I learn and what I teach in this swap.
  const iLearn = direction === "outgoing" ? requestedSkill : offeredSkill;
  const iTeach = direction === "outgoing" ? offeredSkill : requestedSkill;

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-soft sm:flex-row sm:items-center sm:p-5">
      <div className="flex min-w-0 flex-1 items-center gap-3.5">
        <Link href={`/u/${other.id}`}>
          <UserAvatar user={other} className="size-12" />
        </Link>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/u/${other.id}`} className="font-semibold hover:underline">
              {other.name}
            </Link>
            <Badge variant={badge.variant}>{badge.label}</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            <span className="text-learn-ink">{iLearn?.title ?? "—"}</span>
            <ArrowLeftRight className="mx-1.5 inline size-3.5" />
            <span className="text-teach-ink">{iTeach?.title ?? "To be agreed"}</span>
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground/80">
            {direction === "incoming" ? "Requested" : "Sent"} {timeAgo(swap.createdAt)}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {swap.status === "pending" && direction === "incoming" && (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                respond(swap.id, false);
                toast({ title: `Declined ${firstName(other.name)}'s request` });
              }}
            >
              <X /> Decline
            </Button>
            <Button
              size="sm"
              onClick={() => {
                respond(swap.id, true);
                toast({ title: "Swap accepted!", description: "Say hi and schedule your first session.", tone: "success" });
              }}
            >
              <Check /> Accept
            </Button>
          </>
        )}
        {swap.status === "pending" && direction === "outgoing" && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              cancel(swap.id);
              toast({ title: "Request withdrawn" });
            }}
          >
            Withdraw
          </Button>
        )}
        {swap.status !== "declined" && (
          <Button asChild size="sm" variant={swap.status === "accepted" ? "default" : "outline"}>
            <Link href={`/dashboard/messages?c=${swap.id}`}>
              <MessageCircle /> Chat
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
