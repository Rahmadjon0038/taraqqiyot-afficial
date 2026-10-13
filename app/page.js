import Link from "next/link";
import BranchMap from "./branch-map";
import CertificateCarousel from "./certificate-carousel";
import Stamp from "./course-art";
import { branches, courseNames, instagramVideos } from "@/lib/data";

const groups = [
  {
    title: "Tillar",
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
    title: "Fanlar",
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
    title: "Boshqa yo'nalishlar",
    tickets: [
      { course: "mental-arifmetika" },
      { course: "kompyuter-savodxonligi", tag: "Texnologiya" },
      { course: "it-kurslari", tag: "Texnologiya" },
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

export default function Home() {
  return (
    <main className="home">
      <nav className="home-nav">
        <a href="#top" className="home-nav-brand">
          <img src="/logo.png" alt="Taraqqiyot Teaching Center" />
        </a>

        <div className="home-nav-links">
          <a href="#kurslar">Kurslar</a>
          <a href="#natijalar">Natijalar</a>
          <a href="#videolar" className="home-nav-wide">
            Videolar
          </a>
          <a href="#filiallar" className="home-nav-wide">
            Filiallar
          </a>
          <a href="#aloqa">Aloqa</a>
        </div>

        <Link href="/ariza" className="home-nav-cta">
          Ariza<span> qoldirish</span> →
        </Link>
      </nav>

      <section className="home-hero" id="top">
        <p className="home-kicker">
          <b>Taraqqiyot Teaching Center</b> · Namangan · {branches.length} ta filial
        </p>

        <h1>
          <span>Taraqqiyot –</span>
          <span className="home-h1-red">orzudan</span>
          <span className="home-h1-red">natijagacha</span>
        </h1>

        <div className="home-hero-text">
          <p className="home-lead">
            Xorijiy tillar, maktab fanlari va IT kurslari — Namangandagi {branches.length} ta
            filialimizda.
          </p>

          <div className="home-hero-actions">
            <a href="#kurslar" className="btn-block">
              Kursni tanlash ↓
            </a>
            <a href="#natijalar" className="home-link">
              Natijalarimiz
            </a>
          </div>

          <p className="home-scribble" aria-hidden="true">
            <svg viewBox="0 0 60 40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M56 34C40 36 14 30 8 8" />
              <path d="M3 17 8 7l9 6" />
            </svg>
            birinchi qadam shu yerda
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
                <textPath href="#badge-ring" textLength="484">
                  NAMANGAN ✦ 3 TA FILIAL ✦ TARAQQIYOT ✦ O'QUV MARKAZI ✦
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
          <h2>Kurslar</h2>
          <p>yo'nalishni tanlang, chipta sizniki</p>
        </header>

        {groups.map((group) => (
            <div key={group.title} className="ticket-group">
              <h3 className="ticket-group-title">{group.title}</h3>

              {group.tickets.map((item) => (
                <article key={item.course} className={item.tag ? "ticket ticket-dark" : "ticket"}>
                  {item.tag && <span className="ticket-tag">{item.tag}</span>}
                  <div className="ticket-stub">
                    <Stamp course={item.course} />
                  </div>

                  <div className="ticket-main">
                    <h3>{courseNames[item.course]}</h3>
                  </div>

                  <div className="ticket-end">
                    <span className="ticket-barcode" aria-hidden="true" />
                    <Link href={`/${branches[0]}/${item.course}`} className="btn-block">
                      Ariza qoldirish →
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
            <h2>Natijalar</h2>
            <p>o'quvchilarimiz sertifikatlari</p>
          </header>

          <CertificateCarousel />
        </div>
      </section>

      <section className="home-videos" id="videolar">
        <header className="home-heading">
          <h2>Videolar</h2>
          <p>instagramdagi hayotimiz</p>
        </header>

        {[0, 1].map((row) => (
          <div key={row} className="home-video-scroller">
            {instagramVideos.map((url, index) =>
              index % 2 === row ? (
                <article key={index} className="home-video">
                  <p className="home-video-label">
                    <span>Video № {String(index + 1).padStart(2, "0")}</span>
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
                      <span>Video joyi</span>
                    )}
                  </div>
                </article>
              ) : null
            )}
          </div>
        ))}

        <p className="home-video-hint" aria-hidden="true">
          ← suring →
        </p>
      </section>

      <section className="home-block home-branches" id="filiallar">
        <header className="home-heading">
          <h2>Filiallar</h2>
          <p>sizga yaqinini tanlang</p>
        </header>

        <BranchMap />
      </section>

      <section className="home-cta">
        <div className="home-cta-inner">
          <h2>
            Keyingi natija —<br />
            sizniki.
          </h2>
          <p>Kursni tanlang va ariza qoldiring.</p>
          <a href="#kurslar" className="btn-block btn-light">
            Kursni tanlash ↑
          </a>
        </div>
      </section>
    </main>
  );
}
