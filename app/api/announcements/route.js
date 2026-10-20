import { getAnnouncements } from "@/lib/announcements";

// Build paytida emas, har so'rovda ishlaydi (manba build paytida yetib bo'lmasligi mumkin).
// Manbaga so'rov baribir 60 soniya keshlanadi, qarang lib/announcements.js.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await getAnnouncements();
    return Response.json(
      { items, updatedAt: new Date().toISOString() },
      {
        status: 200,
        // Brauzer va nginx ham bir daqiqa eslab turadi: DM platformaga deyarli so'rov bormaydi.
        headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
      }
    );
  } catch (error) {
    console.error("Announcements API error:", error);
    return Response.json({ error: "Announcements are temporarily unavailable" }, { status: 502 });
  }
}
