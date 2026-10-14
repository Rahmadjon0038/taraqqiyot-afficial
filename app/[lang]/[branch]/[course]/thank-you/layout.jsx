import { getDictionary } from "@/lib/i18n";

// Rahmat sahifalari qidiruv tizimlarida chiqmasligi kerak.
export async function generateMetadata({ params }) {
  const { lang } = await params;
  return {
    title: getDictionary(lang).meta.thanksTitle,
    robots: { index: false, follow: false },
  };
}

export default function ThankYouLayout({ children }) {
  return children;
}
