"use client";

import { useStore } from "@/lib/store";
import SkillCard from "@/components/cards/SkillCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  const { user, skills, matches } = useStore();
  const mySkills = skills.filter(s => s.user.name === user?.name);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-2">Welcome back, {user?.name.split(" ")[0]}! Here&apos;s your skill exchange overview.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Pending Matches Component */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Matches</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {matches.map(match => (
              <div key={match.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex gap-4 items-center">
                  <Avatar>
                    <AvatarImage src={match.matchedUser.avatar} />
                    <AvatarFallback>{match.matchedUser.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{match.matchedUser.name} wants your <span className="text-primary">{match.yourSkill}</span></p>
                    <p className="text-xs text-slate-500">In exchange for: {match.theirSkill}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">{match.status}</Badge>
                  <Button size="sm" asChild>
                    <Link href="/chat">Message</Link>
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* My Offered Skills */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">My Offered Skills</h2>
            <Button variant="ghost" size="sm" className="text-primary">Add New</Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {mySkills.map(skill => (
              <SkillCard key={skill.id} {...skill} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
