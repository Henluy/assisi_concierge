
"use client";

import { useEffect, useState } from 'react';

// Mock params for demo - normally from Auth/Session
const MERCHANT_ID = 'demo-merchant-id';

export default function DashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch data from our new API
        fetch(`/api/merchants/dashboard?merchantId=${MERCHANT_ID}`)
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-8 text-center">Chargement du tableau de bord...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Commerçant 📊</h1>
                <p className="text-gray-600">Suivez vos performances et commissions en temps réel.</p>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 uppercase">Chiffre d'Affaires Généré</h3>
                    <p className="mt-2 text-3xl font-bold text-green-600">€{stats?.stats?.revenue || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 uppercase">Clients Apportés</h3>
                    <p className="mt-2 text-3xl font-bold text-blue-600">{stats?.stats?.referrals || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 uppercase">Taux de Conversion</h3>
                    <p className="mt-2 text-3xl font-bold text-purple-600">{stats?.stats?.conversionRate || '0%'}</p>
                </div>
            </div>

            {/* Recent Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Dernières Réservations</h2>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-sm">
                        <tr>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Montant</th>
                            <th className="px-6 py-3">Statut</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {stats?.recentActivity?.map((ref: any) => (
                            <tr key={ref.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-900">{new Date(ref.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-sm font-medium">€{ref.amount}</td>
                                <td className="px-6 py-4 text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs ${ref.status === 'paid' ? 'bg-green-100 text-green-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {ref.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {(!stats?.recentActivity || stats.recentActivity.length === 0) && (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">Aucune activité récente.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
