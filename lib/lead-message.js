import { applicationTypes, branchNames, courseNames } from "@/lib/data";
import { tashkentTime } from "@/lib/telegram";

// Telegram guruhiga tushadigan ariza xabari. Saytdan ariza kelganda ham, CRM holat belgilab
// xabarni qayta yozganda ham shu funksiya ishlatiladi, shuning uchun ko'rinishi bir xil bo'ladi.
export function buildLeadText({ name, phone, course, applicationType, vacancyTitle, branch, otherCity, lang, at }) {
  const lines = ["🆕 Yangi leads", "", `👤 Ism: ${name}`, `📞 Telefon: +${phone}`];
  if (applicationType) lines.push(`🎯 Murojaat: ${applicationTypes[applicationType].name}`);
  if (vacancyTitle) lines.push(`📌 Lavozim: ${vacancyTitle}`);
  if (course) lines.push(`📚 Kurs: ${courseNames[course]}`);
  if (otherCity) {
    lines.push("📍 Boshqa shahardan (borib o'qiy oladi)");
  } else if (branch) {
    lines.push(`📍 Filial: ${branchNames[branch]}`);
  }
  if (lang && lang !== "uz") lines.push(`🌐 Sayt tili: ${lang === "ru" ? "Ruscha" : "Inglizcha"}`);
  lines.push(`🕒 ${tashkentTime(at ? new Date(at) : new Date(), true)}`);
  return lines.join("\n");
}
