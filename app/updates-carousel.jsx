"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getDictionary, localePath } from "@/lib/i18n";

const slideDuration = 3000;
const swipeThreshold = 48;
const defaultSlides = [
  { id: "default-news", type: "news", title: "Yangi kurslar ochildi", image: "/ads/banner-01.png", targetUrl: "#" },
  { id: "default-course", type: "course", title: "Turk tili kursi", image: "/ads/banner-02.png", course: "turk-tili" },
  { id: "default-vacancy", type: "vacancy", title: "O'qituvchi vakansiyasi", image: "/ads/banner-03.png", applicationType: "teacher-vacancy" },
];

export default function UpdatesCarousel({ lang }) {
  const t = getDictionary(lang).updates;
  const pointerStartX = useRef(null);
  const suppressClick = useRef(false);
  const [slides, setSlides] = useState(defaultSlides);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [failedImages, setFailedImages] = useState({});
  const [paused, setPaused] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadSlides() {
      try {
        const response = await fetch("/api/announcements", { cache: "no-store" });
        if (!response.ok) return;
        const data = await response.json();
        if (!ignore && Array.isArray(data.items) && data.items.length) {
          setSlides(data.items);
          setIndex(0);
        }
      } catch {
        // Fall back to local defaults.
      }
    }

    loadSlides();
    return () => {
      ignore = true;
    };
  }, []);

  const availableSlides = useMemo(
    () => slides.filter((_, slideIndex) => !failedImages[slideIndex]),
    [failedImages, slides]
  );

  const activeSlide = availableSlides.find((_, slideIndex) => slideIndex === index) ?? availableSlides[0];
  const activeIndex = availableSlides.findIndex((slide) => slide.id === activeSlide?.id);
  const activeKey = activeSlide?.id ?? "default";
  const activeHref =
    activeSlide?.type === "course" && activeSlide?.course
      ? localePath(lang, `/ariza?course=${encodeURIComponent(activeSlide.course)}`)
      : activeSlide?.type === "vacancy" && activeSlide?.applicationType
        ? localePath(lang, `/ariza?application=${encodeURIComponent(activeSlide.applicationType)}`)
        : activeSlide?.targetUrl || localePath(lang, "/ariza");

  function go(step) {
    if (!availableSlides.length) return;

    const currentPosition = availableSlides.findIndex((slide) => slide.id === activeKey);
    const nextPosition = (currentPosition + step + availableSlides.length) % availableSlides.length;
    setDirection(step);
    setIndex(nextPosition);
  }

  function goTo(nextIndex) {
    const currentPosition = availableSlides.findIndex((slide) => slide.id === activeKey);
    if (nextIndex < 0 || nextIndex >= availableSlides.length || nextIndex === currentPosition) return;

    setDirection(nextIndex > currentPosition ? 1 : -1);
    setIndex(nextIndex);
  }

  function handlePointerDown(event) {
    if (event.target.closest("button")) return;
    pointerStartX.current = event.clientX;
  }

  function handlePointerMove(event) {
    if (
      pointerStartX.current !== null &&
      event.buttons !== 0 &&
      Math.abs(event.clientX - pointerStartX.current) > swipeThreshold &&
      !event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  }

  function handlePointerUp(event) {
    if (pointerStartX.current === null) return;

    const distance = event.clientX - pointerStartX.current;
    pointerStartX.current = null;

    if (Math.abs(distance) > swipeThreshold) {
      suppressClick.current = true;
      window.setTimeout(() => {
        suppressClick.current = false;
      }, 0);
      go(distance < 0 ? 1 : -1);
    }
  }

  function handleBannerLinkClick(event) {
    if (!suppressClick.current) return;
    event.preventDefault();
    suppressClick.current = false;
  }

  useEffect(() => {
    if (paused || !availableSlides.length) return;

    const timer = window.setTimeout(() => {
      const currentPosition = availableSlides.findIndex((slide) => slide.id === activeKey);
      const nextPosition = (currentPosition + 1) % availableSlides.length;
      setDirection(1);
      setIndex(nextPosition);
    }, slideDuration);

    return () => window.clearTimeout(timer);
  }, [activeKey, availableSlides, paused]);

  return (
    <section className="home-updates" aria-label={t.sectionLabel}>
      <div
        className={`home-updates-banner ${direction > 0 ? "is-next" : "is-previous"}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          pointerStartX.current = null;
          suppressClick.current = false;
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
        }}
      >
        {activeSlide && (
          <Image
            key={activeSlide.id || activeSlide.image}
            src={activeSlide.image || "/ads/banner-01.png"}
            alt={activeSlide.title || t.bannerAlt(activeIndex + 1)}
            fill
            priority
            draggable={false}
            sizes="(max-width: 560px) calc(100vw - 24px), (max-width: 1472px) calc(100vw - 32px), 1440px"
            onError={() => setFailedImages((current) => ({ ...current, [activeIndex]: true }))}
          />
        )}

        {activeSlide?.type === "news" ? (
          <button
            type="button"
            className="home-updates-banner-link"
            aria-label={activeSlide.title || "Open announcement"}
            onClick={() => setActiveModal(activeSlide)}
            onMouseDown={handleBannerLinkClick}
            style={{ cursor: "pointer", border: 0, background: "transparent" }}
          />
        ) : (
          <Link
            href={activeHref}
            className="home-updates-banner-link"
            aria-label={activeSlide?.title || t.sectionLabel}
            onClick={handleBannerLinkClick}
          />
        )}

        <button type="button" className="home-updates-arrow home-updates-previous" onClick={() => go(-1)} aria-label={t.previous}>←</button>
        <button type="button" className="home-updates-arrow home-updates-next" onClick={() => go(1)} aria-label={t.next}>→</button>
      </div>

      <div className="home-updates-toolbar">
        <div className="home-updates-pagination">
          <span className="home-updates-current" aria-live="polite">
            {String(availableSlides.findIndex((slide) => slide.id === activeKey) + 1).padStart(2, "0")}
          </span>
          <span className="home-updates-pagination-divider">/</span>
          <span className="home-updates-total">{String(availableSlides.length).padStart(2, "0")}</span>
          <div className="home-updates-dots" role="group" aria-label={t.chooseBanner}>
            {availableSlides.map((slide, slideIndex) => (
              <button
                key={slide.id || slide.image || slideIndex}
                type="button"
                className={slide.id === activeKey ? "is-active" : ""}
                onClick={() => goTo(slideIndex)}
                aria-label={slide.title || t.bannerAlt(slideIndex + 1)}
                aria-current={slide.id === activeKey ? "true" : undefined}
              />
            ))}
          </div>
        </div>
        <div className="home-updates-actions">
          {activeSlide?.type === "news" ? (
            <button type="button" className="home-updates-apply" onClick={() => setActiveModal(activeSlide)}>
              {t.apply}
            </button>
          ) : (
            <Link href={activeHref} className="home-updates-apply">
              {t.apply}
            </Link>
          )}
        </div>
      </div>

      {activeModal && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveModal(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(17, 24, 39, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 20,
          }}
        >
          <div onClick={(event) => event.stopPropagation()} style={{ position: "relative", width: "min(980px, 100%)", maxHeight: "90vh", overflow: "auto", borderRadius: 24, background: "#fff", boxShadow: "0 30px 90px rgba(0,0,0,0.2)" }}>
            <button type="button" onClick={() => setActiveModal(null)} aria-label="Close" style={{ position: "absolute", top: 16, right: 16, width: 40, height: 40, borderRadius: "50%", border: "none", background: "rgba(17,24,39,0.08)", fontSize: 22, cursor: "pointer" }}>
              ×
            </button>
            <div style={{ position: "relative", width: "100%", height: 360 }}>
              <Image src={activeModal.image || "/ads/banner-01.png"} alt={activeModal.title} fill style={{ objectFit: "cover" }} sizes="100vw" />
            </div>
            <div style={{ padding: 24 }}>
              <p style={{ textTransform: "uppercase", letterSpacing: 2, color: "#d62728", fontSize: 12, fontWeight: 700, margin: "0 0 12px" }}>
                {activeModal.type === "news" ? "Yangilik" : activeModal.type === "course" ? "Kurs" : "Vakansiya"}
              </p>
              <h3 style={{ fontSize: 32, margin: "0 0 12px" }}>{activeModal.title}</h3>
              <p style={{ color: "#4b5563", lineHeight: 1.7, margin: 0 }}>
                {activeModal.description || activeModal.preview || "Batafsil ma'lumot tez orada qo'shiladi."}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
