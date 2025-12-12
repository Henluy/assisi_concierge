# 🦅 Assisi AI Concierge

**L'Assistant Touristique Intelligent pour la ville d'Assise (Italie).**

Ce projet est une solution complète "Phygital" combinant un Chatbot IA (Telegram & Web), une Marketplace d'expériences locales, et un système de monétisation pour les commerçants via Stripe.

---

## 🌟 Fonctionnalités Clés

### 🤖 IA & Chatbot

- **Intelligence** : GPT-4o-mini pour des réponses naturelles et contextuelles.
- **RAG (Retrieval Augmented Generation)** : Base vectorielle (Supabase) pour recommander des lieux spécifiques (restaurants secrets, vues panoramiques).
- **Vision** : Analyse de photos envoyées par les touristes (ex: "C'est quoi cette fresque ?").
- **Audio** : Génération d'audioguides à la demande (TTS).
- **Prédictions** : Estimation de l'affluence en temps réel.

### 💰 Monétisation & Business

- **Marketplace** : Vente d'activités (dégustations, visites) directement dans le chat.
- **Paiements** : Intégration Stripe pour les réservations.
- **Commissions** : Système de tracking HMAC pour attribuer les ventes aux commerçants partenaires.
- **Dashboard Marchand** : Espace dédié pour les commerçants (suivi CA, conversions).

### 🌍 Accessibilité

- **Multi-plateforme** : Telegram Bot + Web Chat (`/chat`).
- **Multilingue** : Détection auto (FR, EN, IT, DE, ES).
- **Phygital** : Flyers avec QR Codes pour l'acquisition terrain.

---

## 🛠️ Stack Technique

- **Framework** : Next.js 14 (App Router)
- **Langage** : TypeScript
- **Base de Données** : Supabase (PostgreSQL + pgvector)
- **IA** : OpenAI (GPT-4o, Vision, TTS)
- **Paiement** : Stripe
- **Bot** : Telegraf (Telegram API)
- **Déploiement** : Vercel

---

## 🚀 Installation & Configuration

### 1. Prérequis

- Node.js 20+
- Un projet Supabase
- Clés API : OpenAI, Google Maps, Stripe, Telegram (BotFather).

### 2. Installation

```bash
git clone https://github.com/Henluy/assisi_concierge.git
cd assisi_concierge
npm install
```

### 3. Configuration Environment

Copiez `.env.example` vers `.env.local` et remplissez les valeurs.
⚠️ **IMPORTANT** : Assurez-vous d'avoir `NEXT_PUBLIC_SUPABASE_URL` configuré pour le build frontend.

### 4. Base de Données

Appliquez les migrations SQL dans le Dashboard Supabase SQL Editor :

1. `init_vector.sql` (Recherche sémantique)
2. `init_commission.sql` (Tables marchands & tracking)
3. `init_marketplace.sql` (Tables expériences)

### 5. Démarrage Local

```bash
npm run dev
```

---

## 📱 Commandes Utiles

### Générer les QR Codes & Flyers

Génère les QR codes pointant vers le bot et le chat web, ainsi qu'un flyer PDF/HTML prêt à imprimer.

```bash
npx tsx src/scripts/generate-qr.ts
```

### Onboarder un Commerçant (CLI)

Script rapide pour ajouter un marchand dans la base de données sans passer par l'interface.

```bash
npx tsx src/scripts/onboard-merchant.ts
```

### Tests

```bash
npm run test           # Tests unitaires (Jest)
npx playwright test    # Tests E2E
```

---

## 📦 Déploiement (Vercel)

1. Connectez votre repo GitHub à Vercel.
2. Ajoutez toutes les variables d'environnement (y compris `NEXT_PUBLIC_SUPABASE_URL` et `TELEGRAM_BOT_TOKEN`).
3. Déployez.
4. **Activez le Webhook Telegram** (une seule fois après le déploiement) :
   ```bash
   curl "https://api.telegram.org/bot<VOTRE_TOKEN>/setWebhook?url=https://<VOTRE_URL_VERCEL>/api/bot/webhook"
   ```

---

## 📝 Licence

MIT License. Created by AssignAI.
