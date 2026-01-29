import { MetadataRoute } from 'next';
import dbConnect from '@/lib/db';
import Event from '@/models/Event';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use your actual domain
  const baseUrl = 'https://www.mastmovgnt.in';

  // Fetch all events for dynamic routes
  let events: any[] = [];
  try {
    await dbConnect();
    events = await Event.find({ isLive: true }).select('_id updatedAt').lean();
  } catch (error) {
    console.error('Error fetching events for sitemap:', error);
  }

  // Static routes
  const staticRoutes = [
    {
      url: baseUrl, // Home page
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const, // Events change often
      priority: 0.9,
    },
    {
      url: `${baseUrl}/team`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/join`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ];

  // Dynamic event routes
  const eventRoutes = events.map((event) => ({
    url: `${baseUrl}/events/${event._id}`,
    lastModified: new Date(event.updatedAt || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...eventRoutes];
}