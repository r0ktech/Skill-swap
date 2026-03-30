"use client";

import { useStore } from "@/lib/store";
import SkillCard from "@/components/cards/SkillCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { user, skills } = useStore();
  const mySkills = skills.filter(s => s.user.name === user?.name);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 space-y-12">
      {/* Bio Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 bg-white p-8 rounded-3xl shadow-sm border border-neutral-100">
        <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
          <AvatarImage src={user?.avatar} />
          <AvatarFallback className="text-4xl bg-primary text-white">{user?.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{user?.name}</h1>
            <p className="text-slate-500 font-medium">{user?.location}</p>
          </div>
          <p className="text-slate-700 max-w-xl">{user?.bio}</p>
          <div className="pt-4">
            <Button variant="outline" className="rounded-full px-8">Edit Profile</Button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Offered Skills */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Skills I Offer</h2>
          </div>
          <div className="grid gap-6">
            {mySkills.length > 0 ? (
              mySkills.map(skill => <SkillCard key={skill.id} {...skill} />)
            ) : (
              <p className="text-slate-500">You haven&apos;t offered any skills yet.</p>
            )}
          </div>
        </section>

        {/* Desired Skills */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Skills I Want</h2>
          </div>
          <div className="grid gap-6">
             <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 border-dashed text-center">
                <p className="text-slate-500">You haven&apos;t added any desired skills.</p>
                <Button variant="link" className="text-primary mt-2">Explore Skills</Button>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
}
