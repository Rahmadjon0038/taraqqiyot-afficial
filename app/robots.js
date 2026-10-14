import { siteUrl } from "@/lib/data";

export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/*/thank-you", "/*/*/thank-you", "/*/*/*/thank-you"] },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
