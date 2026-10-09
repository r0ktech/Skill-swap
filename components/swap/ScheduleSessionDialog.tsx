"use client";

import { useEffect, useState } from "react";
import { MapPin, Video } from "lucide-react";
import type { Conversation } from "@/lib/hooks";
import { useMe } from "@/lib/hooks";
import { toast, useStore } from "@/lib/store";
import { addDays, cn, firstName } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, Input, Select, Textarea } from "@/components/ui/input";

const toDateInput = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const SLOTS = ["09:00", "12:30", "18:00", "19:30"];

export function ScheduleSessionDialog({
  conversation,
  open,
  onOpenChange,
}: {
  conversation: Conversation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const me = useMe();
  const scheduleSession = useStore((s) => s.scheduleSession);
  const { swap, other, requestedSkill, offeredSkill } = conversation;
  const skills = [requestedSkill, offeredSkill].filter(Boolean) as NonNullable<typeof requestedSkill>[];

  const [skillId, setSkillId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("18:00");
  const [duration, setDuration] = useState(60);
  const [format, setFormat] = useState<"Video call" | "In person">("Video call");
  const [location, setLocation] = useState("Google Meet");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) return;
    const first = skills[0];
    setSkillId(first?.id ?? "");
    setDuration(first?.sessionLength ?? 60);
    setDate(toDateInput(addDays(new Date(), 2)));
    setTime("18:00");
    setFormat("Video call");
    setLocation("Google Meet");
    setNote("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!me) return null;
  const skill = skills.find((s) => s.id === skillId);
  const startsAt = date && time ? new Date(`${date}T${time}`) : null;
  const inPast = startsAt ? startsAt.getTime() < Date.now() : true;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skill || !startsAt || inPast) return;
    const teacherId = skill.userId;
    scheduleSession({
      swapId: swap.id,
      skillId: skill.id,
      teacherId,
      learnerId: teacherId === me.id ? other.id : me.id,
      startsAt: startsAt.toISOString(),
      durationMin: duration,
      format,
      location: location.trim() || (format === "Video call" ? "Video link TBD" : "Location TBD"),
      note: note.trim(),
    });
    toast({ title: "Session scheduled", description: `${firstName(other.name)} has been notified.`, tone: "success" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Schedule a session</DialogTitle>
          <DialogDescription>With {other.name}. They&apos;ll see it in their calendar.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4">
          <Field label="What are you covering?">
            <div className="grid gap-2 sm:grid-cols-2">
              {skills.map((s) => {
                const teaching = s.userId === me.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSkillId(s.id);
                      setDuration(s.sessionLength);
                    }}
                    className={cn(
                      "rounded-xl border p-3 text-left transition-colors",
                      skillId === s.id
                        ? teaching
                          ? "border-teach bg-teach-soft/60"
                          : "border-learn bg-learn-soft/60"
                        : "hover:bg-secondary"
                    )}
                  >
                    <span
                      className={cn(
                        "text-[11px] font-semibold uppercase tracking-wider",
                        teaching ? "text-teach-ink/80" : "text-learn-ink/80"
                      )}
                    >
                      {teaching ? "You teach" : "You learn"}
                    </span>
                    <span className="mt-0.5 block text-sm font-medium leading-snug">{s.title}</span>
                  </button>
                );
              })}
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Date" htmlFor="ses-date">
              <Input id="ses-date" type="date" min={toDateInput(new Date())} value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>
            <Field label="Time" htmlFor="ses-time">
              <Input id="ses-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} aria-invalid={inPast} />
            </Field>
          </div>
          <div className="-mt-1 flex flex-wrap gap-1.5">
            {SLOTS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setTime(s)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition-colors",
                  time === s ? "border-foreground bg-foreground text-background" : "hover:bg-secondary"
                )}
              >
                {new Date(`2000-01-01T${s}`).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
              </button>
            ))}
          </div>
          {inPast && date && <p className="-mt-2 text-xs text-destructive">Pick a time in the future.</p>}

          <div className="grid grid-cols-2 gap-3">
            <Field label="Duration" htmlFor="ses-dur">
              <Select id="ses-dur" value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
                {[30, 45, 60, 90, 120].map((m) => (
                  <option key={m} value={m}>
                    {m} min
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Format">
              <div className="grid h-11 grid-cols-2 rounded-lg bg-secondary p-1">
                {(["Video call", "In person"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => {
                      setFormat(f);
                      setLocation(f === "Video call" ? "Google Meet" : "");
                    }}
                    className={cn(
                      "inline-flex items-center justify-center gap-1.5 rounded-md text-xs font-medium transition-all",
                      format === f ? "bg-card shadow-sm" : "text-muted-foreground"
                    )}
                  >
                    {f === "Video call" ? <Video className="size-3.5" /> : <MapPin className="size-3.5" />}
                    {f === "Video call" ? "Video" : "In person"}
                  </button>
                ))}
              </div>
            </Field>
          </div>
          <Field label={format === "Video call" ? "Meeting link or app" : "Meeting place"} htmlFor="ses-loc">
            <Input
              id="ses-loc"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={format === "Video call" ? "Zoom, Google Meet, link…" : "Café, library, park…"}
            />
          </Field>
          <Field label="Notes (optional)" htmlFor="ses-note">
            <Textarea id="ses-note" value={note} onChange={(e) => setNote(e.target.value)} className="min-h-[64px]" placeholder="Anything to prepare?" />
          </Field>
          <DialogFooter className="pt-1">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!skill || inPast}>
              Schedule session
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
