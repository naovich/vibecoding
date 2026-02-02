# 🤖 VibeCoding Template

**Template de base pour TOUS vos projets React + TypeScript**

Starter production-ready avec TDD, ESLint strict, hooks Git automatiques, et documentation auto-générée.

> 🎯 **Objectif:** Cloner ce repo pour démarrer N'IMPORTE QUEL nouveau projet React TypeScript avec toutes les bonnes pratiques déjà configurées.

## 🚀 Démarrer un Nouveau Projet

### 1. Cloner le Template

```bash
# Cloner dans un nouveau dossier
git clone https://github.com/naovich/vibecoding.git mon-nouveau-projet
cd mon-nouveau-projet

# Supprimer l'historique Git du template
rm -rf .git

# Initialiser un nouveau repo Git
git init
git add .
git commit -m "chore: init from vibecoding template"
```

### 2. Personnaliser

```bash
# Mettre à jour package.json
npm pkg set name="mon-nouveau-projet"
npm pkg set description="Description de mon projet"
npm pkg set author="Votre Nom"

# Installer les dépendances
npm install
```

### 3. Développer

```bash
# Lancer le serveur de dev
npm run dev

# Tests en mode watch
npm test

# Build production
npm run build
```

### 4. Adapter le Contenu

- Modifier `src/App.tsx` avec votre UI
- Ajouter vos composants dans `src/components/` (créer le dossier)
- Mettre à jour `README.md` avec la doc de votre projet
- Garder `AGENT.md` et `CLAUDE.md` pour les règles de développement

---

## ⚡ Quick Start (Développement)

```bash
npm install          # Installation
npm run dev          # Développement
npm test             # Tests
npm run build        # Build production
```

## 📚 Documentation Automatique

Deux fichiers sont **générés automatiquement** avant chaque commit :

### 📄 `CODEBASE.md`

**Carte de tous les exports du projet** (functions, components, types)

- Généré par : `npm run map`
- Contenu : Signatures + JSDoc de tous les exports
- Usage : **Éviter les duplications** - consulte ce fichier avant de créer une nouvelle fonction/composant

**Exemple :**

```markdown
## 📁 src/

### App.tsx

**Components:**

- `App` _(default export)_
  - Main application component - VibeCoding template landing page
```

### 📁 `FILE_TREE.md`

**Arborescence complète du projet**

- Généré par : `npm run tree`
- Contenu : Structure de tous les dossiers et fichiers
- Usage : Vue d'ensemble rapide de l'organisation

**Exemple :**

```
vibecoding/
├── src/
│   ├── App.tsx
│   └── index.css
├── scripts/
└── package.json
```

## 🛠️ Commandes Utiles

```bash
# Documentation (auto à chaque commit)
npm run docs              # Génère FILE_TREE.md + CODEBASE.md

# Documentation enrichie avec AI (optionnel)
npm run map:ai            # CODEBASE.md avec descriptions AI (Claude Code)

# Linting & Formatting
npm run lint              # Vérifier le code
npm run lint:fix          # Corriger automatiquement
npm run format            # Formatter avec Prettier

# Tests
npm test                  # Mode watch
npm run test:run          # Run once
npm run test:coverage     # Avec coverage

# Validation complète (pre-push)
npm run validate          # lint + type-check + tests
```

## 🎯 Features

- ✅ **TypeScript Strict Mode** - Zero tolerance pour `: any`
- ✅ **TDD avec Vitest** - Coverage minimum 80%
- ✅ **ESLint + SonarJS** - Complexité max 15
- ✅ **Prettier + Husky** - Auto-format au commit
- ✅ **Tailwind CSS v4** - Atomic CSS
- ✅ **Règles Unicorn** - Best practices modernes (Node.js, String methods)
- ✅ **Pre-commit hooks** - Bloque si lint/tests/types échouent
- ✅ **Documentation auto** - FILE_TREE.md + CODEBASE.md

## 📖 Documentation Développeur

- [`AGENT.md`](./AGENT.md) - **Guide complet** pour développeurs et AI agents
- [`docs/generate-codebase-map.md`](./docs/generate-codebase-map.md) - Documentation du générateur CODEBASE.md
- [`CODEBASE.md`](./CODEBASE.md) - Carte des exports (auto-généré)
- [`FILE_TREE.md`](./FILE_TREE.md) - Arborescence projet (auto-généré)

## 🔧 Configuration

### Règles ESLint Strictes

Le projet enforce automatiquement :

- **SonarJS** : Qualité de code (complexité, duplications)
- **Unicorn** : Best practices modernes (S7772, S7773, S7781, S7785, S4138)
- **JSDoc** : Documentation obligatoire sur exports
- **Tailwind** : Syntaxe canonique
- **TypeScript** : No `any`, explicit return types
- **Line Endings** : LF uniquement (pas de CRLF)

Tout commit qui viole ces règles est **automatiquement bloqué**.

## 🚨 Workflow de Développement

### 1. Avant de coder

```bash
# Vérifier si la fonction/composant existe déjà
cat CODEBASE.md | grep "functionName"
cat FILE_TREE.md | grep "ComponentName"
```

**⚠️ DRY Principle** : Consulte `CODEBASE.md` **avant** de créer du code. Si quelque chose de similaire existe, réutilise ou refactorise.

### 2. Pendant le développement

```bash
# TDD : Tests FIRST !
npm test                 # Mode watch

# Type checking en continu
npm run type-check:watch
```

### 3. Avant le commit

Les **pre-commit hooks** exécutent automatiquement :

- ✅ Génération de FILE_TREE.md + CODEBASE.md
- ✅ ESLint --fix (corrige ce qui peut l'être)
- ✅ Prettier --write (formatage)
- ✅ TypeScript type-check
- ✅ Tests sur fichiers modifiés

**Si ça échoue → commit bloqué**. Corrige les erreurs et recommit.

### 4. Avant le push

Les **pre-push hooks** exécutent :

- ✅ Build TypeScript complet
- ✅ Tous les tests
- ✅ Vérification coverage ≥ 80%

**Sois patient, ça prend ~60 secondes.**

## 📝 Convention de Commit

```bash
type(scope): description

# Types valides:
feat, fix, docs, style, refactor, perf, test, chore, ci, revert

# Exemples:
git commit -m "feat: add user authentication"
git commit -m "fix(api): resolve timeout issue"
git commit -m "docs: update README"
```

**Format obligatoire** - commitlint bloquera sinon.

## 🎓 Apprendre Plus

Lis [`AGENT.md`](./AGENT.md) pour :

- Règles de code détaillées
- Best practices React/TypeScript
- Exemples complets
- Workflow TDD
- Guide de debugging

---

## 🗺️ Roadmap

Ce template est en constante amélioration. Prochaines additions:

### Phase 1 - Fondations

- [ ] Structure folders (`components/`, `hooks/`, `lib/`, `types/`)
- [ ] Path aliases TypeScript (`@/components`, `@/lib`)
- [ ] `.env.example` pour variables d'environnement

### Phase 2 - Composants UI

- [ ] `Button` component (primary, secondary, danger variants)
- [ ] `Input` component avec validation
- [ ] `Card` container réutilisable
- [ ] `ErrorBoundary` pour error handling

### Phase 3 - Hooks & Utils

- [ ] `useLocalStorage` hook
- [ ] `useDebounce` hook
- [ ] `lib/utils.ts` (cn, formatters, etc.)
- [ ] `lib/validators.ts` (email, url, phone)

### Phase 4 - DevEx

- [ ] GitHub Actions CI/CD
- [ ] `CONTRIBUTING.md`
- [ ] `test-utils.tsx` avec custom render

**Voir** [`CODE_REVIEW.md`](./CODE_REVIEW.md) pour l'analyse complète et les priorités.

---

## 📦 Variantes Futures

Des variantes du template seront ajoutées:

- `vibecoding` - Template de base (actuel)
- `vibecoding-router` - Avec React Router configuré
- `vibecoding-api` - Avec API client + React Query
- `vibecoding-full` - Full-stack avec backend Node.js

---

**Template créé avec ❤️ pour des projets maintenables et évolutifs.**
