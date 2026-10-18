import { applicationTypes, branches, branchNames, courseNames, courses } from "@/lib/data";
import { logEvent } from "@/lib/leads-log";
import { chatIdFromEnv, keyboard, tashkentTime, tg } from "@/lib/telegram";

const SOURCE_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
  "fbcl",
];

// Reklama manbasi: faqat ma'lum kalitlar, qiymatlar qisqartiriladi.
function cleanSource(raw) {
  if (!raw || typeof raw !== "object") return {};

  return Object.fromEntries(
    SOURCE_KEYS.flatMap((key) => {
      const value =
        typeof raw[key] === "string" ? raw[key].replace(/[\r\n\t]/g, " ").trim().slice(0, 120) : "";
      return value ? [[key, value]] : [];
    })
  );
}

// Arizani Telegram guruhiga tugmalar bilan yuboradi. Token va guruh .env faylida turadi
// (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID) va brauzerga hech qachon chiqmaydi.
export async function POST(request) {
  if (!process.env.TELEGRAM_BOT_TOKEN || !chatIdFromEnv()) {
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
  const applicationType =
    typeof body.applicationType === "string" && Object.hasOwn(applicationTypes, body.applicationType)
      ? body.applicationType
      : null;
  const otherCity = body.otherCity === true;
  const lang = { ru: "ru", en: "en" }[body.lang] ?? "uz";
  const source = cleanSource(body.source);

  if (!name || !/^998\d{9}$/.test(phone)) {
    return Response.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const lines = ["🆕 Yangi leads", "", `👤 Ism: ${name}`, `📞 Telefon: +${phone}`];
  if (applicationType) lines.push(`🎯 Murojaat: ${applicationTypes[applicationType].name}`);
  if (course) lines.push(`📚 Kurs: ${courseNames[course]}`);
  if (otherCity) {
    lines.push("📍 Boshqa shahardan (borib o'qiy oladi)");
  } else if (branch) {
    lines.push(`📍 Filial: ${branchNames[branch]}`);
  }
  if (lang !== "uz") lines.push(`🌐 Sayt tili: ${lang === "ru" ? "Ruscha" : "Inglizcha"}`);
  if (Object.keys(source).length) {
    lines.push(`📣 Reklama: ${Object.entries(source).map(([key, value]) => `${key}=${value}`).join(" · ")}`);
  }
  lines.push(`🕒 ${tashkentTime(new Date(), true)}`);

  const sent = await tg("sendMessage", {
    chat_id: chatIdFromEnv(),
    text: lines.join("\n"),
    reply_markup: keyboard(),
  });

  if (!sent.ok) {
    console.error("Telegram xatosi:", sent.status ?? "", sent.description);
    return Response.json({ ok: false, error: "telegram" }, { status: 502 });
  }

  await logEvent({
    type: "lead",
    id: `${sent.result.chat.id}:${sent.result.message_id}`,
    name,
    phone,
    branch,
    course,
    applicationType,
    otherCity,
    lang,
    source,
  });

  return Response.json({ ok: true });
}
