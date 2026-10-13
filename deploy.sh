#!/usr/bin/env bash
# Taraqqiyot saytini serverda ishga tushiradi yoki yangilaydi.
#   ./deploy.sh          — yangi kodni olib, qayta yig'ib, ishga tushiradi
#   ./deploy.sh logs     — jurnalni ko'rsatadi
#   ./deploy.sh stop     — to'xtatadi
#   ./deploy.sh restart  — qayta yig'masdan qayta ishga tushiradi
#   ./deploy.sh status   — holatini ko'rsatadi
set -euo pipefail

cd "$(dirname "$0")"

CONTAINER=taraqqiyot-web

fail() { echo "XATO: $*" >&2; exit 1; }

command -v docker >/dev/null 2>&1 || fail "Docker o'rnatilmagan."
docker compose version >/dev/null 2>&1 || fail "'docker compose' topilmadi (Docker Compose v2 kerak)."

case "${1:-deploy}" in
  logs)    exec docker compose logs -f --tail=100 ;;
  stop)    exec docker compose down ;;
  restart) exec docker compose restart ;;
  status)  exec docker compose ps ;;
  deploy)  ;;
  *)       fail "Noma'lum buyruq: $1 (deploy | logs | stop | restart | status)" ;;
esac

# 1. Sozlamalar fayli
if [ ! -f .env ]; then
  cp .env.example .env
  chmod 600 .env
  echo "'.env' fayli yaratildi. Uni oching va TELEGRAM_BOT_TOKEN hamda TELEGRAM_CHAT_ID ni to'ldiring:"
  echo "    nano .env"
  echo "Keyin shu buyruqni qayta ishga tushiring: ./deploy.sh"
  exit 1
fi
chmod 600 .env

read_env() { grep -E "^$1=" .env | tail -n 1 | cut -d= -f2- | tr -d '"'"'"' \r' || true; }

[ -n "$(read_env TELEGRAM_BOT_TOKEN)" ] || fail ".env ichida TELEGRAM_BOT_TOKEN bo'sh."
[ -n "$(read_env TELEGRAM_CHAT_ID)" ]   || fail ".env ichida TELEGRAM_CHAT_ID bo'sh."

SITE_URL="$(read_env SITE_URL)"
case "$SITE_URL" in
  https://sizning-domen.uz|"") echo "OGOHLANTIRISH: .env ichida SITE_URL (sayt manzili) ko'rsatilmagan — SEO to'liq ishlamaydi." ;;
esac

HOST_PORT="$(read_env HOST_PORT)";       HOST_PORT="${HOST_PORT:-3800}"
BIND_ADDRESS="$(read_env BIND_ADDRESS)"; BIND_ADDRESS="${BIND_ADDRESS:-127.0.0.1}"
export HOST_PORT BIND_ADDRESS

# 2. Port boshqa loyiha bilan band emasligini tekshirish
owner="$(docker ps --filter "publish=${HOST_PORT}" --format '{{.Names}}' | head -n 1)"
if [ -n "$owner" ] && [ "$owner" != "$CONTAINER" ]; then
  fail "${HOST_PORT}-port '${owner}' konteyneri bilan band. .env ichida HOST_PORT ni o'zgartiring."
fi
if [ -z "$owner" ] && command -v ss >/dev/null 2>&1 && ss -ltnH "sport = :${HOST_PORT}" | grep -q .; then
  fail "${HOST_PORT}-port serverda boshqa dastur bilan band. .env ichida HOST_PORT ni o'zgartiring."
fi

# 3. Yangi kodni olish (agar papka git orqali olingan bo'lsa)
if [ -d .git ]; then
  echo "==> Yangi kod olinmoqda..."
  git pull --ff-only || echo "    (git pull bajarilmadi — mavjud kod bilan davom etiladi)"
fi

# 4. Yig'ish va ishga tushirish
echo "==> Docker image yig'ilmoqda va konteyner ishga tushirilmoqda..."
docker compose up -d --build --remove-orphans

# 5. Sayt javob berishini kutish
echo "==> Sayt tekshirilmoqda..."
for _ in $(seq 1 30); do
  if docker exec "$CONTAINER" node -e "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))" >/dev/null 2>&1; then
    echo
    echo "TAYYOR. Sayt ishlayapti: http://${BIND_ADDRESS}:${HOST_PORT}"
    if [ "$BIND_ADDRESS" = "127.0.0.1" ]; then
      echo "U faqat server ichidan ochiladi. Domen ulash uchun nginx'da:"
      echo "    proxy_pass http://127.0.0.1:${HOST_PORT};"
    fi
    docker image prune -f >/dev/null 2>&1 || true
    exit 0
  fi
  sleep 2
done

echo "Sayt 60 soniya ichida javob bermadi. Oxirgi jurnal:" >&2
docker compose logs --tail=40 >&2
exit 1
