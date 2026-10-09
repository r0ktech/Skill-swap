"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Inbox, Send, Sparkles, Archive, Handshake } from "lucide-react";
import { useConversations, useMatches } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { SuggestionCard, SwapRow } from "@/components/swap/MatchCards";

const TABS = ["suggested", "incoming", "sent", "active", "past"] as const;
type Tab = (typeof TABS)[number];

function MatchesView() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const tab = (TABS.includes(params.get("tab") as Tab) ? params.get("tab") : "suggested") as Tab;

  const matches = useMatches();
  const conversations = useConversations();
  const incoming = conversations.filter((c) => c.direction === "incoming" && c.swap.status === "pending");
  const sent = conversations.filter((c) => c.direction === "outgoing" && c.swap.status === "pending");
  const active = conversations.filter((c) => c.swap.status === "accepted");
  const past = conversations.filter((c) => c.swap.status === "declined" || c.swap.status === "completed");

  const Count = ({ n }: { n: number }) =>
    n ? <span className="rounded-full bg-foreground/10 px-1.5 text-[11px] leading-[18px]">{n}</span> : null;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader title="Matches" description="People whose skills complement yours, and the swaps you've started." />

      <Tabs value={tab} onValueChange={(v) => router.replace(`${pathname}?tab=${v}`, { scroll: false })}>
        <TabsList>
          <TabsTrigger value="suggested">
            Suggested <Count n={matches.length} />
          </TabsTrigger>
          <TabsTrigger value="incoming">
            Requests <Count n={incoming.length} />
          </TabsTrigger>
          <TabsTrigger value="sent">
            Sent <Count n={sent.length} />
          </TabsTrigger>
          <TabsTrigger value="active">
            Active <Count n={active.length} />
          </TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="suggested">
          {matches.length ? (
            <>
              <p className="mb-4 text-sm text-muted-foreground">
                Ranked by how well you fit each other. <span className="font-medium text-learn-ink">Mutual matches</span> teach
                something you want <em>and</em> want something you teach.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {matches.map((m) => (
                  <SuggestionCard key={m.user.id} match={m} />
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              icon={Sparkles}
              title="No suggestions yet"
              description="Add a few skills to your learning list and we'll find people who teach them."
              action={
                <Button asChild>
                  <Link href="/dashboard/wanted-skills">Update learning list</Link>
                </Button>
              }
            />
          )}
        </TabsContent>

        <List value="incoming" items={incoming} icon={Inbox} empty="No new requests" hint="When someone wants to learn from you, it shows up here." />
        <List value="sent" items={sent} icon={Send} empty="No pending requests" hint="Requests you send are listed here until they're answered." />
        <List value="active" items={active} icon={Handshake} empty="No active swaps" hint="Accepted swaps live here. Chat and schedule sessions from each one." />
        <List value="past" items={past} icon={Archive} empty="Nothing here yet" hint="Declined and finished swaps are archived here." />
      </Tabs>
    </div>
  );
}

function List({
  value,
  items,
  icon,
  empty,
  hint,
}: {
  value: Tab;
  items: ReturnType<typeof useConversations>;
  icon: React.ComponentProps<typeof EmptyState>["icon"];
  empty: string;
  hint: string;
}) {
  return (
    <TabsContent value={value}>
      {items.length ? (
        <div className="grid gap-3">
          {items.map((c) => (
            <SwapRow key={c.swap.id} conversation={c} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={icon}
          title={empty}
          description={hint}
          action={
            <Button asChild variant="outline">
              <Link href="/browse">Browse skills</Link>
            </Button>
          }
        />
      )}
    </TabsContent>
  );
}

export default function MatchesPage() {
  return (
    <Suspense>
      <MatchesView />
    </Suspense>
  );
}
