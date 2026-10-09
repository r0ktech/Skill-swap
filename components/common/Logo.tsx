import Link from "next/link";
import { cn } from "@/lib/utils";

/** Two interlocking halves — teal (teach) and violet (learn) — echoing the original logo. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden>
      <path d="M6 13.5 15 4.5a4 4 0 0 1 5.66 0L25 8.84H14.5L9.4 14H6Z" fill="hsl(var(--teach))" />
      <path d="M26 18.5 17 27.5a4 4 0 0 1-5.66 0L7 23.16h10.5l5.1-5.16H26Z" fill="hsl(var(--learn))" />
    </svg>
  );
}

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-2", className)} aria-label="SkillSwap home">
      <LogoMark className="transition-transform duration-500 group-hover:rotate-180" />
      <span className="font-display text-[19px] font-semibold tracking-tight">SkillSwap</span>
    </Link>
  );
}
