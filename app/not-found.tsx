import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/common/Logo";

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center px-6 text-center">
      <div>
        <LogoMark className="mx-auto size-12" />
        <h1 className="mt-6 text-4xl font-semibold">This page swapped itself out.</h1>
        <p className="mt-3 text-muted-foreground">We couldn&apos;t find what you were looking for.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild>
            <Link href="/">Go home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/browse">Browse skills</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
