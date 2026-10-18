import Link from "next/link";
import { branches } from "@/lib/data";
import { getDictionary, localePath } from "@/lib/i18n";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return {
    title: getDictionary(lang).meta.thanksTitle,
    robots: { index: false, follow: false },
  };
}

export default async function ApplicationThankYouPage({ params, searchParams }) {
  const { lang } = await params;
  const { filial } = await searchParams;
  const t = getDictionary(lang);
  const branch = branches.includes(filial) ? filial : null;

  return (
    <main className="course-page">
      <header className="site-header">
        <Link href={localePath(lang, "/")} className="site-brand">
          <img src="/logo.png" alt={t.logoAlt} className="site-logo" />
          <span className="site-name">{t.siteNameUpper}</span>
        </Link>
      </header>

      <section className="thank-you-card">
        <span className="thank-you-icon" aria-hidden="true">✓</span>
        <h1>{t.thanks.title}</h1>
        <p className="section-copy">{t.thanks.text}</p>
        {branch && (
          <p className="thank-you-details">
            {t.thanks.branch}: <strong>{t.branchNames[branch]}</strong>
          </p>
        )}
        <Link href={`${localePath(lang, "/")}#natijalar`} className="results-button">
          {t.thanks.results}
        </Link>
      </section>
    </main>
  );
}
