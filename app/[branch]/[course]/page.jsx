import { notFound } from "next/navigation";
import { branches, branchNames, courseNames, courseSeo, courses, siteName, siteUrl } from "@/lib/data";
import CourseContent from "./course-content";

export function generateStaticParams() {
  return branches.flatMap((branch) =>
    courses.map((course) => ({
      branch,
      course,
    }))
  );
}

export async function generateMetadata({ params }) {
  const { branch, course } = await params;
  if (!branches.includes(branch) || !courses.includes(course)) return {};

  const title = `${courseNames[course]} kursi Namanganda — ${branchNames[branch]} filiali`;
  const description = `${courseSeo[course]} ${siteName}, Namangan, ${branchNames[branch]} filiali. Tajribali ustozlar, zamonaviy darslar. Onlayn ariza qoldiring.`;
  const url = `/${branch}/${course}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "uz_UZ",
      siteName,
      title,
      description,
      url,
      images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
    },
  };
}

export default async function CoursePage({ params }) {
  const { branch, course } = await params;

  if (!branches.includes(branch) || !courses.includes(course)) {
    notFound();
  }

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${courseNames[course]} kursi`,
    description: courseSeo[course],
    url: `${siteUrl}/${branch}/${course}`,
    inLanguage: "uz",
    provider: { "@type": "EducationalOrganization", "@id": `${siteUrl}/#organization`, name: siteName, url: siteUrl },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd).replace(/</g, "\\u003c") }}
      />
      <CourseContent
        branch={branch}
        course={course}
        courseName={courseNames[course]}
      />
    </>
  );
}
