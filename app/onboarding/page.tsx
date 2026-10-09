"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Plus, X } from "lucide-react";
import { useHydrated, useMatches, useMe } from "@/lib/hooks";
import { toast, useStore } from "@/lib/store";
import { AVAILABILITY, CATEGORIES, type Availability, type Category } from "@/lib/types";
import { cn, firstName } from "@/lib/utils";
import { UserAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { Logo } from "@/components/common/Logo";

const STEPS = ["About you", "What you teach", "What you want to learn", "Your matches"];

const LEARN_IDEAS: { title: string; category: Category }[] = [
  { title: "Conversational Spanish", category: "Language" },
  { title: "French conversation", category: "Language" },
  { title: "UI design in Figma", category: "Design" },
  { title: "Guitar basics", category: "Music" },
  { title: "Data analysis with Python", category: "Development" },
  { title: "Photography", category: "Lifestyle" },
  { title: "Copywriting", category: "Marketing" },
  { title: "Notion productivity", category: "Business" },
];

interface Draft {
  title: string;
  category: Category;
}

export default function OnboardingPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const me = useMe();
  const updateProfile = useStore((s) => s.updateProfile);
  const addSkill = useStore((s) => s.addSkill);
  const addWant = useStore((s) => s.addWant);
  const matches = useMatches();

  const [step, setStep] = useState(0);
  const [headline, setHeadline] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [availability, setAvailability] = useState<Availability[]>(["Weekday evenings"]);
  const [teach, setTeach] = useState<Draft[]>([]);
  const [teachDraft, setTeachDraft] = useState<Draft>({ title: "", category: "Development" });
  const [learn, setLearn] = useState<Draft[]>([]);
  const [learnDraft, setLearnDraft] = useState("");

  useEffect(() => {
    if (hydrated && !me) router.replace("/signup");
  }, [hydrated, me, router]);

  const canContinue = useMemo(() => {
    if (step === 1) return teach.length > 0;
    if (step === 2) return learn.length > 0;
    return true;
  }, [step, teach.length, learn.length]);

  if (!hydrated || !me) return null;

  const next = () => {
    if (step === 0) updateProfile({ headline: headline.trim(), location: location.trim(), bio: bio.trim(), availability });
    // Skills and wants are committed together once, so going Back never duplicates them.
    if (step === 2) {
      teach.forEach((t) =>
        addSkill({
          title: t.title,
          category: t.category,
          description: `I can teach ${t.title}. Message me and we'll shape the sessions around your goals.`,
          level: "Intermediate",
          format: "Online",
          sessionLength: 60,
          tags: t.title.toLowerCase().split(/\s+/),
        })
      );
      learn.forEach((l) => addWant({ title: l.title, category: l.category, note: "" }));
    }
    if (step === 3) {
      toast({ title: `You're all set, ${firstName(me.name)}!`, tone: "success" });
      router.push("/dashboard");
      return;
    }
    setStep((s) => s + 1);
  };

  const addTeach = () => {
    if (teachDraft.title.trim().length < 2) return;
    setTeach((t) => [...t, { ...teachDraft, title: teachDraft.title.trim() }]);
    setTeachDraft((d) => ({ ...d, title: "" }));
  };

  const toggleLearn = (idea: Draft) =>
    setLearn((l) => (l.some((x) => x.title === idea.title) ? l.filter((x) => x.title !== idea.title) : [...l, idea]));

  return (
    <div className="min-h-dvh bg-background">
      <header className="container flex h-16 items-center justify-between">
        <Logo href="/" />
        <span className="text-sm text-muted-foreground">
          Step {step + 1} of {STEPS.length}
        </span>
      </header>
      <div className="container">
        <div className="flex gap-1.5" aria-hidden>
          {STEPS.map((s, i) => (
            <span key={s} className={cn("h-1 flex-1 rounded-full transition-colors", i <= step ? "bg-foreground" : "bg-foreground/10")} />
          ))}
        </div>
      </div>

      <main className="container max-w-xl py-12 md:py-16">
        <p className="text-sm font-semibold text-learn">{STEPS[step]}</p>

        {step === 0 && (
          <section className="mt-3 animate-in fade-in-0 slide-in-from-bottom-2">
            <h1 className="text-3xl font-semibold md:text-4xl">Hi {firstName(me.name)}, tell people a little about yourself.</h1>
            <div className="mt-8 grid gap-5">
              <Field label="Headline" htmlFor="ob-headline" hint="One line, e.g. 'Nurse who bakes on weekends'">
                <Input id="ob-headline" value={headline} onChange={(e) => setHeadline(e.target.value)} maxLength={70} />
              </Field>
              <Field label="City" htmlFor="ob-location">
                <Input id="ob-location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Lagos, Nigeria" />
              </Field>
              <Field label="Short bio" htmlFor="ob-bio">
                <Textarea id="ob-bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="What do you love doing? What are you curious about?" />
              </Field>
              <Field label="When are you usually free?">
                <div className="flex flex-wrap gap-2">
                  {AVAILABILITY.map((a) => {
                    const on = availability.includes(a);
                    return (
                      <button
                        key={a}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setAvailability((v) => (on ? v.filter((x) => x !== a) : [...v, a]))}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                          on ? "border-foreground bg-foreground text-background" : "bg-card hover:border-foreground/30"
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
          </section>
        )}

        {step === 1 && (
          <section className="mt-3 animate-in fade-in-0 slide-in-from-bottom-2">
            <h1 className="text-3xl font-semibold md:text-4xl">What could you teach someone?</h1>
            <p className="mt-3 text-muted-foreground">Think hobbies, work skills, languages, anything you&apos;re good at. Add at least one.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addTeach();
              }}
              className="mt-8 grid gap-3 sm:grid-cols-[1fr_160px_auto]"
            >
              <Input
                autoFocus
                value={teachDraft.title}
                onChange={(e) => setTeachDraft((d) => ({ ...d, title: e.target.value }))}
                placeholder="e.g. Excel formulas"
                aria-label="Skill you can teach"
              />
              <Select aria-label="Category" value={teachDraft.category} onChange={(e) => setTeachDraft((d) => ({ ...d, category: e.target.value as Category }))}>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </Select>
              <Button type="submit" variant="teach" className="h-11" disabled={teachDraft.title.trim().length < 2}>
                <Plus /> Add
              </Button>
            </form>
            <ul className="mt-6 flex flex-wrap gap-2">
              {teach.map((t, i) => (
                <li key={i} className="inline-flex items-center gap-1.5 rounded-full bg-teach-soft py-1.5 pl-3.5 pr-1.5 text-sm font-medium text-teach-ink">
                  {t.title}
                  <button onClick={() => setTeach((x) => x.filter((_, j) => j !== i))} className="rounded-full p-0.5 hover:bg-teach/15" aria-label={`Remove ${t.title}`}>
                    <X className="size-3.5" />
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">You can add descriptions, levels and session details later.</p>
          </section>
        )}

        {step === 2 && (
          <section className="mt-3 animate-in fade-in-0 slide-in-from-bottom-2">
            <h1 className="text-3xl font-semibold md:text-4xl">And what do you want to learn?</h1>
            <p className="mt-3 text-muted-foreground">Pick a few. This is what we use to find your matches.</p>
            <div className="mt-8 flex flex-wrap gap-2">
              {[...LEARN_IDEAS, ...learn.filter((l) => !LEARN_IDEAS.some((i) => i.title === l.title))].map((idea) => {
                const on = learn.some((l) => l.title === idea.title);
                return (
                  <button
                    key={idea.title}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleLearn(idea)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                      on ? "border-learn bg-learn text-white" : "bg-card hover:border-learn/50"
                    )}
                  >
                    {on ? <Check className="size-3.5" /> : <Plus className="size-3.5" />}
                    {idea.title}
                  </button>
                );
              })}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const t = learnDraft.trim();
                if (t.length < 2) return;
                setLearn((l) => [...l, { title: t, category: "Lifestyle" }]);
                setLearnDraft("");
              }}
              className="mt-6 flex gap-2"
            >
              <Input value={learnDraft} onChange={(e) => setLearnDraft(e.target.value)} placeholder="Something else…" aria-label="Other skill to learn" />
              <Button type="submit" variant="outline" className="h-11">
                Add
              </Button>
            </form>
          </section>
        )}

        {step === 3 && (
          <section className="mt-3 animate-in fade-in-0 slide-in-from-bottom-2">
            <h1 className="text-3xl font-semibold md:text-4xl">
              {matches.length ? `We found ${matches.length} people to swap with.` : "You're in! Matches will appear as people join."}
            </h1>
            <div className="mt-8 grid gap-3">
              {matches.slice(0, 4).map((m) => (
                <div key={m.user.id} className="flex items-center gap-3 rounded-xl border bg-card p-4">
                  <UserAvatar user={m.user} className="size-11" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{m.user.name}</p>
                    <p className="truncate text-sm text-muted-foreground">Teaches {m.theyTeach[0]?.skill.title}</p>
                  </div>
                  <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", m.mutual ? "bg-learn-soft text-learn-ink" : "bg-secondary")}>
                    {m.score}%
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="mt-12 flex items-center justify-between">
          {step > 0 && step < 3 ? (
            <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>
              <ArrowLeft /> Back
            </Button>
          ) : (
            <span />
          )}
          <Button size="lg" onClick={next} disabled={!canContinue}>
            {step === 3 ? "Go to dashboard" : "Continue"} <ArrowRight />
          </Button>
        </div>
      </main>
    </div>
  );
}
