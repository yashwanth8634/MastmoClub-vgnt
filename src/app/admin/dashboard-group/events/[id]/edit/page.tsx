import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import EditEventForm from "@/components/admin/EditEventForm";
import { notFound } from "next/navigation";

// ✅ FIX: Type definition update
export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  // ✅ FIX: Await params
  const resolvedParams = await params;
  const id = resolvedParams.id;

  await dbConnect();
  
  const event = await Event.findById(id).lean();

  if (!event) {
    return notFound();
  }

  const serializedEvent = {
    ...event,
    _id: event._id.toString(),
  };

  return <EditEventForm event={serializedEvent} id={id} />;
}