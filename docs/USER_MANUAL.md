# Manuel Utilisateur - Assisi AI Concierge

## 1. Pour les Commerçants (Merchants)

### Accéder à votre Tableau de Bord
Votre tableau de bord personnel est accessible via le lien unique fourni par l'administrateur (ex: `https://assisi.ai/dashboard?merchantId=XXX`).
Ce lien est **privé**, ne le partagez pas.

### Comprendre vos Statistiques
- **Chiffre d'Affaires** : Total estimé des réservations générées par le bot.
- **Clients Apportés** : Nombre total de clics validés sur vos liens "Réserver".
- **Conversion** : Taux d'utilisateurs ayant cliqué par rapport aux recommandations affichées (fonctionnalité à venir).

### Activité Récente
Le tableau en bas de page montre les 10 dernières interactions en temps réel.
- **Statut "Pending"** : Le client a cliqué mais la transaction n'est pas encore finalisée.
- **Statut "Paid"** : Commission validée (intégration Stripe future).

## 2. Pour les Administrateurs

### Ajouter un Lieu (Knowledge Base)
Pour l'instant, l'ajout se fait via l'équipe technique.
Envoyez les informations suivantes :
- Nom du lieu
- Type (Restaurant, Hôtel, etc.)
- Description riche (pour la recherche sémantique)
- Adresse et Coordonnées GPS

### Mises à jour de l'IA
Le bot apprend automatiquement des nouveaux lieux ajoutés à la base de données. Aucune action de redémarrage n'est nécessaire.
