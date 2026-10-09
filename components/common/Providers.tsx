"use client";

import { useEffect } from "react";
import { hydrateStore } from "@/lib/store";
import { Toaster } from "./Toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    hydrateStore();
  }, []);

  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
