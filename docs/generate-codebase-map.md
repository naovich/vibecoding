# 📚 Codebase Map Generator - Guide d'utilisation

Script qui génère automatiquement une carte du code (CODEBASE.md) avec signatures de toutes les fonctions/composants exportés.

## 🎯 Fonctionnalités

- 📄 **Extraction automatique** : Parse tous les fichiers TypeScript/TSX
- 🔍 **Signatures complètes** : Functions, Components, Types, Constants
- 🤖 **Enrichissement AI optionnel** : Descriptions générées par Claude Code
- 📁 **Chemins relatifs** : Compatible tous OS (Windows/Linux/Mac)
- 🚫 **Filtrage intelligent** : Ignore tests, dist, coverage

## 🚀 Utilisation

### Mode standard (signatures uniquement)

```bash
npm run map
```

Génère `CODEBASE.md` avec les signatures de tous les exports.

**Exemple de sortie :**

```markdown
## 📁 src/

### App.tsx

**Components:**

- `App` _(default export)_
```

### Mode AI (avec descriptions Claude Code)

```bash
npm run map -- --ai
```

Génère `CODEBASE.md` enrichi avec des descriptions AI.

**Exemple de sortie :**

```markdown
## 📁 src/

### App.tsx

**Description:** Main application component serving as the landing page...

**Components:**

- `App` _(default export)_
  - Renders a full-screen gradient page with a counter button...
```

**⚠️ Prérequis :** Claude Code CLI doit être installé et dans le PATH.

## 📊 Cross-Platform (Windows/Linux/Mac)

La commande `npm run map -- --ai` fonctionne **sur tous les OS** :

- ✅ **Windows** (PowerShell, CMD)
- ✅ **Linux** (bash, zsh)
- ✅ **Mac** (bash, zsh)

**Note technique :** Le double `--` est une convention npm pour passer les arguments au script. Un wrapper (`scripts/map.js`) garantit que les arguments sont correctement transmis sur tous les OS.

## 🤖 Mode AI - Détails

### Avec Claude Code disponible

```
📚 Generating codebase map...
🤖 AI enrichment enabled (Claude Code will generate descriptions)
📂 Found 2 files to analyze
✅ Successfully parsed 1 files
🤖 Enriching 1 files with AI descriptions...
   Analyzing src/App.tsx...
✅ AI enrichment complete
✅ CODEBASE.md generated successfully
```

→ Fichiers enrichis avec descriptions AI ✅

### Sans Claude Code

```
📚 Generating codebase map...
🤖 AI enrichment enabled (Claude Code will generate descriptions)
📂 Found 2 files to analyze
✅ Successfully parsed 1 files
🤖 Enriching 1 files with AI descriptions...
   Analyzing src/App.tsx...
   ⚠️  Failed to enrich src/App.tsx: Claude Code CLI not available (not in PATH)
⚠️  AI enrichment skipped (Claude Code not available)
✅ CODEBASE.md generated successfully
```

→ Génère quand même CODEBASE.md sans descriptions AI ✅

**Comportement :** Le script ne **bloque jamais**. Si Claude Code n'est pas disponible, il génère la doc sans descriptions.

## 📝 Fichiers analysés

Par défaut, le script analyse :

```
src/**/*.{ts,tsx}
```

**Ignores automatiquement :**

- `**/*.test.ts` et `**/*.test.tsx`
- `**/*.spec.ts` et `**/*.spec.tsx`
- `**/test/**` et `**/__tests__/**`
- `**/dist/**` et `**/coverage/**`
- `**/*.d.ts` (fichiers de déclaration)

## 🔧 Intégration

### Pre-commit hook

Le script est déjà intégré dans le hook pre-commit via `npm run docs` :

```json
{
  "scripts": {
    "docs": "npm run tree && npm run map"
  }
}
```

→ `CODEBASE.md` est **automatiquement mis à jour** avant chaque commit.

### Manuel

Pour regénérer manuellement :

```bash
# Mode standard
npm run map

# Mode AI
npm run map -- --ai
```

## 💡 Cas d'usage

### 1. Documentation du projet

```bash
npm run map
```

→ Vue d'ensemble de tous les exports

### 2. Documentation enrichie (avec AI)

```bash
npm run map -- --ai
```

→ Descriptions détaillées de chaque fonction/composant

### 3. Prévenir les duplications

Avant de créer une nouvelle fonction/composant :

```bash
# Ouvrir CODEBASE.md
cat CODEBASE.md | grep "function\|Component"
```

→ Vérifie si quelque chose de similaire existe déjà

### 4. Onboarding

Donner `CODEBASE.md` à un nouveau dev :

```bash
npm run map -- --ai
```

→ Carte complète avec explications

## ⚙️ Configuration

### Ajouter des extensions

Modifier `scripts/generate-codebase-map.js` :

```javascript
const files = await glob('src/**/*.{ts,tsx,js,jsx}', {
  // Ajouter .js, .jsx si nécessaire
});
```

### Changer le dossier source

```javascript
const files = await glob('lib/**/*.{ts,tsx}', {
  cwd: rootDir,
  // ...
});
```

## 🐛 Dépannage

### "AI enrichment skipped"

**Cause :** Claude Code CLI non trouvé dans le PATH.

**Solution :** Installe Claude Code ou utilise le mode standard (`npm run map`).

### Fichiers non documentés

**Cause :** Fichiers n'ont aucun export, ou sont ignorés par les patterns.

**Vérification :**

```bash
# Voir les fichiers trouvés
node scripts/generate-codebase-map.js | grep "Found"
```

### Arguments non passés (Windows)

**Problème :** `npm run map --ai` ne fonctionne pas.

**Solution :** Utilise `npm run map -- --ai` (avec double `--`).

---

**Créé le** : 02/02/2026  
**Dernière mise à jour** : 02/02/2026  
**Version** : 1.0.0
