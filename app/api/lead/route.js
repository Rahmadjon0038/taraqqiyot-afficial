import { applicationTypes, branches, courses } from "@/lib/data";
import { sendLeadToCrm } from "@/lib/crm";
import { buildLeadText } from "@/lib/lead-message";
import { hasMatchingLead, logEvent, serializeLeadSubmissions } from "@/lib/leads-log";
import { chatIdForBranch, chatIdFromEnv, keyboard, tg } from "@/lib/telegram";

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
async function createLead(request) {
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
  const vacancyTitle = typeof body.vacancyTitle === "string" ? body.vacancyTitle.trim().slice(0, 200) : "";
  const otherCity = body.otherCity === true;
  const lang = { ru: "ru", en: "en" }[body.lang] ?? "uz";
  const source = cleanSource(body.source);

  if (!name || !/^998\d{9}$/.test(phone)) {
    return Response.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  if (await hasMatchingLead({ phone, branch, course, applicationType, vacancyTitle, otherCity })) {
    return Response.json({ ok: false, error: "duplicate" }, { status: 409 });
  }

  const text = buildLeadText({ name, phone, course, applicationType, vacancyTitle, branch, otherCity, lang });

  const sent = await tg("sendMessage", {
    chat_id: otherCity ? chatIdFromEnv() : chatIdForBranch(branch),
    text,
    reply_markup: keyboard(),
  });

  if (!sent.ok) {
    console.error("Telegram xatosi:", sent.status ?? "", sent.description);
    return Response.json({ ok: false, error: "telegram" }, { status: 502 });
  }

  const leadId = `${sent.result.chat.id}:${sent.result.message_id}`;
  await logEvent({
    type: "lead",
    id: leadId,
    name,
    phone,
    branch,
    course,
    applicationType,
    vacancyTitle,
    otherCity,
    lang,
    source,
  });

  // Markaz CRM'iga shu zahoti yuboriladi (sozlangan bo'lsa); javobni kutmaymiz.
  sendLeadToCrm({ id: leadId, name, phone, course, vacancyTitle, applicationType, branch, otherCity, lang, source });

  return Response.json({ ok: true });
}

export async function POST(request) {
  return serializeLeadSubmissions(() => createLead(request));
}
