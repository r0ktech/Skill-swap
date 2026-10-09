"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Bookmark, GraduationCap, Plus, Trash2 } from "lucide-react";
import { useMe } from "@/lib/hooks";
import { skillWantScore } from "@/lib/matching";
import { toast, useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { CategoryIcon } from "@/components/skills/CategoryIcon";
import { SkillCard } from "@/components/skills/SkillCard";
import { WantFormDialog } from "@/components/skills/WantFormDialog";

export default function WantedSkillsPage() {
  const me = useMe()!;
  const wants = useStore((s) => s.wants);
  const skills = useStore((s) => s.skills);
  const savedIds = useStore((s) => s.savedSkillIds);
  const deleteWant = useStore((s) => s.deleteWant);
  const [open, setOpen] = useState(false);

  const myWants = useMemo(() => wants.filter((w) => w.userId === me.id), [wants, me.id]);
  const others = useMemo(() => skills.filter((s) => s.userId !== me.id), [skills, me.id]);
  const saved = useMemo(() => others.filter((s) => savedIds.includes(s.id)), [others, savedIds]);

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <PageHeader
        title="Skills I want"
        description="Your learning list. We use it to rank matches and highlight teachers on Browse."
        actions={
          <Button variant="learn" onClick={() => setOpen(true)}>
            <Plus /> Add to list
          </Button>
        }
      />

      {myWants.length ? (
        <ul className="grid gap-3 md:grid-cols-2">
          {myWants.map((w) => {
            const teachers = others.filter((s) => skillWantScore(s, w) >= 0.7);
            return (
              <li key={w.id} className="flex items-start gap-4 rounded-xl border bg-card p-5 shadow-soft">
                <CategoryIcon category={w.category} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{w.title}</p>
                  {w.note && <p className="mt-0.5 text-sm text-muted-foreground">{w.note}</p>}
                  <Link
                    href={`/browse?q=${encodeURIComponent(teachers[0]?.tags[0] ?? w.title)}`}
                    className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-learn-ink hover:underline"
                  >
                    {teachers.length
                      ? `${teachers.length} ${teachers.length === 1 ? "teacher" : "teachers"} available`
                      : "Search for teachers"}
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => {
                    deleteWant(w.id);
                    toast({ title: `Removed ${w.title}` });
                  }}
                  aria-label={`Remove ${w.title}`}
                >
                  <Trash2 />
                </Button>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState
          icon={GraduationCap}
          title="Your learning list is empty"
          description="Add a few things you're curious about and we'll find people who can teach them."
          action={
            <Button variant="learn" onClick={() => setOpen(true)}>
              <Plus /> Add your first skill
            </Button>
          }
        />
      )}

      <section>
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Bookmark className="size-4" /> Saved skills
        </h2>
        {saved.length ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((s) => (
              <SkillCard key={s.id} skill={s} />
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            Tap the bookmark on any skill to save it for later.{" "}
            <Link href="/browse" className="font-medium text-foreground underline underline-offset-4">
              Browse skills
            </Link>
          </p>
        )}
      </section>

      <WantFormDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
