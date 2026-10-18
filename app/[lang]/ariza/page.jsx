import CourseContent from "../[branch]/[course]/course-content";
import { ApplicationPageView } from "../../pixel-tracking";
import { applicationTypes, courses } from "@/lib/data";
import { alternatesFor, getDictionary } from "@/lib/i18n";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const t = getDictionary(lang);

  return {
    title: t.meta.applyTitle,
    description: t.meta.applyDescription,
    alternates: alternatesFor(lang, "/ariza"),
  };
}

export default async function ApplicationPage({ params, searchParams }) {
  const { lang } = await params;
  const { application, course: requestedCourse } = await searchParams;
  const applicationType =
    typeof application === "string" && Object.hasOwn(applicationTypes, application) ? application : null;
  const course = typeof requestedCourse === "string" && courses.includes(requestedCourse)
    ? requestedCourse
    : null;

  return (
    <>
      <ApplicationPageView />
      <CourseContent lang={lang} applicationType={applicationType} course={course} />
    </>
  );
}
