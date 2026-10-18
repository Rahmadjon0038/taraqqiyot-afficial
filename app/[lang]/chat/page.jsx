import ChatPage from "../../chat-page";
import { alternatesFor, getDictionary } from "@/lib/i18n";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const t = getDictionary(lang);

  return {
    title: t.chat.title,
    description: t.chat.demoNotice,
    alternates: alternatesFor(lang, "/chat"),
  };
}

export default async function ChatRoute({ params, searchParams }) {
  const { lang } = await params;
  const { q } = await searchParams;
  const initialQuestion = typeof q === "string" ? q.trim().slice(0, 500) : "";

  return <ChatPage lang={lang} initialQuestion={initialQuestion} />;
}
