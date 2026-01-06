import EventForm from "@/components/admin/Events/EventForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Event ",
  description: "Create a new event for the club.",
};

export default function CreatePage() {
  return <EventForm initialData={null} />;
}