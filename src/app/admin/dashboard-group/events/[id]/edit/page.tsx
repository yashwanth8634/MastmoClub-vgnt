import EventForm from "@/components/admin/Events/EventForm";
import { getEventById } from "@/actions/EventActions"; 

// 1. Change type to Promise
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: PageProps) {
  // 2. Await the params to get the ID
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const eventData = await getEventById(id);

  if (!eventData) {
    return (
      <div className="p-10 text-center text-red-500">
        <h2 className="text-xl font-bold">Event Not Found</h2>
        {/* Now we use the 'id' variable we extracted safely */}
        <p>Could not find event with ID: {id}</p> 
      </div>
    );
  }

  return <EventForm initialData={eventData} />;
}