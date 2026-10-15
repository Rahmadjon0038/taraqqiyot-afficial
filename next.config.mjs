/** @type {import('next').NextConfig} */
const nextConfig = {
  // Docker uchun: .next/standalone ichida o'zi ishlaydigan kichik server yig'iladi.
  output: "standalone",

  // public/ ichidagi rasmlar har safar qayta tekshirilmasin: 1 kun keshda turadi,
  // keyin eskirgan nusxa ko'rsatilib, orqada yangisi olinadi.
  async headers() {
    const cache = [
      { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
    ];

    return [
      { source: "/flags/:path*", headers: cache },
      { source: "/certificates/:path*", headers: cache },
      { source: "/logo.png", headers: cache },
    ];
  },
};

export default nextConfig;
