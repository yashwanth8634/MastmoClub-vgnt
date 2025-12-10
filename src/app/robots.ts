import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // Use your actual domain from the screenshot
  const baseUrl = 'https://www.mastmovgnt.in'; 

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // ❌ Tell Google NOT to look at Admin or API pages
      disallow: ['/admin/', '/api/', '/(protected)/'], 
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}