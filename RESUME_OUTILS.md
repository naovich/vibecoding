# Résumé - Outils de Blocage pour Agents IA ⛔

**Objectif:** Empêcher les modèles IA de faire n'importe quoi via validation automatique

---

## 🎯 Stratégie 3 Niveaux

```
┌─────────────────────────────────────────┐
│  1. PRE-COMMIT (10s) - Bloque AVANT Git │
├─────────────────────────────────────────┤
│  • ESLint          → Erreurs code       │
│  • Prettier        → Formatage          │
│  • TypeScript      → Erreurs types      │
│  • check-no-any    → Bloque `: any`     │
│  • check-file-size → Max 500 lignes     │
│  • Tests affected  → Tests modifiés     │
└─────────────────────────────────────────┘
                ↓ Commit OK
┌─────────────────────────────────────────┐
│  2. PRE-PUSH (60s) - Validation Complète│
├─────────────────────────────────────────┤
│  • Build           → Compilation        │
│  • Tous les tests  → Suite complète     │
│  • E2E             → Scénarios E2E      │
│  • Coverage        → Minimum 80%        │
│  • Circular deps   → Imports circulaires│
│  • Dead code       → Code inutilisé     │
└─────────────────────────────────────────┘
                ↓ Push OK
┌─────────────────────────────────────────┐
│  3. CI/CD (5min) - Dernier Rempart      │
├─────────────────────────────────────────┤
│  • Toutes validations pre-push          │
│  • SonarQube       → Quality gate       │
│  • Security scan   → Vulnérabilités     │
│  • Bundle size     → Limite taille      │
└─────────────────────────────────────────┘
```

---

## 📦 14 Libs JavaScript à Installer

| Lib | Rôle | Bloque Quoi |
|-----|------|-------------|
| **husky** | Git hooks automation | Exécute validations pre-commit/push |
| **lint-staged** | Lint fichiers staged | Fichiers non-lintés |
| **commitlint** | Valide messages commit | Messages non-conformes |
| **eslint** | Linting JS/TS | Erreurs code, style |
| **prettier** | Formatage auto | Code mal formaté |
| **typescript** | Vérification types | Erreurs types, warnings |
| **vitest** | Tests unitaires | Tests échouants, coverage < seuil |
| **playwright** | Tests E2E | Scénarios E2E échouants |
| **sonarqube-scanner** | Analyse qualité | Quality gate échouée |
| **danger** | Code review auto | PR non-conformes |
| **size-limit** | Limite bundle | Bundle trop gros |
| **depcheck** | Deps inutilisées | Deps dans package.json inutiles |
| **madge** | Deps circulaires | Imports circulaires |
| **knip** | Code mort | Fichiers/exports inutilisés |

---

## 🔧 Hooks Husky - Ce Qui Est Bloqué

### `.husky/pre-commit` (Rapide ~10s)
```bash
✅ lint-staged       → Lint + Format fichiers staged
✅ type-check        → Erreurs TypeScript
✅ check-no-any      → Bloque si `: any` trouvé
✅ check-file-size   → Bloque si fichier > 500 lignes
✅ test:affected     → Tests des fichiers modifiés
```

### `.husky/commit-msg`
```bash
✅ commitlint        → Bloque si message non-conforme
```
**Format obligatoire:** `type(scope): description`

Exemples:
- ✅ `feat: add user auth`
- ✅ `fix(api): resolve timeout`
- ❌ `Add auth` (pas de type)
- ❌ `FEAT: add auth` (majuscules)

### `.husky/pre-push` (Complet ~60s)
```bash
✅ build                  → Compilation complète
✅ test:run               → Tous les tests
✅ test:e2e               → Tests E2E
✅ enforce-coverage       → Bloque si coverage < 80%
✅ check-circular-deps    → Bloque imports circulaires
✅ check-dead-code        → Bloque code inutilisé
```

---

## 🛠️ Scripts Custom - Exemples

### `scripts/check-no-any.js`
Scanne tout le code source, **exit 1** si trouve `: any`

```javascript
// Détecte
const data: any = ...;          // ❌ BLOQUÉ
function process(item: any) ... // ❌ BLOQUÉ

// Ignore
// const data: any = ...;         // ✅ OK (commentaire)
(window as any).gtag = ...;     // ✅ OK (tests seulement)
```

### `scripts/check-file-size.js`
Compte lignes de chaque fichier, **exit 1** si > 500 lignes

```
src/UserProfile.tsx: 850 lignes ❌ BLOQUÉ
→ Split en UserProfile + UserSettings + UserAvatar
```

### `scripts/enforce-coverage.js`
Lit `coverage/coverage-summary.json`, **exit 1** si < 80%

```
✅ lines: 85%
✅ statements: 82%
❌ functions: 75%  → BLOQUÉ
❌ branches: 70%   → BLOQUÉ
```

### `scripts/check-circular-deps.js`
Utilise `madge`, **exit 1** si imports circulaires

```
❌ Circular dependency detected:
   store/userStore.ts → components/UserCard.tsx → store/userStore.ts
```

---

## 📝 lint-staged Config

```json
{
  "*.{ts,tsx}": [
    "eslint --fix",           // Fix erreurs auto
    "prettier --write",       // Format
    "vitest related --run"    // Tests fichiers modifiés
  ],
  "*.{json,md}": [
    "prettier --write"        // Format uniquement
  ],
  "package.json": [
    "node scripts/check-unused-deps.js"  // Vérifie deps
  ]
}
```

**Résultat:** Impossible de commit si un seul fichier staged a une erreur ESLint ou test échouant !

---

## 🎯 Résultat Final

### Avant (Sans Guardrails)
```
Agent IA écrit code
    ↓
Commit avec bugs
    ↓
Push vers GitHub
    ↓
CI fail (5 minutes perdues)
    ↓
Rollback + Fix + Re-push
    ↓
Total: 15-20 minutes par erreur
```

### Après (Avec Guardrails)
```
Agent IA écrit code
    ↓
Pre-commit hooks (10s)
    ↓
❌ BLOQUÉ: ESLint error found
    ↓
Agent fix automatiquement
    ↓
Pre-commit hooks (10s)
    ↓
✅ Commit réussi
    ↓
Pre-push hooks (60s)
    ↓
✅ Push réussi
    ↓
CI toujours vert 🟢
    ↓
Total: 70s, ZÉRO erreur
```

---

## 📊 Métriques Garanties

✅ **0 commits** avec erreurs ESLint  
✅ **0 commits** avec code non-formaté  
✅ **0 commits** avec erreurs TypeScript  
✅ **0 commits** avec `: any` (hors tests)  
✅ **0 commits** avec fichiers > 500 lignes  
✅ **0 push** avec tests échouants  
✅ **0 push** avec coverage < 80%  
✅ **0 push** avec dépendances circulaires  
✅ **0 push** avec code mort  
✅ **100%** messages de commit conformes  

---

## 🚀 Installation Rapide (Copy-Paste)

```bash
# 1. Installer toutes les dépendances
npm install -D husky lint-staged \
  @commitlint/cli @commitlint/config-conventional \
  eslint @eslint/js prettier eslint-config-prettier \
  @typescript-eslint/eslint-plugin @typescript-eslint/parser \
  eslint-plugin-react-hooks eslint-plugin-react-refresh \
  vitest @vitest/coverage-v8 @playwright/test \
  sonarqube-scanner madge depcheck knip \
  size-limit @size-limit/preset-app danger

# 2. Initialiser Husky
npx husky init

# 3. Créer scripts custom
mkdir -p scripts
# (Copier les scripts depuis PLAN_DETAILLE_TOOLS.md)

# 4. Configurer hooks
# (Copier .husky/* depuis PLAN_DETAILLE_TOOLS.md)

# 5. Tester
git add .
git commit -m "test: validate hooks"  # Doit passer toutes validations
```

---

## 📂 Fichiers Créés

```
vibecoding/
├── README.md                      # Présentation projet
├── PLAN.md                        # Structure 13 sections
├── SOURCES.md                     # Toutes les sources
├── PROPOSITION.md                 # Options implémentation
├── PLAN_DETAILLE_TOOLS.md         # ⭐ Plan complet outils (19KB)
└── RESUME_OUTILS.md               # 📄 Ce fichier (résumé visuel)
```

---

**Prochaine étape:** Créer un projet template exemple avec toute cette stack configurée ! 🚀
