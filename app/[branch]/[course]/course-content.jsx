"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { branches, branchNames } from "@/lib/data";

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
export default function CourseContent({ branch = null, course = null, courseName = null }) {
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

  function handlePhoneChange(event) {
    const digits = event.target.value.replace(/\D/g, "");
    const withoutPrefix = digits.startsWith("998")
      ? digits.slice(3)
      : "998".startsWith(digits)
        ? ""
        : digits;

    setPhoneDigits(withoutPrefix.slice(0, 9));
    setPhoneError("");
  }

  function chooseBranch(nextBranch) {
    setSelectedBranch(nextBranch);
    setOtherCity(false);
    setStep("form");
    if (course) window.history.replaceState(null, "", `/${nextBranch}/${course}`);
  }

  async function submit() {
    if (sending) return;
    setSending(true);
    setSendError("");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone: `998${phoneDigits}`,
          branch: otherCity ? null : selectedBranch,
          course,
          otherCity,
        }),
      });

      if (!response.ok) throw new Error("send failed");
    } catch {
      setSending(false);
      setSendError("Ariza yuborilmadi. Iltimos, qayta urinib ko'ring yoki bizga qo'ng'iroq qiling.");
      return;
    }

    if (course) {
      router.push(`/${selectedBranch}/${course}/thank-you`);
    } else {
      router.push(
        selectedBranch && !otherCity ? `/ariza/thank-you?filial=${selectedBranch}` : "/ariza/thank-you"
      );
    }
  }

  useEffect(() => {
    if (!showConfirmation) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") setShowConfirmation(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showConfirmation]);

  return (
    <main className="course-page">
      <header className="site-header">
        <img src="/logo.png" alt="Taraqqiyot o'quv markazi" className="site-logo" />
        <span className="site-name">TARAQQIYOT TEACHING CENTER</span>
      </header>

      <section className="hero-section">
        <h1>
          {course ? (
            <>
              <strong>{courseName}</strong> kursi
            </>
          ) : (
            <>
              <strong>Ariza</strong> qoldirish
            </>
          )}
        </h1>
      </section>

      {step === "location" && (
        <section className="step-card">
          <h2>O'zingizga ma'qul joyni belgilang</h2>
          <p className="step-hint">Sizga eng yaqin filialni tanlang</p>

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
                  <strong>{branchNames[item]} yaqini</strong>
                  <small>Namangan shahri</small>
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
                <strong>Boshqa shahar</strong>
                <small>Boshqa hudud</small>
              </span>
              <span className="location-arrow" aria-hidden="true">›</span>
            </button>
          </div>
        </section>
      )}

      {step === "unavailable" && (
        <section className="step-card">
          <h2>Kechirasiz</h2>
          <p className="step-hint">Bizning bu hududda filiallarimiz mavjud emas.</p>

          <div className="step-actions">
            <button
              type="button"
              className="step-primary"
              onClick={() => {
                setOtherCity(true);
                setStep("form");
              }}
            >
              Borib o'qiy olaman
            </button>
            <Link href="/" className="step-secondary">
              Ortga qaytish
            </Link>
          </div>
        </section>
      )}

      {step === "form" && (
        <section className="step-card">
          <h2>Ariza qoldiring</h2>

          <form
            className="application-form"
            onSubmit={(event) => {
              event.preventDefault();
              if (phoneDigits.length === 9) {
                setPhoneError("");
                setShowConfirmation(true);
              } else {
                setPhoneError("Telefon raqamini to'liq kiriting: +998 dan keyin 9 ta raqam bo'lishi kerak.");
              }
            }}
          >
            <label>
              <span>Ismingiz</span>
              <input
                name="name"
                type="text"
                placeholder="Ismingiz"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={80}
                required
              />
            </label>
            <label>
              <span>Telefon raqamingiz</span>
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
            <button type="submit">Arizani yuborish <span aria-hidden="true">→</span></button>
          </form>

          {showConfirmation && (
            <div className="modal-backdrop" onClick={() => setShowConfirmation(false)}>
              <div
                className="phone-confirmation"
                role="dialog"
                aria-modal="true"
                onClick={(event) => event.stopPropagation()}
              >
                <p>Bu telefon raqamingiz to'g'rimi?</p>
                <strong>+998 {formatPhone(phoneDigits)}</strong>
                <div className="confirmation-actions">
                  <button type="button" onClick={() => setShowConfirmation(false)} disabled={sending}>
                    Yo'q
                  </button>
                  <button type="button" onClick={submit} disabled={sending}>
                    {sending ? "Yuborilmoqda…" : "Ha, yuborish"}
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
