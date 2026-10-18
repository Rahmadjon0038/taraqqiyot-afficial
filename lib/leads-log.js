import { promises as fs } from "node:fs";
import path from "node:path";
import { applicationTypes, branchNames, courseNames } from "@/lib/data";
import { STATUSES, tashkentTime } from "@/lib/telegram";

// Arizalar va operator belgilagan holatlar jurnali: har bir voqea alohida qatorda (JSON).
// Docker'da bu fayl doimiy "volume" ichida turadi, shuning uchun qayta yig'ilganda yo'qolmaydi.
// Yo'l loyiha fayllariga tegishli emas (ish vaqtida beriladi), shuning uchun quyida
// turbopackIgnore belgisi bor: aks holda Next butun loyihani serverga qo'shib yuboradi.
const FILE = process.env.LEADS_LOG || path.join(/*turbopackIgnore: true*/ process.cwd(), ".data", "leads.jsonl");

// Jurnalga yozishda xato bo'lsa, ariza yo'qolmasligi kerak: xatoni faqat jurnalga chiqaramiz.
export async function logEvent(event) {
  try {
    await fs.mkdir(/*turbopackIgnore: true*/ path.dirname(FILE), { recursive: true });
    await fs.appendFile(/*turbopackIgnore: true*/ FILE, `${JSON.stringify({ at: new Date().toISOString(), ...event })}\n`);
  } catch (error) {
    console.error("Jurnalga yozib bo'lmadi:", error.message);
  }
}

async function readEvents() {
  try {
    const text = await fs.readFile(/*turbopackIgnore: true*/ FILE, "utf8");
    return text
      .split("\n")
      .filter(Boolean)
      .flatMap((line) => {
        try {
          return [JSON.parse(line)];
        } catch {
          return [];
        }
      });
  } catch {
    return [];
  }
}

const TASHKENT_OFFSET_MS = 5 * 60 * 60 * 1000;

// Davr boshlanishi (millisekund). "today" — Toshkent vaqti bilan bugun 00:00, son — oxirgi N kun.
export function periodStart(period) {
  if (period === "today") {
    const shifted = Date.now() + TASHKENT_OFFSET_MS;
    return shifted - (shifted % (24 * 60 * 60 * 1000)) - TASHKENT_OFFSET_MS;
  }
  if (typeof period === "number" && period > 0) return Date.now() - period * 24 * 60 * 60 * 1000;
  return 0;
}

// Voqealarni arizalar ro'yxatiga aylantiradi: har bir arizada oxirgi holat bo'ladi.
export async function readLeads(period = null) {
  const leads = new Map();

  for (const event of await readEvents()) {
    if (event.type === "lead") {
      leads.set(event.id, { ...event, status: null, statusAt: null, statusBy: null });
    } else if (event.type === "status") {
      const lead = leads.get(event.id);
      if (lead) Object.assign(lead, { status: event.status, statusAt: event.at, statusBy: event.by });
    }
  }

  const since = periodStart(period);
  return [...leads.values()].filter((lead) => new Date(lead.at).getTime() >= since);
}

function pct(part, total) {
  return total ? `${Math.round((part / total) * 100)}%` : "0%";
}

function counts(leads) {
  const result = { total: leads.length, none: 0 };
  for (const key of Object.keys(STATUSES)) result[key] = 0;
  for (const lead of leads) result[lead.status ?? "none"] += 1;
  return result;
}

function group(leads, keyOf, nameOf) {
  const groups = new Map();
  for (const lead of leads) {
    const key = keyOf(lead);
    if (!key) continue;
    groups.set(key, [...(groups.get(key) ?? []), lead]);
  }

  return [...groups.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 10)
    .map(([key, items]) => {
      const c = counts(items);
      return `• ${nameOf(key)} — ${c.total} ta ariza, ${c.keldi} tasi keldi (${pct(c.keldi, c.total)})`;
    });
}

export const PERIOD_TITLES = {
  today: "bugun",
  7: "oxirgi 7 kun",
  30: "oxirgi 30 kun",
  all: "butun davr",
};

export function periodTitle(period) {
  return typeof period === "number" && !PERIOD_TITLES[period] ? `oxirgi ${period} kun` : (PERIOD_TITLES[period ?? "all"] ?? "butun davr");
}

// Holatlar ro'yxati: har bir qator so'z bilan yoziladi, belgi faqat bezak.
function statusRows(c) {
  return [
    `🎓 Keldi (markazga kelgan): ${c.keldi}`,
    `⏳ Keladi (kelishini aytgan): ${c.keladi}`,
    `📞 Javob bermadi (telefonni ko'tarmagan): ${c.javob}`,
    `❌ Kelmaydi (rad etgan): ${c.kelmaydi}`,
    `⚪ Hali belgilanmagan: ${c.none}`,
  ];
}

function resultLine(c) {
  return `Natija: ${c.total} ta arizadan ${c.keldi} tasi keldi (${pct(c.keldi, c.total)})`;
}

// Bosh hisobotdagi bitta davr bloki.
function periodBlock(heading, leads) {
  const c = counts(leads);
  if (!c.total) return [`📅 ${heading}`, "Ariza bo'lmagan."];

  return [`📅 ${heading} — ${c.total} ta ariza`, ...statusRows(c), resultLine(c)];
}

// /hisobot: bugun, 7 kun va 30 kun bitta xabarda.
export function buildOverview(allLeads) {
  const since = (period) => allLeads.filter((lead) => new Date(lead.at).getTime() >= periodStart(period));
  const divider = "──────────────";

  return [
    `📊 Arizalar hisoboti — ${tashkentTime(new Date(), true).split(",")[0]}`,
    "",
    ...periodBlock("BUGUN", since("today")),
    "",
    divider,
    ...periodBlock("OXIRGI 7 KUN", since(7)),
    "",
    divider,
    ...periodBlock("OXIRGI 30 KUN", since(30)),
    "",
    "Filial, kurs va reklama bo'yicha batafsil ko'rish uchun pastdagi tugmalarni bosing.",
  ].join("\n");
}

// Batafsil hisobot: holatlar, filiallar, kurslar va reklama kampaniyalari bo'yicha.
export function buildReport(leads, period) {
  const c = counts(leads);
  const title = periodTitle(period).toUpperCase();

  if (!c.total) return `📊 Hisobot — ${title}\n\nBu davrda ariza bo'lmagan.`;

  const lines = [`📊 Batafsil hisobot — ${title}`, "", `Jami: ${c.total} ta ariza`, ...statusRows(c), "", resultLine(c)];

  const byBranch = group(
    leads,
    (lead) => (lead.otherCity ? "other" : lead.branch),
    (key) => (key === "other" ? "Boshqa shahar" : (branchNames[key] ?? key))
  );
  if (byBranch.length) lines.push("", "📍 Filiallar bo'yicha:", ...byBranch);

  const byCourse = group(leads, (lead) => lead.course, (key) => courseNames[key] ?? key);
  if (byCourse.length) lines.push("", "📚 Kurslar bo'yicha:", ...byCourse);

  const byApplication = group(
    leads,
    (lead) => lead.applicationType,
    (key) => applicationTypes[key]?.name ?? key
  );
  if (byApplication.length) lines.push("", "🎯 Murojaat yo'nalishi bo'yicha:", ...byApplication);

  const byCampaign = group(leads, (lead) => lead.source?.utm_campaign, (key) => key);
  if (byCampaign.length) lines.push("", "📣 Reklama kampaniyalari bo'yicha:", ...byCampaign);

  return lines.join("\n");
}

function dateTime(iso) {
  return new Date(iso).toLocaleString("ru-RU", {
    timeZone: "Asia/Tashkent",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// +998901234567 -> +998 90 123 45 67
function formatPhone(phone) {
  const m = String(phone).match(/^(998)(\d{2})(\d{3})(\d{2})(\d{2})$/);
  return m ? `+${m[1]} ${m[2]} ${m[3]} ${m[4]} ${m[5]}` : `+${phone}`;
}

const LIST_LIMIT = 30;
const CHUNK_LIMIT = 3500;

function leadBlock(lead, number) {
  const place = lead.otherCity ? "Boshqa shahar" : (branchNames[lead.branch] ?? "—");
  const status = lead.status
    ? `${STATUSES[lead.status].label}${lead.statusBy ? ` — ${lead.statusBy}` : ""}`
    : "⚪ Hali belgilanmagan";

  return [
    `${number}. ${lead.name} — ${formatPhone(lead.phone)}`,
    ...(lead.applicationType ? [`   🎯 Murojaat: ${applicationTypes[lead.applicationType]?.name ?? lead.applicationType}`] : []),
    `   📚 ${courseNames[lead.course] ?? "Kurs tanlanmagan"} · 📍 ${place}`,
    `   🕒 Ariza qoldirgan: ${dateTime(lead.at)}`,
    `   📌 Holat: ${status}`,
    ...(lead.source?.utm_campaign ? [`   📣 Reklama: ${lead.source.utm_campaign}`] : []),
  ].join("\n");
}

// Har bir ariza alohida: ism, telefon, kurs, filial, qachon qoldirgani va holati.
// Eng yangisi birinchi. Telegram bitta xabarga ~4000 belgi sig'diradi, shuning uchun bir nechta xabarga bo'linadi.
export function buildLeadList(leads) {
  if (!leads.length) return [];

  const newest = [...leads].sort((a, b) => new Date(b.at) - new Date(a.at));
  const shown = newest.slice(0, LIST_LIMIT);
  const hidden = newest.length - shown.length;

  const chunks = [];
  let current = `📋 Arizalar ro'yxati (${shown.length} ta${hidden ? `, eng yangisi` : ""}):`;

  shown.forEach((lead, index) => {
    const block = leadBlock(lead, index + 1);
    if (current.length + block.length + 2 > CHUNK_LIMIT) {
      chunks.push(current);
      current = "";
    }
    current += `${current ? "\n\n" : ""}${block}`;
  });

  if (hidden) {
    current += `\n\n… yana ${hidden} ta ariza bor. Hammasini ko'rish uchun /eksport (CSV fayl).`;
  }

  chunks.push(current);
  return chunks;
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n;]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

// Excel va Google Sheets'da o'zbekcha harflar to'g'ri ochilishi uchun fayl BOM bilan boshlanadi.
export function buildCsv(leads) {
  const header = ["ID", "Sana", "Ism", "Telefon", "Filial", "Kurs", "Ariza yo'nalishi", "Sayt tili", "Kampaniya", "Manba", "Holat", "Holat vaqti", "Belgilagan"];

  const rows = leads.map((lead) => [
    lead.id,
    tashkentTime(new Date(lead.at), true),
    lead.name,
    `+${lead.phone}`,
    lead.otherCity ? "Boshqa shahar" : (branchNames[lead.branch] ?? ""),
    courseNames[lead.course] ?? "",
    applicationTypes[lead.applicationType]?.name ?? "",
    lead.lang ?? "uz",
    lead.source?.utm_campaign ?? "",
    lead.source?.utm_source ?? "",
    lead.status ? STATUSES[lead.status].label : "",
    lead.statusAt ? tashkentTime(new Date(lead.statusAt), true) : "",
    lead.statusBy ?? "",
  ]);

  return `﻿${[header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n")}\n`;
}
