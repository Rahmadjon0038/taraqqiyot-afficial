import Script from "next/script";
import { notFound } from "next/navigation";
import { Anton, Caveat, JetBrains_Mono, Manrope, Oswald } from "next/font/google";
import "../globals.css";
import AdSource from "../ad-source";
import SiteFooter from "../site-footer";
import { branches, branchInfo, siteName, siteUrl, socialLinks } from "@/lib/data";
import { alternatesFor, getDictionary, isLocale, locales, ogLocales } from "@/lib/i18n";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-manrope",
});

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

// Anton'da kirill harflari yo'q — ruscha sarlavhalar uchun Oswald ishlatiladi.
const oswald = Oswald({
  subsets: ["cyrillic"],
  weight: "700",
  variable: "--font-display-cyr",
  preload: false,
  fallback: [],
  adjustFontFallback: false,
});

const mono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "700"],
  variable: "--font-mono",
  preload: false,
});

const caveat = Caveat({
  subsets: ["latin", "cyrillic"],
  weight: ["600", "700"],
  variable: "--font-hand",
  preload: false,
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const t = getDictionary(lang);

  return {
    metadataBase: new URL(siteUrl),
    title: { default: t.meta.homeTitle, template: "%s | Taraqqiyot Teaching Center" },
    description: t.meta.description,
    applicationName: siteName,
    keywords: t.meta.keywords,
    alternates: alternatesFor(lang, "/"),
    openGraph: {
      type: "website",
      locale: ogLocales[lang],
      alternateLocale: locales.filter((code) => code !== lang).map((code) => ogLocales[code]),
      siteName,
      url: alternatesFor(lang, "/").canonical,
      title: t.meta.ogTitle,
      description: t.meta.description,
      images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", images: ["/opengraph-image.png"] },
    robots: { index: true, follow: true },
    formatDetection: { telephone: true },
  };
}

function organizationJsonLd(lang) {
  const t = getDictionary(lang);

  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${siteUrl}/#organization`,
    name: siteName,
    alternateName: ["Taraqqiyot", "Taraqqiyot o'quv markazi", "Taraqqiyot Markaz"],
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    image: `${siteUrl}/opengraph-image.png`,
    description: t.meta.description,
    slogan: t.meta.slogan,
    sameAs: socialLinks,
    address: { "@type": "PostalAddress", addressLocality: "Namangan", addressCountry: "UZ" },
    department: branches.map((branch) => {
      const info = branchInfo[branch];
      const [opens, closes] = info.hours.split("–");

      return {
        "@type": "EducationalOrganization",
        name: t.meta.branchSchemaName(siteName, t.branchNames[branch]),
        telephone: info.phone.replace(/\s/g, ""),
        hasMap: info.map,
        address: {
          "@type": "PostalAddress",
          streetAddress: t.landmarks[branch] ?? t.branchNames[branch],
          addressLocality: "Namangan",
          addressCountry: "UZ",
        },
        ...(info.geo && {
          geo: { "@type": "GeoCoordinates", latitude: info.geo[0], longitude: info.geo[1] },
        }),
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens,
          closes,
        },
      };
    }),
  };
}

export default async function RootLayout({ children, params }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html lang={lang}>
      <body
        className={`${manrope.variable} ${anton.variable} ${oswald.variable} ${mono.variable} ${caveat.variable}`}
      >
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document, 'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1861679368537163');
            fbq('track', 'PageView');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(lang)).replace(/</g, "\\u003c") }}
        />
        <AdSource />
        {children}
        <SiteFooter lang={lang} />
      </body>
    </html>
  );
}
