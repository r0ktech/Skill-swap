"use client";

import { useEffect, useState } from "react";
import { toast, useStore } from "@/lib/store";
import { CATEGORIES, type Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, Input, Select, Textarea } from "@/components/ui/input";

const SUGGESTIONS: { title: string; category: Category }[] = [
  { title: "Conversational Spanish", category: "Language" },
  { title: "UI design in Figma", category: "Design" },
  { title: "Guitar basics", category: "Music" },
  { title: "Data analysis with Python", category: "Development" },
  { title: "Photography", category: "Lifestyle" },
  { title: "Public speaking", category: "Business" },
];

export function WantFormDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const addWant = useStore((s) => s.addWant);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("Language");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (open) {
      setTitle("");
      setNote("");
    }
  }, [open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim().length < 2) return;
    addWant({ title: title.trim(), category, note: note.trim() });
    toast({ title: "Added to your learning list", description: "We'll surface matching teachers.", tone: "success" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>What do you want to learn?</DialogTitle>
          <DialogDescription>Your learning list powers your match suggestions.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4">
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((s) => (
              <button
                type="button"
                key={s.title}
                onClick={() => {
                  setTitle(s.title);
                  setCategory(s.category);
                }}
                className="rounded-full border border-dashed border-learn/40 px-3 py-1 text-xs text-learn-ink transition-colors hover:bg-learn-soft"
              >
                + {s.title}
              </button>
            ))}
          </div>
          <Field label="Skill" htmlFor="want-title">
            <Input id="want-title" autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Japanese for travel" />
          </Field>
          <Field label="Category" htmlFor="want-cat">
            <Select id="want-cat" value={category} onChange={(e) => setCategory(e.target.value as Category)}>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Select>
          </Field>
          <Field label="Goal (optional)" htmlFor="want-note">
            <Textarea
              id="want-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[72px]"
              placeholder="Why you want to learn it, and your current level"
            />
          </Field>
          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="learn" disabled={title.trim().length < 2}>
              Add to list
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
