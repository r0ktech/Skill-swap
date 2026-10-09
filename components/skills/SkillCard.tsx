"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeftRight, Bookmark, Clock, MonitorSmartphone, Pencil, Trash2 } from "lucide-react";
import { useMe, useRatings, useUserLookup } from "@/lib/hooks";
import { toast, useStore } from "@/lib/store";
import type { Skill } from "@/lib/types";
import { cn, formatDuration } from "@/lib/utils";
import { UserAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { RatingInline } from "@/components/common/StarRating";
import { RequestSwapDialog } from "@/components/swap/RequestSwapDialog";
import { CategoryIcon } from "./CategoryIcon";
import { LevelMeter } from "./LevelMeter";

interface SkillCardProps {
  skill: Skill;
  onEdit?: (skill: Skill) => void;
  onDelete?: (skill: Skill) => void;
  className?: string;
}

export function SkillCard({ skill, onEdit, onDelete, className }: SkillCardProps) {
  const me = useMe();
  const getUser = useUserLookup();
  const ratingFor = useRatings();
  const saved = useStore((s) => s.savedSkillIds.includes(skill.id));
  const toggleSaved = useStore((s) => s.toggleSaved);
  const [requestOpen, setRequestOpen] = useState(false);

  const owner = getUser(skill.userId);
  if (!owner) return null;
  const isOwn = me?.id === skill.userId;
  const rating = ratingFor(owner.id);

  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-xl border bg-card p-5 shadow-soft transition-[box-shadow,transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-lift",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <CategoryIcon category={skill.category} />
          <span className="text-xs font-medium text-muted-foreground">{skill.category}</span>
        </div>
        {!isOwn && me && (
          <button
            onClick={() => {
              toggleSaved(skill.id);
              toast({ title: saved ? "Removed from saved" : "Saved for later", tone: saved ? "default" : "success" });
            }}
            className={cn(
              "relative z-10 -m-1.5 rounded-full p-1.5 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              saved ? "text-learn" : "text-muted-foreground"
            )}
            aria-label={saved ? "Remove from saved" : "Save skill"}
            aria-pressed={saved}
          >
            <Bookmark className={cn("size-[18px]", saved && "fill-current")} />
          </button>
        )}
      </div>

      <h3 className="mt-4 text-[17px] font-semibold leading-snug">
        <Link href={`/skills/${skill.id}`} className="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none">
          {skill.title}
        </Link>
      </h3>
      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{skill.description}</p>

      <div className="mb-5 mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        <LevelMeter level={skill.level} />
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="size-3.5" />
          {formatDuration(skill.sessionLength)}
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <MonitorSmartphone className="size-3.5" />
          {skill.format}
        </span>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t pt-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <UserAvatar user={owner} className="size-8" />
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium leading-tight">{isOwn ? "You" : owner.name}</p>
            <RatingInline {...rating} />
          </div>
        </div>

        {isOwn ? (
          onEdit || onDelete ? (
            <div className="relative z-10 flex gap-1">
              {onEdit && (
                <Button size="icon-sm" variant="ghost" onClick={() => onEdit(skill)} aria-label={`Edit ${skill.title}`}>
                  <Pencil />
                </Button>
              )}
              {onDelete && (
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => onDelete(skill)}
                  aria-label={`Delete ${skill.title}`}
                >
                  <Trash2 />
                </Button>
              )}
            </div>
          ) : null
        ) : (
          <Button size="sm" variant="outline" className="relative z-10 group-hover:border-foreground/30" onClick={() => setRequestOpen(true)}>
            <ArrowLeftRight />
            Swap
          </Button>
        )}
      </div>

      {!isOwn && <RequestSwapDialog skill={skill} open={requestOpen} onOpenChange={setRequestOpen} />}
    </article>
  );
}
