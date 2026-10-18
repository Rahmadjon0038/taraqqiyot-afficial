"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getDictionary, localePath } from "@/lib/i18n";

const slides = [
  { src: "/ads/banner-01.png", applicationType: "english-course" },
  { src: "/ads/banner-02.png", applicationType: "german-course" },
  { src: "/ads/banner-03.png", applicationType: "teacher-vacancy" },
];
const slideDuration = 3000;
const swipeThreshold = 48;

export default function UpdatesCarousel({ lang }) {
  const t = getDictionary(lang).updates;
  const pointerStartX = useRef(null);
  const suppressClick = useRef(false);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [failedImages, setFailedImages] = useState({});
  const [paused, setPaused] = useState(false);
  const availableSlides = useMemo(
    () => slides
      .map((slide, slideIndex) => ({ ...slide, slideIndex }))
      .filter(({ slideIndex }) => !failedImages[slideIndex]),
    [failedImages]
  );
  const activeSlide = availableSlides.find(({ slideIndex }) => slideIndex === index) ?? availableSlides[0];
  const activeIndex = activeSlide?.slideIndex ?? index;
  const applicationHref = localePath(
    lang,
    activeSlide?.applicationType
      ? `/ariza?application=${encodeURIComponent(activeSlide.applicationType)}`
      : "/ariza"
  );

  function go(step) {
    if (!availableSlides.length) return;

    const currentPosition = availableSlides.findIndex(({ slideIndex }) => slideIndex === activeIndex);
    const nextPosition = (currentPosition + step + availableSlides.length) % availableSlides.length;
    setDirection(step);
    setIndex(availableSlides[nextPosition].slideIndex);
  }

  function goTo(slideIndex) {
    const currentPosition = availableSlides.findIndex(({ slideIndex }) => slideIndex === activeIndex);
    const nextPosition = availableSlides.findIndex((slide) => slide.slideIndex === slideIndex);

    if (nextPosition === -1 || nextPosition === currentPosition) return;

    setDirection(nextPosition > currentPosition ? 1 : -1);
    setIndex(slideIndex);
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
      const currentPosition = availableSlides.findIndex(({ slideIndex }) => slideIndex === activeIndex);
      const nextPosition = (currentPosition + 1) % availableSlides.length;
      setDirection(1);
      setIndex(availableSlides[nextPosition].slideIndex);
    }, slideDuration);

    return () => window.clearTimeout(timer);
  }, [activeIndex, availableSlides, paused]);

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
            key={activeSlide.src}
            src={activeSlide.src}
            alt={t.bannerAlt(activeIndex + 1)}
            fill
            priority
            draggable={false}
            sizes="(max-width: 560px) calc(100vw - 24px), (max-width: 1472px) calc(100vw - 32px), 1440px"
            onError={() => setFailedImages((current) => ({ ...current, [activeIndex]: true }))}
          />
        )}

        <Link
          href={applicationHref}
          className="home-updates-banner-link"
          aria-label={`${t.apply} ${t.applicationTypes[activeSlide?.applicationType] ?? ""}`.trim()}
          onClick={handleBannerLinkClick}
        />

        <button
          type="button"
          className="home-updates-arrow home-updates-previous"
          onClick={() => go(-1)}
          aria-label={t.previous}
        >
          ←
        </button>
        <button
          type="button"
          className="home-updates-arrow home-updates-next"
          onClick={() => go(1)}
          aria-label={t.next}
        >
          →
        </button>
      </div>
      <div className="home-updates-toolbar">
        <div className="home-updates-pagination">
          <span className="home-updates-current" aria-live="polite">
            {String(availableSlides.findIndex(({ slideIndex }) => slideIndex === activeIndex) + 1).padStart(2, "0")}
          </span>
          <span className="home-updates-pagination-divider">/</span>
          <span className="home-updates-total">{String(availableSlides.length).padStart(2, "0")}</span>
          <div className="home-updates-dots" role="group" aria-label={t.chooseBanner}>
            {availableSlides.map(({ src, slideIndex }) => (
              <button
                key={src}
                type="button"
                className={slideIndex === activeIndex ? "is-active" : ""}
                onClick={() => goTo(slideIndex)}
                aria-label={t.bannerAlt(slideIndex + 1)}
                aria-current={slideIndex === activeIndex ? "true" : undefined}
              />
            ))}
          </div>
        </div>
        <div className="home-updates-actions">
          <Link href={applicationHref} className="home-updates-apply">
            {t.apply}
          </Link>
        </div>
      </div>
    </section>
  );
}
