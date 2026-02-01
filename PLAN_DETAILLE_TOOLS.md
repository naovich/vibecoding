# Plan Détaillé VibeCoding - Focus Outils de Blocage ⛔

**Objectif:** Empêcher les modèles IA de faire des erreurs via validation déterministe automatique

---

## 🎯 Philosophie

**Principe:** Si ça peut être vérifié automatiquement, ça DOIT être bloqué automatiquement.

**Stratégie à 3 niveaux:**
1. **Pre-commit** (Husky) - Bloque AVANT que le code entre dans Git
2. **Pre-push** (Husky) - Validation complète AVANT le push
3. **CI/CD** (GitHub Actions) - Dernier rempart si bypass local

---

## 🛠️ Section TOOLS - Architecture Complète

```
tools/
├── 01-husky/                    # Git hooks automation
│   ├── README.md
│   ├── Setup.md
│   ├── pre-commit-hook.md
│   ├── pre-push-hook.md
│   ├── commit-msg-hook.md
│   └── examples/
│       ├── .husky/              # Dossier complet à copier
│       │   ├── pre-commit
│       │   ├── pre-push
│       │   └── commit-msg
│       └── package.json         # Scripts npm
│
├── 02-lint-staged/              # Run linters sur fichiers staged uniquement
│   ├── README.md
│   ├── Config.md
│   ├── .lintstagedrc.example.json
│   └── patterns/
│       ├── react-ts.json        # Config React+TS
│       ├── nestjs.json          # Config NestJS
│       └── monorepo.json        # Config Monorepo
│
├── 03-commitlint/               # Validation messages de commit
│   ├── README.md
│   ├── Setup.md
│   ├── Rules.md
│   ├── commitlint.config.example.js
│   └── examples/
│       ├── valid-commits.md
│       └── invalid-commits.md
│
├── 04-eslint/                   # Linting JavaScript/TypeScript
│   ├── README.md
│   ├── Config-Modern.md         # ESLint 9+ Flat Config
│   ├── Config-Legacy.md         # ESLint 8 (.eslintrc)
│   ├── Custom-Rules.md
│   ├── eslint.config.example.js # Flat config
│   ├── rules/
│   │   ├── react.md
│   │   ├── typescript.md
│   │   ├── nodejs.md
│   │   └── nestjs.md
│   └── plugins/
│       ├── react-hooks.md
│       ├── react-refresh.md
│       ├── typescript-eslint.md
│       └── import.md
│
├── 05-prettier/                 # Formatage automatique
│   ├── README.md
│   ├── Config.md
│   ├── .prettierrc.example.json
│   ├── .prettierignore.example
│   └── integration/
│       ├── eslint.md            # eslint-config-prettier
│       ├── vscode.md
│       └── webstorm.md
│
├── 06-typescript/               # Vérification types stricte
│   ├── README.md
│   ├── tsconfig.strict.json     # Config ultra-stricte
│   ├── tsconfig.recommended.json
│   ├── NoWarnings.md            # Policy zéro warning
│   ├── NoEmit.md                # tsc --noEmit dans CI
│   └── scripts/
│       ├── check-types.js       # Script qui exit 1 si warnings
│       └── count-any.js         # Compte les `: any` dans le code
│
├── 07-vitest/                   # Tests unitaires validation
│   ├── README.md
│   ├── Config.md
│   ├── Coverage.md              # Minimum coverage enforcement
│   ├── vitest.config.example.ts
│   └── scripts/
│       ├── enforce-coverage.js  # Bloque si coverage < X%
│       └── check-tests-exist.js # Vérifie que chaque .ts a un .test.ts
│
├── 08-playwright/               # Tests E2E validation
│   ├── README.md
│   ├── Config.md
│   ├── playwright.config.example.ts
│   └── scripts/
│       └── enforce-e2e.js       # Bloque si tests E2E échouent
│
├── 09-sonarqube-scanner/        # Analyse qualité code
│   ├── README.md
│   ├── Local-Setup.md           # SonarQube local
│   ├── CLI.md
│   ├── sonar-project.properties.example
│   ├── Quality-Gates.md         # Définir quality gates
│   └── scripts/
│       └── check-quality-gate.js # Exit 1 si quality gate fail
│
├── 10-danger-js/                # Code review automation (PR)
│   ├── README.md
│   ├── Setup.md
│   ├── dangerfile.example.js
│   └── rules/
│       ├── pr-size.md           # Limite taille PR
│       ├── test-coverage.md     # Vérifie coverage diff
│       ├── changelog.md         # Force CHANGELOG update
│       └── no-console.md        # Bloque console.log
│
├── 11-size-limit/               # Limite taille bundle
│   ├── README.md
│   ├── Setup.md
│   ├── .size-limit.example.js
│   └── scripts/
│       └── enforce-bundle-size.js
│
├── 12-depcheck/                 # Vérifie dépendances inutilisées
│   ├── README.md
│   └── scripts/
│       └── check-unused-deps.js # Exit 1 si deps inutilisées
│
├── 13-madge/                    # Détecte dépendances circulaires
│   ├── README.md
│   └── scripts/
│       └── check-circular-deps.js
│
├── 14-knip/                     # Détecte code mort (dead code)
│   ├── README.md
│   ├── knip.config.example.ts
│   └── scripts/
│       └── check-dead-code.js
│
├── 15-custom-scripts/           # Scripts maison
│   ├── README.md
│   ├── check-no-any.js          # Bloque si `: any` détecté
│   ├── check-no-todo.js         # Bloque si TODO/FIXME en prod
│   ├── check-file-size.js       # Bloque fichiers > 500 lignes
│   ├── check-imports.js         # Vérifie path aliases utilisés
│   ├── check-naming.js          # Vérifie conventions nommage
│   └── check-architecture.js    # Vérifie structure dossiers
│
└── 16-ci-templates/             # Templates CI/CD
    ├── README.md
    ├── github-actions/
    │   ├── validate-pr.yml      # Validation complète PR
    │   ├── validate-push.yml    # Validation push main
    │   └── nightly-quality.yml  # Analyse qualité nocturne
    ├── gitlab-ci/
    │   └── .gitlab-ci.example.yml
    └── azure-pipelines/
        └── azure-pipelines.example.yml
```

---

## 📦 Libs JavaScript à Installer

### 1. Husky (Git Hooks)
```bash
npm install -D husky
npx husky init
```

**Rôle:** Exécute des scripts AVANT commit/push  
**Blocage:** Si script exit 1, le commit/push est annulé

### 2. lint-staged
```bash
npm install -D lint-staged
```

**Rôle:** Lance linters UNIQUEMENT sur fichiers staged  
**Avantage:** Rapide (ne lint pas tout le projet)

### 3. @commitlint/cli + @commitlint/config-conventional
```bash
npm install -D @commitlint/cli @commitlint/config-conventional
```

**Rôle:** Valide format messages de commit  
**Bloque:** Messages non-conformes (ex: "fix bug" → ❌, "fix: resolve auth issue" → ✅)

### 4. ESLint + Plugins
```bash
npm install -D eslint @eslint/js \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  eslint-plugin-react-hooks \
  eslint-plugin-react-refresh \
  eslint-config-prettier
```

**Rôle:** Détecte erreurs code, enforce style  
**Bloque:** Code non-conforme aux règles

### 5. Prettier
```bash
npm install -D prettier eslint-config-prettier
```

**Rôle:** Formatage automatique  
**Bloque:** Code mal formaté (avec --check)

### 6. TypeScript (strict mode)
```bash
npm install -D typescript
```

**Rôle:** Vérification types stricte  
**Bloque:** Erreurs de types, `: any` warnings

### 7. Vitest
```bash
npm install -D vitest @vitest/coverage-v8
```

**Rôle:** Tests unitaires + coverage  
**Bloque:** Tests échouants, coverage < seuil

### 8. Playwright
```bash
npm install -D @playwright/test
```

**Rôle:** Tests E2E  
**Bloque:** Scénarios E2E échouants

### 9. SonarQube Scanner
```bash
npm install -D sonarqube-scanner
```

**Rôle:** Analyse qualité (bugs, code smells, vulnérabilités)  
**Bloque:** Quality gate échouée

### 10. Danger JS
```bash
npm install -D danger
```

**Rôle:** Automatisation code review sur PR  
**Bloque:** PR non-conformes (trop grosse, pas de tests, etc.)

### 11. size-limit
```bash
npm install -D size-limit @size-limit/preset-app
```

**Rôle:** Limite taille bundle  
**Bloque:** Bundle > limite définie

### 12. depcheck
```bash
npm install -D depcheck
```

**Rôle:** Détecte dépendances inutilisées  
**Bloque:** Deps inutiles dans package.json

### 13. madge
```bash
npm install -D madge
```

**Rôle:** Détecte dépendances circulaires  
**Bloque:** Import circulaires

### 14. knip
```bash
npm install -D knip
```

**Rôle:** Détecte code mort (dead code)  
**Bloque:** Fichiers/exports inutilisés

---

## 🔧 Configuration Husky - Hooks Détaillés

### `.husky/pre-commit`
**Exécuté AVANT chaque commit**

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."

# 1. lint-staged (lint + format fichiers staged)
npx lint-staged

# 2. Check TypeScript types (rapide, no emit)
echo "📘 Checking TypeScript types..."
npm run type-check

# 3. Check for : any usage
echo "🚫 Checking for 'any' usage..."
node scripts/check-no-any.js

# 4. Check file size (max 500 lines)
echo "📏 Checking file sizes..."
node scripts/check-file-size.js

# 5. Run unit tests on affected files
echo "🧪 Running unit tests..."
npm run test:affected

echo "✅ Pre-commit checks passed!"
```

### `.husky/commit-msg`
**Valide le message de commit**

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Commitlint validation
npx --no -- commitlint --edit $1
```

### `.husky/pre-push`
**Exécuté AVANT push (plus lourd)**

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🚀 Running pre-push checks..."

# 1. Full TypeScript build
echo "🏗️ Building TypeScript..."
npm run build

# 2. Full test suite
echo "🧪 Running all tests..."
npm run test

# 3. E2E tests
echo "🎭 Running E2E tests..."
npm run test:e2e

# 4. Check test coverage
echo "📊 Checking test coverage..."
node scripts/enforce-coverage.js

# 5. Check for circular dependencies
echo "🔄 Checking circular dependencies..."
node scripts/check-circular-deps.js

# 6. Check for dead code
echo "💀 Checking dead code..."
node scripts/check-dead-code.js

# 7. SonarQube analysis (if configured)
# echo "📈 Running SonarQube analysis..."
# npm run sonar

echo "✅ Pre-push checks passed! Ready to push."
```

---

## 📝 Configuration lint-staged

### `.lintstagedrc.json`

```json
{
  "*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write",
    "vitest related --run"
  ],
  "*.{js,jsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{json,md,yml,yaml}": [
    "prettier --write"
  ],
  "package.json": [
    "node scripts/check-unused-deps.js"
  ]
}
```

**Explication:**
- Fichiers `.ts/.tsx` → ESLint fix + Prettier + Tests associés
- Fichiers `.js/.jsx` → ESLint fix + Prettier
- Fichiers config → Prettier uniquement
- `package.json` modifié → Check deps inutilisées

---

## 🎯 Scripts Custom - Exemples Détaillés

### `scripts/check-no-any.js`
**Bloque si `: any` détecté**

```javascript
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const files = glob.sync('src/**/*.{ts,tsx}', {
  ignore: ['**/*.test.ts', '**/*.test.tsx', '**/test/**']
});

let foundAny = false;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    // Regex pour détecter `: any` (mais pas dans commentaires)
    if (/:\s*any(?!\w)/.test(line) && !line.trim().startsWith('//')) {
      console.error(`❌ Found ': any' in ${file}:${index + 1}`);
      console.error(`   ${line.trim()}`);
      foundAny = true;
    }
  });
});

if (foundAny) {
  console.error('\n🚫 Commit blocked: Remove all `: any` usage!');
  process.exit(1);
}

console.log('✅ No `: any` found');
process.exit(0);
```

### `scripts/check-file-size.js`
**Bloque fichiers > 500 lignes**

```javascript
#!/usr/bin/env node
const fs = require('fs');
const glob = require('glob');

const MAX_LINES = 500;
const files = glob.sync('src/**/*.{ts,tsx,js,jsx}', {
  ignore: ['**/*.test.*', '**/test/**']
});

let foundLarge = false;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n').length;
  
  if (lines > MAX_LINES) {
    console.error(`❌ ${file}: ${lines} lines (max: ${MAX_LINES})`);
    foundLarge = true;
  }
});

if (foundLarge) {
  console.error(`\n🚫 Commit blocked: Split large files!`);
  process.exit(1);
}

console.log(`✅ All files under ${MAX_LINES} lines`);
process.exit(0);
```

### `scripts/enforce-coverage.js`
**Bloque si coverage < 80%**

```javascript
#!/usr/bin/env node
const fs = require('fs');

const MIN_COVERAGE = 80;

// Lit le rapport coverage JSON généré par Vitest
const coverageFile = 'coverage/coverage-summary.json';

if (!fs.existsSync(coverageFile)) {
  console.error('❌ No coverage report found. Run `npm run test:coverage` first.');
  process.exit(1);
}

const coverage = JSON.parse(fs.readFileSync(coverageFile, 'utf-8'));
const total = coverage.total;

const metrics = ['lines', 'statements', 'functions', 'branches'];
let failed = false;

metrics.forEach(metric => {
  const pct = total[metric].pct;
  if (pct < MIN_COVERAGE) {
    console.error(`❌ ${metric}: ${pct}% (minimum: ${MIN_COVERAGE}%)`);
    failed = true;
  } else {
    console.log(`✅ ${metric}: ${pct}%`);
  }
});

if (failed) {
  console.error(`\n🚫 Push blocked: Coverage below ${MIN_COVERAGE}%`);
  process.exit(1);
}

console.log(`\n✅ Coverage meets requirements (${MIN_COVERAGE}%+)`);
process.exit(0);
```

### `scripts/check-circular-deps.js`
**Détecte dépendances circulaires**

```javascript
#!/usr/bin/env node
const madge = require('madge');

madge('src/index.ts', {
  fileExtensions: ['ts', 'tsx'],
  tsConfig: 'tsconfig.json'
})
  .then((res) => {
    const circular = res.circular();
    
    if (circular.length > 0) {
      console.error('❌ Circular dependencies detected:');
      circular.forEach(circle => {
        console.error(`   ${circle.join(' → ')}`);
      });
      console.error('\n🚫 Push blocked: Fix circular dependencies!');
      process.exit(1);
    }
    
    console.log('✅ No circular dependencies');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error analyzing dependencies:', err);
    process.exit(1);
  });
```

---

## 🔐 Commitlint Configuration

### `commitlint.config.js`

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // Nouvelle fonctionnalité
        'fix',      // Correction de bug
        'docs',     // Documentation
        'style',    // Formatage (ne change pas la logique)
        'refactor', // Refactoring (ni feat ni fix)
        'perf',     // Amélioration performance
        'test',     // Ajout/modification tests
        'chore',    // Maintenance (deps, config, etc.)
        'ci',       // CI/CD
        'revert',   // Revert d'un commit précédent
      ],
    ],
    'subject-case': [2, 'never', ['upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
  },
};
```

**Exemples valides:**
```
✅ feat: add user authentication
✅ feat(auth): implement JWT tokens
✅ fix: resolve memory leak in WebSocket
✅ docs: update README with new API
✅ refactor(store): split monolithic store into modules
✅ test: add E2E tests for checkout flow
✅ chore: upgrade dependencies to latest
```

**Exemples invalides:**
```
❌ Add user auth (pas de type)
❌ FEAT: add auth (type en majuscules)
❌ feat: Add auth (sujet commence par majuscule)
❌ feat: add auth. (point à la fin)
❌ fixed bug (mauvais type, devrait être "fix")
```

---

## 📊 Package.json Scripts

```json
{
  "scripts": {
    "prepare": "husky",
    
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx",
    "lint:fix": "eslint . --ext .ts,.tsx,.js,.jsx --fix",
    
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,js,jsx,json,md}\"",
    
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch",
    
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:affected": "vitest related --run",
    
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    
    "validate": "npm run lint && npm run type-check && npm run test:run",
    "validate:full": "npm run validate && npm run test:e2e",
    
    "check:any": "node scripts/check-no-any.js",
    "check:file-size": "node scripts/check-file-size.js",
    "check:circular": "node scripts/check-circular-deps.js",
    "check:dead-code": "knip",
    "check:unused-deps": "depcheck",
    
    "sonar": "sonar-scanner",
    
    "size": "size-limit",
    
    "ci:validate": "npm run validate:full && npm run check:circular && npm run check:dead-code"
  }
}
```

---

## 🎯 Checklist Installation Complète

### 1. Installation Husky + lint-staged
```bash
npm install -D husky lint-staged
npx husky init
```

### 2. Installation Commitlint
```bash
npm install -D @commitlint/cli @commitlint/config-conventional
echo "export default { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg
chmod +x .husky/commit-msg
```

### 3. Installation ESLint + Prettier
```bash
npm install -D eslint @eslint/js prettier eslint-config-prettier \
  @typescript-eslint/eslint-plugin @typescript-eslint/parser \
  eslint-plugin-react-hooks eslint-plugin-react-refresh
```

### 4. Installation Vitest + Playwright
```bash
npm install -D vitest @vitest/coverage-v8 @playwright/test
```

### 5. Installation Analyse Qualité
```bash
npm install -D sonarqube-scanner madge depcheck knip
```

### 6. Installation Size Limit + Danger
```bash
npm install -D size-limit @size-limit/preset-app danger
```

### 7. Créer les Scripts Custom
```bash
mkdir -p scripts
touch scripts/check-no-any.js
touch scripts/check-file-size.js
touch scripts/enforce-coverage.js
touch scripts/check-circular-deps.js
chmod +x scripts/*.js
```

### 8. Configuration Hooks Husky
```bash
# .husky/pre-commit
echo '#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
npx lint-staged
npm run type-check
node scripts/check-no-any.js
node scripts/check-file-size.js' > .husky/pre-commit

# .husky/pre-push
echo '#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
npm run validate:full
node scripts/enforce-coverage.js
node scripts/check-circular-deps.js' > .husky/pre-push

chmod +x .husky/pre-commit .husky/pre-push
```

---

## 🚀 Workflow Agent IA avec Guardrails

### Avant (Sans Guardrails)
```
Agent écrit code → Commit → Push → CI fail → Rollback → Perte de temps
```

### Après (Avec Guardrails)
```
Agent écrit code
    ↓
Pre-commit hooks (10s)
    ├─ ESLint → ❌ Bloque si erreurs
    ├─ Prettier → ❌ Bloque si mal formaté
    ├─ TypeScript → ❌ Bloque si erreurs types
    ├─ check-no-any → ❌ Bloque si `: any`
    ├─ check-file-size → ❌ Bloque si > 500 lignes
    └─ Tests unitaires → ❌ Bloque si tests fail
    ↓
Commit réussi ✅
    ↓
Pre-push hooks (60s)
    ├─ Build complet → ❌ Bloque si build fail
    ├─ Tous les tests → ❌ Bloque si tests fail
    ├─ Coverage → ❌ Bloque si < 80%
    ├─ E2E → ❌ Bloque si scénarios fail
    ├─ Circular deps → ❌ Bloque si circulaires
    └─ Dead code → ❌ Bloque si code mort
    ↓
Push réussi ✅
    ↓
CI/CD (Dernier rempart)
    ├─ Même validation que pre-push
    ├─ SonarQube analysis
    ├─ Security scan
    └─ Quality gate
    ↓
Merge autorisé ✅
```

---

## 📈 Métriques de Succès

**Objectifs:**
- ✅ **0 commits avec erreurs** atteignent Git
- ✅ **0 push avec tests échouants** atteignent remote
- ✅ **100% conformité** messages de commit
- ✅ **0 `: any`** dans le code (hors tests)
- ✅ **Coverage > 80%** maintenu
- ✅ **0 dépendances circulaires**
- ✅ **0 code mort** (dead code)
- ✅ **CI toujours vert** 🟢

---

**Prochaine étape:** Implémentation de cette stack complète dans un projet template exemple !
