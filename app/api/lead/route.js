import { branches, branchNames, courseNames, courses } from "@/lib/data";

// Arizani Telegram kanaliga yuboradi. Token va kanal .env.local faylida turadi
// (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID) va brauzerga hech qachon chiqmaydi.
export async function POST(request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("Telegram sozlanmagan: TELEGRAM_BOT_TOKEN va TELEGRAM_CHAT_ID kerak.");
    return Response.json({ ok: false, error: "not_configured" }, { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim().slice(0, 80);
  const phone = String(body.phone ?? "").replace(/\D/g, "");
  const branch = branches.includes(body.branch) ? body.branch : null;
  const course = courses.includes(body.course) ? body.course : null;
  const otherCity = body.otherCity === true;

  if (!name || !/^998\d{9}$/.test(phone)) {
    return Response.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const lines = ["🆕 Yangi leads", "", `👤 Ism: ${name}`, `📞 Telefon: +${phone}`];
  if (course) lines.push(`📚 Kurs: ${courseNames[course]}`);
  if (otherCity) {
    lines.push("📍 Boshqa shahardan (borib o'qiy oladi)");
  } else if (branch) {
    lines.push(`📍 Filial: ${branchNames[branch]}`);
  }
  lines.push(
    `🕒 ${new Date().toLocaleString("ru-RU", { timeZone: "Asia/Tashkent" })}`
  );

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: lines.join("\n") }),
    });

    if (!response.ok) {
      const details = await response.json().catch(() => null);
      console.error("Telegram xatosi:", response.status, details?.description);
      return Response.json({ ok: false, error: "telegram" }, { status: 502 });
    }
  } catch (error) {
    console.error("Telegramga ulanib bo'lmadi:", error.message);
    return Response.json({ ok: false, error: "telegram" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
