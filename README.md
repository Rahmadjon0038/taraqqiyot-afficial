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
