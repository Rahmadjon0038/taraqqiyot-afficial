import Link from "next/link";
import { branches, branchInfo } from "@/lib/data";
import { alternatesFor, getDictionary, localePath } from "@/lib/i18n";
import { privacy, privacyUpdated } from "@/lib/privacy";
import LangSwitch from "../../lang-switch";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const p = privacy[lang];

  return {
    title: p.title,
    description: p.description,
    alternates: alternatesFor(lang, "/privacy-policy"),
  };
}

export default async function PrivacyPolicyPage({ params }) {
  const { lang } = await params;
  const t = getDictionary(lang);
  const p = privacy[lang];

  return (
    <main className="course-page">
      <header className="site-header">
        <Link href={localePath(lang, "/")} className="site-brand">
          <img src="/logo.png" alt={t.logoAlt} className="site-logo" />
          <span className="site-name">{t.siteNameUpper}</span>
        </Link>
        <LangSwitch lang={lang} path="/privacy-policy" className="lang-switch-page" />
      </header>

      <article className="legal">
        <h1>{p.title}</h1>
        <p className="legal-updated">
          {p.updated}: {privacyUpdated}
        </p>

        <p>{p.intro}</p>

        {p.sections.map((section) => (
          <section key={section.h}>
            <h2>{section.h}</h2>
            {section.p?.map((text) => <p key={text}>{text}</p>)}
            {section.ul && (
              <ul>
                {section.ul.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
            )}
            {section.after?.map((text) => <p key={text}>{text}</p>)}
          </section>
        ))}

        <h2>{p.contactsTitle}</h2>
        <ul className="legal-contacts">
          {branches.map((branch) => (
            <li key={branch}>
              {p.branchContact(t.branchNames[branch])}:{" "}
              <a href={`tel:${branchInfo[branch].phone.replace(/\s/g, "")}`}>{branchInfo[branch].phone}</a>
            </li>
          ))}
          <li>
            Telegram: <a href="https://t.me/taraqqiyot_namangan_rasmiy">@taraqqiyot_namangan_rasmiy</a>
          </li>
        </ul>

        <Link href={localePath(lang, "/")} className="results-button">
          {p.back}
        </Link>
      </article>
    </main>
  );
}
