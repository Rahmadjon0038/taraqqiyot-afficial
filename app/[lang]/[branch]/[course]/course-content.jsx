"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { applicationTypes, branches } from "@/lib/data";
import { getDictionary, localePath } from "@/lib/i18n";
import { createMetaEventId, readAdSource, trackMetaEvent } from "@/lib/pixel";
import LangSwitch from "../../../lang-switch";

function formatPhone(digits) {
  return [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 7), digits.slice(7, 9)]
    .filter(Boolean)
    .join(" ");
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s7-6.1 7-11.5a7 7 0 1 0-14 0C5 14.9 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}

// course va branch berilmasa, bu umumiy ariza sahifasi: fan tanlanmaydi va yuborilmaydi.
export default function CourseContent({ lang, branch = null, course = null, applicationType = null, vacancyTitle = "" }) {
  const t = getDictionary(lang);
  const application = applicationType ? applicationTypes[applicationType] : null;
  const resolvedVacancyTitle =
    applicationType === "teacher-vacancy" && vacancyTitle ? vacancyTitle : applicationType === "teacher-vacancy" ? applicationTypes[applicationType].name : "";
  const router = useRouter();
  const [step, setStep] = useState("location");
  const [selectedBranch, setSelectedBranch] = useState(branch);
  const [phoneDigits, setPhoneDigits] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [name, setName] = useState("");
  const [otherCity, setOtherCity] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const submissionInProgress = useRef(false);

  function handlePhoneChange(event) {
    const digits = event.target.value.replace(/\D/g, "");
    const withoutPrefix = digits.startsWith("998")
      ? digits.slice(3)
      : "998".startsWith(digits)
        ? ""
        : digits;

    setPhoneDigits(withoutPrefix.slice(0, 9));
    setPhoneError("");
    setSendError("");
  }

  function chooseBranch(nextBranch) {
    setSelectedBranch(nextBranch);
    setOtherCity(false);
    setStep("form");
    if (branch && course) window.history.replaceState(null, "", localePath(lang, `/${nextBranch}/${course}`));
  }

  // Oyna yopilganda eski xato ("oldin yuborgansiz") qolib, yangi raqamda chalg'itmasin.
  function closeConfirmation() {
    setShowConfirmation(false);
    setSendError("");
  }

  async function submit() {
    if (submissionInProgress.current) return;
    submissionInProgress.current = true;
    setSending(true);
    setSendError("");
    const eventID = createMetaEventId("lead");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone: `998${phoneDigits}`,
          branch: otherCity ? null : selectedBranch,
          course: course ?? application?.course ?? null,
          applicationType,
          vacancyTitle: resolvedVacancyTitle,
          otherCity,
          lang,
          eventID,
          source: readAdSource(),
        }),
      });

      const result = await response.json();
      if (response.status === 409 && result.error === "duplicate") {
        submissionInProgress.current = false;
        setSending(false);
        setSendError(t.form.duplicateApplication);
        return;
      }

      if (!response.ok) throw new Error("send failed");
    } catch {
      submissionInProgress.current = false;
      setSending(false);
      setSendError(t.form.sendError);
      return;
    }

    const trackedCourse = course ?? application?.course;
    trackMetaEvent(
      "Lead",
      {
        content_name: applicationType || course || "unknown",
        branch: otherCity ? "other_city" : selectedBranch || "unknown",
        language: lang,
        content_category: "course_lead",
        ...(trackedCourse ? { course: trackedCourse } : {}),
        ...(resolvedVacancyTitle ? { vacancy_title: resolvedVacancyTitle } : {}),
      },
      { eventID }
    );

    if (course) {
      router.push(localePath(lang, `/${selectedBranch}/${course}/thank-you`));
    } else {
      router.push(
        localePath(lang, selectedBranch && !otherCity ? `/ariza/thank-you?filial=${selectedBranch}` : "/ariza/thank-you")
      );
    }
  }

  useEffect(() => {
    if (!showConfirmation) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") closeConfirmation();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showConfirmation]);

  return (
    <main className="course-page">
      <header className="site-header">
        <Link href={localePath(lang, "/")} className="site-brand">
          <img src="/logo.png" alt={t.logoAlt} className="site-logo" />
          <span className="site-name">{t.siteNameUpper}</span>
        </Link>
        <LangSwitch
          lang={lang}
          path={
            branch && course
              ? `/${selectedBranch}/${course}`
              : applicationType
                ? `/ariza?application=${encodeURIComponent(applicationType)}`
                : course
                  ? `/ariza?course=${encodeURIComponent(course)}`
                  : "/ariza"
          }
          className="lang-switch-page"
        />
      </header>

      <section className="hero-section">
        <h1>
          {course ? (
            <>
              {t.form.courseTitle[0]}
              <strong>{t.courseNames[course]}</strong>
              {t.form.courseTitle[1]}
            </>
          ) : (
            <>
              <strong>{t.form.applyTitle[0]}</strong>
              {t.form.applyTitle[1]}
            </>
          )}
        </h1>
        {application && (
          <p className="application-context">
            {t.form.applicationFor} <strong>{resolvedVacancyTitle || t.updates.applicationTypes[applicationType]}</strong>
          </p>
        )}
      </section>

      {step === "location" && (
        <section className="step-card">
          <h2>{t.form.locationTitle}</h2>
          <p className="step-hint">{t.form.locationHint}</p>

          <div className="location-options">
            {branches.map((item) => (
              <button
                key={item}
                type="button"
                className="location-option"
                onClick={() => chooseBranch(item)}
              >
                <span className="location-icon" aria-hidden="true">
                  <PinIcon />
                </span>
                <span className="location-text">
                  <strong>{t.form.near(t.branchNames[item])}</strong>
                  <small>{t.form.city}</small>
                </span>
                <span className="location-arrow" aria-hidden="true">›</span>
              </button>
            ))}
            <button
              type="button"
              className="location-option location-other"
              onClick={() => setStep("unavailable")}
            >
              <span className="location-icon" aria-hidden="true">
                <GlobeIcon />
              </span>
              <span className="location-text">
                <strong>{t.form.otherCity}</strong>
                <small>{t.form.otherRegion}</small>
              </span>
              <span className="location-arrow" aria-hidden="true">›</span>
            </button>
          </div>
        </section>
      )}

      {step === "unavailable" && (
        <section className="step-card">
          <h2>{t.form.sorryTitle}</h2>
          <p className="step-hint">{t.form.sorryText}</p>

          <div className="step-actions">
            <button
              type="button"
              className="step-primary"
              onClick={() => {
                setOtherCity(true);
                setStep("form");
              }}
            >
              {t.form.canCome}
            </button>
            <Link href={localePath(lang, "/")} className="step-secondary">
              {t.form.back}
            </Link>
          </div>
        </section>
      )}

      {step === "form" && (
        <section className="step-card">
          <h2>{t.form.title}</h2>

          <form
            className="application-form"
            onSubmit={(event) => {
              event.preventDefault();
              if (phoneDigits.length === 9) {
                setPhoneError("");
                setSendError("");
                setShowConfirmation(true);
              } else {
                setPhoneError(t.form.phoneError);
              }
            }}
          >
            <label>
              <span>{t.form.name}</span>
              <input
                name="name"
                type="text"
                placeholder={t.form.name}
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={80}
                required
              />
            </label>
            <label>
              <span>{t.form.phone}</span>
              <input
                name="phone"
                type="tel"
                value={`+998 ${formatPhone(phoneDigits)}`}
                onChange={handlePhoneChange}
                placeholder="+998 90 123 45 67"
                inputMode="numeric"
                required
              />
            </label>
            {phoneError && <p className="phone-error">{phoneError}</p>}
            <button type="submit">
              {t.form.submit} <span aria-hidden="true">→</span>
            </button>
          </form>

          {showConfirmation && (
            <div className="modal-backdrop" onClick={closeConfirmation}>
              <div
                className="phone-confirmation"
                role="dialog"
                aria-modal="true"
                onClick={(event) => event.stopPropagation()}
              >
                <p>{t.form.confirm}</p>
                <strong>+998 {formatPhone(phoneDigits)}</strong>
                <div className="confirmation-actions">
                  <button type="button" onClick={closeConfirmation} disabled={sending}>
                    {t.form.no}
                  </button>
                  <button type="button" onClick={submit} disabled={sending}>
                    {sending ? t.form.sending : t.form.yes}
                  </button>
                </div>
                {sendError && <p className="send-error">{sendError}</p>}
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
