"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Search } from "lucide-react";

const POPULAR = ["Spanish", "Figma", "Guitar", "Python", "Photography"];

export function HeroSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const go = (term: string) => router.push(term ? `/browse?q=${encodeURIComponent(term)}` : "/browse");

  return (
    <div className="w-full max-w-xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          go(q.trim());
        }}
        className="flex items-center gap-2 rounded-full border bg-card p-1.5 pl-5 shadow-lift transition-colors focus-within:border-learn"
      >
        <Search className="size-5 shrink-0 text-muted-foreground" />
        <label htmlFor="hero-q" className="sr-only">
          What do you want to learn?
        </label>
        <input
          id="hero-q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="What do you want to learn?"
          className="h-11 min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-foreground/85"
        >
          <span className="hidden sm:inline">Find a teacher</span>
          <ArrowRight className="size-4" />
        </button>
      </form>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-muted-foreground">Popular:</span>
        {POPULAR.map((p) => (
          <button
            key={p}
            onClick={() => go(p)}
            className="rounded-full border border-transparent bg-secondary px-3 py-1 text-[13px] transition-colors hover:border-foreground/20 hover:bg-card"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
