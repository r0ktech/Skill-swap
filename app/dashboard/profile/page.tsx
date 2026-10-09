"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Camera, Check, ExternalLink, LogOut, RotateCcw } from "lucide-react";
import { useMe } from "@/lib/hooks";
import { toast, useStore } from "@/lib/store";
import { AVAILABILITY, type Availability } from "@/lib/types";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, Input, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/common/PageHeader";

const MAX_AVATAR_BYTES = 1024 * 1024;

export default function ProfileSettingsPage() {
  const router = useRouter();
  const me = useMe()!;
  const updateProfile = useStore((s) => s.updateProfile);
  const logout = useStore((s) => s.logout);
  const resetDemo = useStore((s) => s.resetDemo);
  const fileRef = useRef<HTMLInputElement>(null);

  const initial = {
    name: me.name,
    email: me.email,
    headline: me.headline,
    location: me.location,
    bio: me.bio,
    languages: me.languages.join(", "),
    availability: me.availability,
    avatar: me.avatar,
  };
  const [form, setForm] = useState(initial);
  const [resetOpen, setResetOpen] = useState(false);
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  const dirty = JSON.stringify(form) !== JSON.stringify(initial);
  const errors = {
    name: form.name.trim().length < 2 ? "Name is required." : "",
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) ? "" : "Enter a valid email.",
  };
  const valid = !errors.name && !errors.email;

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast({ title: "Please choose an image file", tone: "error" });
    if (file.size > MAX_AVATAR_BYTES) return toast({ title: "Image must be under 1 MB", tone: "error" });
    const reader = new FileReader();
    reader.onload = () => set("avatar", String(reader.result));
    reader.readAsDataURL(file);
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    updateProfile({
      name: form.name.trim(),
      email: form.email.trim(),
      headline: form.headline.trim(),
      location: form.location.trim(),
      bio: form.bio.trim(),
      avatar: form.avatar,
      availability: form.availability,
      languages: form.languages
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean),
    });
    toast({ title: "Profile saved", tone: "success" });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Settings"
        description="This is what other members see on your public profile."
        actions={
          <Button asChild variant="outline">
            <Link href={`/u/${me.id}`}>
              <ExternalLink /> View profile
            </Link>
          </Button>
        }
      />

      <form onSubmit={save} className="rounded-xl border bg-card shadow-soft">
        <div className="flex flex-col items-start gap-5 border-b p-6 sm:flex-row sm:items-center">
          <div className="relative">
            <UserAvatar user={{ name: form.name || me.name, avatar: form.avatar }} className="size-20 text-xl" />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 grid size-8 place-items-center rounded-full border-2 border-card bg-foreground text-background transition-transform hover:scale-105"
              aria-label="Change photo"
            >
              <Camera className="size-3.5" />
            </button>
          </div>
          <div>
            <p className="font-medium">Profile photo</p>
            <p className="text-sm text-muted-foreground">JPG, PNG or GIF, up to 1 MB. Faces get more swap requests.</p>
            <div className="mt-2 flex gap-2">
              <Button type="button" size="sm" variant="outline" onClick={() => fileRef.current?.click()}>
                Upload
              </Button>
              {form.avatar && (
                <Button type="button" size="sm" variant="ghost" onClick={() => set("avatar", "")}>
                  Remove
                </Button>
              )}
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} aria-label="Upload profile photo" />
        </div>

        <div className="grid gap-5 p-6 sm:grid-cols-2">
          <Field label="Full name" htmlFor="pf-name" error={errors.name}>
            <Input id="pf-name" value={form.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!errors.name} />
          </Field>
          <Field label="Email" htmlFor="pf-email" error={errors.email}>
            <Input id="pf-email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!errors.email} />
          </Field>
          <Field label="Headline" htmlFor="pf-headline" className="sm:col-span-2" hint="Shown under your name everywhere.">
            <Input id="pf-headline" value={form.headline} onChange={(e) => set("headline", e.target.value)} maxLength={70} />
          </Field>
          <Field label="Location" htmlFor="pf-location">
            <Input id="pf-location" value={form.location} onChange={(e) => set("location", e.target.value)} />
          </Field>
          <Field label="Languages" htmlFor="pf-langs" hint="Comma separated">
            <Input id="pf-langs" value={form.languages} onChange={(e) => set("languages", e.target.value)} />
          </Field>
          <Field label="Bio" htmlFor="pf-bio" className="sm:col-span-2" hint={`${form.bio.length}/400`}>
            <Textarea id="pf-bio" value={form.bio} onChange={(e) => set("bio", e.target.value)} maxLength={400} className="min-h-[120px]" />
          </Field>
          <Field label="Availability" className="sm:col-span-2">
            <div className="flex flex-wrap gap-2">
              {AVAILABILITY.map((a: Availability) => {
                const on = form.availability.includes(a);
                return (
                  <button
                    key={a}
                    type="button"
                    aria-pressed={on}
                    onClick={() => set("availability", on ? form.availability.filter((x) => x !== a) : [...form.availability, a])}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                      on ? "border-foreground bg-foreground text-background" : "hover:border-foreground/30"
                    )}
                  >
                    {on && <Check className="size-3.5" />}
                    {a}
                  </button>
                );
              })}
            </div>
          </Field>
        </div>

        <div className="sticky bottom-20 flex items-center justify-end gap-2 rounded-b-xl border-t bg-card/95 px-6 py-4 backdrop-blur md:bottom-0">
          {dirty && <span className="mr-auto text-sm text-muted-foreground">Unsaved changes</span>}
          <Button type="button" variant="ghost" disabled={!dirty} onClick={() => setForm(initial)}>
            Discard
          </Button>
          <Button type="submit" disabled={!dirty || !valid}>
            Save changes
          </Button>
        </div>
      </form>

      <section className="rounded-xl border bg-card p-6 shadow-soft">
        <h2 className="font-semibold">Account</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Button
            variant="outline"
            onClick={() => {
              logout();
              toast({ title: "Signed out" });
              router.push("/");
            }}
          >
            <LogOut /> Sign out
          </Button>
          <Button variant="outline" className="text-destructive hover:bg-destructive/5" onClick={() => setResetOpen(true)}>
            <RotateCcw /> Reset demo data
          </Button>
        </div>
      </section>

      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset demo data?</DialogTitle>
            <DialogDescription>
              Everything you&apos;ve changed in this browser (skills, swaps, messages, sessions) goes back to the sample data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setResetOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                resetDemo();
                setResetOpen(false);
                toast({ title: "Demo data restored" });
                router.push("/dashboard");
              }}
            >
              Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
