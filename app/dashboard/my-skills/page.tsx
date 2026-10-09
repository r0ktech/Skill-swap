"use client";

import { useMemo, useState } from "react";
import { Lightbulb, Plus } from "lucide-react";
import { useMe } from "@/lib/hooks";
import { toast, useStore } from "@/lib/store";
import type { Skill } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { SkillCard } from "@/components/skills/SkillCard";
import { SkillFormDialog } from "@/components/skills/SkillFormDialog";

export default function MySkillsPage() {
  const me = useMe()!;
  const skills = useStore((s) => s.skills);
  const swaps = useStore((s) => s.swaps);
  const deleteSkill = useStore((s) => s.deleteSkill);
  const mySkills = useMemo(() => skills.filter((s) => s.userId === me.id), [skills, me.id]);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [deleting, setDeleting] = useState<Skill | null>(null);

  const requestsFor = (id: string) => swaps.filter((sw) => sw.requestedSkillId === id).length;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Skills I teach"
        description="What you offer the community. Clear, specific listings get more requests."
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus /> Offer a skill
          </Button>
        }
      />

      {mySkills.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mySkills.map((s) => (
            <div key={s.id} className="flex flex-col">
              <SkillCard
                skill={s}
                className="flex-1"
                onEdit={(sk) => {
                  setEditing(sk);
                  setFormOpen(true);
                }}
                onDelete={setDeleting}
              />
              <p className="mt-2 px-1 text-xs text-muted-foreground">
                {requestsFor(s.id) ? `${requestsFor(s.id)} swap request${requestsFor(s.id) > 1 ? "s" : ""} so far` : "No requests yet"}
              </p>
            </div>
          ))}
          <button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            className="flex min-h-[240px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-muted-foreground transition-colors hover:border-foreground/30 hover:bg-card hover:text-foreground"
          >
            <Plus className="size-6" />
            <span className="text-sm font-medium">Add another skill</span>
          </button>
        </div>
      ) : (
        <EmptyState
          icon={Lightbulb}
          title="You haven't offered a skill yet"
          description="Everyone knows something. Cooking, spreadsheets, a language, an instrument: it all counts."
          action={
            <Button onClick={() => setFormOpen(true)}>
              <Plus /> Offer your first skill
            </Button>
          }
        />
      )}

      <SkillFormDialog open={formOpen} onOpenChange={setFormOpen} skill={editing} />

      <Dialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete &ldquo;{deleting?.title}&rdquo;?</DialogTitle>
            <DialogDescription>It will disappear from Browse. Existing swaps and conversations stay intact.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleting(null)}>
              Keep it
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleting) deleteSkill(deleting.id);
                toast({ title: "Skill deleted" });
                setDeleting(null);
              }}
            >
              Delete skill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
