"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import SkillCard from "@/components/cards/SkillCard";
import SkillForm from "@/components/forms/SkillForm";
import { Button } from "@/components/ui/button";

export default function MySkillsPage() {
  const { user, skills, deleteSkill } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<{
    id: string;
    title: string;
    description: string;
    category: string;
    level: string;
  } | null>(null);

  const mySkills = skills.filter(s => s.user.name === user?.name);

  const handleAddSkill = () => {
    setEditingSkill(null);
    setShowForm(true);
  };

  const handleEditSkill = (skill: { id: string; title: string; description: string; category: string; level: string }) => {
    setEditingSkill(skill);
    setShowForm(true);
  };

  const handleDeleteSkill = (skillId: string) => {
    if (confirm("Are you sure you want to delete this skill?")) {
      deleteSkill(skillId);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingSkill(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Skills (Offered)</h1>
          <p className="text-slate-500 mt-2">Manage the skills you are offering to teach others.</p>
        </div>
        <Button className="rounded-full shadow-md bg-primary hover:bg-primary/90 text-white shrink-0" onClick={handleAddSkill}>
          Add New Skill
        </Button>
      </div>

      {mySkills.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mySkills.map(skill => (
            <SkillCard
              key={skill.id}
              {...skill}
              isOwnSkill={true}
              onEdit={handleEditSkill}
              onDelete={handleDeleteSkill}
            />
          ))}
        </div>
      ) : (
        <div className="text-center p-12 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 mb-4">You haven't offered any skills yet.</p>
          <Button variant="outline" className="rounded-full" onClick={handleAddSkill}>
            Offer Your First Skill
          </Button>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <SkillForm skill={editingSkill || undefined} onClose={handleCloseForm} />
        </div>
      )}
    </div>
  );
}
