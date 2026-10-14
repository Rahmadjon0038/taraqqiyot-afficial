import Link from "next/link";
import { localeLabels, localePath, locales } from "@/lib/i18n";

export default function LangSwitch({ lang, path = "/", className = "" }) {
  return (
    <nav className={`lang-switch ${className}`} aria-label="Til / Язык / Language">
      {locales.map((code) => (
        <Link
          key={code}
          href={localePath(code, path)}
          hrefLang={code}
          aria-current={code === lang ? "true" : undefined}
          className={code === lang ? "is-active" : undefined}
        >
          {localeLabels[code]}
        </Link>
      ))}
    </nav>
  );
}
