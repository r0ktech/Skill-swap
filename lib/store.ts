"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  CURRENT_USER_ID,
  seedMessages,
  seedNotifications,
  seedReviews,
  seedSessions,
  seedSkills,
  seedSwaps,
  seedUsers,
  seedWants,
} from "./seed";
import type {
  Message,
  Notification,
  Review,
  Session,
  Skill,
  Swap,
  User,
  Want,
} from "./types";
import { firstName, uid } from "./utils";

type SkillInput = Omit<Skill, "id" | "userId" | "createdAt">;
type WantInput = Omit<Want, "id" | "userId">;
type SessionInput = Omit<Session, "id" | "status">;

interface Data {
  currentUserId: string | null;
  users: User[];
  skills: Skill[];
  wants: Want[];
  swaps: Swap[];
  messages: Message[];
  sessions: Session[];
  reviews: Review[];
  notifications: Notification[];
  savedSkillIds: string[];
  /** Last time the current user opened each conversation (swap id → ISO). */
  lastRead: Record<string, string>;
}

interface Actions {
  login: (email: string) => boolean;
  signup: (input: { name: string; email: string }) => void;
  logout: () => void;
  updateProfile: (patch: Partial<Omit<User, "id" | "joinedAt">>) => void;

  addSkill: (input: SkillInput) => Skill | null;
  editSkill: (id: string, patch: Partial<SkillInput>) => void;
  deleteSkill: (id: string) => void;
  addWant: (input: WantInput) => void;
  deleteWant: (id: string) => void;
  toggleSaved: (skillId: string) => void;

  requestSwap: (input: { requestedSkillId: string; offeredSkillId: string | null; note: string }) => Swap | null;
  respondToSwap: (swapId: string, accept: boolean) => void;
  cancelSwap: (swapId: string) => void;

  sendMessage: (swapId: string, text: string) => void;
  markConversationRead: (swapId: string) => void;

  scheduleSession: (input: SessionInput) => void;
  cancelSession: (sessionId: string) => void;
  completeSession: (sessionId: string) => void;
  addReview: (input: Omit<Review, "id" | "authorId" | "createdAt">) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetDemo: () => void;
}

const seed = (): Data => ({
  currentUserId: CURRENT_USER_ID,
  users: seedUsers,
  skills: seedSkills,
  wants: seedWants,
  swaps: seedSwaps,
  messages: seedMessages,
  sessions: seedSessions,
  reviews: seedReviews,
  notifications: seedNotifications,
  savedSkillIds: ["s3"],
  lastRead: {},
});

const now = () => new Date().toISOString();

const REPLIES = [
  "Sounds great, thanks!",
  "Perfect, that works for me 🙌",
  "Love it. Looking forward to it!",
  "Good idea, let's do that.",
  "Sure! Let me check my calendar and confirm.",
];

/** Simulated network latency for the demo's "other side" of a conversation. */
const REPLY_DELAY = 2200;

export const useStore = create<Data & Actions>()(
  persist(
    (set, get) => {
      const me = () => get().users.find((u) => u.id === get().currentUserId) ?? null;

      const notify = (n: Omit<Notification, "id" | "createdAt" | "read">) =>
        set((s) => ({
          notifications: [{ ...n, id: uid("n"), createdAt: now(), read: false }, ...s.notifications],
        }));

      const pushMessage = (swapId: string, senderId: string, text: string) =>
        set((s) => ({
          messages: [...s.messages, { id: uid("m"), swapId, senderId, text, createdAt: now() }],
        }));

      return {
        ...seed(),

        login: (email) => {
          const user = get().users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
          // Demo: unknown emails sign in as the sample account.
          set({ currentUserId: user?.id ?? CURRENT_USER_ID });
          return Boolean(user);
        },

        signup: ({ name, email }) => {
          const user: User = {
            id: uid("u"),
            name: name.trim(),
            email: email.trim(),
            avatar: "",
            headline: "",
            bio: "",
            location: "",
            languages: ["English"],
            availability: ["Flexible"],
            joinedAt: now(),
          };
          set((s) => ({ users: [...s.users, user], currentUserId: user.id }));
        },

        logout: () => set({ currentUserId: null }),

        updateProfile: (patch) =>
          set((s) => ({
            users: s.users.map((u) => (u.id === s.currentUserId ? { ...u, ...patch } : u)),
          })),

        addSkill: (input) => {
          const user = me();
          if (!user) return null;
          const skill: Skill = { ...input, id: uid("s"), userId: user.id, createdAt: now() };
          set((s) => ({ skills: [skill, ...s.skills] }));
          return skill;
        },

        editSkill: (id, patch) =>
          set((s) => ({ skills: s.skills.map((sk) => (sk.id === id ? { ...sk, ...patch } : sk)) })),

        deleteSkill: (id) =>
          set((s) => ({
            skills: s.skills.filter((sk) => sk.id !== id),
            savedSkillIds: s.savedSkillIds.filter((x) => x !== id),
          })),

        addWant: (input) => {
          const user = me();
          if (!user) return;
          set((s) => ({ wants: [{ ...input, id: uid("w"), userId: user.id }, ...s.wants] }));
        },

        deleteWant: (id) => set((s) => ({ wants: s.wants.filter((w) => w.id !== id) })),

        toggleSaved: (skillId) =>
          set((s) => ({
            savedSkillIds: s.savedSkillIds.includes(skillId)
              ? s.savedSkillIds.filter((x) => x !== skillId)
              : [...s.savedSkillIds, skillId],
          })),

        requestSwap: ({ requestedSkillId, offeredSkillId, note }) => {
          const user = me();
          const skill = get().skills.find((s) => s.id === requestedSkillId);
          if (!user || !skill || skill.userId === user.id) return null;

          const existing = get().swaps.find(
            (sw) =>
              sw.requestedSkillId === requestedSkillId &&
              sw.requesterId === user.id &&
              (sw.status === "pending" || sw.status === "accepted")
          );
          if (existing) return existing;

          const swap: Swap = {
            id: uid("sw"),
            requesterId: user.id,
            recipientId: skill.userId,
            requestedSkillId,
            offeredSkillId,
            status: "pending",
            createdAt: now(),
            updatedAt: now(),
          };
          set((s) => ({ swaps: [swap, ...s.swaps] }));
          if (note.trim()) pushMessage(swap.id, user.id, note.trim());

          // Demo: the other member accepts shortly after.
          setTimeout(() => {
            const current = get().swaps.find((sw) => sw.id === swap.id);
            if (current?.status !== "pending") return;
            const other = get().users.find((u) => u.id === skill.userId);
            set((s) => ({
              swaps: s.swaps.map((sw) => (sw.id === swap.id ? { ...sw, status: "accepted", updatedAt: now() } : sw)),
            }));
            pushMessage(
              swap.id,
              skill.userId,
              `Hi ${firstName(user.name)}! Happy to teach you ${skill.title}. Want to pick a time for our first session?`
            );
            notify({
              userId: user.id,
              kind: "accepted",
              title: "Swap accepted",
              body: `${other?.name ?? "Someone"} accepted your request for ${skill.title}`,
              href: `/dashboard/messages?c=${swap.id}`,
            });
          }, REPLY_DELAY * 2);

          return swap;
        },

        respondToSwap: (swapId, accept) => {
          const user = me();
          set((s) => ({
            swaps: s.swaps.map((sw) =>
              sw.id === swapId ? { ...sw, status: accept ? "accepted" : "declined", updatedAt: now() } : sw
            ),
          }));
          if (accept && user) {
            pushMessage(swapId, "system", `${user.name} accepted the swap. Say hi and pick a time!`);
          }
        },

        cancelSwap: (swapId) =>
          set((s) => ({
            swaps: s.swaps.map((sw) => (sw.id === swapId ? { ...sw, status: "cancelled", updatedAt: now() } : sw)),
          })),

        sendMessage: (swapId, text) => {
          const user = me();
          const swap = get().swaps.find((sw) => sw.id === swapId);
          if (!user || !swap || !text.trim()) return;
          pushMessage(swapId, user.id, text.trim());
          set((s) => ({ lastRead: { ...s.lastRead, [swapId]: now() } }));

          // Demo: simulate the other person replying.
          const otherId = swap.requesterId === user.id ? swap.recipientId : swap.requesterId;
          setTimeout(() => {
            pushMessage(swapId, otherId, REPLIES[Math.floor(Math.random() * REPLIES.length)]);
          }, REPLY_DELAY);
        },

        markConversationRead: (swapId) => set((s) => ({ lastRead: { ...s.lastRead, [swapId]: now() } })),

        scheduleSession: (input) => {
          const user = me();
          const skill = get().skills.find((s) => s.id === input.skillId);
          if (!user) return;
          const session: Session = { ...input, id: uid("se"), status: "scheduled" };
          set((s) => ({ sessions: [...s.sessions, session] }));
          const when = new Date(input.startsAt).toLocaleString([], {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          });
          pushMessage(input.swapId, "system", `Session scheduled: ${skill?.title ?? "Skill swap"} · ${when}`);
        },

        cancelSession: (sessionId) => {
          const session = get().sessions.find((s) => s.id === sessionId);
          set((s) => ({
            sessions: s.sessions.map((se) => (se.id === sessionId ? { ...se, status: "cancelled" } : se)),
          }));
          if (session) pushMessage(session.swapId, "system", "A session was cancelled.");
        },

        completeSession: (sessionId) =>
          set((s) => ({
            sessions: s.sessions.map((se) => (se.id === sessionId ? { ...se, status: "completed" } : se)),
          })),

        addReview: (input) => {
          const user = me();
          if (!user) return;
          set((s) => ({
            reviews: [{ ...input, id: uid("r"), authorId: user.id, createdAt: now() }, ...s.reviews],
          }));
        },

        markNotificationRead: (id) =>
          set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),

        markAllNotificationsRead: () =>
          set((s) => ({
            notifications: s.notifications.map((n) => (n.userId === s.currentUserId ? { ...n, read: true } : n)),
          })),

        resetDemo: () => set(seed()),
      };
    },
    {
      name: "skillswap-demo",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => {
        const { users, skills, wants, swaps, messages, sessions, reviews, notifications, savedSkillIds, lastRead, currentUserId } = s;
        return { users, skills, wants, swaps, messages, sessions, reviews, notifications, savedSkillIds, lastRead, currentUserId };
      },
      // Older demo data used a different shape; start fresh rather than crash.
      migrate: () => seed() as unknown as Data & Actions,
    }
  )
);

// ---------- Hydration ----------

interface HydrationState {
  hydrated: boolean;
}
export const useHydration = create<HydrationState>(() => ({ hydrated: false }));

export function hydrateStore() {
  if (useHydration.getState().hydrated) return;
  Promise.resolve(useStore.persist.rehydrate()).finally(() => useHydration.setState({ hydrated: true }));
}

// ---------- Toasts ----------

export interface Toast {
  id: string;
  title: string;
  description?: string;
  tone?: "default" | "success" | "error";
}

interface ToastState {
  toasts: Toast[];
  push: (t: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
}

export const useToasts = create<ToastState>((set, get) => ({
  toasts: [],
  push: (t) => {
    const id = uid("t");
    set((s) => ({ toasts: [...s.toasts, { ...t, id }].slice(-3) }));
    setTimeout(() => get().dismiss(id), 3800);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export const toast = (t: Omit<Toast, "id">) => useToasts.getState().push(t);
