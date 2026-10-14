import Link from "next/link";
import BranchMap from "../branch-map";
import CertificateCarousel from "../certificate-carousel";
import Stamp from "../course-art";
import LangSwitch from "../lang-switch";
import { branches, instagramVideos } from "@/lib/data";
import { alternatesFor, getDictionary, localePath } from "@/lib/i18n";

const groups = [
  {
    key: "languages",
    tickets: [
      { course: "ingliz-tili" },
      { course: "rus-tili" },
      { course: "turk-tili" },
      { course: "nemis-tili" },
      { course: "koreys-tili" },
      { course: "xitoy-tili" },
      { course: "yapon-tili" },
    ],
  },
  {
    key: "sciences",
    tickets: [
      { course: "matematika" },
      { course: "fizika" },
      { course: "kimyo" },
      { course: "biologiya" },
      { course: "ona-tili" },
      { course: "tarix" },
    ],
  },
  {
    key: "other",
    tickets: [
      { course: "mental-arifmetika" },
      { course: "kompyuter-savodxonligi", tech: true },
      { course: "it-kurslari", tech: true },
      { course: "suniy-intellekt", tech: true },
    ],
  },
];


const marquee = [
  { word: "Merhaba", flag: "tr" },
  { word: "Hallo", flag: "de" },
  { word: "안녕하세요", flag: "kr" },
  { word: "Привет", flag: "ru" },
  { word: "a² + b² = c²" },
];

function embedUrl(url) {
  return `${url.split("?")[0].replace(/\/+$/, "")}/embed`;
}

function MarqueeRow() {
  return (
    <div className="home-marquee-row">
      {marquee.map((item) => (
        <span key={item.word}>
          {item.flag ? <img src={`/flags/${item.flag}.png`} alt="" /> : <i>√x</i>}
          {item.word}
        </span>
      ))}
    </div>
  );
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return { alternates: alternatesFor(lang, "/") };
}

export default async function Home({ params }) {
  const { lang } = await params;
  const t = getDictionary(lang);

  return (
    <main className="home">
      <nav className="home-nav">
        <a href="#top" className="home-nav-brand">
          <img src="/logo.png" alt={t.logoAlt} />
        </a>

        <div className="home-nav-links">
          <a href="#kurslar">{t.nav.courses}</a>
          <a href="#natijalar" className="home-nav-mid">
            {t.nav.results}
          </a>
          <a href="#videolar" className="home-nav-wide">
            {t.nav.videos}
          </a>
          <a href="#filiallar" className="home-nav-wide">
            {t.nav.branches}
          </a>
          <a href="#aloqa" className="home-nav-mid">
            {t.nav.contact}
          </a>
        </div>

        <LangSwitch lang={lang} />

        <Link href={localePath(lang, "/ariza")} className="home-nav-cta">
          {t.nav.apply}
          {t.nav.applyRest && <span>{t.nav.applyRest}</span>} →
        </Link>
      </nav>

      <section className="home-hero" id="top">
        <p className="home-kicker">
          <b>Taraqqiyot Teaching Center</b> · {t.hero.kicker(branches.length)}
        </p>

        <h1>
          <span>{t.hero.title[0]}</span>
          <span className="home-h1-red">{t.hero.title[1]}</span>
          <span className="home-h1-red">{t.hero.title[2]}</span>
        </h1>

        <div className="home-hero-text">
          <p className="home-lead">
            {t.hero.lead(branches.length)}
          </p>

          <div className="home-hero-actions">
            <a href="#kurslar" className="btn-block">
              {t.hero.choose}
            </a>
            <a href="#natijalar" className="home-link">
              {t.hero.results}
            </a>
          </div>

          <p className="home-scribble" aria-hidden="true">
            <svg viewBox="0 0 60 40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M56 34C40 36 14 30 8 8" />
              <path d="M3 17 8 7l9 6" />
            </svg>
            {t.hero.scribble}
          </p>
        </div>

        <div className="home-collage" aria-hidden="true">
          <Stamp course="turk-tili" className="stamp-a" />
          <Stamp course="koreys-tili" className="stamp-b" />
          <Stamp course="matematika" className="stamp-c" />
          <Stamp course="nemis-tili" className="stamp-d" />
          <Stamp course="rus-tili" className="stamp-e" />
          <Stamp course="it-kurslari" className="stamp-f" />

          <div className="home-badge">
            <svg viewBox="0 0 200 200">
              <defs>
                <path id="badge-ring" d="M100 100m-78 0a78 78 0 1 1 156 0a78 78 0 1 1-156 0" />
              </defs>
              <text>
                <textPath href="#badge-ring" textLength="484" lengthAdjust="spacingAndGlyphs">
                  {t.hero.badge}
                </textPath>
              </text>
            </svg>
            <span>
              <img src="/logo.png" alt="" />
            </span>
          </div>
        </div>
      </section>

      <div className="home-marquee" aria-hidden="true">
        <div className="home-marquee-track">
          <MarqueeRow />
          <MarqueeRow />
        </div>
      </div>

      <section className="home-block" id="kurslar">
        <header className="home-heading">
          <h2>{t.courses.title}</h2>
          <p>{t.courses.note}</p>
        </header>

        {groups.map((group) => (
            <div key={group.key} className="ticket-group">
              <h3 className="ticket-group-title">{t.courses.groups[group.key]}</h3>

              {group.tickets.map((item) => (
                <article key={item.course} className={item.tech ? "ticket ticket-dark" : "ticket"}>
                  {item.tech && <span className="ticket-tag">{t.courses.tag}</span>}
                  <div className="ticket-stub">
                    <Stamp course={item.course} />
                  </div>

                  <div className="ticket-main">
                    <h3>{t.courseNames[item.course]}</h3>
                  </div>

                  <div className="ticket-end">
                    <span className="ticket-barcode" aria-hidden="true" />
                    <Link href={localePath(lang, `/${branches[0]}/${item.course}`)} className="btn-block">
                      {t.courses.apply}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
        ))}
      </section>

      <section className="home-wall" id="natijalar">
        <div className="home-wall-inner">
          <header className="home-heading">
            <h2>{t.results.title}</h2>
            <p>{t.results.note}</p>
          </header>

          <CertificateCarousel lang={lang} />
        </div>
      </section>

      <section className="home-videos" id="videolar">
        <header className="home-heading">
          <h2>{t.videos.title}</h2>
          <p>{t.videos.note}</p>
        </header>

        {[0, 1].map((row) => (
          <div key={row} className="home-video-scroller">
            {instagramVideos.map((url, index) =>
              index % 2 === row ? (
                <article key={index} className="home-video">
                  <p className="home-video-label">
                    <span>
                      {t.videos.label} № {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>Instagram</span>
                  </p>
                  <div className="home-video-frame">
                    {url ? (
                      <iframe
                        src={embedUrl(url)}
                        title={`Instagram video ${index + 1}`}
                        loading="lazy"
                        scrolling="no"
                        sandbox="allow-scripts allow-same-origin"
                        allow="autoplay; encrypted-media; picture-in-picture"
                      />
                    ) : (
                      <span>{t.videos.empty}</span>
                    )}
                  </div>
                </article>
              ) : null
            )}
          </div>
        ))}

        <p className="home-video-hint" aria-hidden="true">
          {t.videos.hint}
        </p>
      </section>

      <section className="home-block home-branches" id="filiallar">
        <header className="home-heading">
          <h2>{t.branches.title}</h2>
          <p>{t.branches.note}</p>
        </header>

        <BranchMap lang={lang} />
      </section>

      <section className="home-cta">
        <div className="home-cta-inner">
          <h2>
            {t.cta.title[0]}
            <br />
            {t.cta.title[1]}
          </h2>
          <p>{t.cta.text}</p>
          <a href="#kurslar" className="btn-block btn-light">
            {t.cta.button}
          </a>
        </div>
      </section>
    </main>
  );
}
