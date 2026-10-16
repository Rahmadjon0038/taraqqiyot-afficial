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

## Arizalar va operator tugmalari

Har bir ariza Telegram guruhiga tushadi. Xabar tagida tugmalar bor: **⏳ Keladi · 🎓 Keldi · 📞 Javob bermadi · ❌ Kelmaydi**.
Operator bosganda xabar o'zgaradi ("📌 Holat: 🎓 Keldi — @operator") va holat serverdagi jurnalga yoziladi.
Holatni keyin boshqasiga almashtirish mumkin: oxirgisi hisoblanadi.

Guruhda buyruqlar:

| Buyruq | Nima qiladi |
|---|---|
| `/hisobot` | arizalar, holatlar, filial, kurs va reklama kampaniyasi bo'yicha hisobot |
| `/hisobot 7` | faqat oxirgi 7 kun |
| `/eksport` | barcha arizalar CSV fayl (Excel / Sheets'da ochiladi) |
| `/eksport 30` | oxirgi 30 kun |

### Birinchi marta sozlash (serverda, bir marta)

1. `.env` ga `TELEGRAM_WEBHOOK_SECRET` yozing (`openssl rand -hex 24` bilan hosil qilish mumkin).
2. `./deploy.sh` ni ishga tushiring.
3. Telegram'ga manzilni ro'yxatdan o'tkazing:

```bash
set -a && . ./.env && set +a && curl -s "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" \
  -d "url=$SITE_URL/api/telegram" -d "secret_token=$TELEGRAM_WEBHOOK_SECRET" \
  -d 'allowed_updates=["callback_query","message"]'
```

`{"ok":true,...}` chiqsa, tayyor. Jurnal fayl `leads-data` volume'ida (`/data/leads.jsonl`) turadi va qayta yig'ilganda yo'qolmaydi.

### Reklamadan qaysi ariza kelganini bilish

Reklama havolasiga `utm_campaign` qo'shing, masalan:
`https://taraqqiyot-official.uz/davlatobod/turk-tili?utm_source=facebook&utm_campaign=turk-oktyabr`
Ariza xabarida "📣 Reklama: turk-oktyabr · facebook" chiqadi va hisobotda kampaniya bo'yicha ajraladi.
