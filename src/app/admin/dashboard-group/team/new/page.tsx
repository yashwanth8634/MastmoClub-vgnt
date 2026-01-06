import { Metadata } from "next";
import NewTeamMemberForm from "@/components/admin/NewTeamMemberForm";

export const metadata: Metadata = {
  title: "Add Team Member ",
  description: "Add a new member to the core team or faculty board.",
};

export default function NewMemberPage() {
  return <NewTeamMemberForm />;
}