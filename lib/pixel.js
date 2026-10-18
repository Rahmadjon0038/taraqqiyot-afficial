const ATTRIBUTION_KEY = "ad-source";
const ATTRIBUTION_TTL = 7 * 24 * 60 * 60 * 1000;
const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
  "fbcl",
];

export function storeAdSource(search = window.location.search) {
  const params = new URLSearchParams(search);
  const values = Object.fromEntries(
    ATTRIBUTION_KEYS.flatMap((key) => {
      const value = params.get(key)?.trim().slice(0, 120);
      return value ? [[key, value]] : [];
    })
  );

  if (!Object.keys(values).length) return;

  try {
    localStorage.setItem(
      ATTRIBUTION_KEY,
      JSON.stringify({ expiresAt: Date.now() + ATTRIBUTION_TTL, values })
    );
  } catch {
    // Attribution is optional; the application form must remain usable without browser storage.
  }
}

export function readAdSource() {
  try {
    const stored = JSON.parse(localStorage.getItem(ATTRIBUTION_KEY) ?? "null");
    if (!stored || typeof stored.expiresAt !== "number" || stored.expiresAt <= Date.now()) {
      localStorage.removeItem(ATTRIBUTION_KEY);
      return {};
    }

    return stored.values && typeof stored.values === "object" ? stored.values : {};
  } catch {
    return {};
  }
}

export function trackMetaEvent(name, parameters, options) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    try {
      if (options) {
        window.fbq("track", name, parameters, options);
      } else if (parameters) {
        window.fbq("track", name, parameters);
      } else {
        window.fbq("track", name);
      }
    } catch (error) {
      console.error(`Meta Pixel failed to send ${name} event:`, error);
    }
    return;
  }

  console.warn(`Meta Pixel is not ready; skipped ${name} event.`);
}

export function createMetaEventId(eventName) {
  const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}_${Math.random().toString(36).slice(2)}`;
  return `${eventName}_${id}`;
}
