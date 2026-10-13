import CourseContent from "../[branch]/[course]/course-content";

export const metadata = {
  title: "Ariza qoldirish — kursga yozilish",
  description:
    "Taraqqiyot Teaching Center kurslariga onlayn ariza qoldiring: Namangandagi o'zingizga yaqin filialni tanlang, biz siz bilan bog'lanamiz.",
  alternates: { canonical: "/ariza" },
};

export default function ApplicationPage() {
  return <CourseContent />;
}
