import { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sprite-sheet-generator.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    {
      url: `${baseUrl}/`,
      lastModified,
    },
    {
      url: `${baseUrl}/create-favicon`,
      lastModified,
    },
    {
      url: `${baseUrl}/how-to-use-sprite-sheets`,
      lastModified,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified,
    },
  ]
}
