"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { getDictionary, localePath } from "@/lib/i18n";

const CHAT_THEME_KEY = "taraqqiyot-chat-theme";
const CHAT_THEME_EVENT = "taraqqiyot-chat-theme-change";

function subscribeChatTheme(callback) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHAT_THEME_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHAT_THEME_EVENT, callback);
  };
}

function getChatTheme() {
  return window.localStorage.getItem(CHAT_THEME_KEY) === "dark";
}

function getServerChatTheme() {
  return false;
}

export default function ChatPage({ lang, initialQuestion = "" }) {
  const t = getDictionary(lang);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState("");
  const darkMode = useSyncExternalStore(subscribeChatTheme, getChatTheme, getServerChatTheme);
  const [fontScale, setFontScale] = useState(1);
  const [messages, setMessages] = useState([]);
  const nextId = useRef(1);
  const sending = useRef(false);
  const initialQuestionSent = useRef(false);
  const messagesRef = useRef(null);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function toggleTheme() {
    window.localStorage.setItem(CHAT_THEME_KEY, darkMode ? "light" : "dark");
    window.dispatchEvent(new Event(CHAT_THEME_EVENT));
  }

  const sendMessage = useCallback(async (rawMessage) => {
    const question = rawMessage.trim().slice(0, 500);
    if (!question || sending.current) return;

    sending.current = true;
    setError("");
    setInput("");
    setTyping(true);

    const nextMessages = [
      ...messages,
      { id: nextId.current++, role: "user", text: question },
    ].slice(-40);
    setMessages(nextMessages);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lang,
          messages: nextMessages.map(({ role, text }) => ({ role, text })),
        }),
      });
      const result = await response.json();

      if (!response.ok || typeof result.text !== "string" || !result.text.trim()) {
        throw new Error(response.status === 503 ? "not_configured" : "request_failed");
      }

      setMessages((current) =>
        [...current, { id: nextId.current++, role: "assistant", text: result.text.trim() }].slice(-40)
      );
    } catch (requestError) {
      console.error("Chat so'rovi bajarilmadi:", requestError);
      setError(
        requestError.message === "not_configured"
          ? t.chat.notConfigured
          : t.chat.requestError
      );
    } finally {
      sending.current = false;
      setTyping(false);
    }
  }, [lang, messages, t.chat.notConfigured, t.chat.requestError]);

  useEffect(() => {
    if (initialQuestion && !initialQuestionSent.current) {
      initialQuestionSent.current = true;
      void sendMessage(initialQuestion);
    }
  }, [initialQuestion, sendMessage]);

  return (
    <main className="site-chat-page" data-theme={darkMode ? "dark" : "light"}>
      <header className="site-chat-page-header">
        <Link
          href={localePath(lang, "/")}
          className="site-chat-home-link"
          aria-label={t.chat.backHome}
          title={t.chat.backHome}
        >
          <span aria-hidden="true">←</span>
        </Link>
        <h1 id="site-chat-title" className="site-chat-sr-only">{t.chat.title}</h1>
        <div className="site-chat-controls" aria-label={t.chat.displaySettings}>
          <button
            type="button"
            className="site-chat-font-button is-small"
            aria-label={t.chat.decreaseFont}
            title={t.chat.decreaseFont}
            disabled={fontScale <= 0.8}
            onClick={() => setFontScale((size) => Math.max(0.8, Math.round((size - 0.1) * 10) / 10))}
          >
            A
          </button>
          <button
            type="button"
            className="site-chat-font-button is-large"
            aria-label={t.chat.increaseFont}
            title={t.chat.increaseFont}
            disabled={fontScale >= 1.3}
            onClick={() => setFontScale((size) => Math.min(1.3, Math.round((size + 0.1) * 10) / 10))}
          >
            A
          </button>
          <button
            type="button"
            className="site-chat-theme-button"
            aria-label={darkMode ? t.chat.switchToLight : t.chat.switchToDark}
            title={darkMode ? t.chat.switchToLight : t.chat.switchToDark}
            aria-pressed={darkMode}
            onClick={toggleTheme}
          >
            {darkMode ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.2 15.4A8.5 8.5 0 0 1 8.6 3.8a8.5 8.5 0 1 0 11.6 11.6Z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
              </svg>
            )}
          </button>
        </div>
      </header>
      <section
        className="site-chat-page-content"
        aria-labelledby="site-chat-title"
        style={{ "--chat-font-scale": fontScale }}
      >
        <div className="site-chat-messages" ref={messagesRef} aria-live="polite" aria-relevant="additions">
          {messages.map((message) => (
            <div key={message.id} className={`site-chat-message is-${message.role}`}>
              <p>{message.text}</p>
              {message.href && (
                <Link href={localePath(lang, message.href)}>
                  {message.linkLabel ?? t.chat.openPage} →
                </Link>
              )}
            </div>
          ))}
          {messages.length === 0 && (
            <div className="site-chat-suggestions">
              {t.chat.suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  disabled={typing}
                  onClick={() => sendMessage(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          {error && <p className="site-chat-error" role="alert">{error}</p>}
          {typing && <p className="site-chat-typing">{t.chat.typing}</p>}
        </div>
        <form
          className="site-chat-form"
          onSubmit={(event) => {
            event.preventDefault();
            void sendMessage(input);
          }}
        >
          <label className="site-chat-sr-only" htmlFor="site-chat-input">{t.chat.inputLabel}</label>
          <input
            id="site-chat-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={t.chat.placeholder}
            maxLength={500}
            autoComplete="off"
          />
          <button type="submit" disabled={!input.trim() || typing} aria-label={t.chat.send}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m3 11 18-8-8 18-2-8-8-2Zm8 2 4-4" />
            </svg>
          </button>
        </form>
        <p className="site-chat-notice">{t.chat.demoNotice}</p>
      </section>
    </main>
  );
}
