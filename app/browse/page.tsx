"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import SkillCard from "@/components/cards/SkillCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function BrowsePage() {
  const { skills } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const categories = ["All", "Development", "Language", "Design", "Marketing"];

  const filteredSkills = skills.filter((skill) =>
    skill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    skill.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 space-y-12">
      <div className="space-y-8 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-800">Explore Skills</h1>
        <p className="text-lg text-slate-600">Find the perfect skill to learn and swap with someone who needs what you offer.</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Input 
            type="search" 
            placeholder="Search skills, topics, or categories..." 
            className="flex-1 rounded-full px-6 shadow-sm border-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button size="lg" className="rounded-full px-8 shadow-sm">Search</Button>
        </div>
      </div>

      <div className="flex overflow-x-auto pb-4 gap-2 whitespace-nowrap scrollbar-hide">
        {categories.map(cat => (
          <Button 
            key={cat} 
            variant={cat === "All" ? "default" : "outline"}
            className="rounded-full shadow-sm border-slate-200"
          >
            {cat}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredSkills.map(skill => (
          <SkillCard key={skill.id} {...skill} />
        ))}
        {filteredSkills.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            No skills found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
