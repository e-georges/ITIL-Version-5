# Révisio — Phase 1 (Setup)

Scaffold fonctionnel : Next.js 15 + TypeScript + Tailwind, auth Supabase (email/mot de passe + Google), schéma SQL complet avec RLS, et provisionnement automatique du squelette officiel (tronc commun de Seconde générale) à la création d'un compte élève.

## Ce qui est livré

- Auth complète : inscription (parent/élève), connexion, Google OAuth
- Schéma SQL Supabase (3 migrations) avec Row Level Security par famille
- Provisionnement automatique : un nouveau compte élève reçoit immédiatement les matières et chapitres du tronc commun de Seconde
- Dashboard élève (squelette : "Aujourd'hui", liste des matières en cartes "intercalaire")
- Dashboard parent (squelette : liste des enfants rattachés)
- PWA de base (manifest.json)

## Ce qui n'est PAS encore fait (Phase 2+)

- Pipeline IA (génération de fiches/quiz) — branché sur `app/api/ai/...` à créer
- Ajout de cours (formulaire de saisie manuelle)
- Quiz, scoring, révision espacée, calcul de maîtrise
- **Rattachement parent ↔ enfant** : actuellement, chaque inscription crée sa propre famille isolée. Il manque un système d'invitation (code à partager) pour qu'un parent et son enfant se retrouvent dans la même famille. À concevoir avant tout test réel à deux comptes.
- Canaux photo (V1.1) et URL (V1.2)

## Mise en route

### 1. Installer les dépendances

```bash
npm install
```

### 2. Créer le projet Supabase

Sur [supabase.com](https://supabase.com), crée un nouveau projet, puis récupère dans **Project Settings > API** :
- l'URL du projet
- la clé `anon` (publique)
- la clé `service_role` (à garder secrète, utile en Phase 2 pour les appels IA)

Copie `.env.example` vers `.env.local` et renseigne ces valeurs.

### 3. Appliquer les migrations

Avec la CLI Supabase (`npm install -g supabase`), depuis la racine du projet :

```bash
supabase link --project-ref TON_PROJECT_ID
supabase db push
```

Ou, plus simplement pour démarrer : copie-colle le contenu des 3 fichiers de `supabase/migrations/` dans l'éditeur SQL du dashboard Supabase, dans l'ordre (0001, 0002, 0003).

### 4. Activer Google OAuth (optionnel pour démarrer)

Dans **Authentication > Providers** sur le dashboard Supabase, active Google et renseigne un Client ID/Secret OAuth (console Google Cloud).

### 5. Lancer en local

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000) — tu seras redirigé vers `/login`.

### 6. Tester le provisionnement automatique

Crée un compte avec le rôle **Élève**. Tu devrais immédiatement voir apparaître les 8 matières du tronc commun (Français, Maths, Histoire-Géo, Physique-Chimie, SVT, SES, Anglais, Espagnol) avec leurs chapitres, sur le dashboard.

## Prochaine étape (Phase 2)

Construire le pipeline IA unique (`lib/ai/pipeline.ts`) : un seul point d'entrée qui reçoit un texte normalisé (peu importe le canal), appelle l'Agent Fiche puis l'Agent Quiz, et fait passer le chapitre concerné de `content_tier = 'generic'` à `content_tier = 'authoritative'`.
