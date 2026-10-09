import { PublicProfile } from "@/components/profile/PublicProfile";

export default function UserPage({ params }: { params: { id: string } }) {
  return <PublicProfile id={params.id} />;
}
