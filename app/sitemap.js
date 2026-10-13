import { branches, courses, siteUrl } from "@/lib/data";

export default function sitemap() {
  const lastModified = new Date();

  return [
    { url: `${siteUrl}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/ariza`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    ...branches.flatMap((branch) =>
      courses.map((course) => ({
        url: `${siteUrl}/${branch}/${course}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.7,
      }))
    ),
  ];
}
