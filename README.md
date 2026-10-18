# taraqqiyot-afficial

Taraqqiyot Teaching Center (Namangan) sayti: bosh sahifa, kurslar bo'yicha ariza sahifalari va
arizalarni Telegram guruhiga yuborish. Next.js 16.

## Kompyuterda ishga tushirish

```bash
npm install
cp .env.example .env.local   # TELEGRAM_BOT_TOKEN va TELEGRAM_CHAT_ID ni to'ldiring
npm run dev
```

## Serverga joylash (Docker)

```bash
git clone https://github.com/Rahmadjon0038/taraqqiyot-afficial.git
cd taraqqiyot-afficial
./deploy.sh        # birinchi marta .env yaratadi — to'ldiring va qayta ishga tushiring
```

`.env` ichida: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `SITE_URL` (masalan `https://domen.uz`),
`HOST_PORT` (standart 3800), `BIND_ADDRESS` (standart 127.0.0.1 — nginx orqali).

| Buyruq | Vazifasi |
|---|---|
| `./deploy.sh` | yangi kodni oladi, qayta yig'adi, ishga tushiradi |
| `./deploy.sh logs` | jurnal |
| `./deploy.sh status` | holat |
| `./deploy.sh restart` | qayta ishga tushirish |
| `./deploy.sh stop` | to'xtatish |

Token faqat serverdagi `.env` faylida turadi: git'ga ham, Docker image'ga ham, brauzerga ham chiqmaydi.

## Ma'lumotlarni o'zgartirish

Kurslar, filiallar, sertifikatlar va Instagram videolar ro'yxati — `lib/data.js`.

## Dinamik e'lonlar / karusel

Home page dagi `UpdatesCarousel` e'lonlarni DM platformadagi **Sayt e'lonlari** boshqaruv sahifasidan oladi. Rasmlar o'sha paneldan Cloudflare R2 ga yuklanadi. Marketing saytning server `.env` faylida feed manzilini belgilang:

```bash
ANNOUNCEMENTS_JSON_URL=https://ayubxon-api.inboxcrm.uz/api/announcements
```

Local ishlashda `http://localhost:4100/api/announcements` ni ishlating. `public/announcements.json` backend feed vaqtincha ulanmaganida fallback hisoblanadi. Feed formatiga misol:

```json
{
  "items": [
    {
      "id": "news-01",
      "type": "news",
      "title": "Yangi kurslar ochildi",
      "image": "https://.../banner.png",
      "preview": "Qisqa ta'rif",
      "description": "Batafsil matn",
      "active": true,
      "sort": 1
    },
    {
      "id": "course-01",
      "type": "course",
      "title": "Turk tili",
      "image": "https://.../course.png",
      "course": "turk-tili",
      "active": true,
      "sort": 2
    },
    {
      "id": "vacancy-01",
      "type": "vacancy",
      "title": "O'qituvchi vakansiyasi",
      "image": "https://.../vacancy.png",
      "applicationType": "teacher-vacancy",
      "active": true,
      "sort": 3
    }
  ]
}
```

- `news` turi: faqat fullscreen modal ochiladi, ariza tugmasi chiqmaydi.
- `course` turi: kursga yo'naltirish bo'ladi (`/ariza?course=...`).
- `vacancy` turi: lavozim nomi (`title`) bilan vakansiya formasiga yo'naltiriladi.
- `targetUrl` bo'lsa, uni override sifatida ishlatish mumkin.
- `sort` bo'yicha karusel tartibi aniqlanadi.

## Arizalar va operator tugmalari

Har bir ariza Telegram guruhiga tushadi. Xabar tagida tugmalar bor: **⏳ Keladi · 🎓 Keldi · 📞 Javob bermadi · ❌ Kelmaydi**.
Operator bosganda xabar o'zgaradi ("📌 Holat: 🎓 Keldi — @operator") va holat serverdagi jurnalga yoziladi.
Holatni keyin boshqasiga almashtirish mumkin: oxirgisi hisoblanadi.

Buyruqlar (arizalar guruhida va botga shaxsiy yozganda ishlaydi):

| Buyruq | Nima qiladi |
|---|---|
| `/hisobot` | **bugun, 7 kun va 30 kun** bitta xabarda + tugmalar: batafsil (filial, kurs, kampaniya) va CSV |
| `/kunlik` · `/haftalik` · `/oylik` | bugun / 7 kun / 30 kun uchun batafsil hisobot |
| `/hisobot 14` | oxirgi 14 kun (istalgan son) |
| `/eksport` · `/eksport 30` | arizalar CSV fayl (Excel / Sheets'da ochiladi) |

Kim foydalana oladi: arizalar guruhi, `TELEGRAM_ALLOWED_CHATS` dagi guruhlar va arizalar guruhining a'zolari
(botga shaxsiy yozganda). Begona guruhga qo'shilgan bot hisobot bermaydi, chunki hisobotda mijozlar telefoni bor.

### Birinchi marta sozlash (serverda, bir marta)

1. `.env` ga `TELEGRAM_WEBHOOK_SECRET` yozing (`openssl rand -hex 24` bilan hosil qilish mumkin).
2. `./deploy.sh` ni ishga tushiring.
3. Telegram'ga manzilni ro'yxatdan o'tkazing:

```bash
set -a && . ./.env && set +a && curl -s "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" \
  -d "url=$SITE_URL/api/telegram" -d "secret_token=$TELEGRAM_WEBHOOK_SECRET" \
  -d 'allowed_updates=["callback_query","message"]'
```

`{"ok":true,...}` chiqsa, tayyor. Telegram'dagi "/" menyusida buyruqlar ko'rinishi uchun (ixtiyoriy):

```bash
curl -s "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setMyCommands" -d 'commands=[{"command":"hisobot","description":"Bugun, 7 va 30 kunlik hisobot"},{"command":"kunlik","description":"Bugungi hisobot"},{"command":"haftalik","description":"Oxirgi 7 kun"},{"command":"oylik","description":"Oxirgi 30 kun"},{"command":"eksport","description":"Arizalar CSV fayl"}]'
```
 Jurnal fayl `leads-data` volume'ida (`/data/leads.jsonl`) turadi va qayta yig'ilganda yo'qolmaydi.

### Reklamadan qaysi ariza kelganini bilish

Reklama havolasiga `utm_campaign` qo'shing, masalan:
`https://taraqqiyot-official.uz/davlatobod/turk-tili?utm_source=facebook&utm_campaign=turk-oktyabr`
Ariza xabarida manba parametrlari `utm_source=facebook · utm_campaign=turk-oktyabr` ko'rinishida chiqadi.

Bir xil telefon raqami bilan ayni filial va kursga avval ariza yuborilgan bo'lsa, yangi ariza qabul qilinmaydi. Tekshiruv arizalar jurnalidagi barcha yozuvlar bo'yicha amalga oshadi; boshqa filial yoki boshqa kursga ariza yuborish mumkin. Tizim odamni telefon raqami orqali aniqlaydi, shuning uchun boshqa raqam ishlatilsa, takroriy ariza aniqlanmaydi.

### Meta Pixel tekshiruvi

- Events Manager > Data Sources > Settings > Domains da `taraqqiyot-official.uz` ni verify qiling, keyin AEM da `Lead` ni 1-priority qiling.
- Test uchun Events Manager > Test events bo'limini ochiq qoldirib, saytda ariza muvaffaqiyatli yuboring. `Lead` eventi `Processed` holatida, `branch`, `course`, `language` va `content_category` parametrlarini olganini tekshiring. Sayt brauzeridan kelgan eventda `TEST73435` kodini kodga qo'shish shart emas; bu kod Meta ko'rsatgan test server eventlari/CAPI so'roviga qo'shiladi.
- Meta Pixel Helper extension'ida saytni ochganda bitta `PageView`, ariza sahifasiga kirganda `ViewContent`, arizani muvaffaqiyatli yuborganda bitta `Lead` ko'rinishini tekshiring. `Lead` tafsilotlarida filial va kurs parametrlarini ko'ring.
- Hozirgi tracking formadagi ism yoki telefonni Meta Pixel'ga yubormaydi. Automatic Advanced Matching'ni faqat tegishli foydalanuvchi roziligi va maxfiylik xabarnomasi mavjud bo'lganda yoqing.
- `app/api/capi/route.js` hozircha ishlamaydigan tayyorlov stub'i; u Meta'ga event yubormaydi. CAPI ishga tushirilganda browser `eventID` bilan bir xil server `event_id` yuborilib, deduplication sozlanishi kerak.
