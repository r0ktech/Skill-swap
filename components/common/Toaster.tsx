"use client";

import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useToasts } from "@/lib/store";
import { cn } from "@/lib/utils";

const ICONS = { default: Info, success: CheckCircle2, error: XCircle };

export function Toaster() {
  const { toasts, dismiss } = useToasts();
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex flex-col items-center gap-2 px-4 md:bottom-6 md:left-auto md:right-6 md:items-end"
    >
      {toasts.map((t) => {
        const Icon = ICONS[t.tone ?? "default"];
        return (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl bg-foreground px-4 py-3 text-background shadow-lift animate-in fade-in-0 slide-in-from-bottom-3"
          >
            <Icon
              className={cn(
                "mt-0.5 size-4 shrink-0",
                t.tone === "success" && "text-teach-soft",
                t.tone === "error" && "text-red-300"
              )}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{t.title}</p>
              {t.description && <p className="mt-0.5 text-[13px] text-background/70">{t.description}</p>}
            </div>
            <button onClick={() => dismiss(t.id)} className="text-background/60 hover:text-background" aria-label="Dismiss">
              <X className="size-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
