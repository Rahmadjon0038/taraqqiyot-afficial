import CourseContent from "../[branch]/[course]/course-content";
import { ApplicationPageView } from "../../pixel-tracking";
import { applicationTypes } from "@/lib/data";
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
  const { application } = await searchParams;
  const applicationType =
    typeof application === "string" && Object.hasOwn(applicationTypes, application) ? application : null;

  return (
    <>
      <ApplicationPageView />
      <CourseContent lang={lang} applicationType={applicationType} />
    </>
  );
}
