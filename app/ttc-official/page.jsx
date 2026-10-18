import Link from "next/link";
import Image from "next/image";
import { getAnnouncements, buildAnnouncementLink } from "@/lib/announcements";

export default async function TTCOfficialPage() {
  const items = await getAnnouncements();

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 20px 80px" }}>
      <header style={{ marginBottom: 32 }}>
        <p style={{ textTransform: "uppercase", letterSpacing: 2, color: "#d62728", fontWeight: 700, fontSize: 12 }}>
          TTC OFFICIAL
        </p>
        <h1 style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)", margin: "8px 0 12px" }}>Yangi e&apos;lonlar va kurslar</h1>
        <p style={{ color: "#4b5563", fontSize: 18, maxWidth: 700 }}>
          Bularning hammasi bir xil JSON feeddan keladi. Rasmni Cloudflare R2 yoki public katalogdan yuklab,
          type bo&apos;yicha biz kurs yoki yangilikni avtomatik boshqaramiz.
        </p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
        {items.map((item) => (
          <article key={item.id} style={{ border: "1px solid #e5e7eb", borderRadius: 18, overflow: "hidden", background: "#fff" }}>
            <div style={{ position: "relative", width: "100%", height: 220 }}>
              <Image src={item.image} alt={item.title} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
            <div style={{ padding: 18 }}>
              <span
                style={{
                  display: "inline-flex",
                  padding: "6px 10px",
                  borderRadius: 999,
                  background: item.type === "course" ? "#fee2e2" : item.type === "vacancy" ? "#fef3c7" : "#e0f2fe",
                  color: "#111827",
                  fontWeight: 700,
                  fontSize: 12,
                  marginBottom: 12,
                  textTransform: "uppercase",
                }}
              >
                {item.type}
              </span>
              <h2 style={{ fontSize: 22, margin: "0 0 10px" }}>{item.title}</h2>
              <p style={{ color: "#4b5563", margin: "0 0 16px", minHeight: 48 }}>{item.preview || item.description}</p>
              <Link
                href={buildAnnouncementLink(item, "uz")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#111827",
                  color: "#fff",
                  borderRadius: 999,
                  padding: "12px 18px",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                {item.type === "news" ? "Batafsil ko&apos;rish" : item.type === "course" ? "Ariza yuborish" : "Vakansiyaga ariza"}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
