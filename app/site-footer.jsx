import { getDictionary, localePath } from "@/lib/i18n";

const socials = [
  {
    key: "telegram",
    handle: "@taraqqiyot_namangan_rasmiy",
    href: "https://t.me/taraqqiyot_namangan_rasmiy",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M21.9 4.3 18.7 19.5c-.2 1.1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.1-8.2c.4-.4-.1-.6-.6-.2L6.2 13.2l-4.8-1.5c-1-.3-1.1-1 .2-1.5L20.5 2.9c.9-.3 1.7.2 1.4 1.4z" />
      </svg>
    ),
  },
  {
    key: "instagram",
    handle: "@taraqqiyot_namangan",
    href: "https://www.instagram.com/taraqqiyot_namangan",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
      </svg>
    ),
  },
];

export default function SiteFooter({ lang }) {
  const t = getDictionary(lang);

  return (
    <footer className="site-footer" id="aloqa">
      <h2>{t.footer.follow}</h2>

      <div className="site-footer-links">
        {socials.map((social) => (
          <a key={social.key} href={social.href} target="_blank" rel="noopener noreferrer">
            <span className="site-footer-icon" aria-hidden="true">
              {social.icon}
            </span>
            <span className="site-footer-text">
              <strong>{social.key === "telegram" ? t.footer.telegram : "Instagram"}</strong>
              <small>{social.handle}</small>
            </span>
          </a>
        ))}
      </div>

      <p>© Taraqqiyot Teaching Center</p>
      <p className="site-footer-legal">
        <a href={localePath(lang, "/privacy-policy")}>{t.footer.privacy}</a>
      </p>
    </footer>
  );
}
