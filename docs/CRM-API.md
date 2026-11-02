# CRM integratsiyasi: Taraqqiyot sayti API qo'llanmasi

> **Joriy ulanish (markaz CRM'i):** ariza tushishi bilan sayt uni CRM'ning `POST /api/leads/intake` manziliga o'zi yuboradi
> (`x-leads-token` bilan). Sozlash: saytning `.env` ida `CRM_INTAKE_URL` va `CRM_INTAKE_TOKEN` (CRM'dagi `LEADS_INTAKE_TOKEN`
> bilan bir xil). CRM xato qaytarsa, sayt 3 marta qayta uriladi; ariza baribir Telegramga tushadi va saytning jurnalida saqlanadi.
> Quyidagi `GET`/`POST` API'lar tashqi tizimlar uchun va zaxira sifatida qoladi.

Saytdagi forma orqali tushgan arizalarni (lidlarni) CRM'ga olish va CRM'da operator belgilagan holatni ("keldi", "kelmaydi"...) saytga qaytarish uchun API.

- **Asosiy manzil:** `https://taraqqiyot-official.uz`
- **Himoya:** har bir so'rovda `X-API-Key: <kalit>` sarlavhasi.
- **Format:** JSON, UTF-8. Vaqtlar ISO 8601, UTC (masalan `2026-11-02T10:05:00.000Z`).
- **Kalitni olish:** saytning serverida `./deploy.sh crm-key` (kalit `.env` dagi `CRM_API_KEY`). Uni faqat CRM serveringizda saqlang, brauzer yoki ochiq kodga qo'ymang.

## Umumiy ish tartibi

1. CRM har 1–5 daqiqada `GET /api/crm/leads?since=<oxirgi next>` ni chaqiradi.
2. Kelgan har bir arizani `id` bo'yicha **yaratadi yoki yangilaydi** (upsert). Holati o'zgargan ariza ham qayta keladi.
3. Javobdagi `next` qiymatini saqlab qo'yadi, keyingi so'rovda `since` qilib yuboradi.
4. Operator CRM'da holatni o'zgartirsa, CRM `POST /api/crm/leads/status` ni chaqiradi.

## 1. Arizalar ro'yxati

```
GET /api/crm/leads
```

| Parametr | Majburiy | Ma'nosi |
|---|---|---|
| `since` | yo'q | ISO 8601 vaqt. Shundan **keyin** yangi kelgan yoki holati o'zgargan arizalar qaytadi. Berilmasa, barcha arizalar |
| `limit` | yo'q | 1–500, standart 100 |

Arizalar `updatedAt` bo'yicha eskidan yangiga tartiblangan.

```bash
curl -H "X-API-Key: KALIT" \
  "https://taraqqiyot-official.uz/api/crm/leads?since=2026-11-01T00:00:00Z&limit=100"
```

Javob:

```json
{
  "leads": [
    {
      "id": "-1003652682355:128",
      "createdAt": "2026-11-02T10:00:00.000Z",
      "updatedAt": "2026-11-02T11:00:00.000Z",
      "name": "Ali",
      "phone": "+998901112233",
      "type": "course",
      "course": "turk-tili",
      "courseName": "Turk tili",
      "vacancyTitle": null,
      "branch": "chorsu",
      "branchName": "Chorsu",
      "otherCity": false,
      "language": "uz",
      "source": { "utm_source": "meta", "utm_campaign": "turk_davlatobod_test" },
      "status": "keldi",
      "statusAt": "2026-11-02T11:00:00.000Z",
      "statusBy": "Operator Ali"
    }
  ],
  "next": "2026-11-02T11:00:00.000Z"
}
```

### Maydonlar

| Maydon | Turi | Ma'nosi |
|---|---|---|
| `id` | matn | Arizaning noyob ID si (`<chat>:<xabar>` ko'rinishida). CRM'da shu bo'yicha qidiring. Matn sifatida saqlang, ichida `:` bor |
| `createdAt` | vaqt | Ariza qoldirilgan vaqt |
| `updatedAt` | vaqt | Oxirgi o'zgarish: yangi ariza yoki holat o'zgargan vaqt |
| `name` | matn | Mijoz kiritgan ism |
| `phone` | matn | Telefon, `+998XXXXXXXXX` formatida |
| `type` | matn | `course` (kursga ariza), `vacancy` (ish arizasi), `general` (umumiy ariza) |
| `course` / `courseName` | matn yoki `null` | Kurs kodi (`turk-tili`) va nomi ("Turk tili") |
| `vacancyTitle` | matn yoki `null` | Vakansiya nomi, masalan "IT teacher" |
| `branch` / `branchName` | matn yoki `null` | Filial kodi (`davlatobod`, `boburshox`, `chorsu`) va nomi |
| `otherCity` | mantiqiy | `true`: mijoz Namangandan tashqarida va markazga borib o'qiy oladi (shunda `branch` `null`) |
| `language` | matn | Ariza qoldirilgan sayt tili: `uz`, `ru`, `en` |
| `source` | obyekt | Reklama manbasi: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `fbclid`, `gclid`. Reklamasiz kelsa `{}` |
| `status` | matn yoki `null` | Operator belgilagan holat (pastga qarang). Belgilanmagan bo'lsa `null` |
| `statusAt` / `statusBy` | vaqt / matn | Holat qachon va kim tomonidan belgilangan |

### Holatlar

| Kod | Ma'nosi |
|---|---|
| `keladi` | ⏳ Keladi |
| `javob` | 📞 Javob bermadi |
| `kelmaydi` | ❌ Kelmaydi |
| `keldi` | 🎓 Keldi (o'qishga keldi) |

## 2. Holatni belgilash

```
POST /api/crm/leads/status
Content-Type: application/json
```

```json
{ "id": "-1003652682355:128", "status": "keldi", "by": "Operator Ali" }
```

| Maydon | Majburiy | Ma'nosi |
|---|---|---|
| `id` | ha | `GET /api/crm/leads` dan olingan ariza ID si |
| `status` | ha | `keladi`, `javob`, `kelmaydi` yoki `keldi` |
| `by` | yo'q | Kim belgilagani (Telegramdagi xabarda ko'rinadi). Yozilmasa "CRM" |

```bash
curl -X POST "https://taraqqiyot-official.uz/api/crm/leads/status" \
  -H "X-API-Key: KALIT" -H "Content-Type: application/json" \
  -d '{"id":"-1003652682355:128","status":"keldi","by":"Operator Ali"}'
```

Javob:

```json
{ "ok": true, "id": "-1003652682355:128", "status": "keldi", "changed": true, "telegramUpdated": true }
```

- `changed: false`: ariza allaqachon shu holatda edi, hech narsa o'zgarmadi.
- `telegramUpdated: false`: holat saqlandi, lekin Telegramdagi xabarni yangilab bo'lmadi (bu xato emas).

Holat belgilanganda: jurnalga yoziladi (Telegram `/hisobot` shuni hisoblaydi), Telegram guruhidagi xabar yangilanadi, keyingi `GET` shu holatni qaytaradi.

## Xato kodlari

| Kod | Javob | Sabab |
|---|---|---|
| `401` | `{"error":"unauthorized"}` | `X-API-Key` yo'q yoki noto'g'ri |
| `503` | `{"error":"not_configured"}` | Serverda `CRM_API_KEY` sozlanmagan |
| `400` | `{"error":"invalid_since"}` | `since` yaroqsiz vaqt |
| `400` | `{"error":"invalid_status","allowed":[...]}` | `status` ruxsat etilmagan |
| `400` | `{"error":"invalid_json"}` | So'rov tanasi JSON emas |
| `404` | `{"error":"not_found"}` | Bunday `id` li ariza yo'q |

## Misol: CRM tomonida sinxronlash (Node.js)

```js
const BASE = "https://taraqqiyot-official.uz";
const KEY = process.env.TARAQQIYOT_API_KEY;

// since ni o'zingizning bazangizda saqlang (birinchi marta bo'sh)
async function sync(since) {
  const url = new URL("/api/crm/leads", BASE);
  if (since) url.searchParams.set("since", since);

  const res = await fetch(url, { headers: { "X-API-Key": KEY } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const { leads, next } = await res.json();

  for (const lead of leads) {
    await upsertLeadInCrm(lead.id, lead); // id bo'yicha yaratish yoki yangilash
  }
  return next ?? since; // keyingi safar since sifatida ishlating
}

async function setStatus(id, status, by) {
  const res = await fetch(`${BASE}/api/crm/leads/status`, {
    method: "POST",
    headers: { "X-API-Key": KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ id, status, by }),
  });
  return res.json();
}
```

## Muhim qoidalar

- **Upsert qiling:** ariza holati o'zgarganda qayta keladi. `id` bo'yicha mavjudini yangilang, yangi nusxa qo'shmang.
- **`since` ni faqat muvaffaqiyatli saqlangandan keyin yangilang:** xato bo'lsa, eskisi bilan qayta so'rang, hech narsa yo'qolmaydi.
- Bir arizani CRM'da ham, Telegram tugmalari orqali ham belgilash mumkin. Oxirgi belgilangan holat amal qiladi.
- Saytda bir xil raqam, filial va kursga takroriy ariza qabul qilinmaydi, shuning uchun CRM'da dublikat kamdan-kam bo'ladi.
- Kalit sizib chiqqan bo'lsa: serverdagi `.env` dan `CRM_API_KEY=` qatorini o'chiring va `./deploy.sh` ni qayta ishga tushiring, yangi kalit yaratiladi.

## Tekshirish

1. Serverda: `./deploy.sh crm-key`, kalitni oling.
2. `curl -H "X-API-Key: KALIT" https://taraqqiyot-official.uz/api/crm/leads?limit=1`: ariza chiqsa, ulanish ishlayapti.
3. Saytdan test ariza yuboring, so'ng `since` bilan so'rab, uning kelganini ko'ring.
4. `POST /api/crm/leads/status` bilan holat belgilang, Telegram xabari yangilanganini tekshiring.
