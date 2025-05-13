# CV-AI: Générateur de CV Intelligent avec OpenAI

CV-AI est une application web Next.js qui exploite la puissance d'OpenAI (GPT-3.5 Turbo) pour aider les utilisateurs à générer des CV professionnels et personnalisés. Les utilisateurs peuvent fournir des informations sur leur profil, des instructions spécifiques et une description de poste pour obtenir un CV structuré au format JSON, qui est ensuite rendu en PDF.

**(Optionnel mais recommandé) :**
> **Lien vers la démo live :** `[URL_DE_VOTRE_DEMO_LIVE_ICI]`
>
> **Screenshots :**
> ![Screenshot Interface CV-AI](chemin/vers/votre/screenshot_interface.png)
> ![Screenshot PDF Généré](chemin/vers/votre/screenshot_pdf.png)

## Table des Matières

1.  [Fonctionnalités Principales](#fonctionnalités-principales)
2.  [Stack Technique](#stack-technique)
3.  [Architecture et Flux de Données](#architecture-et-flux-de-données)
4.  [Structure du Projet](#structure-du-projet)
5.  [Prérequis](#prérequis)
6.  [Installation](#installation)
7.  [Variables d'Environnement](#variables-denvironnement)
8.  [Lancement du Projet](#lancement-du-projet)
9.  [Logique Clé : Prompt Engineering et Validation](#logique-clé--prompt-engineering-et-validation)
10. [Points d'Intérêt et Évolutions Possibles](#points-dintérêt-et-évolutions-possibles)

## Fonctionnalités Principales

*   **Génération de CV Basée sur l'IA**: Utilise l'API OpenAI (GPT-3.5 Turbo) pour analyser les informations fournies par l'utilisateur.
*   **Personnalisation Avancée**:
    *   Prise en compte d'un **prompt utilisateur** décrivant son profil.
    *   Possibilité d'ajouter des **instructions spécifiques** pour guider l'IA (ex: mettre en avant certains projets, adapter le ton).
    *   Adaptation du CV à une **description de poste** fournie, en optimisant le contenu pour les mots-clés et compétences recherchées.
*   **Sortie Structurée en JSON**: L'IA est contrainte de retourner les données du CV dans un format JSON prédéfini et validé.
*   **Rendu PDF**: Génération d'un document CV au format PDF à partir des données JSON, en utilisant `@react-pdf/renderer`.
*   **Interface Utilisateur Intuitive**: Page d'accueil avec formulaire pour saisir les informations et visualiser le résultat.
*   **Validation des Entrées**: Vérification de la présence du prompt utilisateur.
*   **Nettoyage et Validation des Données IA**: Une fonction `cleanAndValidateJSON` assure que la réponse de l'IA est conforme à la structure attendue et gère les champs manquants.
*   **Logs Détaillés**: Pour le débogage et le suivi du processus de génération côté serveur (route API).

## Stack Technique

*   **Framework Frontend & Backend (API Route)**: Next.js 14 (App Router)
*   **Langage**: TypeScript
*   **Intelligence Artificielle**: OpenAI API (modèle `gpt-3.5-turbo-1106`)
*   **Génération PDF**: `@react-pdf/renderer`
*   **Styling**: Tailwind CSS
*   **Composants UI**: Shadcn/ui (Button, Card, Textarea, Label, Input)
*   **Icônes**: Lucide React
*   **Utilitaires**: `clsx`, `tailwind-merge` (via `cn` de Shadcn/ui)

## Architecture et Flux de Données

1.  **Frontend (`app/page.tsx`)**:
    *   L'utilisateur remplit un formulaire avec son profil (`prompt`), des instructions optionnelles et une description de poste optionnelle.
    *   À la soumission, une requête `POST` est envoyée à la route API `/api/generate-cv`.
2.  **Backend - API Route (`app/api/generate-cv/route.ts`)**:
    *   Réception des données du frontend.
    *   Construction d'un **meta-prompt** détaillé et structuré pour guider le modèle OpenAI. Ce prompt inclut :
        *   Le rôle de l'assistant IA.
        *   La tâche spécifique (extraction et structuration des informations).
        *   Des instructions conditionnelles basées sur la présence d'une description de poste.
        *   Des règles strictes pour le format de sortie (JSON uniquement, structure exacte).
        *   La structure JSON attendue.
        *   Les informations de l'utilisateur et ses instructions spécifiques.
    *   Appel à l'API OpenAI avec le `meta-prompt` et demande d'une réponse au format `json_object`.
    *   Réception de la réponse JSON brute de l'IA.
    *   Nettoyage et validation de cette réponse via la fonction `cleanAndValidateJSON` pour s'assurer de sa conformité avec `CVStructure`.
    *   Renvoi des données CV structurées au frontend.
3.  **Frontend (`app/page.tsx` & `app/components/CVDocument.tsx`)**:
    *   Réception des données CV.
    *   Passage des données au composant `CVDocument`.
    *   Utilisation de `@react-pdf/renderer` et `PDFViewer` pour afficher le CV généré en PDF directement dans le navigateur.

## Structure du Projet


CV-ai/
├── app/
│ ├── api/
│ │ └── generate-cv/
│ │ └── route.ts # Logique backend pour l'appel OpenAI
│ ├── components/
│ │ └── CVDocument.tsx # Composant pour le rendu PDF du CV
│ ├── globals.css
│ ├── layout.tsx
│ └── page.tsx # Interface utilisateur principale
├── components/
│ └── ui/ # Composants Shadcn/ui (Button, Card, etc.)
├── lib/
│ └── utils.ts # Fonction utilitaire cn
├── .env.local.example # Fichier d'exemple pour OPENAI_API_KEY
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── tsconfig.json

## Prérequis

*   Node.js (version 18.x ou supérieure recommandée)
*   npm ou yarn
*   Une clé API OpenAI

## Installation

1.  Clonez le dépôt :
    ```bash
    git clone https://github.com/VOTRE_NOM_UTILISATEUR/CV-ai.git
    cd CV-ai
    ```
2.  Installez les dépendances :
    ```bash
    npm install
    # ou
    yarn install
    ```

## Variables d'Environnement

Pour que l'application fonctionne, vous devez fournir votre clé API OpenAI.

1.  Créez un fichier `.env.local` à la racine du projet (vous pouvez copier `.env.local.example` s'il existe).
2.  Ajoutez votre clé API :
    ```env
    OPENAI_API_KEY="sk-VotreCléOpenAI"
    ```
    **Important** : N'oubliez pas d'ajouter `.env.local` à votre fichier `.gitignore` pour ne pas exposer votre clé API.

## Lancement du Projet

Pour démarrer le serveur de développement :
```bash
npm run dev
# ou
yarn dev
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
IGNORE_WHEN_COPYING_END

Ouvrez http://localhost:3000 dans votre navigateur.

Logique Clé : Prompt Engineering et Validation

L'efficacité de ce projet repose sur deux piliers principaux dans app/api/generate-cv/route.ts:

Prompt Engineering Avancé: Un meta-prompt très détaillé est construit dynamiquement. Il donne des instructions claires et précises à OpenAI sur le rôle attendu, le format de sortie (JSON strict), la structure des données, et comment utiliser les informations de l'utilisateur, les instructions spécifiques, et l'éventuelle description de poste. L'option response_format: { type: "json_object" } est utilisée pour renforcer la contrainte de format.

Validation et Nettoyage Rigoureux (cleanAndValidateJSON): Même avec des prompts stricts, les LLMs peuvent parfois produire des sorties imparfaites. Cette fonction garantit que le JSON reçu d'OpenAI est parsé correctement, que les champs attendus sont présents (avec des valeurs par défaut si manquants), et que les types de données sont respectés, assurant ainsi la robustesse avant le rendu PDF.

