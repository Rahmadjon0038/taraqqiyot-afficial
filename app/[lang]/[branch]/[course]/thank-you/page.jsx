"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getDictionary, localePath } from "@/lib/i18n";

export default function ThankYouPage() {
  const params = useParams();
  const t = getDictionary(params.lang);

  useEffect(() => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "Lead", {
        branch: params.branch,
        course: params.course,
        language: params.lang,
      });
    }
  }, [params.branch, params.course, params.lang]);

  return (
    <main className="course-page">
      <header className="site-header">
        <Link href={localePath(params.lang, "/")} className="site-brand">
          <img src="/logo.png" alt={t.logoAlt} className="site-logo" />
          <span className="site-name">{t.siteNameUpper}</span>
        </Link>
      </header>

      <section className="thank-you-card">
        <span className="thank-you-icon" aria-hidden="true">✓</span>
        <h1>{t.thanks.title}</h1>
        <p className="section-copy">{t.thanks.text}</p>
        <p className="thank-you-details">
          {t.thanks.branch}: <strong>{t.branchNames[params.branch]}</strong>
          <br />
          {t.thanks.course}: <strong>{t.courseNames[params.course]}</strong>
        </p>
        <Link href={`${localePath(params.lang, "/")}#natijalar`} className="results-button">
          {t.thanks.results}
        </Link>
      </section>
    </main>
  );
}
