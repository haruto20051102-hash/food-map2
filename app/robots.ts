import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hidden-gems.example.com';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/spots/manage', '/favorites', '/settings'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
