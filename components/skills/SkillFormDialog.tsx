"use client";

import { useEffect, useState } from "react";
import { toast, useStore } from "@/lib/store";
import { CATEGORIES, FORMATS, LEVELS, type Category, type Format, type Level, type Skill } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, Input, Select, Textarea } from "@/components/ui/input";

const empty = {
  title: "",
  description: "",
  category: CATEGORIES[0] as Category,
  level: "Intermediate" as Level,
  format: "Online" as Format,
  sessionLength: 60,
  tags: "",
};

export function SkillFormDialog({
  open,
  onOpenChange,
  skill,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skill?: Skill | null;
}) {
  const addSkill = useStore((s) => s.addSkill);
  const editSkill = useStore((s) => s.editSkill);
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (!open) return;
    setForm(skill ? { ...skill, tags: skill.tags.join(", ") } : empty);
  }, [open, skill]);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => setForm((f) => ({ ...f, [key]: value }));
  const valid = form.title.trim().length >= 3 && form.description.trim().length >= 20;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    const payload = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      tags: form.tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
    };
    if (skill) {
      editSkill(skill.id, payload);
      toast({ title: "Skill updated", tone: "success" });
    } else {
      addSkill(payload);
      toast({ title: "Skill published", description: "It's now visible on Browse.", tone: "success" });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{skill ? "Edit skill" : "Offer a new skill"}</DialogTitle>
          <DialogDescription>Describe what you can teach. Specific beats general.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4">
          <Field label="Skill title" htmlFor="sk-title">
            <Input
              id="sk-title"
              autoFocus
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Sourdough baking from scratch"
              maxLength={60}
            />
          </Field>
          <Field
            label="What will people learn?"
            htmlFor="sk-desc"
            hint={`${form.description.trim().length}/20 characters minimum`}
          >
            <Textarea
              id="sk-desc"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Outline what a first session looks like and who it's for."
              maxLength={400}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category" htmlFor="sk-cat">
              <Select id="sk-cat" value={form.category} onChange={(e) => set("category", e.target.value as Category)}>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </Select>
            </Field>
            <Field label="Your level" htmlFor="sk-level">
              <Select id="sk-level" value={form.level} onChange={(e) => set("level", e.target.value as Level)}>
                {LEVELS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </Select>
            </Field>
            <Field label="Format" htmlFor="sk-format">
              <Select id="sk-format" value={form.format} onChange={(e) => set("format", e.target.value as Format)}>
                {FORMATS.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </Select>
            </Field>
            <Field label="Session length" htmlFor="sk-len">
              <Select id="sk-len" value={form.sessionLength} onChange={(e) => set("sessionLength", Number(e.target.value))}>
                {[30, 45, 60, 90, 120].map((m) => (
                  <option key={m} value={m}>
                    {m} minutes
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <Field label="Tags" htmlFor="sk-tags" hint="Comma separated. Tags improve your matches.">
            <Input id="sk-tags" value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="baking, bread, cooking" />
          </Field>
          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!valid}>
              {skill ? "Save changes" : "Publish skill"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
