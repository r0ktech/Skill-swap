"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SkillCardProps {
  title: string;
  description: string;
  category: string;
  level: string;
  user: {
    name: string;
    avatar?: string;
  };
  id?: string;
  isOwnSkill?: boolean;
  onEdit?: (skill: { id: string; title: string; description: string; category: string; level: string }) => void;
  onDelete?: (skillId: string) => void;
}

export default function SkillCard({ title, description, category, level, user, id, isOwnSkill, onEdit, onDelete }: SkillCardProps) {
  const { requestSkillSwap, user: currentUser } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRequestSwap = () => {
    if (!currentUser || currentUser.name === user.name) {
      alert("You cannot request a swap with yourself!");
      return;
    }

    setIsLoading(true);
    // Simulate async operation
    setTimeout(() => {
      requestSkillSwap(title, user.name, user.avatar);
      setIsLoading(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 300);
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">{category}</Badge>
          <span className="text-xs font-medium text-slate-500">{level}</span>
        </div>
        <h3 className="font-semibold text-lg mt-2">{title}</h3>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-slate-600 line-clamp-2 mt-1">{description}</p>
        <div className="flex items-center gap-2 mt-4">
          <Avatar className="w-6 h-6">
            {user.avatar && <AvatarImage src={user.avatar} />}
            <AvatarFallback className="text-[10px] bg-slate-100 text-slate-600">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium text-slate-700">{user.name}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {isOwnSkill ? (
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              className="flex-1 rounded-full"
              onClick={() => onEdit?.({ id: id!, title, description, category, level })}
            >
              Edit
            </Button>
            <Button
              variant="outline"
              className="flex-1 rounded-full text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => onDelete?.(id!)}
            >
              Delete
            </Button>
          </div>
        ) : (
          <Button 
            className="w-full rounded-full" 
            variant={showSuccess ? "default" : "outline"}
            onClick={handleRequestSwap}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : showSuccess ? "✓ Request Sent!" : "Request Swap"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
