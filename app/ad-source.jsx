"use client";

import { useEffect } from "react";

const KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"];

// Reklamadan kelgan odamning manzilidagi belgilarni saqlab qo'yadi: foydalanuvchi sahifalar
// orasida yursa ham (va manzil o'zgarsa ham) ariza qaysi reklamadan kelgani yo'qolmaydi.
export default function AdSource() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const found = {};

    for (const key of KEYS) {
      const value = params.get(key);
      if (value) found[key] = value.slice(0, 120);
    }

    if (!Object.keys(found).length) return;

    try {
      sessionStorage.setItem("ad-source", JSON.stringify(found));
    } catch {
      // Brauzer saqlashga ruxsat bermasa, ariza baribir yuboriladi, faqat manbasiz.
    }
  }, []);

  return null;
}
