"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Bell, CalendarDays, Check, MessageCircle, Star, UserPlus, X, type LucideIcon } from "lucide-react";
import { useUnreadNotifications } from "@/lib/hooks";
import { useStore } from "@/lib/store";
import type { Notification } from "@/lib/types";
import { cn, timeAgo } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const ICONS: Record<Notification["kind"], { icon: LucideIcon; tint: string }> = {
  request: { icon: UserPlus, tint: "bg-learn-soft text-learn-ink" },
  accepted: { icon: Check, tint: "bg-success-soft text-success" },
  declined: { icon: X, tint: "bg-destructive/10 text-destructive" },
  message: { icon: MessageCircle, tint: "bg-teach-soft text-teach-ink" },
  session: { icon: CalendarDays, tint: "bg-warning-soft text-warning" },
  review: { icon: Star, tint: "bg-amber-100 text-amber-600" },
};

export function NotificationsMenu() {
  const meId = useStore((s) => s.currentUserId);
  const all = useStore((s) => s.notifications);
  const markRead = useStore((s) => s.markNotificationRead);
  const markAll = useStore((s) => s.markAllNotificationsRead);
  const unread = useUnreadNotifications();
  const items = useMemo(() => all.filter((n) => n.userId === meId).slice(0, 8), [all, meId]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}>
          <Bell className="!size-[18px]" />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 grid min-w-[18px] place-items-center rounded-full bg-learn px-1 text-[10px] font-semibold leading-[18px] text-white ring-2 ring-background">
              {unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[min(22rem,calc(100vw-2rem))] p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="font-display font-semibold">Notifications</p>
          {unread > 0 && (
            <button onClick={markAll} className="text-xs font-medium text-muted-foreground hover:text-foreground">
              Mark all read
            </button>
          )}
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-1.5">
          {items.length === 0 && <p className="px-3 py-8 text-center text-sm text-muted-foreground">You&apos;re all caught up.</p>}
          {items.map((n) => {
            const { icon: Icon, tint } = ICONS[n.kind];
            return (
              <DropdownMenuItem key={n.id} asChild className="items-start gap-3 p-2.5">
                <Link href={n.href} onClick={() => markRead(n.id)}>
                  <span className={cn("grid size-8 shrink-0 place-items-center rounded-full", tint)}>
                    <Icon className="!size-4 !text-current" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium leading-tight">{n.title}</span>
                    <span className="mt-0.5 line-clamp-2 block text-[13px] text-muted-foreground">{n.body}</span>
                    <span className="mt-1 block text-[11px] text-muted-foreground/80">{timeAgo(n.createdAt)}</span>
                  </span>
                  {!n.read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-learn" aria-label="Unread" />}
                </Link>
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
