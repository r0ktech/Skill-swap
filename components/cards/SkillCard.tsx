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
}

export default function SkillCard({ title, description, category, level, user }: SkillCardProps) {
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
        <Button className="w-full rounded-full" variant="outline">
          Request Swap
        </Button>
      </CardFooter>
    </Card>
  );
}
