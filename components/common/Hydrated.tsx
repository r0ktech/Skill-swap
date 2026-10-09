"use client";

import { useHydrated } from "@/lib/hooks";

/**
 * Renders children only after the persisted store has loaded from localStorage,
 * so server HTML and the first client render never disagree.
 */
export function Hydrated({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const hydrated = useHydrated();
  return <>{hydrated ? children : fallback}</>;
}
