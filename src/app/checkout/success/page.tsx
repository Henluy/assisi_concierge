'use client';

import Link from 'next/link';

export default function CheckoutSuccessPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                <div className="text-6xl mb-6">🎉</div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Paiement Réussi !
                </h1>
                <p className="text-gray-600 mb-8">
                    Merci pour votre réservation. Vous recevrez un email de confirmation sous peu.
                </p>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
                    <p className="text-green-800 text-sm">
                        ✅ Votre expérience a été réservée avec succès.
                    </p>
                </div>

                <div className="space-y-3">
                    <Link
                        href="/chat"
                        className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                    >
                        Retour au Chat
                    </Link>
                    <Link
                        href="/"
                        className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors"
                    >
                        Accueil
                    </Link>
                </div>
            </div>
        </div>
    );
}
