export const CATEGORIES = [
  "Development",
  "Design",
  "Marketing",
  "Language",
  "Music",
  "Business",
  "Lifestyle",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"] as const;
export type Level = (typeof LEVELS)[number];

export const FORMATS = ["Online", "In person", "Either"] as const;
export type Format = (typeof FORMATS)[number];

export const AVAILABILITY = [
  "Weekday mornings",
  "Weekday evenings",
  "Weekends",
  "Flexible",
] as const;
export type Availability = (typeof AVAILABILITY)[number];

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  headline: string;
  bio: string;
  location: string;
  languages: string[];
  availability: Availability[];
  joinedAt: string;
}

/** A skill a user can teach. */
export interface Skill {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: Category;
  level: Level;
  format: Format;
  sessionLength: number; // minutes
  tags: string[];
  createdAt: string;
}

/** A skill a user wants to learn. */
export interface Want {
  id: string;
  userId: string;
  title: string;
  category: Category;
  note: string;
}

export type SwapStatus = "pending" | "accepted" | "declined" | "cancelled" | "completed";

export interface Swap {
  id: string;
  requesterId: string;
  recipientId: string;
  /** The recipient's skill the requester wants to learn. */
  requestedSkillId: string;
  /** The requester's skill offered in exchange. */
  offeredSkillId: string | null;
  status: SwapStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  swapId: string;
  senderId: string; // "system" for automated notes
  text: string;
  createdAt: string;
}

export type SessionStatus = "scheduled" | "completed" | "cancelled";

export interface Session {
  id: string;
  swapId: string;
  skillId: string;
  teacherId: string;
  learnerId: string;
  startsAt: string;
  durationMin: number;
  format: "Video call" | "In person";
  location: string;
  note: string;
  status: SessionStatus;
}

export interface Review {
  id: string;
  authorId: string;
  subjectId: string;
  sessionId: string | null;
  rating: number;
  text: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  kind: "request" | "accepted" | "declined" | "message" | "session" | "review";
  title: string;
  body: string;
  href: string;
  createdAt: string;
  read: boolean;
}
