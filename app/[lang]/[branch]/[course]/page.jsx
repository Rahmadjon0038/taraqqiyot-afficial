import { notFound } from "next/navigation";
import { branches, courses, siteName, siteUrl } from "@/lib/data";
import { alternatesFor, getDictionary, ogLocales } from "@/lib/i18n";
import CourseContent from "./course-content";

export function generateStaticParams() {
  return branches.flatMap((branch) => courses.map((course) => ({ branch, course })));
}

export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { lang, branch, course } = await params;
  if (!branches.includes(branch) || !courses.includes(course)) return {};

  const t = getDictionary(lang);
  const courseName = t.courseNames[course];
  const branchName = t.branchNames[branch];
  const title = t.meta.courseTitle(courseName, branchName);
  const description = `${t.courseSeo[course]} ${t.meta.courseSuffix(siteName, branchName)}`;
  const alternates = alternatesFor(lang, `/${branch}/${course}`);

  return {
    title,
    description,
    alternates,
    openGraph: {
      type: "website",
      locale: ogLocales[lang],
      siteName,
      title,
      description,
      url: alternates.canonical,
      images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
    },
  };
}

export default async function CoursePage({ params }) {
  const { lang, branch, course } = await params;

  if (!branches.includes(branch) || !courses.includes(course)) {
    notFound();
  }

  const t = getDictionary(lang);
  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: t.meta.courseSchemaName(t.courseNames[course]),
    description: t.courseSeo[course],
    url: `${siteUrl}${alternatesFor(lang, `/${branch}/${course}`).canonical}`,
    inLanguage: lang,
    provider: { "@type": "EducationalOrganization", "@id": `${siteUrl}/#organization`, name: siteName, url: siteUrl },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd).replace(/</g, "\\u003c") }}
      />
      <CourseContent lang={lang} branch={branch} course={course} />
    </>
  );
}
