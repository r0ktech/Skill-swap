"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Bookmark, SearchX, Search, Sparkles, X } from "lucide-react";
import { useMe, useRatings, useUserLookup } from "@/lib/hooks";
import { skillWantScore } from "@/lib/matching";
import { useStore } from "@/lib/store";
import { CATEGORIES, FORMATS, LEVELS } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { Hydrated } from "@/components/common/Hydrated";
import { SkillCard } from "@/components/skills/SkillCard";

const SORTS = { relevance: "Best match", newest: "Newest", rating: "Top rated" } as const;
type SortKey = keyof typeof SORTS;

export function BrowseView() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [q, setQ] = useState(params.get("q") ?? "");
  const category = params.get("category") ?? "All";
  const level = params.get("level") ?? "Any";
  const format = params.get("format") ?? "Any";
  const sort = (params.get("sort") as SortKey) ?? "relevance";
  const saved = params.get("saved") === "1";

  const update = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === null || v === "" || v === "All" || v === "Any") next.delete(k);
      else next.set(k, v);
    }
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  // Debounce the search box into the URL.
  useEffect(() => {
    const t = setTimeout(() => {
      if ((params.get("q") ?? "") !== q.trim()) update({ q: q.trim() || null });
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const activeFilters = [category !== "All", level !== "Any", format !== "Any", saved].filter(Boolean).length;

  return (
    <div className="pb-24">
      <section className="border-b bg-card">
        <div className="container py-10 md:py-14">
          <h1 className="text-4xl font-semibold md:text-5xl">Browse skills</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Find someone who teaches what you want to learn, then offer something you know in return.
          </p>
          <div className="relative mt-7 max-w-2xl">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search skills, topics or people…"
              aria-label="Search skills"
              className="h-14 w-full rounded-full border bg-background pl-12 pr-5 text-base shadow-soft outline-none transition-colors focus:border-learn focus:ring-4 focus:ring-learn/15"
            />
          </div>
        </div>
      </section>

      <div className="sticky top-16 z-20 border-b bg-background/90 backdrop-blur-lg">
        <div className="container no-scrollbar flex gap-2 overflow-x-auto py-3">
          {["All", ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => update({ category: c })}
              aria-pressed={category === c}
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                category === c ? "border-foreground bg-foreground text-background" : "bg-card hover:border-foreground/30"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="container mt-6 flex flex-wrap items-center gap-3">
        <div className="w-[150px]">
          <Select aria-label="Level" value={level} onChange={(e) => update({ level: e.target.value })} className="h-10 rounded-full">
            <option value="Any">Any level</option>
            {LEVELS.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </Select>
        </div>
        <div className="w-[150px]">
          <Select aria-label="Format" value={format} onChange={(e) => update({ format: e.target.value })} className="h-10 rounded-full">
            <option value="Any">Any format</option>
            {FORMATS.filter((f) => f !== "Either").map((f) => (
              <option key={f}>{f}</option>
            ))}
          </Select>
        </div>
        <Hydrated>
          <SavedToggle saved={saved} onToggle={() => update({ saved: saved ? null : "1" })} />
        </Hydrated>
        {activeFilters > 0 && (
          <Button variant="ghost" size="sm" onClick={() => router.replace(q ? `${pathname}?q=${encodeURIComponent(q)}` : pathname)}>
            <X /> Clear filters
          </Button>
        )}
        <div className="ml-auto w-[150px]">
          <Select aria-label="Sort by" value={sort} onChange={(e) => update({ sort: e.target.value === "relevance" ? null : e.target.value })} className="h-10 rounded-full">
            {Object.entries(SORTS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="container mt-6">
        <Hydrated
          fallback={
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-[250px] rounded-xl" />
              ))}
            </div>
          }
        >
          <Results
            q={params.get("q") ?? ""}
            category={category}
            level={level}
            format={format}
            sort={sort}
            saved={saved}
            onReset={() => {
              setQ("");
              router.replace(pathname);
            }}
          />
        </Hydrated>
      </div>
    </div>
  );
}

function SavedToggle({ saved, onToggle }: { saved: boolean; onToggle: () => void }) {
  const me = useMe();
  const count = useStore((s) => s.savedSkillIds.length);
  if (!me) return null;
  return (
    <button
      onClick={onToggle}
      aria-pressed={saved}
      className={cn(
        "inline-flex h-10 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-colors",
        saved ? "border-learn bg-learn-soft text-learn-ink" : "bg-card hover:border-foreground/30"
      )}
    >
      <Bookmark className={cn("size-4", saved && "fill-current")} />
      Saved {count > 0 && <span className="text-muted-foreground">({count})</span>}
    </button>
  );
}

function Results({
  q,
  category,
  level,
  format,
  sort,
  saved,
  onReset,
}: {
  q: string;
  category: string;
  level: string;
  format: string;
  sort: SortKey;
  saved: boolean;
  onReset: () => void;
}) {
  const me = useMe();
  const skills = useStore((s) => s.skills);
  const wants = useStore((s) => s.wants);
  const savedIds = useStore((s) => s.savedSkillIds);
  const getUser = useUserLookup();
  const ratingFor = useRatings();

  const myWants = useMemo(() => wants.filter((w) => w.userId === me?.id), [wants, me?.id]);

  const results = useMemo(() => {
    const term = q.toLowerCase().trim();
    const list = skills
      .filter((s) => s.userId !== me?.id)
      .filter((s) => category === "All" || s.category === category)
      .filter((s) => level === "Any" || s.level === level)
      .filter((s) => format === "Any" || s.format === format || s.format === "Either")
      .filter((s) => !saved || savedIds.includes(s.id))
      .filter((s) => {
        if (!term) return true;
        const owner = getUser(s.userId);
        return [s.title, s.description, s.category, owner?.name ?? "", ...s.tags].some((f) => f.toLowerCase().includes(term));
      })
      .map((s) => ({ skill: s, fit: Math.max(0, ...myWants.map((w) => skillWantScore(s, w))) }));

    if (sort === "newest") list.sort((a, b) => b.skill.createdAt.localeCompare(a.skill.createdAt));
    else if (sort === "rating") list.sort((a, b) => ratingFor(b.skill.userId).average - ratingFor(a.skill.userId).average);
    else list.sort((a, b) => b.fit - a.fit);
    return list;
  }, [skills, me?.id, category, level, format, saved, savedIds, q, getUser, myWants, sort, ratingFor]);

  const forYou = sort === "relevance" && !q ? results.filter((r) => r.fit >= 0.7) : [];
  const rest = forYou.length ? results.filter((r) => r.fit < 0.7) : results;

  if (results.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="No skills found"
        description={q ? `Nothing matches "${q}" with these filters yet.` : "Try a different combination of filters."}
        action={
          <Button variant="outline" onClick={onReset}>
            Reset search
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-12">
      {forYou.length > 0 && (
        <section>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Sparkles className="size-4 text-learn" /> Matches your learning list
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {forYou.map(({ skill }) => (
              <SkillCard key={skill.id} skill={skill} className="ring-1 ring-learn/20" />
            ))}
          </div>
        </section>
      )}
      <section>
        <p className="text-sm text-muted-foreground">
          {forYou.length > 0 ? "More skills" : `${results.length} ${results.length === 1 ? "skill" : "skills"}`}
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {rest.map(({ skill }) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      </section>
    </div>
  );
}
