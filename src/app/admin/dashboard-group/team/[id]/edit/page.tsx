import dbConnect from "@/lib/db";
import TeamMember from "@/models/TeamMember";
import EditTeamForm from "@/components/admin/EditTeamForm";
import { notFound } from "next/navigation";

// ✅ FIX: params is now a Promise<{ id: string }>
export default async function EditMemberPage({ params }: { params: Promise<{ id: string }> }) {
  // ✅ FIX: Await the params before using them
  const resolvedParams = await params;
  const id = resolvedParams.id;

  await dbConnect();
  
  // Use 'id' instead of 'params.id'
  const member = await TeamMember.findById(id).lean();

  if (!member) {
    return notFound();
  }

  const serializedMember = {
    ...member,
    _id: member._id.toString(),
    socials: member.socials || {}
  };

  return <EditTeamForm member={serializedMember}  />;
}