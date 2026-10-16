import { buildCsv, buildLeadList, buildOverview, buildReport, logEvent, readLeads } from "@/lib/leads-log";
import { STATUSES, STATUS_PREFIX, isAllowed, keyboard, statusByCode, tashkentTime, tg } from "@/lib/telegram";

// Telegram shu manzilga tugma bosilishlarini va buyruqlarni yuboradi.
// Manzilni Telegram'ga bir marta ro'yxatdan o'tkazish kerak (README'da yozilgan).

const HELP = [
  "Buyruqlar:",
  "/hisobot — bugun, 7 kun va 30 kunlik hisobot (tugmalar bilan batafsil: statistika va har bir ariza)",
  "/kunlik — bugungi batafsil hisobot",
  "/haftalik — oxirgi 7 kun",
  "/oylik — oxirgi 30 kun",
  "/eksport — barcha arizalar CSV fayl",
  "/eksport 14 — oxirgi 14 kun (istalgan son)",
].join("\n");

// Bosh hisobot tagidagi tugmalar.
const REPORT_KEYBOARD = {
  inline_keyboard: [
    [
      { text: "📅 Bugun", callback_data: "r:d" },
      { text: "📅 7 kun", callback_data: "r:w" },
      { text: "📅 30 kun", callback_data: "r:m" },
    ],
    [
      { text: "📊 Butun davr", callback_data: "r:a" },
      { text: "📥 CSV fayl", callback_data: "x:a" },
    ],
  ],
};

const REPORT_PERIODS = { d: "today", w: 7, m: 30, a: null };

function operatorName(user) {
  return user.username ? `@${user.username}` : [user.first_name, user.last_name].filter(Boolean).join(" ");
}

// Batafsil hisobot: avval statistika, keyin har bir ariza alohida ro'yxatda.
async function sendReport(chatId, period) {
  const leads = await readLeads(period);

  await tg("sendMessage", { chat_id: chatId, text: buildReport(leads, period) });

  for (const text of buildLeadList(leads)) {
    await tg("sendMessage", { chat_id: chatId, text });
  }
}

async function sendCsv(chatId, period) {
  const leads = await readLeads(period);
  const form = new FormData();
  form.append("chat_id", String(chatId));
  form.append("caption", `Arizalar: ${leads.length} ta${typeof period === "number" ? `, oxirgi ${period} kun` : ""}`);
  form.append("document", new Blob([buildCsv(leads)], { type: "text/csv" }), "arizalar.csv");
  await tg("sendDocument", form);
}

// Ruxsatsiz joyda javob: egasi o'zi tuzata olishi uchun ID ni ko'rsatamiz.
async function denyAccess(chat, userId) {
  const text =
    chat.type === "private"
      ? `Ruxsat yo'q. Sizning ID raqamingiz: ${userId}\nArizalar guruhining a'zosi bo'lsangiz, ruxsat o'zi beriladi; yoki ID ni bot egasiga yuboring.`
      : `Bu guruhga hisobot berish ruxsat etilmagan. Guruh ID: ${chat.id}\nEgasi uni serverdagi TELEGRAM_ALLOWED_CHATS ga qo'shishi kerak.`;

  await tg("sendMessage", { chat_id: chat.id, text });
}

async function handleStatusButton(query, statusKey) {
  const message = query.message;
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

async function handleButton(query) {
  const message = query.message;
  const [kind, value] = String(query.data ?? "").split(":");

  if (!message || !["s", "r", "x"].includes(kind)) {
    await tg("answerCallbackQuery", { callback_query_id: query.id });
    return;
  }

  if (!(await isAllowed(message.chat, query.from.id))) {
    await tg("answerCallbackQuery", { callback_query_id: query.id, text: "Ruxsat yo'q", show_alert: true });
    return;
  }

  if (kind === "s") {
    const statusKey = statusByCode(value);
    if (statusKey) await handleStatusButton(query, statusKey);
    else await tg("answerCallbackQuery", { callback_query_id: query.id });
    return;
  }

  await tg("answerCallbackQuery", { callback_query_id: query.id });

  if (kind === "r" && value in REPORT_PERIODS) await sendReport(message.chat.id, REPORT_PERIODS[value]);
  if (kind === "x") await sendCsv(message.chat.id, null);
}

async function handleCommand(message) {
  const match = message.text?.match(/^\/(hisobot|kunlik|haftalik|oylik|eksport|start|help)(?:@\w+)?(?:\s+(\d{1,4}))?/i);
  if (!match) return;

  const chat = message.chat;
  if (!(await isAllowed(chat, message.from?.id))) {
    await denyAccess(chat, message.from?.id);
    return;
  }

  const command = match[1].toLowerCase();
  const days = match[2] ? Number(match[2]) : null;

  if (command === "start" || command === "help") {
    await tg("sendMessage", { chat_id: chat.id, text: HELP });
  } else if (command === "hisobot" && !days) {
    await tg("sendMessage", {
      chat_id: chat.id,
      text: buildOverview(await readLeads()),
      reply_markup: REPORT_KEYBOARD,
    });
  } else if (command === "hisobot") {
    await sendReport(chat.id, days);
  } else if (command === "kunlik") {
    await sendReport(chat.id, "today");
  } else if (command === "haftalik") {
    await sendReport(chat.id, 7);
  } else if (command === "oylik") {
    await sendReport(chat.id, 30);
  } else {
    await sendCsv(chat.id, days);
  }
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
