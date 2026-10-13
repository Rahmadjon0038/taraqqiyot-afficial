import Script from "next/script";
import { Anton, Caveat, JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";
import SiteFooter from "./site-footer";
import { branches, branchInfo, branchNames, siteName, siteUrl, socialLinks } from "@/lib/data";

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

const mono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "700"],
  variable: "--font-mono",
});

const caveat = Caveat({
  subsets: ["latin", "cyrillic"],
  weight: ["600", "700"],
  variable: "--font-hand",
});

const description =
  "Taraqqiyot Teaching Center — Namangandagi o'quv markazi. Ingliz, turk, rus, nemis, koreys, xitoy va yapon tillari, matematika, fizika, kimyo, IT kurslari. Davlatobod, Boburshox va Chorsu filiallari.";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Taraqqiyot Teaching Center — Namangandagi o'quv markazi | Til, fan va IT kurslari",
    template: "%s | Taraqqiyot Teaching Center",
  },
  description,
  applicationName: siteName,
  keywords: [
    "Taraqqiyot",
    "Taraqqiyot Teaching Center",
    "Taraqqiyot o'quv markazi",
    "Namangan o'quv markazi",
    "o'quv markaz Namangan",
    "til kurslari Namangan",
    "ingliz tili kursi Namangan",
    "turk tili kursi Namangan",
    "IELTS Namangan",
    "учебный центр Наманган",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    siteName,
    url: "/",
    title: "Taraqqiyot Teaching Center — orzudan natijagacha",
    description,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  formatDetection: { telephone: true },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": `${siteUrl}/#organization`,
  name: siteName,
  alternateName: ["Taraqqiyot", "Taraqqiyot o'quv markazi", "Taraqqiyot Markaz"],
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  image: `${siteUrl}/opengraph-image.png`,
  description,
  slogan: "Orzudan natijagacha",
  sameAs: socialLinks,
  address: { "@type": "PostalAddress", addressLocality: "Namangan", addressCountry: "UZ" },
  department: branches.map((branch) => {
    const info = branchInfo[branch];
    const [opens, closes] = info.hours.split("–");

    return {
      "@type": "EducationalOrganization",
      name: `${siteName} — ${branchNames[branch]} filiali`,
      telephone: info.phone.replace(/\s/g, ""),
      hasMap: info.map,
      address: {
        "@type": "PostalAddress",
        streetAddress: info.landmark ?? `${branchNames[branch]}`,
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

export default function RootLayout({ children }) {
  return (
    <html lang="uz">
      <body className={`${manrope.variable} ${anton.variable} ${mono.variable} ${caveat.variable}`}>
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
            fbq('init', 'YOUR_PIXEL_ID');
            fbq('track', 'PageView');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c") }}
        />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
