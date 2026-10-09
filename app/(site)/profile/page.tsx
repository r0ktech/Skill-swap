"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useHydrated, useMe } from "@/lib/hooks";

/** Legacy route: send people to their public profile (or to log in). */
export default function ProfileRedirect() {
  const router = useRouter();
  const hydrated = useHydrated();
  const me = useMe();
  useEffect(() => {
    if (hydrated) router.replace(me ? `/u/${me.id}` : "/login");
  }, [hydrated, me, router]);
  return null;
}
