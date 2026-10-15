"use client";

import { useEffect, useRef, useState } from "react";

// Tashqi iframe (Instagram, Google Maps) faqat foydalanuvchi ko'ra boshlaganda yuklanadi.
// Brauzerning `loading="lazy"` belgisiga ishonib bo'lmaydi: gorizontal suriladigan qatorlarda
// va tez tarmoqda u iframe'larni sahifa ochilishi bilanoq yuklab yuboradi.
export default function LazyFrame({ className, rootMargin = "100px", ...frameProps }) {
  const slot = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = slot.current;
    if (!node) return;

    // Juda eski brauzerlarda kuzatuvchi yo'q: iframe'ni keyingi kadrda ko'rsatamiz.
    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={slot} className={className}>
      {visible && <iframe {...frameProps} />}
    </div>
  );
}
