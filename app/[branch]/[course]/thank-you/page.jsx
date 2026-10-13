"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { branchNames, courseNames } from "@/lib/data";

export default function ThankYouPage() {
  const params = useParams();

  useEffect(() => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "Lead", {
        branch: params.branch,
        course: params.course,
      });
    }
  }, [params.branch, params.course]);

  return (
    <main className="course-page">
      <header className="site-header">
        <img src="/logo.png" alt="Taraqqiyot o'quv markazi" className="site-logo" />
        <span className="site-name">TARAQQIYOT TEACHING CENTER</span>
      </header>

      <section className="thank-you-card">
        <span className="thank-you-icon" aria-hidden="true">✓</span>
        <h1>Arizangiz qabul qilindi!</h1>
        <p className="section-copy">Biz siz bilan tez orada bog'lanamiz</p>
        <p className="thank-you-details">
          Filial: <strong>{branchNames[params.branch]}</strong>
          <br />
          Kurs: <strong>{courseNames[params.course]}</strong>
        </p>
        <Link href="/#natijalar" className="results-button">
          Natijalarimizni ko'ring
        </Link>
      </section>
    </main>
  );
}
