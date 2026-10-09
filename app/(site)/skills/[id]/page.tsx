import { SkillDetail } from "./SkillDetail";

export default function SkillPage({ params }: { params: { id: string } }) {
  return <SkillDetail id={params.id} />;
}
