# Assisi AI Concierge 🤖🇮🇹

A full-stack AI Concierge for Assisi (Italy), built with **Next.js 14**, **Supabase**, and **OpenAI**. 
This project features a multilingual Telegram bot, smart vector-based recommendations, and a commission tracking dashboard.

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 20+
- Supabase Account
- OpenAI API Key
- Telegram account (for BotFather)

### 2. Environment Setup
Copy the example environment file and fill in your keys:
```bash
cp .env.example .env.local
```

### 3. Install Dependencies
```bash
npm install
# 🦅 Assisi AI Concierge

Un assistant IA intelligent pour les touristes à Assise, intégrant un chatbot Telegram, une recherche vectorielle avancée et un système de monétisation pour les commerçants locaux.

## 🚀 Features

### 🤖 Smart Bot (Telegram)
- **Compréhension du Langage Naturel** : Utilise GPT-4o-mini pour répondre aux questions complexes.
- **Recherche Sémantique (RAG)** : Base de connaissances vectorielle (Supabase `pgvector`) pour trouver des lieux par concept (ex: "calme", "vue panoramique").
- **Données en Temps Réel** : Intégration Google Places API pour les horaires et avis.

### 💰 Système de Commission
- **Liens Trackés** : Génération de liens uniques signés cryptographiquement (HMAC).
- **Dashboard Commerçant** : Interface Web pour suivre le CA et les conversions.
- **Sécurité** : Protection anti-fraude sur les liens de parrainage.

## 🛠 Tech Stack
npm run test
```

## 📝 License
MIT
