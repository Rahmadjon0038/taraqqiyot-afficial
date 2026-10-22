// Telegram Bot API bilan ishlash uchun umumiy yordamchilar (faqat serverda ishlatiladi).

// Operator bosadigan holatlar. code — tugma ichiga yoziladigan qisqa belgi.
export const STATUSES = {
  keladi: { code: "k", label: "⏳ Keladi", style: "primary" },
  javob: { code: "j", label: "📞 Javob bermadi" },
  kelmaydi: { code: "n", label: "❌ Kelmaydi", style: "danger" },
  keldi: { code: "d", label: "🎓 Keldi", style: "success" },
};

export const STATUS_PREFIX = "📌 Holat:";

export function statusByCode(code) {
  return Object.entries(STATUSES).find(([, value]) => value.code === code)?.[0] ?? null;
}

// Xabar tagidagi tugmalar. Tanlangani ✔ belgisi bilan ko'rinadi.
// style — tugma rangi (Bot API 9.4): primary = ko'k, success = yashil, danger = qizil; yo'q bo'lsa kulrang.
export function keyboard(selected = null) {
  const button = (key) => ({
    text: `${selected === key ? "✔ " : ""}${STATUSES[key].label}`,
    callback_data: `s:${STATUSES[key].code}`,
    ...(STATUSES[key].style ? { style: STATUSES[key].style } : {}),
  });

  return {
    inline_keyboard: [
      [button("keladi"), button("keldi")],
      [button("javob"), button("kelmaydi")],
    ],
  };
}

export function chatIdFromEnv() {
  return String(process.env.TELEGRAM_CHAT_ID ?? "");
}

function listFromEnv(name) {
  return String(process.env[name] ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

// Botni istalgan odam o'z guruhiga qo'sha oladi, shuning uchun hisobotni faqat ruxsat berilgan
// joylarga beramiz (hisobotda va CSV faylda mijozlarning telefon raqamlari bor):
//  - arizalar guruhi (TELEGRAM_CHAT_ID) va qo'shimcha guruhlar (TELEGRAM_ALLOWED_CHATS);
//  - botga shaxsiy yozganda: arizalar guruhining a'zosi yoki TELEGRAM_ADMIN_IDS ro'yxatidagi odam.
export async function isAllowed(chat, userId) {
  const chatId = String(chat.id);
  if (chatId === chatIdFromEnv() || listFromEnv("TELEGRAM_ALLOWED_CHATS").includes(chatId)) return true;
  if (chat.type !== "private") return false;
  if (listFromEnv("TELEGRAM_ADMIN_IDS").includes(String(userId))) return true;

  const member = await tg("getChatMember", { chat_id: chatIdFromEnv(), user_id: userId });
  return member.ok && ["creator", "administrator", "member"].includes(member.result.status);
}

export function tashkentTime(date = new Date(), full = false) {
  return date.toLocaleString("ru-RU", {
    timeZone: "Asia/Tashkent",
    ...(full ? {} : { hour: "2-digit", minute: "2-digit" }),
  });
}

// Telegram'ga so'rov. Muvaffaqiyatsiz bo'lsa { ok: false } qaytaradi, xato tashlamaydi.
export async function tg(method, payload) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return { ok: false, description: "token yo'q" };

  const isForm = payload instanceof FormData;

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: "POST",
      headers: isForm ? undefined : { "Content-Type": "application/json" },
      body: isForm ? payload : JSON.stringify(payload),
    });
    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.ok) {
      return { ok: false, status: response.status, description: data?.description ?? "noma'lum xato" };
    }

    return { ok: true, result: data.result };
  } catch (error) {
    return { ok: false, description: error.message };
  }
}
