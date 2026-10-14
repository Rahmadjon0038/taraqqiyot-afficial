"use client";

import { useState } from "react";
import { certificates } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";

export default function CertificateCarousel({ lang }) {
  const t = getDictionary(lang);
  const [index, setIndex] = useState(0);
  const item = certificates[index];
  const total = certificates.length;

  function go(step) {
    setIndex((current) => (current + step + total) % total);
  }

  return (
    <div className="cert-carousel">
      <button type="button" className="cert-arrow" onClick={() => go(-1)} aria-label={t.results.prev}>
        ←
      </button>

      <figure key={index} className="cert">
        <div className={item.fit === "contain" ? "cert-image cert-image-contain" : "cert-image"}>
          <img src={item.image} alt={t.results.alt(item.name)} draggable={false} />
        </div>
        <figcaption>
          <strong>{item.name}</strong>
          <span>{item.result ?? `${t.courseNames[item.course]} · ${item.level}`}</span>
        </figcaption>
      </figure>

      <button type="button" className="cert-arrow" onClick={() => go(1)} aria-label={t.results.next}>
        →
      </button>

      <p className="cert-count" aria-live="polite">
        {index + 1} / {total}
      </p>
    </div>
  );
}
