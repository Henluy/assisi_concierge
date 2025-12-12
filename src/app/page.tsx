"use client";

import Link from "next/link";
import { useState } from "react";

type Language = "fr" | "en" | "it" | "de" | "es";

const TRANSLATIONS = {
  fr: {
    subtitle: "Votre guide touristique intelligent à Assise.",
    description:
      "Découvrez les meilleurs restaurants, lieux secrets et histoires locales grâce à notre IA.",
    botCardTitle: "🤖 Chatbot Telegram",
    botCardDesc: "Posez vos questions et recevez des réponses instantanées.",
    botBtn: "Lancer le Bot",
    dashCardTitle: "📊 Espace Commerçant",
    dashCardDesc: "Suivez vos statistiques et commissions.",
    dashBtn: "Accéder au Dashboard",
    chatBtn: "Parler au Concierge",
  },
  en: {
    subtitle: "Your intelligent tourist guide in Assisi.",
    description:
      "Discover the best restaurants, secret spots, and local stories with our AI.",
    botCardTitle: "🤖 Telegram Chatbot",
    botCardDesc: "Ask your questions and get instant answers.",
    botBtn: "Launch Bot",
    dashCardTitle: "📊 Merchant Area",
    dashCardDesc: "Track your statistics and commissions.",
    dashBtn: "Access Dashboard",
    chatBtn: "Talk to Concierge",
  },
  it: {
    subtitle: "La tua guida turistica intelligente ad Assisi.",
    description:
      "Scopri i migliori ristoranti, luoghi segreti e storie locali grazie alla nostra IA.",
    botCardTitle: "🤖 Chatbot Telegram",
    botCardDesc: "Fai le tue domande e ricevi risposte immediate.",
    botBtn: "Avvia Bot",
    dashCardTitle: "📊 Area Commercianti",
    dashCardDesc: "Monitora le tue statistiche e commissioni.",
    dashBtn: "Accedi alla Dashboard",
    chatBtn: "Parla col Concierge",
  },
  de: {
    subtitle: "Ihr intelligenter Reiseführer in Assisi.",
    description:
      "Entdecken Sie die besten Restaurants, geheimen Orte und lokalen Geschichten mit unserer KI.",
    botCardTitle: "🤖 Telegram Chatbot",
    botCardDesc: "Stellen Sie Ihre Fragen und erhalten Sie sofort Antworten.",
    botBtn: "Bot starten",
    dashCardTitle: "📊 Händlerbereich",
    dashCardDesc: "Verfolgen Sie Ihre Statistiken und Provisionen.",
    dashBtn: "Dashboard aufrufen",
    chatBtn: "Sprechen Sie mit dem Concierge",
  },
  es: {
    subtitle: "Tu guía turístico inteligente en Asís.",
    description:
      "Descubre los mejores restaurantes, lugares secretos e historias locales con nuestra IA.",
    botCardTitle: "🤖 Chatbot Telegram",
    botCardDesc: "Haz tus preguntas y recibe respuestas instantáneas.",
    botBtn: "Iniciar Bot",
    dashCardTitle: "📊 Área de Comerciantes",
    dashCardDesc: "Sigue tus estadísticas y comisiones.",
    dashBtn: "Acceder al Dashboard",
    chatBtn: "Hablar con el Conserje",
  },
};

const FLAGS: Record<Language, string> = {
  fr: "🇫🇷",
  en: "🇬🇧",
  it: "🇮🇹",
  de: "🇩🇪",
  es: "🇪🇸",
};

export default function Home() {
  const [lang, setLang] = useState<Language>("fr");
  const t = TRANSLATIONS[lang];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-8 relative">
      {/* Language Selector */}
      <div className="absolute top-6 right-6 flex gap-2">
        {(Object.keys(FLAGS) as Language[]).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`text-2xl hover:scale-110 transition-transform ${lang === l ? "scale-125 drop-shadow-md" : "opacity-70"}`}
            title={l.toUpperCase()}
          >
            {FLAGS[l]}
          </button>
        ))}
      </div>

      <main className="max-w-4xl w-full text-center space-y-8 mt-12">
        <h1 className="text-5xl font-extrabold text-blue-900 tracking-tight">
          Assisi AI Concierge 🦅
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {t.subtitle}
          <br />
          {t.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg mx-auto mt-12">
          {/* Bot Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {t.botCardTitle}
            </h2>
            <p className="text-gray-600 mb-4">{t.botCardDesc}</p>
            <a
              href="https://t.me/Vainqueur85Bot"
              target="_blank"
              className="inline-block w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t.botBtn}
            </a>
          </div>

          {/* Dashboard Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {t.dashCardTitle}
            </h2>
            <p className="text-gray-600 mb-4">{t.dashCardDesc}</p>
            <Link
              href="/dashboard?merchantId=demo-merchant-id"
              className="inline-block w-full py-3 px-6 bg-white text-blue-600 border-2 border-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              {t.dashBtn}
            </Link>
          </div>
        </div>

        <footer className="mt-16 text-sm text-gray-400">
          Powered by AssignAI • Next.js • Supabase • OpenAI
        </footer>
      </main>

      {/* Floating Chat Button */}
      <a
        href="/chat"
        className="fixed bottom-6 right-6 w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110 z-50 animate-bounce group"
      >
        <span className="absolute -top-10 bg-white text-gray-800 text-xs px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {t.chatBtn}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </a>
    </div>
  );
}
