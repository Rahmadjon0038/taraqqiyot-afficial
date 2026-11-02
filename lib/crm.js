import { branchNames, courseNames } from "@/lib/data";
import { logEvent } from "@/lib/leads-log";

// Saytdan tushgan arizani markaz CRM'iga (POST /api/leads/intake) darhol yuboradi.
// Sozlamalar .env da: CRM_INTAKE_URL va CRM_INTAKE_TOKEN (CRM'dagi LEADS_INTAKE_TOKEN bilan bir xil).
// Ikkalasi bo'lmasa, jim o'chiq turadi. Arizaning Telegramga tushishi CRM'ga bog'liq emas.
const ATTEMPT_DELAYS_MS = [0, 2000, 6000];
const REQUEST_TIMEOUT_MS = 8000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// CRM_BRANCH_IDS=davlatobod:1,boburshox:2,chorsu:3  (sayt filiali : CRM dagi filial ID si)
function crmBranchId(branch) {
  for (const pair of String(process.env.CRM_BRANCH_IDS ?? "").split(",")) {
    const [code, id] = pair.split(":").map((part) => part.trim());
    if (code === branch && Number(id) > 0) return Number(id);
  }
  return null;
}

function toCrmPayload({ name, phone, course, vacancyTitle, applicationType, branch, otherCity, lang, source }) {
  const isVacancy = applicationType === "vacancy" || applicationType === "teacher-vacancy";
  const adParts = [source?.utm_source, source?.utm_campaign, source?.utm_content].filter(Boolean);

  const branchId = otherCity ? null : crmBranchId(branch);

  return {
    // Lid mijoz tanlagan filial operatorlariga tushadi. Boshqa shahar yoki moslik yo'q bo'lsa,
    // branch_id yuborilmaydi va CRM standart filialga (LEADS_INTAKE_BRANCH_ID) yozadi.
    ...(branchId ? { branch_id: branchId } : {}),
    full_name: name,
    phone: `+${phone}`,
    inquiry_type: isVacancy ? "Vakansiya" : course ? "Kurs" : "Ariza",
    course: isVacancy ? vacancyTitle || null : course ? (courseNames[course] ?? course) : null,
    branch_label: otherCity ? "Boshqa shahar" : branch ? (branchNames[branch] ?? branch) : null,
    site_lang: lang,
    // Targetdan kelganini CRM'da ko'rish uchun: manba, kampaniya va banner
    note: adParts.length ? `Reklama: ${adParts.join(" · ")}` : null,
  };
}

async function post(url, token, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-leads-token": token },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  return response;
}

// Kutmasdan chaqiriladi (fire-and-forget): mijozga javob CRM'ni kutib turmaydi.
export function sendLeadToCrm(lead) {
  const url = process.env.CRM_INTAKE_URL;
  const token = process.env.CRM_INTAKE_TOKEN;
  if (!url || !token) return;

  const payload = toCrmPayload(lead);

  (async () => {
    let lastError = "";
    for (const delay of ATTEMPT_DELAYS_MS) {
      if (delay) await sleep(delay);
      try {
        const response = await post(url, token, payload);
        if (response.ok) {
          await logEvent({ type: "crm", id: lead.id, ok: true });
          return;
        }
        lastError = `HTTP ${response.status}`;
        // 4xx: so'rov yoki token noto'g'ri, qayta urinish foyda bermaydi
        if (response.status >= 400 && response.status < 500) break;
      } catch (error) {
        lastError = error.name === "TimeoutError" ? "timeout" : error.message;
      }
    }

    console.error(`CRM'ga yuborib bo'lmadi (${lead.id}): ${lastError}`);
    await logEvent({ type: "crm", id: lead.id, ok: false, error: lastError });
  })().catch((error) => console.error("CRM yuborishda kutilmagan xato:", error.message));
}
