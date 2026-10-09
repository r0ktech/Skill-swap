"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Fragment, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowLeftRight, CalendarPlus, Check, Clock, MessageCircle, Search, SendHorizontal, X } from "lucide-react";
import { type Conversation, useConversations, useMe } from "@/lib/hooks";
import { toast, useStore } from "@/lib/store";
import { cn, firstName, formatChatTime, formatDayLabel, formatTime, isSameDay } from "@/lib/utils";
import { UserAvatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { ScheduleSessionDialog } from "@/components/swap/ScheduleSessionDialog";

function MessagesView() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const conversations = useConversations();
  const [filter, setFilter] = useState("");

  const selectedId = params.get("c");
  const selected = conversations.find((c) => c.swap.id === selectedId);

  // On desktop, open the most recent conversation by default.
  useEffect(() => {
    if (!selectedId && conversations[0] && window.matchMedia("(min-width: 768px)").matches) {
      router.replace(`${pathname}?c=${conversations[0].swap.id}`, { scroll: false });
    }
  }, [selectedId, conversations, pathname, router]);

  const visible = conversations.filter((c) => c.other.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="flex h-[calc(100dvh-8rem)] md:h-[calc(100dvh-4rem)]">
      {/* Conversation list */}
      <aside className={cn("w-full shrink-0 flex-col border-r bg-card md:flex md:w-80 lg:w-96", selected ? "hidden" : "flex")}>
        <div className="space-y-3 border-b p-4">
          <h1 className="text-xl font-semibold">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search conversations"
              aria-label="Search conversations"
              className="h-10 w-full rounded-full bg-secondary pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-learn/20"
            />
          </div>
        </div>
        <ul className="flex-1 overflow-y-auto p-2">
          {visible.length === 0 && <li className="px-4 py-10 text-center text-sm text-muted-foreground">No conversations found.</li>}
          {visible.map((c) => {
            const active = c.swap.id === selectedId;
            return (
              <li key={c.swap.id}>
                <Link
                  href={`${pathname}?c=${c.swap.id}`}
                  scroll={false}
                  className={cn("flex items-center gap-3 rounded-xl p-3 transition-colors", active ? "bg-secondary" : "hover:bg-secondary/60")}
                >
                  <UserAvatar user={c.other} className="size-11" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className={cn("truncate text-sm", c.unread ? "font-semibold" : "font-medium")}>{c.other.name}</p>
                      <span className="shrink-0 text-[11px] text-muted-foreground">
                        {formatChatTime(c.lastMessage?.createdAt ?? c.swap.updatedAt)}
                      </span>
                    </div>
                    <p className={cn("truncate text-[13px]", c.unread ? "text-foreground" : "text-muted-foreground")}>
                      {c.lastMessage ? c.lastMessage.text : "No messages yet"}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5">
                      {c.swap.status === "pending" && (
                        <Badge variant="warning" className="py-0 text-[10px]">
                          {c.direction === "incoming" ? "Request" : "Pending"}
                        </Badge>
                      )}
                      {c.swap.status === "declined" && (
                        <Badge variant="secondary" className="py-0 text-[10px]">
                          Declined
                        </Badge>
                      )}
                      <span className="truncate text-[11px] text-muted-foreground">{c.requestedSkill?.title}</span>
                    </div>
                  </div>
                  {c.unread > 0 && (
                    <span className="grid min-w-[20px] place-items-center rounded-full bg-learn px-1 text-[11px] font-semibold leading-5 text-white">
                      {c.unread}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Thread */}
      <section className={cn("min-w-0 flex-1 flex-col", selected ? "flex" : "hidden md:flex")}>
        {selected ? (
          <Thread key={selected.swap.id} conversation={selected} onBack={() => router.push(pathname, { scroll: false })} />
        ) : (
          <div className="grid flex-1 place-items-center p-6">
            <EmptyState
              icon={MessageCircle}
              title={conversations.length ? "Pick a conversation" : "No conversations yet"}
              description={conversations.length ? "Choose someone on the left to continue." : "Request a swap to start chatting."}
              action={
                !conversations.length && (
                  <Button asChild>
                    <Link href="/browse">Browse skills</Link>
                  </Button>
                )
              }
              className="border-none bg-transparent"
            />
          </div>
        )}
      </section>
    </div>
  );
}

function Thread({ conversation, onBack }: { conversation: Conversation; onBack: () => void }) {
  const me = useMe()!;
  const { swap, other, requestedSkill, offeredSkill, direction } = conversation;
  const allMessages = useStore((s) => s.messages);
  const sendMessage = useStore((s) => s.sendMessage);
  const markRead = useStore((s) => s.markConversationRead);
  const respond = useStore((s) => s.respondToSwap);

  const messages = useMemo(() => allMessages.filter((m) => m.swapId === swap.id), [allMessages, swap.id]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const last = messages[messages.length - 1];

  useEffect(() => {
    markRead(swap.id);
    if (last?.senderId === other.id) setTyping(false);
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, swap.id, markRead, last?.senderId, other.id]);

  useEffect(() => {
    if (!typing) return;
    const t = setTimeout(() => setTyping(false), 6000);
    return () => clearTimeout(t);
  }, [typing]);

  // Auto-grow the composer.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, [text]);

  const canChat = swap.status === "pending" || swap.status === "accepted";
  const iLearn = direction === "outgoing" ? requestedSkill : offeredSkill;
  const iTeach = direction === "outgoing" ? offeredSkill : requestedSkill;

  const send = () => {
    if (!text.trim()) return;
    sendMessage(swap.id, text);
    setText("");
    setTimeout(() => setTyping(true), 600);
  };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-3 border-b bg-card px-3 md:px-6">
        <Button variant="ghost" size="icon-sm" className="md:hidden" onClick={onBack} aria-label="Back to conversations">
          <ArrowLeft />
        </Button>
        <Link href={`/u/${other.id}`} className="flex min-w-0 flex-1 items-center gap-3">
          <UserAvatar user={other} className="size-10" />
          <div className="min-w-0">
            <p className="truncate font-semibold leading-tight">{other.name}</p>
            <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
              <span className="truncate text-learn-ink">{iLearn?.title ?? "—"}</span>
              <ArrowLeftRight className="size-3 shrink-0" />
              <span className="truncate text-teach-ink">{iTeach?.title ?? "To be agreed"}</span>
            </p>
          </div>
        </Link>
        {swap.status === "accepted" && (
          <Button size="sm" onClick={() => setScheduleOpen(true)}>
            <CalendarPlus /> <span className="hidden sm:inline">Schedule</span>
          </Button>
        )}
      </header>

      {swap.status === "pending" && direction === "incoming" && (
        <div className="flex flex-col gap-3 border-b bg-warning-soft/60 px-4 py-3 sm:flex-row sm:items-center md:px-6">
          <p className="flex-1 text-sm">
            <span className="font-semibold">{firstName(other.name)}</span> wants to swap. Accept to start scheduling sessions.
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                respond(swap.id, false);
                toast({ title: "Request declined" });
              }}
            >
              <X /> Decline
            </Button>
            <Button
              size="sm"
              onClick={() => {
                respond(swap.id, true);
                toast({ title: "Swap accepted!", tone: "success" });
              }}
            >
              <Check /> Accept
            </Button>
          </div>
        </div>
      )}
      {swap.status === "pending" && direction === "outgoing" && (
        <div className="flex items-center gap-2 border-b bg-secondary/60 px-4 py-2.5 text-sm text-muted-foreground md:px-6">
          <Clock className="size-4" /> Waiting for {firstName(other.name)} to accept your request.
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto bg-background px-4 py-6 md:px-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-1.5">
          {messages.map((m, i) => {
            const prev = messages[i - 1];
            const newDay = !prev || !isSameDay(new Date(prev.createdAt), new Date(m.createdAt));
            const mine = m.senderId === me.id;
            const grouped = prev && !newDay && prev.senderId === m.senderId;
            return (
              <Fragment key={m.id}>
                {newDay && (
                  <div className="my-4 text-center text-xs font-medium text-muted-foreground">{formatDayLabel(m.createdAt)}</div>
                )}
                {m.senderId === "system" ? (
                  <div className="my-2 flex justify-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground">
                      <CalendarPlus className="size-3.5" /> {m.text}
                    </span>
                  </div>
                ) : (
                  <div className={cn("flex items-end gap-2", mine ? "justify-end" : "justify-start", !grouped && "mt-2")}>
                    {!mine && (grouped ? <span className="w-7 shrink-0" /> : <UserAvatar user={other} className="size-7" />)}
                    <div
                      className={cn(
                        "max-w-[78%] rounded-2xl px-3.5 py-2 text-[15px] leading-relaxed sm:max-w-[65%]",
                        mine ? "rounded-br-md bg-foreground text-background" : "rounded-bl-md border bg-card"
                      )}
                    >
                      <p className="whitespace-pre-wrap break-words">{m.text}</p>
                      <p className={cn("mt-0.5 text-right text-[10px]", mine ? "text-background/55" : "text-muted-foreground")}>
                        {formatTime(m.createdAt)}
                      </p>
                    </div>
                  </div>
                )}
              </Fragment>
            );
          })}
          {typing && (
            <div className="mt-2 flex items-end gap-2" aria-live="polite">
              <UserAvatar user={other} className="size-7" />
              <div className="flex gap-1 rounded-2xl rounded-bl-md border bg-card px-4 py-3" aria-label={`${firstName(other.name)} is typing`}>
                {[0, 150, 300].map((d) => (
                  <span key={d} className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {canChat ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="shrink-0 border-t bg-card p-3 md:px-6 md:py-4"
        >
          <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border bg-background p-1.5 pl-4 focus-within:border-learn/60">
            <textarea
              ref={inputRef}
              rows={1}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder={`Message ${firstName(other.name)}…`}
              aria-label="Message"
              className="max-h-[140px] flex-1 resize-none bg-transparent py-2 text-[15px] outline-none placeholder:text-muted-foreground"
            />
            <Button type="submit" size="icon" disabled={!text.trim()} aria-label="Send message" className="shrink-0">
              <SendHorizontal />
            </Button>
          </div>
        </form>
      ) : (
        <p className="shrink-0 border-t bg-card px-6 py-4 text-center text-sm text-muted-foreground">
          This swap is {swap.status}. Messaging is closed.
        </p>
      )}

      <ScheduleSessionDialog conversation={conversation} open={scheduleOpen} onOpenChange={setScheduleOpen} />
    </>
  );
}

export default function MessagesPage() {
  return (
    <Suspense>
      <MessagesView />
    </Suspense>
  );
}
