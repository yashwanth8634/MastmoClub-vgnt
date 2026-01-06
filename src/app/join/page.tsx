import { Metadata } from "next";
import JoinClubForm from "@/components/features/club/JoinClubForm";

export const metadata: Metadata = {
  title: "Join Us ",
  description: "Become a member of MASTMO, the most active tech club at VGNT. Open for students and faculty.",
  openGraph: {
    title: "Join MASTMO - Mathematical & Statistical Modeling Club",
    description: "Become a member of MASTMO, the most active tech club at VGNT. Open for students and faculty.",
    type: "website",
  },
};

export default function JoinClubPage() {
  return <JoinClubForm />;
}