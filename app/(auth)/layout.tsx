import Image from "next/image";
import { Logo } from "@/components/common/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col px-5 py-6 sm:px-10">
        <Logo />
        <div className="flex flex-1 items-center justify-center py-12">{children}</div>
      </div>
      <aside className="relative hidden overflow-hidden bg-foreground p-12 text-background lg:flex lg:flex-col lg:justify-between">
        <div className="relative z-10 max-w-md">
          <p className="font-serif text-4xl leading-tight">
            &ldquo;The best way to learn something is to teach something.&rdquo;
          </p>
          <p className="mt-4 text-sm text-background/60">The SkillSwap community, 2026</p>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-[2rem] bg-background">
          <Image src="/hero.png" alt="" fill sizes="448px" className="object-cover" />
        </div>
        <div className="relative z-10 grid grid-cols-3 gap-6 text-sm">
          {[
            ["12k+", "members"],
            ["340", "skills"],
            ["4.9", "avg. rating"],
          ].map(([v, l]) => (
            <div key={l}>
              <p className="font-display text-3xl font-semibold">{v}</p>
              <p className="text-background/60">{l}</p>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
