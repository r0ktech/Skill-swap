"use client";

import { useStore } from "@/lib/store";
import SkillCard from "@/components/cards/SkillCard";
import { Button } from "@/components/ui/button";

export default function WantedSkillsPage() {
  const { user, skills } = useStore();
  // Simulate wanted skills by grabbing skills not owned by the user
  const wantedSkills = skills.filter(s => s.user.name !== user?.name);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Skills I Want</h1>
          <p className="text-slate-500 mt-2">Skills you are currently looking to learn from others.</p>
        </div>
        <Button variant="outline" className="rounded-full shadow-sm text-primary border-primary shrink-0">Browse Network</Button>
      </div>

      {wantedSkills.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wantedSkills.map(skill => (
            <SkillCard key={skill.id} {...skill} />
          ))}
        </div>
      ) : (
        <div className="text-center p-12 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 mb-4">You haven't saved any skills you want to learn yet.</p>
          <Button variant="outline" className="rounded-full">Explore Skills</Button>
        </div>
      )}
    </div>
  );
}
