// Telegram Bot API bilan ishlash uchun umumiy yordamchilar (faqat serverda ishlatiladi).

// Operator bosadigan holatlar. code — tugma ichiga yoziladigan qisqa belgi.
export const STATUSES = {
  keladi: { code: "k", label: "⏳ Keladi" },
  javob: { code: "j", label: "📞 Javob bermadi" },
  kelmaydi: { code: "n", label: "❌ Kelmaydi" },
  keldi: { code: "d", label: "🎓 Keldi" },
};

export const STATUS_PREFIX = "📌 Holat:";

export function statusByCode(code) {
  return Object.entries(STATUSES).find(([, value]) => value.code === code)?.[0] ?? null;
}

// Xabar tagidagi tugmalar. Tanlangani ✔ belgisi bilan ko'rinadi.
export function keyboard(selected = null) {
  const button = (key) => ({
    text: `${selected === key ? "✔ " : ""}${STATUSES[key].label}`,
    callback_data: `s:${STATUSES[key].code}`,
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

// Foydalanuvchi ro'yxatdagi guruhda yoki administratorlar ro'yxatida ekanini tekshiradi.
export function isAllowed(chatId, userId) {
  if (String(chatId) === chatIdFromEnv()) return true;

  const admins = String(process.env.TELEGRAM_ADMIN_IDS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  return admins.includes(String(userId));
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
