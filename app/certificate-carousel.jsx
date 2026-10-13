"use client";

import { useState } from "react";
import { certificates } from "@/lib/data";

export default function CertificateCarousel() {
  const [index, setIndex] = useState(0);
  const item = certificates[index];
  const total = certificates.length;

  function go(step) {
    setIndex((current) => (current + step + total) % total);
  }

  return (
    <div className="cert-carousel">
      <button type="button" className="cert-arrow" onClick={() => go(-1)} aria-label="Oldingi sertifikat">
        ←
      </button>

      <figure key={index} className="cert">
        <div className={item.fit === "contain" ? "cert-image cert-image-contain" : "cert-image"}>
          <img src={item.image} alt={`${item.name} sertifikati`} draggable={false} />
        </div>
        <figcaption>
          <strong>{item.name}</strong>
          <span>{item.result}</span>
        </figcaption>
      </figure>

      <button type="button" className="cert-arrow" onClick={() => go(1)} aria-label="Keyingi sertifikat">
        →
      </button>

      <p className="cert-count" aria-live="polite">
        {index + 1} / {total}
      </p>
    </div>
  );
}
