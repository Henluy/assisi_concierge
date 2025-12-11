
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-8">
      <main className="max-w-4xl w-full text-center space-y-8">
        <h1 className="text-5xl font-extrabold text-blue-900 tracking-tight">
          Assisi AI Concierge 🦅
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Votre guide touristique intelligent à Assise.
          Découvrez les meilleurs restaurants, lieux secrets et histoires locales grâce à notre IA.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg mx-auto mt-12">
          {/* Bot Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">🤖 Chatbot Telegram</h2>
            <p className="text-gray-600 mb-4">Posez vos questions et recevez des réponses instantanées.</p>
            <a
              href="https://t.me/Vainqueur85Bot"
              target="_blank"
              className="inline-block w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Lancer le Bot
            </a>
          </div>

          {/* Dashboard Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">📊 Espace Commerçant</h2>
            <p className="text-gray-600 mb-4">Suivez vos statistiques et commissions.</p>
            <Link
              href="/dashboard?merchantId=demo-merchant-id"
              className="inline-block w-full py-3 px-6 bg-white text-blue-600 border-2 border-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Accéder au Dashboard
            </Link>
          </div>
        </div>

        <footer className="mt-16 text-sm text-gray-400">
          Powered by AssignAI • Next.js • Supabase • OpenAI
        </footer>
      </main>
    </div>
  );
}
