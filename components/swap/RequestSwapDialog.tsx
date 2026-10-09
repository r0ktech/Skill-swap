"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowDown, Check, Plus } from "lucide-react";
import { useMe, useUserLookup } from "@/lib/hooks";
import { skillWantScore } from "@/lib/matching";
import { toast, useStore } from "@/lib/store";
import type { Skill } from "@/lib/types";
import { cn, firstName } from "@/lib/utils";
import { UserAvatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, Textarea } from "@/components/ui/input";

export function RequestSwapDialog({
  skill,
  open,
  onOpenChange,
}: {
  skill: Skill;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const me = useMe();
  const getUser = useUserLookup();
  const allSkills = useStore((s) => s.skills);
  const wants = useStore((s) => s.wants);
  const swaps = useStore((s) => s.swaps);
  const requestSwap = useStore((s) => s.requestSwap);
  const owner = getUser(skill.userId);

  const mySkills = useMemo(() => allSkills.filter((s) => s.userId === me?.id), [allSkills, me?.id]);
  const ownerWants = useMemo(() => wants.filter((w) => w.userId === skill.userId), [wants, skill.userId]);

  // Rank my skills by how much the owner wants them.
  const ranked = useMemo(
    () =>
      mySkills
        .map((s) => ({ skill: s, score: Math.max(0, ...ownerWants.map((w) => skillWantScore(s, w))) }))
        .sort((a, b) => b.score - a.score),
    [mySkills, ownerWants]
  );

  const existing = swaps.find(
    (sw) => sw.requestedSkillId === skill.id && sw.requesterId === me?.id && ["pending", "accepted"].includes(sw.status)
  );

  const [offered, setOffered] = useState<string | null>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open || !owner || !me) return;
    setOffered(ranked[0]?.skill.id ?? null);
    setNote(`Hi ${firstName(owner.name)}! I'd love to learn ${skill.title} from you.`);
  }, [open, owner, me, ranked, skill.title]);

  if (!owner) return null;

  const submit = () => {
    const swap = requestSwap({ requestedSkillId: skill.id, offeredSkillId: offered, note });
    if (!swap) return;
    onOpenChange(false);
    toast({
      title: "Swap request sent",
      description: `${firstName(owner.name)} usually replies within a day.`,
      tone: "success",
    });
    router.push(`/dashboard/messages?c=${swap.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Propose a swap</DialogTitle>
          <DialogDescription>Pick what you&apos;ll teach {firstName(owner.name)} in return.</DialogDescription>
        </DialogHeader>

        {!me ? (
          <div className="grid gap-4 text-sm">
            <p className="text-muted-foreground">Sign in to request a swap with {owner.name}.</p>
            <Button asChild>
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        ) : existing ? (
          <div className="grid gap-4">
            <p className="text-sm text-muted-foreground">
              You already have a {existing.status} swap with {firstName(owner.name)} for this skill.
            </p>
            <Button asChild>
              <Link href={`/dashboard/messages?c=${existing.id}`}>Open conversation</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="grid gap-2">
              {/* You learn */}
              <div className="flex items-center gap-3 rounded-xl border border-learn/25 bg-learn-soft/60 p-3.5">
                <UserAvatar user={owner} className="size-9" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-learn-ink/80">You learn</p>
                  <p className="truncate font-medium">{skill.title}</p>
                </div>
              </div>
              <div className="flex justify-center">
                <span className="grid size-7 place-items-center rounded-full border bg-card text-muted-foreground">
                  <ArrowDown className="size-3.5" />
                </span>
              </div>
              {/* You teach */}
              <p className="text-[11px] font-semibold uppercase tracking-wider text-teach-ink/80">You teach</p>
              {ranked.length > 0 ? (
                <div className="grid gap-2" role="radiogroup" aria-label="Skill to offer">
                  {ranked.map(({ skill: s, score }) => {
                    const selected = offered === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setOffered(s.id)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl border p-3.5 text-left transition-colors",
                          selected ? "border-teach bg-teach-soft/60" : "hover:bg-secondary"
                        )}
                      >
                        <span
                          className={cn(
                            "grid size-5 place-items-center rounded-full border",
                            selected ? "border-teach bg-teach text-white" : "border-input"
                          )}
                        >
                          {selected && <Check className="size-3" />}
                        </span>
                        <span className="flex-1 font-medium">{s.title}</span>
                        {score >= 0.7 && <Badge variant="teach">On their list</Badge>}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                  You haven&apos;t listed a skill yet. You can still send a request, but members are more likely to accept
                  a real swap.{" "}
                  <Link href="/dashboard/my-skills" className="inline-flex items-center gap-1 font-medium text-foreground underline">
                    <Plus className="size-3.5" /> Add a skill
                  </Link>
                </div>
              )}
            </div>

            <Field label="Message" htmlFor="swap-note">
              <Textarea id="swap-note" value={note} onChange={(e) => setNote(e.target.value)} className="min-h-[80px]" />
            </Field>

            <DialogFooter>
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={submit}>Send request</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
