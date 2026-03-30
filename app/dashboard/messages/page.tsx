"use client";

import { useState, useRef, useEffect } from "react";
import { useStore } from "@/lib/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ChatPage() {
  const { messages, user, matches, sendMessage } = useStore();
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim() || !user) return;
    sendMessage(inputText.trim(), user.id);
    setInputText("");
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-neutral-50 overflow-hidden">
      {/* Sidebar with Conversations */}
      <aside className="w-80 border-r bg-white h-full hidden md:flex flex-col flex-shrink-0">
        <div className="p-4 border-b">
          <Input type="search" placeholder="Search messages..." className="rounded-full bg-slate-50" />
        </div>
        <div className="overflow-y-auto flex-1 p-2 space-y-1">
          {matches.map(match => (
            <div key={match.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 cursor-pointer transition-colors bg-slate-50/50">
              <Avatar>
                <AvatarImage src={match.matchedUser.avatar} />
                <AvatarFallback>{match.matchedUser.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-sm truncate">{match.matchedUser.name}</h4>
                  <span className="text-xs text-slate-400">10:05 AM</span>
                </div>
                <p className="text-xs text-slate-500 truncate">Hey Maria! That sounds perfect...</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Chat Window */}
      <main className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <header className="h-16 border-b flex items-center px-6 gap-4 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
          <Avatar>
            <AvatarImage src={matches[0].matchedUser.avatar} />
            <AvatarFallback>{matches[0].matchedUser.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{matches[0].matchedUser.name}</h3>
            <p className="text-xs text-primary">Exchange {matches[0].theirSkill} for {matches[0].yourSkill}</p>
          </div>
        </header>

        {/* Message Bubbles */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
          {messages.map((msg) => {
            const isMe = msg.senderId === user?.id;
            return (
              <div key={msg.id} className={`flex max-w-lg ${isMe ? "ml-auto" : "mr-auto"}`}>
                <div className={`p-4 rounded-2xl shadow-sm ${
                  isMe ? "bg-primary text-white rounded-br-sm" : "bg-white text-slate-900 border border-slate-100 rounded-bl-sm"
                }`}>
                  <p className="text-sm">{msg.text}</p>
                  <span className={`text-[10px] block mt-1 ${isMe ? "text-primary-foreground/70" : "text-slate-400"}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-white">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-2 items-center bg-slate-50 p-2 rounded-full border border-slate-100"
          >
            <Input 
              type="text" 
              placeholder="Type your message..." 
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 shadow-none px-4"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <Button type="submit" size="icon" className="rounded-full shadow-md shrink-0 disabled:opacity-50" disabled={!inputText.trim()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
