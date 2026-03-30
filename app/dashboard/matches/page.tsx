"use client";

import { useStore } from "@/lib/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MatchesPage() {
  const { matches } = useStore();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Matches</h1>
        <p className="text-slate-500 mt-2">Review users who want to exchange skills with you.</p>
      </div>

      <div className="space-y-4">
        {matches.map(match => (
          <div key={match.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-white rounded-3xl border border-slate-100 shadow-sm gap-4 transition-all hover:shadow-md">
            <div className="flex gap-4 items-center w-full md:w-auto">
              <Avatar className="h-16 w-16 shadow-sm border border-slate-100">
                <AvatarImage src={match.matchedUser.avatar} />
                <AvatarFallback className="text-xl bg-primary/10 text-primary">{match.matchedUser.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{match.matchedUser.name}</h3>
                <div className="flex flex-col md:flex-row gap-1 md:gap-4 text-sm text-slate-500 mt-1">
                  <p>Wants: <span className="font-medium text-primary">{match.yourSkill}</span></p>
                  <p className="hidden md:block text-slate-300">•</p>
                  <p>Offers: <span className="font-medium text-slate-900">{match.theirSkill}</span></p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-0 border-slate-100 justify-start md:justify-end">
              <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100/80 mb-2 md:mb-0 mr-auto md:mr-2 w-fit">{match.status}</Badge>
              <Button size="icon" variant="outline" className="rounded-full text-green-600 border-green-200 bg-green-50 hover:bg-green-100 hover:text-green-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </Button>
              <Button size="icon" variant="outline" className="rounded-full text-red-600 border-red-200 bg-red-50 hover:bg-red-100 hover:text-red-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </Button>
              <Button asChild className="rounded-full shadow-md bg-slate-900 text-white">
                <Link href="/dashboard/messages">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path></svg>
                  Chat
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
