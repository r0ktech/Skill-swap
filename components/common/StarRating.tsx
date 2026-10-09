"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${value.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn("size-3.5", i <= Math.round(value) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted")}
        />
      ))}
    </span>
  );
}

export function RatingInline({ average, count, className }: { average: number; count: number; className?: string }) {
  if (!count) return <span className={cn("text-xs text-muted-foreground", className)}>New member</span>;
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs text-muted-foreground", className)}>
      <Star className="size-3.5 fill-amber-400 text-amber-400" />
      <span className="font-medium text-foreground">{average.toFixed(1)}</span>
      <span>({count})</span>
    </span>
  );
}

export function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          role="radio"
          aria-checked={value === i}
          aria-label={`${i} star${i > 1 ? "s" : ""}`}
          onClick={() => onChange(i)}
          className="rounded-md p-1 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Star className={cn("size-7", i <= value ? "fill-amber-400 text-amber-400" : "fill-muted text-muted-foreground/30")} />
        </button>
      ))}
    </div>
  );
}
