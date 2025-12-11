# Déploiement - Assisi AI Concierge

Ce guide détaille les étapes pour déployer l'application sur Vercel et configurer l'environnement de production.

## 1. Prérequis Supabase

Assurez-vous que votre projet Supabase est configuré pour la production.

### Extensions
Dans le tableau de bord Supabase > Database > Extensions :
- Activez `vector` (pour le module de recherche sémantique).

### Schéma de Base de Données
Exécutez les scripts de migration suivants dans l'éditeur SQL :
1. `supabase/migrations/init_vector.sql` : Tables pour le Knowledge Base.
2. `supabase/migrations/init_commission.sql` : Tables pour les Commissions.

### Données
Pour initialiser la base de connaissances en production :
1. Configurez les variables d'environnement locales avec les credentials de prod.
2. Lancez `npx tsx src/scripts/seed-knowledge.ts`.

## 2. Déploiement Vercel

### Import du Projet
1. Connectez votre compte GitHub à Vercel.
2. Importez le repository `assisi_concierge`.
3. Laissez les paramètres de build par défaut (Framework: Next.js).

### Variables d'Environnement
Ajoutez les variables suivantes dans **Settings > Environment Variables** sur Vercel :

| Variable | Description |
|----------|-------------|
| `TELEGRAM_BOT_TOKEN` | Token du bot (@BotFather) |
| `OPENAI_API_KEY` | Clé API OpenAI |
| `GOOGLE_MAPS_API_KEY` | Clé API Google Maps |
| `SUPABASE_URL` | URL de l'instance Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé secrète (Admin) pour le backend |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique pour le client |
| `COMMISSION_HMAC_SECRET` | Clé aléatoire pour signer les liens (ex: `openssl rand -hex 32`) |

## 3. Webhook Telegram

Une fois déployé, vous devez connecter le webhook Telegram à votre URL de production.
Exécutez cette commande dans votre terminal local :

```bash
curl -F "url=https://VOTRE-PROJET.vercel.app/api/bot/webhook" https://api.telegram.org/bot<VOTRE_BOT_TOKEN>/setWebhook
```

## 4. Vérification post-déploiement

1. Ouvrez votre bot Telegram et envoyez `/start`.
2. Testez une requête complexe : "Où manger italien ?".
3. Vérifiez le Dashboard à l'adresse `https://VOTRE-PROJET.vercel.app/dashboard`.
