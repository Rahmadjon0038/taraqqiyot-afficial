# syntax=docker/dockerfile:1

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
# Sayt manzili (maxfiy emas) — sitemap, canonical va ulashish havolalari uchun.
ARG SITE_URL
ENV SITE_URL=$SITE_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Maxfiy qiymatlar (Telegram token) bu bosqichga kirmaydi: .dockerignore .env fayllarini
# tashlab ketadi, ular faqat konteyner ishga tushganda beriladi.
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# Arizalar jurnali shu papkada saqlanadi (docker-compose uni doimiy volume'ga ulaydi).
RUN mkdir -p /data && chown node:node /data

USER node
EXPOSE 3000
CMD ["node", "server.js"]
