import type { Skill, User, Want } from "./types";

const STOPWORDS = new Set([
  "and", "for", "the", "with", "basics", "beginners", "beginner", "fundamentals",
  "practice", "intro", "introduction", "made", "simple", "to", "of", "in", "a", "my",
]);

function tokens(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s]/g, " ")
    .split(/\s+/)
    .map((t) => t.replace(/\.$/, ""))
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

/** How well a teachable skill satisfies a wanted skill, 0..1. */
export function skillWantScore(skill: Skill, want: Pick<Want, "title" | "category">) {
  const wantTokens = new Set(tokens(want.title));
  const skillTokens = new Set([...tokens(skill.title), ...skill.tags.flatMap(tokens)]);
  let overlap = 0;
  wantTokens.forEach((t) => {
    if (skillTokens.has(t)) overlap++;
  });
  if (overlap > 0) return Math.min(1, 0.7 + 0.15 * overlap);
  return skill.category === want.category ? 0.35 : 0;
}

export interface Pairing {
  skill: Skill;
  want: Want;
  score: number;
}

export interface MatchSuggestion {
  user: User;
  /** Their skills that cover what I want to learn. */
  theyTeach: Pairing[];
  /** My skills that cover what they want to learn. */
  iTeach: Pairing[];
  mutual: boolean;
  score: number; // 0..100
}

function bestPairings(skills: Skill[], wants: Want[]) {
  const pairings: Pairing[] = [];
  for (const skill of skills) {
    let best: Pairing | null = null;
    for (const want of wants) {
      const score = skillWantScore(skill, want);
      if (score > 0 && (!best || score > best.score)) best = { skill, want, score };
    }
    if (best) pairings.push(best);
  }
  return pairings.sort((a, b) => b.score - a.score);
}

/**
 * Rank other members by how well a swap would work in both directions.
 * A strong one-sided match still shows up, but mutual matches rank higher.
 */
export function computeMatches(
  meId: string,
  users: User[],
  skills: Skill[],
  wants: Want[]
): MatchSuggestion[] {
  const myWants = wants.filter((w) => w.userId === meId);
  const mySkills = skills.filter((s) => s.userId === meId);

  return users
    .filter((u) => u.id !== meId)
    .map((user) => {
      const theirSkills = skills.filter((s) => s.userId === user.id);
      const theirWants = wants.filter((w) => w.userId === user.id);
      const theyTeach = bestPairings(theirSkills, myWants);
      const iTeach = bestPairings(mySkills, theirWants);
      const a = theyTeach[0]?.score ?? 0;
      const b = iTeach[0]?.score ?? 0;
      const mutual = a >= 0.7 && b >= 0.7;
      const score = Math.round(Math.min(99, a * 55 + b * 40 + (mutual ? 8 : 0)));
      return { user, theyTeach, iTeach, mutual, score };
    })
    .filter((m) => m.score >= 25 && m.theyTeach.length > 0)
    .sort((x, y) => y.score - x.score);
}
