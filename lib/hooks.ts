"use client";

import { useMemo } from "react";
import { computeMatches } from "./matching";
import { useHydration, useStore } from "./store";
import type { Message, Session, Skill, Swap, User } from "./types";

export const useHydrated = () => useHydration((s) => s.hydrated);

export function useMe(): User | null {
  const id = useStore((s) => s.currentUserId);
  const users = useStore((s) => s.users);
  return useMemo(() => users.find((u) => u.id === id) ?? null, [users, id]);
}

export function useUserLookup() {
  const users = useStore((s) => s.users);
  return useMemo(() => {
    const map = new Map(users.map((u) => [u.id, u]));
    return (id: string) => map.get(id);
  }, [users]);
}

export function useSkillLookup() {
  const skills = useStore((s) => s.skills);
  return useMemo(() => {
    const map = new Map(skills.map((s) => [s.id, s]));
    return (id: string | null | undefined) => (id ? map.get(id) : undefined);
  }, [skills]);
}

export function useRatings() {
  const reviews = useStore((s) => s.reviews);
  return useMemo(() => {
    const acc = new Map<string, { total: number; count: number }>();
    for (const r of reviews) {
      const cur = acc.get(r.subjectId) ?? { total: 0, count: 0 };
      acc.set(r.subjectId, { total: cur.total + r.rating, count: cur.count + 1 });
    }
    return (userId: string) => {
      const v = acc.get(userId);
      return v ? { average: v.total / v.count, count: v.count } : { average: 0, count: 0 };
    };
  }, [reviews]);
}

export function useMatches() {
  const me = useStore((s) => s.currentUserId);
  const users = useStore((s) => s.users);
  const skills = useStore((s) => s.skills);
  const wants = useStore((s) => s.wants);
  return useMemo(() => (me ? computeMatches(me, users, skills, wants) : []), [me, users, skills, wants]);
}

export interface Conversation {
  swap: Swap;
  other: User;
  requestedSkill?: Skill;
  offeredSkill?: Skill;
  lastMessage?: Message;
  unread: number;
  direction: "incoming" | "outgoing";
}

export function useConversations(): Conversation[] {
  const meId = useStore((s) => s.currentUserId);
  const swaps = useStore((s) => s.swaps);
  const messages = useStore((s) => s.messages);
  const lastRead = useStore((s) => s.lastRead);
  const getUser = useUserLookup();
  const getSkill = useSkillLookup();

  return useMemo(() => {
    if (!meId) return [];
    return swaps
      .filter((sw) => (sw.requesterId === meId || sw.recipientId === meId) && sw.status !== "cancelled")
      .map((swap) => {
        const otherId = swap.requesterId === meId ? swap.recipientId : swap.requesterId;
        const thread = messages.filter((m) => m.swapId === swap.id);
        const lastMessage = thread[thread.length - 1];
        const readAt = lastRead[swap.id] ?? "";
        const unread = thread.filter((m) => m.senderId === otherId && m.createdAt > readAt).length;
        return {
          swap,
          other: getUser(otherId)!,
          requestedSkill: getSkill(swap.requestedSkillId),
          offeredSkill: getSkill(swap.offeredSkillId),
          lastMessage,
          unread,
          direction: swap.recipientId === meId ? "incoming" : "outgoing",
        } satisfies Conversation;
      })
      .filter((c) => c.other)
      .sort((a, b) =>
        (b.lastMessage?.createdAt ?? b.swap.updatedAt).localeCompare(a.lastMessage?.createdAt ?? a.swap.updatedAt)
      );
  }, [meId, swaps, messages, lastRead, getUser, getSkill]);
}

export function useMySessions(): Session[] {
  const meId = useStore((s) => s.currentUserId);
  const sessions = useStore((s) => s.sessions);
  return useMemo(
    () =>
      sessions
        .filter((s) => s.teacherId === meId || s.learnerId === meId)
        .sort((a, b) => a.startsAt.localeCompare(b.startsAt)),
    [sessions, meId]
  );
}

export function useUnreadNotifications() {
  const meId = useStore((s) => s.currentUserId);
  const notifications = useStore((s) => s.notifications);
  return useMemo(() => notifications.filter((n) => n.userId === meId && !n.read).length, [notifications, meId]);
}
