"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { getDictionary, localePath } from "@/lib/i18n";

const slideDuration = 3000;
// Shu kenglikdan tor ekranlarda (telefon) telefon banneri ko'rsatiladi. CSS dagi 560px bilan bir xil bo'lishi kerak.
const MOBILE_MEDIA = "(max-width: 560px)";
const swipeThreshold = 48;

export default function UpdatesCarousel({ lang }) {
  const t = getDictionary(lang).updates;
  const pointerStartX = useRef(null);
  const suppressClick = useRef(false);
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [failedImages, setFailedImages] = useState({});
  // Telefon rasmi yuklanmasa (masalan, o'chirilgan bo'lsa), shu e'lon uchun kompyuter rasmiga qaytamiz.
  const [failedMobile, setFailedMobile] = useState({});
  const [paused, setPaused] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadSlides() {
      try {
        const response = await fetch("/api/announcements", { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`Announcements request failed with status ${response.status}`);
        }
        const data = await response.json();
        if (!Array.isArray(data.items)) {
          throw new Error("Announcements response did not contain an items list");
        }
        if (!ignore) {
          setSlides(data.items);
          setIndex(0);
        }
      } catch (error) {
        if (!ignore) console.error("Could not load announcements:", error);
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
  const hasMobileImage = Boolean(activeSlide?.mobileImage) && !failedMobile[activeSlide?.id];
  // Kamida bitta e'londa telefon banneri bo'lsa, telefonda hamma ramka bir xil balandlikda bo'ladi:
  // aks holda karusel aylanganda sahifa sakrab turadi.
  const anyMobileImage = slides.some((slide) => slide.mobileImage && !failedMobile[slide.id]);
  const activeHref =
    activeSlide?.type === "course" && activeSlide?.course
      ? localePath(
          lang,
          `/ariza?course=${encodeURIComponent(activeSlide.course)}${activeSlide.branch ? `&branch=${encodeURIComponent(activeSlide.branch)}` : ""}`
        )
      : activeSlide?.type === "vacancy" && activeSlide?.applicationType
        ? localePath(
            lang,
            `/ariza?application=${encodeURIComponent(activeSlide.applicationType)}&vacancy_title=${encodeURIComponent(activeSlide.title)}${activeSlide.branch ? `&branch=${encodeURIComponent(activeSlide.branch)}` : ""}`
          )
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

  if (!activeSlide) return null;

  return (
    <section className="home-updates" aria-label={t.sectionLabel}>
      <div
        className={`home-updates-banner ${direction > 0 ? "is-next" : "is-previous"}`}
        data-mobile-layout={anyMobileImage ? "true" : undefined}
        data-mobile-image={hasMobileImage ? "true" : undefined}
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
        <picture key={activeSlide.id || activeSlide.image}>
          {hasMobileImage && <source media={MOBILE_MEDIA} srcSet={activeSlide.mobileImage} />}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeSlide.image}
            alt={activeSlide.title || t.bannerAlt(activeIndex + 1)}
            fetchPriority="high"
            draggable={false}
            onError={() => {
              if (hasMobileImage && window.matchMedia(MOBILE_MEDIA).matches) {
                setFailedMobile((current) => ({ ...current, [activeSlide.id]: true }));
              } else {
                setFailedImages((current) => ({ ...current, [activeIndex]: true }));
              }
            }}
          />
        </picture>

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
          {activeSlide.type !== "news" && (
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
          aria-label={activeModal.title}
          onClick={() => setActiveModal(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.94)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div onClick={(event) => event.stopPropagation()} style={{ position: "relative", width: "100vw", height: "100dvh" }}>
            <button type="button" onClick={() => setActiveModal(null)} aria-label="Close image" style={{ position: "absolute", zIndex: 1, top: 16, right: 16, width: 44, height: 44, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.5)", background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: 26, cursor: "pointer" }}>
              ×
            </button>
            <picture>
              {activeModal.mobileImage && <source media={MOBILE_MEDIA} srcSet={activeModal.mobileImage} />}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={activeModal.image} alt={activeModal.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }} />
            </picture>
          </div>
        </div>
      )}
    </section>
  );
}
