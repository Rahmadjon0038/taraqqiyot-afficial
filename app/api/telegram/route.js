import { buildCsv, buildReport, logEvent, readLeads } from "@/lib/leads-log";
import { STATUSES, STATUS_PREFIX, isAllowed, keyboard, statusByCode, tashkentTime, tg } from "@/lib/telegram";

// Telegram shu manzilga tugma bosilishlarini va buyruqlarni yuboradi.
// Manzilni Telegram'ga bir marta ro'yxatdan o'tkazish kerak (README'da yozilgan).

function operatorName(user) {
  return user.username ? `@${user.username}` : [user.first_name, user.last_name].filter(Boolean).join(" ");
}

async function handleButton(query) {
  const message = query.message;
  const statusKey = query.data?.startsWith("s:") ? statusByCode(query.data.slice(2)) : null;

  if (!message || !statusKey) {
    await tg("answerCallbackQuery", { callback_query_id: query.id });
    return;
  }

  if (!isAllowed(message.chat.id, query.from.id)) {
    await tg("answerCallbackQuery", { callback_query_id: query.id, text: "Ruxsat yo'q", show_alert: true });
    return;
  }

  const label = STATUSES[statusKey].label;
  const original = message.text ?? "";

  if (original.includes(`${STATUS_PREFIX} ${label} `)) {
    await tg("answerCallbackQuery", { callback_query_id: query.id, text: "Bu holat allaqachon belgilangan" });
    return;
  }

  const who = operatorName(query.from);
  const base = original
    .split("\n")
    .filter((line) => !line.startsWith(STATUS_PREFIX))
    .join("\n")
    .trimEnd();
  const text = `${base}\n\n${STATUS_PREFIX} ${label} — ${who} (${tashkentTime()})`;

  const edited = await tg("editMessageText", {
    chat_id: message.chat.id,
    message_id: message.message_id,
    text,
    reply_markup: keyboard(statusKey),
  });

  if (!edited.ok && !edited.description?.includes("not modified")) {
    console.error("Xabarni o'zgartirib bo'lmadi:", edited.description);
    await tg("answerCallbackQuery", { callback_query_id: query.id, text: "Xatolik, qayta urinib ko'ring", show_alert: true });
    return;
  }

  await logEvent({ type: "status", id: `${message.chat.id}:${message.message_id}`, status: statusKey, by: who });
  await tg("answerCallbackQuery", { callback_query_id: query.id, text: `Belgilandi: ${label}` });
}

async function handleCommand(message) {
  const match = message.text?.match(/^\/(hisobot|eksport|start|help)(?:@\w+)?(?:\s+(\d{1,4}))?/i);
  if (!match) return;

  const chatId = message.chat.id;
  if (!isAllowed(chatId, message.from?.id)) return;

  const command = match[1].toLowerCase();
  const days = match[2] ? Number(match[2]) : null;

  if (command === "start" || command === "help") {
    await tg("sendMessage", {
      chat_id: chatId,
      text: "Buyruqlar:\n/hisobot — arizalar hisoboti (butun davr)\n/hisobot 7 — oxirgi 7 kun\n/eksport — barcha arizalar (CSV fayl)\n/eksport 30 — oxirgi 30 kun",
    });
    return;
  }

  const leads = await readLeads(days);

  if (command === "hisobot") {
    await tg("sendMessage", { chat_id: chatId, text: buildReport(leads, days) });
    return;
  }

  const form = new FormData();
  form.append("chat_id", String(chatId));
  form.append("caption", `Arizalar: ${leads.length} ta${days ? `, oxirgi ${days} kun` : ""}`);
  form.append("document", new Blob([buildCsv(leads)], { type: "text/csv" }), "arizalar.csv");
  await tg("sendDocument", form);
}

export async function POST(request) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;

  // Maxfiy so'z berilmagan bo'lsa, bu manzil yopiq turadi.
  if (!secret) return Response.json({ ok: false }, { status: 503 });
  if (request.headers.get("x-telegram-bot-api-secret-token") !== secret) {
    return Response.json({ ok: false }, { status: 401 });
  }

  const update = await request.json().catch(() => null);
  if (!update) return Response.json({ ok: false }, { status: 400 });

  try {
    if (update.callback_query) await handleButton(update.callback_query);
    else if (update.message) await handleCommand(update.message);
  } catch (error) {
    console.error("Telegram yangilanishini qayta ishlashda xato:", error.message);
  }

  // Doim 200: aks holda Telegram bir xil yangilanishni qayta-qayta yuboradi.
  return Response.json({ ok: true });
}
