"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getDictionary, localePath } from "@/lib/i18n";

export default function AiPrompt({ lang }) {
  const t = getDictionary(lang).chat;
  const router = useRouter();
  const [question, setQuestion] = useState("");

  function startChat(event) {
    event.preventDefault();
    const message = question.trim();
    if (!message) return;

    router.push(localePath(lang, `/chat?q=${encodeURIComponent(message.slice(0, 500))}`));
  }

  return (
    <section className="home-ai-prompt" aria-labelledby="home-ai-title">
      <div className="home-ai-copy">
        <span className="home-ai-icon" aria-hidden="true">✦</span>
        <h2 id="home-ai-title">{t.promptTitle}</h2>
        <p>{t.promptSubtitle}</p>
      </div>
      <form className="home-ai-form" onSubmit={startChat}>
        <label className="site-chat-sr-only" htmlFor="home-ai-input">{t.inputLabel}</label>
        <span className="home-ai-form-icon" aria-hidden="true">✦</span>
        <input
          id="home-ai-input"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder={t.promptPlaceholder}
          maxLength={500}
          autoComplete="off"
        />
        <button type="submit" disabled={!question.trim()} aria-label={t.ask}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 19V5m-6 6 6-6 6 6" />
          </svg>
        </button>
      </form>
      <p className="home-ai-disclaimer">
        <span aria-hidden="true" />
        {t.demoLabel}
      </p>
    </section>
  );
}
