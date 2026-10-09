import Image from "next/image";
import Link from "next/link";
import { ArrowLeftRight, ArrowRight, ArrowUpRight, CalendarDays, Clock, MessageCircle, ShieldCheck, Star } from "lucide-react";
import { seedSkills, seedUsers } from "@/lib/seed";
import { CATEGORIES } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/common/Logo";
import { CATEGORY_META } from "@/components/skills/CategoryIcon";
import { SkillCard } from "@/components/skills/SkillCard";
import { HeroSearch } from "@/components/landing/HeroSearch";

const PAIRS = [
  ["Spanish", "React"],
  ["Guitar", "Next.js"],
  ["Figma", "Copywriting"],
  ["French", "Python"],
  ["Photography", "TypeScript"],
  ["Notion", "Spanish"],
  ["Node.js", "Copywriting"],
  ["Japanese", "Marketing"],
];

const user = (id: string) => seedUsers.find((u) => u.id === id)!;

export default function HomePage() {
  const featured = seedSkills.filter((s) => s.userId !== "u1").slice(0, 4);
  const counts = Object.fromEntries(CATEGORIES.map((c) => [c, seedSkills.filter((s) => s.category === c).length]));

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden">
        <div className="container grid items-center gap-12 pb-16 pt-10 md:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:pb-24">
          <div className="flex flex-col items-start">
            <Link
              href="/browse"
              className="group mb-7 inline-flex items-center gap-2 rounded-full border bg-card py-1 pl-1 pr-3 text-[13px] shadow-soft transition-colors hover:border-foreground/20"
            >
              <span className="flex -space-x-1.5">
                {["u2", "u3", "u6"].map((id) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={id} src={user(id).avatar} alt="" className="size-6 rounded-full border-2 border-card object-cover" />
                ))}
              </span>
              <span className="text-muted-foreground">
                <span className="font-semibold text-foreground">2,400+</span> swaps this month
              </span>
              <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>

            <h1 className="text-[44px] font-semibold leading-[1.02] sm:text-6xl lg:text-[76px]">
              Teach what you know.
              <br />
              Learn what you{" "}
              <span className="font-serif text-[1.08em] font-normal italic tracking-normal text-learn">don&apos;t.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground text-pretty">
              SkillSwap matches you with people who want what you can teach and can teach what you want.
              No fees, no subscriptions. An hour of your time for an hour of theirs.
            </p>
            <div className="mt-9 w-full">
              <HeroSearch />
            </div>
          </div>

          {/* Swap composition */}
          <div className="relative mx-auto w-full max-w-[540px]">
            <div className="relative aspect-square overflow-hidden rounded-[2rem] border bg-card bg-dots">
              <Image
                src="/hero.png"
                alt="Two people trading coding skills for language lessons"
                fill
                priority
                sizes="(min-width: 1024px) 540px, 90vw"
                className="object-cover mix-blend-multiply"
              />
            </div>

            <div className="absolute -left-3 top-[12%] w-[200px] animate-float-y rounded-2xl border bg-card p-3 shadow-lift sm:-left-10">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-teach">Teaches</p>
              <p className="mt-0.5 text-sm font-semibold">React &amp; Next.js</p>
              <div className="mt-2.5 flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={user("u1").avatar} alt="" className="size-6 rounded-full object-cover" />
                <span className="text-xs text-muted-foreground">Ahmed · Dubai</span>
              </div>
            </div>

            <div className="absolute -right-3 bottom-[16%] w-[200px] animate-float-y rounded-2xl border bg-card p-3 shadow-lift [animation-delay:-3s] sm:-right-8">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-learn">Teaches</p>
              <p className="mt-0.5 text-sm font-semibold">Conversational Spanish</p>
              <div className="mt-2.5 flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={user("u2").avatar} alt="" className="size-6 rounded-full object-cover" />
                <span className="text-xs text-muted-foreground">Maria · Madrid</span>
              </div>
            </div>

            <div className="absolute bottom-[-18px] left-1/2 flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-foreground py-2 pl-2 pr-4 text-background shadow-lift">
              <span className="grid size-7 place-items-center rounded-full bg-gradient-to-br from-teach to-learn">
                <ArrowLeftRight className="size-3.5" />
              </span>
              <span className="text-sm font-medium">96% mutual match</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Live swaps marquee ---------- */}
      <section aria-label="Recent swaps" className="border-y bg-card py-4">
        <div className="mask-fade-x overflow-hidden">
          <div className="flex w-max animate-marquee gap-3 hover:[animation-play-state:paused]">
            {[...PAIRS, ...PAIRS].map(([a, b], i) => (
              <span key={i} className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm">
                <span className="text-teach-ink">{a}</span>
                <ArrowLeftRight className="size-3.5 text-muted-foreground" />
                <span className="text-learn-ink">{b}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section id="how-it-works" className="container scroll-mt-20 py-20 md:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-sm font-semibold text-learn">How it works</p>
            <h2 className="mt-3 text-4xl font-semibold leading-[1.05] md:text-5xl">
              From stranger to study partner in four steps.
            </h2>
            <p className="mt-5 max-w-md text-muted-foreground">
              Every swap is two-way. You&apos;re always a teacher and a student, which keeps things fair and keeps people
              showing up.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/signup">
                Create your profile <ArrowRight />
              </Link>
            </Button>
          </div>

          <ol className="grid gap-4">
            <Step n="01" title="List your skills" text="Add what you can teach and what you want to learn. It takes about two minutes.">
              <div className="flex flex-wrap gap-1.5">
                {["Guitar", "Spanish", "Excel"].map((t) => (
                  <span key={t} className="rounded-full bg-teach-soft px-2.5 py-1 text-xs font-medium text-teach-ink">
                    Teach · {t}
                  </span>
                ))}
                {["Figma", "Python"].map((t) => (
                  <span key={t} className="rounded-full bg-learn-soft px-2.5 py-1 text-xs font-medium text-learn-ink">
                    Learn · {t}
                  </span>
                ))}
              </div>
            </Step>
            <Step n="02" title="Get matched" text="We rank members whose skills complement yours, with mutual matches first.">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={user("u3").avatar} alt="" className="size-8 rounded-full object-cover" />
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full w-[88%] rounded-full bg-gradient-to-r from-teach to-learn" />
                </div>
                <span className="text-sm font-semibold">88%</span>
              </div>
            </Step>
            <Step n="03" title="Chat and agree" text="Send a swap request, then work out goals and expectations in the chat.">
              <div className="grid gap-1.5 text-[13px]">
                <span className="w-fit rounded-2xl rounded-bl-md bg-secondary px-3 py-1.5">Evenings work best for me!</span>
                <span className="ml-auto w-fit rounded-2xl rounded-br-md bg-foreground px-3 py-1.5 text-background">
                  Perfect, Tuesday at 7?
                </span>
              </div>
            </Step>
            <Step n="04" title="Meet and review" text="Book sessions online or in person, then leave a review to build trust.">
              <div className="flex items-center gap-3 rounded-xl border bg-background p-2.5">
                <div className="grid size-10 place-items-center rounded-lg bg-learn text-white">
                  <CalendarDays className="size-4" />
                </div>
                <div className="text-[13px]">
                  <p className="font-medium">Spanish × React</p>
                  <p className="text-muted-foreground">Tue · 7:00 PM · Video call</p>
                </div>
                <span className="ml-auto flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="size-3 fill-amber-400 text-amber-400" />
                  ))}
                </span>
              </div>
            </Step>
          </ol>
        </div>
      </section>

      {/* ---------- Categories ---------- */}
      <section id="categories" className="scroll-mt-20 bg-foreground py-20 text-background md:py-28">
        <div className="container">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h2 className="max-w-xl text-4xl font-semibold leading-[1.05] md:text-5xl">
              Whatever you know,{" "}
              <span className="font-serif font-normal italic text-teach-soft">someone wants to learn it.</span>
            </h2>
            <Link href="/browse" className="inline-flex items-center gap-1.5 text-sm font-medium text-background/70 hover:text-background">
              See every skill <ArrowUpRight className="size-4" />
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
            {CATEGORIES.map((c, i) => {
              const { icon: Icon, blurb } = CATEGORY_META[c];
              return (
                <Link
                  key={c}
                  href={`/browse?category=${c}`}
                  className={`group relative flex min-h-[150px] flex-col justify-between overflow-hidden rounded-2xl border border-background/10 bg-background/[0.04] p-5 transition-colors hover:bg-background/[0.09] ${
                    i === 0 ? "col-span-2 md:row-span-2 md:min-h-[316px]" : ""
                  }`}
                >
                  <Icon className={i === 0 ? "size-10 text-teach-soft" : "size-6 text-background/70"} />
                  <div>
                    <p className={i === 0 ? "font-display text-3xl font-semibold" : "font-display text-lg font-semibold"}>{c}</p>
                    <p className="mt-1 text-sm text-background/60">
                      {blurb} · {counts[c]} {counts[c] === 1 ? "skill" : "skills"}
                    </p>
                  </div>
                  <ArrowUpRight className="absolute right-5 top-5 size-5 text-background/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-background" />
                </Link>
              );
            })}
            <Link
              href="/signup"
              className="flex min-h-[150px] flex-col justify-between rounded-2xl bg-gradient-to-br from-teach to-learn p-5 transition-opacity hover:opacity-90"
            >
              <LogoMark className="size-8 brightness-[10]" />
              <p className="font-display text-lg font-semibold leading-tight">Don&apos;t see yours? Add it.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Featured skills ---------- */}
      <section className="container py-20 md:py-28">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold text-teach">Fresh on SkillSwap</p>
            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">Skills people are offering now</h2>
          </div>
          <Button asChild variant="outline" className="hidden sm:inline-flex">
            <Link href="/browse">
              Browse all <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((s) => (
            <SkillCard key={s.id} skill={s} />
          ))}
        </div>
      </section>

      {/* ---------- Principles + testimonial ---------- */}
      <section className="border-y bg-card">
        <div className="container grid gap-14 py-20 md:py-24 lg:grid-cols-2 lg:gap-20">
          <figure>
            <blockquote className="font-serif text-3xl leading-[1.2] md:text-[42px]">
              &ldquo;I taught Ahmed Spanish on Tuesdays and he taught me React on Thursdays. Three months later
              I&apos;d shipped my first app, and he&apos;d ordered tapas in Madrid.&rdquo;
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={user("u2").avatar} alt="" className="size-11 rounded-full object-cover" />
              <div>
                <p className="font-medium">Maria Garcia</p>
                <p className="text-sm text-muted-foreground">Swapped Spanish for React</p>
              </div>
            </figcaption>
          </figure>

          <div className="grid content-center gap-8">
            {[
              { icon: Clock, title: "An hour for an hour", text: "No money, no points to buy. Time is the only currency, and everyone's is worth the same." },
              { icon: ShieldCheck, title: "Trust built in", text: "Public reviews after every session, and profiles that show what people have actually taught." },
              { icon: MessageCircle, title: "Everything in one place", text: "Requests, chat and scheduling all live together, so nothing gets lost in your DMs." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full border">
                  <Icon className="size-[18px]" />
                </span>
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="container py-20 md:py-28">
        <div className="relative overflow-hidden rounded-[2rem] bg-learn-soft px-6 py-16 text-center md:px-16 md:py-20">
          <LogoMark className="pointer-events-none absolute -left-10 -top-10 size-48 opacity-[0.08]" />
          <LogoMark className="pointer-events-none absolute -bottom-12 -right-8 size-56 rotate-180 opacity-[0.08]" />
          <h2 className="relative mx-auto max-w-2xl text-4xl font-semibold leading-[1.05] md:text-[56px]">
            You already know something worth teaching.
          </h2>
          <p className="relative mx-auto mt-5 max-w-md text-muted-foreground">
            Join free, list one skill, and get your first match suggestions in minutes.
          </p>
          <div className="relative mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/signup">
                Start swapping <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/browse">Browse skills first</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

function Step({ n, title, text, children }: { n: string; title: string; text: string; children: React.ReactNode }) {
  return (
    <li className="grid grid-cols-1 gap-5 rounded-2xl border bg-card p-6 shadow-soft sm:grid-cols-[auto_1fr] sm:gap-6">
      <span className="font-display text-4xl font-semibold leading-none text-foreground/15">{n}</span>
      <div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-1.5 text-muted-foreground">{text}</p>
        <div className="mt-5">{children}</div>
      </div>
    </li>
  );
}
