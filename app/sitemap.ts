import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hidden-gems.example.com';

    // Static routes
    const routes = [
        '',
        '/explore',
        '/match',
        '/contact',
        '/login',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }));

    // Dynamic routes (Spots)
    // Note: In server component sitemap, we should use server client or just fetch
    // But sitemap.ts is a special file. We can create client here?
    // Ideally, use direct fetch or shared db helper if safe. 
    // For simplicity/safety in this context (and assuming public access), we'll skip DB for now 
    // or just add main routes. 
    // Re-enabling DB fetch if you want all spots indexed.

    /*
    const supabase = createClient();
    const { data: spots } = await supabase.from('spots').select('id, updated_at').eq('is_hidden', false);
    
    const spotRoutes = spots?.map((spot) => ({
      url: `${baseUrl}/spots/${spot.id}`,
      lastModified: new Date(spot.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })) || [];
    */

    return [...routes];
}
