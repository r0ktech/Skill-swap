"use client";

import { useEffect, useState } from "react";
import { toast, useStore } from "@/lib/store";
import type { Session, User } from "@/lib/types";
import { firstName } from "@/lib/utils";
import { UserAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/input";
import { StarInput } from "@/components/common/StarRating";

const LABELS = ["", "Not great", "Okay", "Good", "Great", "Outstanding"];

export function ReviewDialog({
  session,
  subject,
  open,
  onOpenChange,
}: {
  session: Session;
  subject: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const addReview = useStore((s) => s.addReview);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  useEffect(() => {
    if (open) {
      setRating(5);
      setText("");
    }
  }, [open]);

  const submit = () => {
    addReview({ subjectId: subject.id, sessionId: session.id, rating, text: text.trim() });
    toast({ title: "Thanks for the review!", description: "It helps the whole community.", tone: "success" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>How was your session?</DialogTitle>
          <DialogDescription>Your review appears on {firstName(subject.name)}&apos;s public profile.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-3 py-2">
          <UserAvatar user={subject} className="size-14" />
          <StarInput value={rating} onChange={setRating} />
          <p className="text-sm font-medium text-muted-foreground">{LABELS[rating]}</p>
        </div>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`What did ${firstName(subject.name)} do well?`}
          aria-label="Review"
        />
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Later
          </Button>
          <Button onClick={submit} disabled={text.trim().length < 5}>
            Post review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
