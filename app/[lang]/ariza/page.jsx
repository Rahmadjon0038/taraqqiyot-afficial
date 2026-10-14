import CourseContent from "../[branch]/[course]/course-content";
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

export default async function ApplicationPage({ params }) {
  const { lang } = await params;
  return <CourseContent lang={lang} />;
}
