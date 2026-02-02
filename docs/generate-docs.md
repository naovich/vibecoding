# 📚 Documentation Generator - Guide d'utilisation

Script TypeScript qui génère automatiquement une documentation structurée du projet.

## 🎯 Fonctionnalités

- ✅ **Chemins relatifs** : Génère des chemins relatifs au projet (pas de chemins absolus Windows)
- 🤖 **Mode AI intelligent** : Option `--ai` qui documente uniquement les fichiers modifiés/créés récemment
- 📁 **Arborescence visuelle** : Affiche la structure du projet avec des icônes
- 📄 **Contenu complet** : Inclut le code source de chaque fichier documenté
- 🔍 **Filtrage intelligent** : Ignore automatiquement `node_modules`, `.git`, etc.

## 📦 Installation

Aucune installation nécessaire ! Le script utilise `tsx` via `npx`.

## 🚀 Utilisation

### Mode complet (tous les fichiers du dossier `src/`)

```bash
npx tsx scripts/generate-docs.ts
```

Génère la documentation de **tous** les fichiers dans `src/`.

### Mode AI (uniquement les fichiers modifiés)

```bash
npx tsx scripts/generate-docs.ts --ai
```

Génère la documentation **uniquement** des fichiers :

- Modifiés mais non commités (`git status`)
- Présents dans le dernier commit (`git diff-tree HEAD`)

**Idéal pour :**

- Documenter rapidement les changements récents
- Partager le contexte d'une feature en cours
- Créer une documentation incrémentale
- Éviter de générer une doc massive

## 📊 Exemple de sortie (mode AI)

```
🚀 Génération de la documentation du projet...

🤖 Mode AI activé : seuls les fichiers modifiés/créés seront documentés

📝 Fichiers détectés (3) :
   - src/components/Button.tsx
   - src/utils/helpers.ts
   - README.md

✅ Documentation générée avec succès !
📁 Fichier : PROJECT_STRUCTURE.md
📊 Fichiers documentés : 3
```

## 📝 Format de sortie

Le fichier `PROJECT_STRUCTURE.md` généré contient :

1. **En-tête** avec date de génération
2. **Arborescence** du projet
3. **Contenu détaillé** de chaque fichier avec coloration syntaxique

### Exemple d'arborescence générée

```markdown
## 📂 Arborescence

- 📁 **src/**
  - 📁 **components/**
    - 📄 Button.tsx
  - 📁 **utils/**
    - 📄 helpers.ts
  - 📄 App.tsx
```

### Exemple de contenu généré

```markdown
## 📁 src/components/

### src/components/Button.tsx

typescript
import React from 'react';

export const Button: React.FC = () => {
return <button>Click me</button>;
};
```

## ⚙️ Configuration

### Extensions de fichiers supportées

Par défaut, le script documente :

- `.ts`, `.tsx`, `.js`, `.jsx`
- `.json`
- `.css`, `.scss`
- `.md`, `.html`
- `.yml`, `.yaml`

Modifiez la constante `VALID_EXTENSIONS` dans le script pour ajouter d'autres extensions.

### Dossiers/fichiers ignorés

Par défaut, le script ignore :

- `node_modules`
- `.git`
- `dist`, `build`, `.next`
- `coverage`
- `.env`, `.env.local`
- `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`

Modifiez la constante `IGNORE_PATTERNS` pour ajuster.

## 🤖 Mode AI - Détection des fichiers modifiés

Le mode `--ai` utilise Git pour détecter les fichiers modifiés :

```bash
# Fichiers non commités (staged + unstaged)
git status --porcelain

# Fichiers du dernier commit
git diff-tree --no-commit-id --name-only -r HEAD
```

**Note :** Si Git n'est pas disponible, le script documentera tous les fichiers (fallback).

## 🎨 Chemins relatifs vs absolus

### ❌ Avant (chemins absolus Windows)

```markdown
## 📁 root/

### D:\Dev\Project\vibecoding\src\App.tsx
```

### ✅ Après (chemins relatifs)

```markdown
## 📁 src/

### src/App.tsx
```

Les chemins sont maintenant relatifs au projet, ce qui rend la documentation :

- **Portable** : fonctionne quel que soit l'emplacement du projet
- **Lisible** : moins de bruit visuel
- **Multi-plateforme** : compatible Windows/Linux/Mac

## 🔧 Intégration

### Commande npm

Utilisez directement :

```bash
npx tsx scripts/generate-docs.ts        # Mode complet
npx tsx scripts/generate-docs.ts --ai   # Mode AI (fichiers modifiés uniquement)
```

**Note :** Ce script utilise `tsx` pour TypeScript. Les arguments fonctionnent directement.

### Hook Git (pre-commit)

Pour générer automatiquement la doc avant chaque commit :

```json
// .husky/pre-commit ou .lintstagedrc.json
{
  "*.{ts,tsx}": ["npx tsx scripts/generate-docs.ts --ai"]
}
```

## 💡 Cas d'usage

### 1. Documentation complète du projet

```bash
npx tsx scripts/generate-docs.ts
```

→ Génère une vue d'ensemble de tout le code source

### 2. Partager un changement avec un collaborateur

```bash
# Après avoir modifié quelques fichiers
npx tsx scripts/generate-docs.ts --ai
# Partager PROJECT_STRUCTURE.md
```

→ Documentation ciblée des changements récents

### 3. Préparer une PR/code review

```bash
git add .
git commit -m "feat: new feature"
npx tsx scripts/generate-docs.ts --ai
```

→ Documentation des fichiers du dernier commit

### 4. Onboarding d'un nouveau développeur

```bash
npx tsx scripts/generate-docs.ts
```

→ Vue complète de l'architecture du projet

## 🐛 Dépannage

### "pnpm: command not found"

Utilisez `npx tsx` au lieu de `pnpm tsx`.

### "\_\_dirname is not defined"

Le script a été mis à jour pour supporter les ES modules. Si vous avez encore l'erreur, vérifiez que vous utilisez la dernière version du script.

### "Aucun fichier à documenter"

En mode `--ai`, cela signifie qu'aucun fichier n'a été modifié récemment. Utilisez le mode normal :

```bash
npx tsx scripts/generate-docs.ts
```

### Les fichiers de configuration ne sont pas documentés

Par défaut, en mode normal, seul le dossier `src/` est documenté. En mode `--ai`, tous les fichiers modifiés du projet sont documentés, y compris les fichiers de config.

## 📊 Statistiques

À chaque exécution, le script affiche :

- Nombre de fichiers détectés (mode AI)
- Nombre de fichiers documentés
- Emplacement du fichier généré

```
✅ Documentation générée avec succès !
📁 Fichier : PROJECT_STRUCTURE.md
📊 Fichiers documentés : 12
```

---

**Créé le** : 02/02/2026  
**Dernière mise à jour** : 02/02/2026  
**Version** : 1.0.0
