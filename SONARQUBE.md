# SonarQube Configuration Guide 🔍

Guide complet pour configurer les règles SonarQube dans VibeCoding.

---

## 🎯 Deux Approches

### 1. **eslint-plugin-sonarjs** (Actuel ✅)

Vérifications locales via ESLint - **Déjà configuré et actif**

**Avantages:**

- ✅ Instantané (feedback immédiat)
- ✅ Bloque les commits automatiquement
- ✅ Gratuit, pas de compte requis
- ✅ Fonctionne offline

**Inconvénients:**

- ❌ Pas de dashboard
- ❌ Pas d'historique
- ❌ Subset des règles SonarQube complètes

### 2. **SonarQube Cloud** (Optionnel 🔄)

Analyse complète avec dashboard cloud

**Avantages:**

- ✅ Dashboard professionnel
- ✅ Historique des métriques
- ✅ Toutes les règles SonarQube
- ✅ Security hotspots
- ✅ Gratuit pour projets publics

**Inconvénients:**

- ❌ Nécessite compte SonarQube
- ❌ Analyse plus lente
- ❌ Configuration CI/CD requise

---

## 📘 Méthode 1: eslint-plugin-sonarjs (Configuration Actuelle)

### Configuration actuelle

**Fichier:** `eslint.config.js`

```javascript
import sonarjs from 'eslint-plugin-sonarjs';

export default [
  {
    plugins: {
      sonarjs: sonarjs,
    },
    rules: {
      // Règles actuellement actives ✅
      'sonarjs/cognitive-complexity': ['error', 15],
      'sonarjs/no-duplicate-string': 'warn',
      'sonarjs/no-identical-functions': 'error',
      'sonarjs/no-collapsible-if': 'warn',
      'sonarjs/prefer-immediate-return': 'warn',
    },
  },
];
```

### Règles disponibles dans eslint-plugin-sonarjs v3.x

**⚠️ Note:** La version 3.x d'eslint-plugin-sonarjs a un nombre limité de règles comparé à SonarQube complet. Pour toutes les règles, utiliser SonarQube Cloud.

**Règles actuellement disponibles et testées:**

```javascript
// Complexity (✅ Disponible v3.x)
'sonarjs/cognitive-complexity': ['error', 15],           // ✅ Activé

// Duplications (✅ Disponible v3.x)
'sonarjs/no-duplicate-string': 'warn',                   // ✅ Activé
'sonarjs/no-identical-functions': 'error',               // ✅ Activé

// Simplification (✅ Disponible v3.x)
'sonarjs/no-collapsible-if': 'warn',                     // ✅ Activé
'sonarjs/prefer-immediate-return': 'warn',               // ✅ Activé
```

**Autres règles (nécessitent SonarQube Cloud complet):**

```javascript
// Ces règles ne sont PAS dans eslint-plugin-sonarjs v3.x
// Pour les utiliser, configurer SonarQube Cloud
'sonarjs/max-switch-cases': ['warn', 30],
'sonarjs/no-identical-expressions': 'error',
'sonarjs/prefer-object-literal': 'warn',
'sonarjs/prefer-single-boolean-return': 'warn',
'sonarjs/no-all-duplicated-branches': 'error',
'sonarjs/no-element-overwrite': 'error',
// ... + 200+ autres règles dans SonarQube complet
```

### Configuration actuelle (optimale pour v3.x)

**La configuration dans `eslint.config.js` est déjà optimale:**

```javascript
rules: {
  // SonarJS - Toutes les règles disponibles dans v3.x
  'sonarjs/cognitive-complexity': ['error', 15],     // ✅ Complexité max 15
  'sonarjs/no-duplicate-string': 'warn',             // ✅ Strings dupliquées
  'sonarjs/no-identical-functions': 'error',         // ✅ Fonctions identiques
  'sonarjs/no-collapsible-if': 'warn',               // ✅ If imbriqués
  'sonarjs/prefer-immediate-return': 'warn',         // ✅ Return immédiat
}
```

**C'est TOUT ce qui est disponible dans eslint-plugin-sonarjs v3.x** ✅

Pour avoir + de 200 règles SonarQube, il faut configurer **SonarQube Cloud** (voir section ci-dessous).

### Tester les règles

```bash
# Teste une règle spécifique
npm run lint

# Exemple de code qui viole les règles:
```

```typescript
// ❌ no-duplicate-string
const msg1 = 'User not found';
const msg2 = 'User not found';
const msg3 = 'User not found'; // Violation

// ✅ Fix
const USER_NOT_FOUND = 'User not found';
const msg1 = USER_NOT_FOUND;

// ❌ no-identical-functions
function getNameA(user: User): string {
  return user.firstName + ' ' + user.lastName;
}
function getNameB(author: Author): string {
  return author.firstName + ' ' + author.lastName; // Identique!
}

// ✅ Fix
function getFullName(person: { firstName: string; lastName: string }): string {
  return `${person.firstName} ${person.lastName}`;
}
```

---

## 🌐 Méthode 2: SonarQube Cloud (Setup Complet)

### Étape 1: Créer un compte SonarQube Cloud

1. **Aller sur:** https://sonarcloud.io
2. **Se connecter avec GitHub**
3. **Importer le repo:** `naovich/vibecoding`
4. **Obtenir le token** dans Account → Security

### Étape 2: Installer les dépendances

```bash
npm install --save-dev sonarqube-scanner
```

### Étape 3: Configuration projet

**Créer:** `sonar-project.properties`

```properties
# Project identification
sonar.projectKey=naovich_vibecoding
sonar.organization=naovich

# Source code
sonar.sources=src
sonar.tests=src
sonar.test.inclusions=**/*.test.ts,**/*.spec.ts
sonar.exclusions=**/node_modules/**,**/dist/**,**/coverage/**

# Coverage
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.coverage.exclusions=**/*.test.ts,**/*.spec.ts,**/__tests__/**

# TypeScript
sonar.typescript.tsconfigPath=tsconfig.json

# Quality Gate
sonar.qualitygate.wait=true
```

### Étape 4: Ajouter script

**Dans `package.json`:**

```json
{
  "scripts": {
    "sonar": "sonar-scanner"
  }
}
```

### Étape 5: GitHub Actions CI/CD

**Créer:** `.github/workflows/sonarqube.yml`

```yaml
name: SonarQube Analysis

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  sonarqube:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0 # Full history for better analysis

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Install dependencies
        run: npm ci

      - name: Run tests with coverage
        run: npm run test:coverage

      - name: SonarQube Scan
        uses: SonarSource/sonarqube-scan-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: https://sonarcloud.io
```

### Étape 6: Ajouter le secret GitHub

1. **GitHub repo** → Settings → Secrets → Actions
2. **New secret:**
   - Name: `SONAR_TOKEN`
   - Value: (le token de SonarQube Cloud)

### Étape 7: Badge dans README

**Ajouter dans `README.md`:**

```markdown
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=naovich_vibecoding&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=naovich_vibecoding)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=naovich_vibecoding&metric=coverage)](https://sonarcloud.io/summary/new_code?id=naovich_vibecoding)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=naovich_vibecoding&metric=bugs)](https://sonarcloud.io/summary/new_code?id=naovich_vibecoding)
```

---

## 📊 Comparaison

| Feature        | eslint-plugin-sonarjs | SonarQube Cloud   |
| -------------- | --------------------- | ----------------- |
| **Vitesse**    | Instantané            | ~2-3 min          |
| **Feedback**   | Pre-commit            | Après push        |
| **Dashboard**  | ❌                    | ✅ Professional   |
| **Historique** | ❌                    | ✅ Tendances      |
| **Security**   | Basique               | ✅ Advanced       |
| **Gratuit**    | ✅                    | ✅ (public repos) |
| **Setup**      | 5 min                 | 30 min            |

---

## 💡 Recommandation

**Setup optimal:**

✅ **eslint-plugin-sonarjs** (actuel) - Garde pour pre-commit  
✅ **SonarQube Cloud** (optionnel) - Ajoute pour dashboard pro + CI/CD

**Les deux sont complémentaires:**

- ESLint = Feedback rapide local
- SonarCloud = Vue d'ensemble + historique

---

**Next steps:**

1. **Maintenant:** Ajouter les règles SonarJS manquantes dans `eslint.config.js`
2. **Plus tard:** Setup SonarQube Cloud pour dashboard professionnel

Tu veux que je configure tout ça maintenant ?
