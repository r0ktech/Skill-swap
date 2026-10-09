import type { Metadata } from "next";
import { Suspense } from "react";
import { BrowseView } from "./BrowseView";

export const metadata: Metadata = { title: "Browse skills" };

export default function BrowsePage() {
  return (
    <Suspense>
      <BrowseView />
    </Suspense>
  );
}
