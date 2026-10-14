import { branches, courses, siteUrl } from "@/lib/data";
import { alternatesFor, locales } from "@/lib/i18n";

const pages = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/ariza", changeFrequency: "monthly", priority: 0.8 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
  ...branches.flatMap((branch) =>
    courses.map((course) => ({ path: `/${branch}/${course}`, changeFrequency: "monthly", priority: 0.7 }))
  ),
];

export default function sitemap() {
  const lastModified = new Date();

  return pages.flatMap(({ path, changeFrequency, priority }) =>
    locales.map((lang) => {
      const { canonical, languages } = alternatesFor(lang, path);

      return {
        url: `${siteUrl}${canonical}`,
        lastModified,
        changeFrequency,
        priority,
        alternates: {
          languages: Object.fromEntries(
            Object.entries(languages).map(([code, href]) => [code, `${siteUrl}${href}`])
          ),
        },
      };
    })
  );
}
