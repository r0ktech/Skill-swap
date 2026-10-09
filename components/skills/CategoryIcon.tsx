import { Briefcase, Camera, Code2, Languages, Megaphone, Music, Palette, type LucideIcon } from "lucide-react";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

export const CATEGORY_META: Record<Category, { icon: LucideIcon; tint: string; blurb: string }> = {
  Development: { icon: Code2, tint: "bg-sky-100 text-sky-700", blurb: "Web, data, backend" },
  Design: { icon: Palette, tint: "bg-rose-100 text-rose-700", blurb: "UI, UX, visual" },
  Marketing: { icon: Megaphone, tint: "bg-amber-100 text-amber-700", blurb: "Growth, ads, copy" },
  Language: { icon: Languages, tint: "bg-emerald-100 text-emerald-700", blurb: "Conversation & travel" },
  Music: { icon: Music, tint: "bg-violet-100 text-violet-700", blurb: "Instruments & theory" },
  Business: { icon: Briefcase, tint: "bg-stone-200 text-stone-700", blurb: "Productivity & ops" },
  Lifestyle: { icon: Camera, tint: "bg-orange-100 text-orange-700", blurb: "Photo, cooking, more" },
};

export function CategoryIcon({ category, className }: { category: Category; className?: string }) {
  const { icon: Icon, tint } = CATEGORY_META[category];
  return (
    <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl", tint, className)}>
      <Icon className="size-[18px]" />
    </span>
  );
}
