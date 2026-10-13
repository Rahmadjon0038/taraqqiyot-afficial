import Link from "next/link";
import { branches, branchNames } from "@/lib/data";
import LeadEvent from "./lead-event";

export const metadata = {
  title: "Arizangiz qabul qilindi",
  robots: { index: false, follow: false },
};

export default async function ApplicationThankYouPage({ searchParams }) {
  const { filial } = await searchParams;
  const branch = branches.includes(filial) ? filial : null;

  return (
    <main className="course-page">
      <LeadEvent branch={branch} />

      <header className="site-header">
        <img src="/logo.png" alt="Taraqqiyot o'quv markazi" className="site-logo" />
        <span className="site-name">TARAQQIYOT TEACHING CENTER</span>
      </header>

      <section className="thank-you-card">
        <span className="thank-you-icon" aria-hidden="true">✓</span>
        <h1>Arizangiz qabul qilindi!</h1>
        <p className="section-copy">Biz siz bilan tez orada bog'lanamiz</p>
        {branch && (
          <p className="thank-you-details">
            Filial: <strong>{branchNames[branch]}</strong>
          </p>
        )}
        <Link href="/#natijalar" className="results-button">
          Natijalarimizni ko'ring
        </Link>
      </section>
    </main>
  );
}
