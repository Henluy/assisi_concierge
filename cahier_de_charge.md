Cahier Complet de Prompts pour Antigravity : "Assisi AI Concierge"

Ce cahier vous permettra de réaliser 100% du projet en prompts copier-coller pour Google Antigravity. Chaque prompt génère des Artifacts (plans, implémentations, tests) que vous validez avant exécution.

---

🎯 PROMPT 0 : PROJET INITIAL (SETUP GLOBAL)

Contexte : Vous êtes dans un nouveau workspace vide. Ce prompt crée l'architecture complète.

```prompt
Créez un projet full-stack "Assisi AI Concierge" avec cette architecture :

**STACK TECHNIQUE** :
- Frontend : Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- Backend : API Route Next.js (serverless)
- Base de données : Supabase (PostgreSQL avec extension vector)
- LLM : OpenAI GPT-4o-mini
- Interface utilisateur : Telegram Bot + Webapp Next.js
- Déploiement : Vercel (configuration automatique)

**FONCTIONNALITÉS MVP** :
1. Chatbot Telegram multilingue (it/en/fr/de/es) répondant aux questions touristiques sur Assisi
2. Intégration base de connaissances locales (lieus saints, restaurants, horaires messes)
3. Recommandations intelligentes avec vector search
4. Système de commission pour réservations (tracking sans paiement pour MVP)
5. Dashboard admin pour ajouter/modifier les lieux

**CONTRAINTES** :
- Code modulaire avec séparation claire : src/lib/, src/components/, src/app/api/
- Types TypeScript stricts pour tous les modèles (Lieu, Message, Réservation)
- Gestion erreurs complète avec try/catch et logging
- Variables d'environnement dans .env.local (à ne JAMAIS commiter)
- Documentation JSDoc sur toutes les fonctions publiques

**LIVRABLES ATTENDUS** :
- README.md avec commandes setup, dev, deploy
- .env.example avec toutes les clés nécessaires (annotées)
- Structure de dossiers complète avec fichiers vides nommés
- package.json avec toutes les dépendances
- Configuration ESLint + Prettier
- GitHub Actions pour tests CI (fichier workflow)

**PROCESSUS** :
1. Générer Task Artifact avec checklist détaillée
2. Générer Implementation Plan avec chaque fichier à créer
3. Créer la structure projet complète
4. Ne PAS démarrer les services, juste valider la structure

Commencez par créer la structure de base puis attendez ma validation.
```

Résultat attendu : Antigravity crée un `Task Artifact` avec 30 tâches et un `Implementation Plan` détaillé.

---

🤖 PROMPT 1 : MVP CHATBOT TELEGRAM

Contexte : Après validation du Prompt 0, dans le même workspace.

```prompt
Maintenant, implémentez le MVP Chatbot Telegram :

**FONCTIONNALITÉS** :
1. Bot Telegram @AssisiConciergeBot (utiliser Telegram Bot API)
2. Endpoint API : `/api/bot/webhook` (POST) pour recevoir les messages
3. Logique de conversation :
   - Si message contient "mangiare" → recommander 3 restaurants avec notes Google
   - Si "pregare" → horaires messes + basiliques moins fréquentées
   - Si "dormire" → 3 hôtels/auberges avec prix moyen
   - Sinon → réponse générale sur l'histoire de Saint-François

**BASE DE CONNAISSANCES** :
- Créez un fichier `src/data/places.json` avec 15 lieus réels d'Assisi :
  - 5 restaurants (nom, adresse, tel, prix_moyen, avis_google, coords)
  - 5 lieus religieux (nom, horaires, capacité, secret_local)
  - 5 hébergements (nom, type, prix, dispo)

**INTÉGRATION OPENAI** :
- Utiliser `openai.chat.completions.create()`
- Prompt système : "Tu es le concierge officiel d'Assisi, expert en histoire et culture locale. Réponse courte (<100 mots) et actionable. Inclure emoji 🇮🇹"
- Température : 0.3 (précis)
- Max tokens : 150

**TESTS** :
- Créer un script `src/scripts/test-bot.ts` qui simule 3 conversations
- Vérifier que le webhook renvoie 200 OK
- Tester les 4 intents principaux

**SETUP** :
- Générer .env.example avec TELEGRAM_BOT_TOKEN (à obtenir sur t.me/BotFather)
- Générer README section "Setup Telegram Bot"
- Installer dépendances : `telegraf` ou `node-telegram-bot-api`

Créez les fichiers, les tests, puis exécutez le script de test. Générez un Artifact de test montrant les résultats.
```

---

📍 PROMPT 2 : INTEGRATION GOOGLE PLACES & MAPS

Contexte : Bot fonctionnel, besoin de données réelles.

```prompt
Ajoutez l'intégration Google Places API pour des recommandations dynamiques :

**FONCTIONNALITÉS** :
1. Nouveau endpoint `/api/places/search` (GET) :
   - Query params : `type` (restaurant|lodging), `language`, `maxPrice`
   - Utiliser Google Places API `nearbySearch` avec location Assisi (43.0708,12.6198)
   - Rayon : 5km
   - Filtrer les résultats avec rating > 4.0

2. Enrichir la réponse du bot :
   - Avant d'appeler OpenAI, faire un appel Places API
   - Injecter les 3 meilleurs résultats dans le contexte GPT
   - Format : "Restaurant La Taverna (⭐4.6, 25€/pers) - Via San Francesco 12"

**CONFIGURATION** :
- Ajouter GOOGLE_MAPS_API_KEY dans .env.example
- Créer `src/lib/google-places.ts` avec fonctions typées :
  - `searchPlaces(type, options)`
  - `getPlaceDetails(placeId)`
  - `calculateRoute(origin, destination)`

3. **CACHING** :
   - Utiliser Supabase Redis (ou simple table `place_cache`)
   - TTL : 24h pour les horaires, 7j pour les avis
   - Clé : `places:${type}:${lat}-${lng}`

**TESTS** :
- Script `src/scripts/test-places.ts` qui fait 3 recherches
- Vérifier le cache fonctionne (2ème appel plus rapide)
- Gestion erreurs : si API quota atteint → fallback sur `places.json` local

**Gestion des coûts** :
- Google offre 200€/mois de crédits
- Implémenter un rate-limiter : max 10 req/min
- Logger chaque appel avec coût estimé dans `src/lib/logger.ts`

Générez un Artifact montrant la structure de cache et les coûts projetés.
```

---

🔍 PROMPT 3 : VECTOR SEARCH SUPABASE

Contexte : Pour éviter les hallucinations et améliorer la pertinence.

```prompt
Implémentez un système de vector search avec Supabase pour la base de connaissances :

**SETUP** :
1. Activer extension `pgvector` sur Supabase
2. Créer table `knowledge_vectors` :
   ```sql
   CREATE TABLE knowledge_vectors (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     content TEXT NOT NULL,
     metadata JSONB, -- {type: 'church', name: 'Basilica', coords: [43.07, 12.61]}
     embedding VECTOR(1536)
   );
   ```

3. Créer fonction `match_knowledge(query TEXT, match_threshold FLOAT)` avec search similarity

IMPLEMENTATION :
- Créer `src/lib/embeddings.ts` :
  - `generateEmbedding(text: string) => number[]` (OpenAI `text-embedding-3-small`)
  - `storeKnowledge(content, metadata)` → upsert dans Supabase
  - `searchKnowledge(query, limit=3)` → retourne les chunks pertinents

DATA PIPELINE :
- Script `src/scripts/seed-knowledge.ts` :
  - Lire `places.json`
  - Pour chaque lieu, créer 3 chunks (description, horaires, conseils locaux)
  - Générer embeddings et stocker
  - Progress bar avec `cli-progress`

INTEGRATION BOT :
- Modifier `/api/bot/webhook` :
  1. Recevoir message
  2. Générer embedding de la question
  3. Faire vector search sur Supabase
  4. Injecter les 3 résultats dans le prompt GPT
  5. Répondre

PERFORMANCE :
- Ajouter index GIST sur la colonne embedding
- Cache des embeddings en mémoire (Redis si besoin)
- Temps de réponse objectif : <500ms pour le search

TESTS :
- Tester avec 10 questions typiques : "où manger du vrai italien ?", "messe en français ?"
- Vérifier que les résultats sont pertinents (pas d'hallucination)
- Benchmark performance : 100 recherches simultanées

Générez un Artifact avec le schéma SQL, les exemples de chunks, et les métriques de performance attendues.

```

---

## 💳 PROMPT 4 : SYSTEME DE COMMISSION & DASHBOARD

**Contexte** : Monétisation et interface commerçants.

```prompt
Implémentez le système de suivi des commissions et le dashboard admin :

**BASE DE DONNEES** :
- Table `merchants` : id, name, type, email, commission_rate (default 10%)
- Table `referrals` : id, user_id, merchant_id, amount, status ('pending'|'paid'), created_at
- Table `conversations` : log de toutes les interactions (anonymisé)

**API ENDPOINTS** :
1. `POST /api/referrals/track` : 
   - Body : {merchantId, userId, amount}
   - Vérifier que la recommandation vient bien du bot (signature HMAC)
   - Créer referral en 'pending'

2. `GET /api/merchants/dashboard` :
   - Auth avec Supabase Auth (magic link)
   - Retourne : total_commissions, nb_referrals, top_5_clients
   - Période : current_month vs last_month

3. `POST /api/merchants/register` :
   - Formulaire : nom, type, email
   - Envoi email de confirmation (via Resend ou SendGrid gratuit)
   - Création compte avec role 'merchant'

**FRONTEND DASHBOARD** :
- Route `/dashboard/login` : connexion avec magic link
- Route `/dashboard` :
  - KPI cards (commissions, conversions)
  - Table des dernières recommandations
  - Bouton "Modifier profil"
- Design shadcn/ui avec thème sombre/clair

**INTEGRATION BOT** :
- Modifier les réponses GPT : ajouter un footer "🔗 Réservé via AssisiConcierge" avec lien tracké
- Le lien contient `?ref=merchantId&sig=hmac`
- Lors du clic, appeler `/api/referrals/track`

**TESTS** :
- Script `src/scripts/test-commission.ts` :
  - Simuler 10 réservations
  - Vérifier que les commissions sont calculées correctement
  - Tester la sécurité : tentative de falsification de signature

**SETUP** :
- Variables d'environnement :
  - `COMMISSION_HMAC_SECRET` (générer avec `openssl rand -hex 32`)
  - `RESEND_API_KEY` (compte gratuit)
- Créer 2 merchants fictifs pour tests

Générez un Artifact avec la logique de signature HMAC, le modèle de données, et un screenshot du dashboard (code seulement).
```

---

🧪 PROMPT 5 : TESTS E2E & QUALITÉ

Contexte : Assurer la fiabilité avant production.

```prompt
Créez une suite de tests complète pour le projet :

**TESTS UNITAIRES** (Jest) :
- `tests/unit/bot.test.ts` : test des intents (mangiare, pregare, dormire)
- `tests/unit/places.test.ts` : mock Google Places API
- `tests/unit/embeddings.test.ts` : test vector search avec données factices
- `tests/unit/commission.test.ts` : test calcul commission + sécurité HMAC

**TESTS D'INTEGRATION** (Supertest) :
- `tests/integration/api.test.ts` :
  - POST /api/bot/webhook avec payload Telegram réel
  - GET /api/places/search avec différents filtres
  - POST /api/referrals/track avec signature valide/invalid
- Utiliser une base de test (Supabase projets séparés)

**TESTS E2E** (Playwright) :
- `tests/e2e/bot-flow.spec.ts` :
  1. Ouvrir Telegram Web
  2. Envoyer message au bot
  3. Vérifier réponse contient des recommandations
  4. Cliquer lien de réservation
  5. Vérifier tracking dans dashboard
- Tourner contre l'API déployée sur Vercel (preview)

**TESTS DE PERFORMANCE** :
- Script `tests/performance/load.js` (k6) :
  - 50 requêtes/sec sur /api/bot/webhook pendant 1 min
  - Objectif : p95 < 2s, erreurs < 0.1%
- Script `tests/performance/vector-search.js` :
  - 100 recherches simultanées sur Supabase
  - Mesurer latence moyenne

**QUALITÉ CODE** :
- Configurer ESLint avec règles strictes (no-any, explicit-return-types)
- Prettier avec format on save
- Husky pre-commit hooks :
  - lint-staged
  - tests unitaires doivent passer
  - pas de console.log

**COVERAGE** :
- Objectif : >80% coverage
- Ignorer : `src/scripts/` et fichiers de config
- Générer badge coverage dans README

**CI/CD** :
- GitHub Actions `.github/workflows/ci.yml` :
  - Run on push/PR
  - Lint, test unitaires, build
  - Déployer sur Vercel Preview
  - Lancer tests E2E sur Preview

Générez un Artifact avec la config complète (Jest, ESLint, Husky, GitHub Actions) et un rapport de test factice montrant 85% coverage.
```

---

🚀 PROMPT 6 : DEPLOIEMENT & DOCUMENTATION

Contexte : Dernière étape avant mise en ligne.

```prompt
Préparez le déploiement en production et la documentation complète :

**DEPLOIEMENT VERCEL** :
1. Créer `vercel.json` avec config :
   - Build command : `npm run build`
   - Install command : `npm ci`
   - Ignorer dossiers inutiles (tests, scripts)
   - Variables d'environnement à setter côté Vercel

2. Générer `deploy.sh` :
   ```bash
   #!/bin/bash
   # Vérifier .env.example complet
   # Run tests
   # Deploy to Vercel
   # Run E2E tests
   # Switch production
   ```

DOCUMENTATION :
- `README.md` complet avec :
  - 🎯 Vue d'ensemble du projet
  - 📋 Prérequis (Node 20+, Supabase CLI)
  - 🔧 Setup étape par étape (BotFather, OpenAI, Google Maps)
  - 🏃‍♂️ Développement local (`npm run dev`)
  - 🧪 Lancer les tests
  - 🚀 Déploiement production
  - 📊 Monitoring (configurer Vercel Analytics)
  - 🤝 Contribution guide

- `docs/merchant-onboarding.md` :
  - Comment s'inscrire en tant que commerçant
  - Installer le badge "Réservé via AssisiConcierge"
  - Suivre ses commissions

- `docs/api-reference.md` :
  - OpenAPI/Swagger documentation
  - Exemples curl pour chaque endpoint

MONITORING :
- Intégrer Sentry pour error tracking (compte gratuit)
- Configurer Vercel Analytics
- Créer dashboard Grafana (optionnel, utilisant Vercel logs)

OPTIMISATIONS :
- Implémenter React.memo sur composants chers
- Ajouter caching Redis (Upstash gratuit) pour les embeddings
- Optimiser images avec Next.js Image
- Configurer `stale-while-revalidate` sur API routes

CHECKLIST PRE-PRODUCTION :
- Toutes les variables d'env configurées sur Vercel
- Bot Telegram en mode webhook (pas polling)
- Domaine personnalisé configuré
- SSL activé
- Rate limiting sur API (Upstash Ratelimit)
- Emails de confirmation testés
- Sentry testé avec erreur factice
- Coverage >80%
- Documentation à jour

Générez un Artifact final contenant :
- La checklist signée (en code comment)
- Les commandes exactes pour setup production
- Un message de commit "feat: initial production release"

```

---

## 🎨 PROMPT BONUS : ITÉRATION & AMÉLIORATIONS

**Contexte** : Pour évolution future, après le MVP.

```prompt
Maintenant que le MVP est en production, implémentez ces features d'amélioration :

**FEATURE 1 : Reconnaissance d'Images**
- Endpoint `/api/vision/analyze` (POST) qui reçoit une photo
- Utiliser OpenAI Vision API pour identifier :
  - Œuvres d'art dans les basiliques
  - Plats typiques pour recommandations food
  - Paysages pour itinéraires randonnée
- Retourner description + histoire + lieu exact

**FEATURE 2 : Prédiction des Files d'Attente**
- Scraper horaires messes sur site officiel Assisi
- Agréger données historiques de visites (simulées d'abord)
- Modèle prédictif simple : heure de la journée + jour semaine + saison
- Endpoint `/api/predict/wait-time?placeId=XXX`

**FEATURE 3 : Expériences Audio IA**
- Générer audioguides avec OpenAI TTS (text-to-speech)
- QR Code dans chaque lieu → lien vers audio commentaire
- Stockage sur Supabase Storage (1GB gratuit)
- Endpoint `/api/audio/generate` (coût : 0,015€/min)

**FEATURE 4 : Marketplace d'Expériences**
- Table `experiences` : ateliers ombriens, dégustations, visites guidées
- Système de réservation avec calendrier (Cal.com API gratuit)
- Commission 15% sur expériences

Pour chaque feature :
1. Générer Task Artifact indépendant
2. Implémenter avec feature flag (canary deployment)
3. Écrire tests spécifiques
4. Mettre à jour documentation

Commencez par la Feature 1 (Vision) en créant la structure, puis attendez validation.
```

---

📋 CHECKLIST DE VERIFICATION ANTI-GRAVITY

Avant de lancer chaque prompt, assurez-vous :

- ✅ Workspace propre : `git init` si besoin
- ✅ Agent Manager sélectionné et modèle Gemini 3 Pro ou Claude Sonnet
- ✅ Terminal accessible (`which node` doit retourner v20+)
- ✅ Permissions : Allow List configuré pour `npm`, `npx`, `vercel`
- ✅ Env setup : avoir vos clés API prêtes à coller quand demandé

Pro-tip Antigravity : Après chaque gros prompt, tapez  "Show me the Implementation Artifact"  . Vous pouvez l'éditer avant de dire  "Proceed with implementation"  . C'est votre garde-fou contre les dérapages.

---

🔑 VARIABLES D'ENVIRONNEMENT A PREPARER

Copiez cette liste dans un fichier `SECRETS_TO_GET.md` :

```env
# Telegram
TELEGRAM_BOT_TOKEN=Obtenir sur t.me/BotFather (Bot Father → /newbot)

# OpenAI
OPENAI_API_KEY=Obtenir sur platform.openai.com (créer clé avec $5 credits gratuits)

# Google Maps
GOOGLE_MAPS_API_KEY=Obtenir sur console.cloud.google.com (activer Places API + Maps API)

# Supabase
SUPABASE_URL=Obtenir après création projet sur supabase.com
SUPABASE_SERVICE_ROLE_KEY=Clé "service_role" dans Settings > API
NEXT_PUBLIC_SUPABASE_ANON_KEY=Clé "anon" dans Settings > API

# Commission Security
COMMISSION_HMAC_SECRET=Générer avec : openssl rand -hex 32

# Email (optionnel pour phase 2)
RESEND_API_KEY=Obtenir sur resend.com (50 emails/jour gratuits)

# Sentry (optionnel)
SENTRY_DSN=Obtenir après création projet sur sentry.io
```

---

💰 BUDGET REEL PREVISIONNEL

Après implémentation, vos coûts seront :

Service	Gratuit	Payant (à l'échelle)	
Telegram Bot	illimité	0€	
OpenAI GPT-4o mini	5 credits	0,15€/M tokens (0,05€/conversation)	
Google Maps	200€/mois crédits	5-15€/mois après	
Supabase	500 MB, 50k users	25€/mois pour 8GB	
Vercel	10k req/mois	20€/mois pour 100k req	
Resend	50 emails/jour	10€/mois pour 5k emails	

Seuil rentabilité : 20 touristes premium/mois ou 3 commerçants couvrent tous les coûts.

---

Lancez les prompts un par un dans l'ordre. Ne passez au suivant que quand Antigravity a terminé et que vous avez testé. La magie d'Antigravity est dans l'itération, pas la précipitation.