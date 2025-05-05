# ReviewBoost-AI

ReviewBoost-AI est une application Shopify qui permet aux marchands de collecter, analyser et afficher les avis clients de manière intelligente grâce à l'IA.

## Fonctionnalités principales

- 🛍️ Intégration Shopify native
- 📧 Envoi automatique de demandes d'avis après livraison
- 🤖 Analyse IA des avis (sentiment, mots-clés, résumé)
- 📊 Tableau de bord analytique
- 🎯 Widget d'affichage des avis personnalisable
- 📱 Interface responsive et moderne

## Technologies utilisées

- Frontend : Next.js (App Router), React
- UI : Tailwind CSS + Shadcn/ui
- Backend : Next.js API Routes
- Base de données : MongoDB Atlas
- Auth : OAuth 2.0 avec Shopify
- Hébergement : Vercel
- Stockage fichiers : AWS S3
- IA : OpenAI API

## Installation

1. Clonez le repository :
```bash
git clone https://github.com/annis94/ReviewBoost-AI.git
cd ReviewBoost-AI
```

2. Installez les dépendances :
```bash
npm install
```

3. Configurez les variables d'environnement :
```bash
cp .env.example .env.local
```

4. Démarrez le serveur de développement :
```bash
npm run dev
```

## Configuration requise

- Node.js 18+
- MongoDB Atlas
- Compte Shopify Partner
- Clés API OpenAI
- Compte AWS S3
- Compte SendGrid

## Structure du projet

```
reviewboost-ai/
├── app/                    # Pages et routes Next.js
├── components/            # Composants React réutilisables
├── lib/                   # Utilitaires et configurations
├── models/               # Modèles MongoDB
├── public/               # Fichiers statiques
└── styles/               # Styles globaux
```

## Licence

MIT 