import { getAnnouncements } from "@/lib/announcements";

export async function GET() {
  try {
    const items = await getAnnouncements();
    return Response.json({ items, updatedAt: new Date().toISOString() }, { status: 200 });
  } catch (error) {
    console.error("Announcements API error:", error);
    return Response.json({ error: "Announcements are temporarily unavailable" }, { status: 502 });
  }
}
