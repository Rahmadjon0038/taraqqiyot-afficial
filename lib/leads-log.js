import { promises as fs } from "node:fs";
import path from "node:path";
import { branchNames, courseNames } from "@/lib/data";
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

// Voqealarni arizalar ro'yxatiga aylantiradi: har bir arizada oxirgi holat bo'ladi.
export async function readLeads(days = null) {
  const leads = new Map();

  for (const event of await readEvents()) {
    if (event.type === "lead") {
      leads.set(event.id, { ...event, status: null, statusAt: null, statusBy: null });
    } else if (event.type === "status") {
      const lead = leads.get(event.id);
      if (lead) Object.assign(lead, { status: event.status, statusAt: event.at, statusBy: event.by });
    }
  }

  const since = days ? Date.now() - days * 24 * 60 * 60 * 1000 : 0;
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
      return `• ${nameOf(key)}: ${c.total} ariza · 🎓 ${c.keldi} (${pct(c.keldi, c.total)})`;
    });
}

export function buildReport(leads, days) {
  const c = counts(leads);
  const period = days ? `oxirgi ${days} kun` : "butun davr";

  if (!c.total) return `📊 Hisobot — ${period}\n\nBu davrda ariza yo'q.`;

  const lines = [
    `📊 Hisobot — ${period}`,
    "",
    `Jami ariza: ${c.total}`,
    "",
    `🎓 Keldi: ${c.keldi}`,
    `⏳ Keladi: ${c.keladi}`,
    `📞 Javob bermadi: ${c.javob}`,
    `❌ Kelmaydi: ${c.kelmaydi}`,
    `⚪ Belgilanmagan: ${c.none}`,
    "",
    `Ariza → keldi: ${pct(c.keldi, c.total)}`,
  ];

  const byBranch = group(
    leads,
    (lead) => (lead.otherCity ? "other" : lead.branch),
    (key) => (key === "other" ? "Boshqa shahar" : (branchNames[key] ?? key))
  );
  if (byBranch.length) lines.push("", "Filiallar bo'yicha:", ...byBranch);

  const byCourse = group(leads, (lead) => lead.course, (key) => courseNames[key] ?? key);
  if (byCourse.length) lines.push("", "Kurslar bo'yicha:", ...byCourse);

  const byCampaign = group(leads, (lead) => lead.source?.utm_campaign, (key) => key);
  if (byCampaign.length) lines.push("", "Reklama kampaniyalari bo'yicha:", ...byCampaign);

  return lines.join("\n");
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n;]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

// Excel va Google Sheets'da o'zbekcha harflar to'g'ri ochilishi uchun fayl BOM bilan boshlanadi.
export function buildCsv(leads) {
  const header = ["ID", "Sana", "Ism", "Telefon", "Filial", "Kurs", "Sayt tili", "Kampaniya", "Manba", "Holat", "Holat vaqti", "Belgilagan"];

  const rows = leads.map((lead) => [
    lead.id,
    tashkentTime(new Date(lead.at), true),
    lead.name,
    `+${lead.phone}`,
    lead.otherCity ? "Boshqa shahar" : (branchNames[lead.branch] ?? ""),
    courseNames[lead.course] ?? "",
    lead.lang ?? "uz",
    lead.source?.utm_campaign ?? "",
    lead.source?.utm_source ?? "",
    lead.status ? STATUSES[lead.status].label : "",
    lead.statusAt ? tashkentTime(new Date(lead.statusAt), true) : "",
    lead.statusBy ?? "",
  ]);

  return `﻿${[header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n")}\n`;
}
