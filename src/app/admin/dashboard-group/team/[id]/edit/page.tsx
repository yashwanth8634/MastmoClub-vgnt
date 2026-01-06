import { getTeamMember } from "@/actions/teamActions";
import EditTeamForm from "@/components/admin/EditTeamForm"; // Verify path
import { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const member = await getTeamMember(resolvedParams.id);

  if (!member) {
    return { title: "Member Not Found" };
  }

  return {
    title: `Edit ${member.name} `,
  };
}

export default async function EditTeamPage({ params }: { params: Promise<{ id: string }> }) {

  const resolvedParams = await params;
  const id = resolvedParams.id;
  // 1. Fetch data using the safe server action
  const member = await getTeamMember(id);

  // 2. Pass serialized data to the Client Component
  // If member is null, the form will handle the error view
  return <EditTeamForm member={member} />;
}