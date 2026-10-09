import { LEVELS, type Level } from "@/lib/types";
import { cn } from "@/lib/utils";

export function LevelMeter({ level, className }: { level: Level; className?: string }) {
  const idx = LEVELS.indexOf(level);
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs text-muted-foreground", className)}>
      <span className="flex gap-0.5" aria-hidden>
        {LEVELS.map((l, i) => (
          <span key={l} className={cn("h-2.5 w-1 rounded-full", i <= idx ? "bg-foreground/70" : "bg-foreground/15")} />
        ))}
      </span>
      {level}
    </span>
  );
}
