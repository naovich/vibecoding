# VibeCoding 🤖💻

**Template TypeScript stricte avec TDD, qualité code et hooks Git automatisés**

Guide complet pour développer avec les meilleurs standards : TypeScript strict, TDD obligatoire, complexité limitée, SonarJS, et validation automatique à chaque commit.

---

## 🎯 Philosophie

**Code de qualité = Code validé automatiquement**

- ✅ **TDD obligatoire** - Tests écrits AVANT le code (Red → Green → Refactor)
- ✅ **Zéro `any`** - TypeScript strict mode activé
- ✅ **Complexité limitée** - Max 15 par fonction (SonarQube standard)
- ✅ **80% coverage minimum** - Enforced par pre-push hook
- ✅ **Feature folders** - Organisation par fonctionnalités
- ✅ **Préférer `??` à `||`** - Nullish coalescing quand approprié

---

## ⚡ Quick Start

```bash
# Clone et install
git clone https://github.com/naovich/vibecoding.git
cd vibecoding
npm install

# Run tests (TDD workflow)
npm test              # Watch mode
npm run test:run      # Single run
npm run test:coverage # Avec coverage

# Lint & format
npm run lint          # ESLint + SonarJS
npm run format        # Prettier
npm run type-check    # TypeScript strict

# Build
npm run build         # Compile TypeScript
```

---

## 🛡️ Automated Guardrails

### Pre-Commit Hooks (~10s)

**Bloque le commit si :**

- ❌ ESLint errors (TypeScript strict, SonarJS)
- ❌ Prettier formatting issues
- ❌ TypeScript type errors
- ❌ `: any` detected in code
- ❌ Any file > 500 lines
- ❌ Tests fail for modified files

### Commit Message Hook

**Format requis :** `type(scope): description`

```bash
✅ feat: add user authentication
✅ fix(api): resolve timeout issue
✅ docs: update README
✅ test(user): add validation tests

❌ Add feature              # No type
❌ FEAT: add feature        # Uppercase
```

### Pre-Push Hooks (~60s)

**Bloque le push si :**

- ❌ TypeScript build fails
- ❌ Any test fails
- ❌ Coverage < 80%

---

## 🧪 TDD Workflow (MANDATORY)

**RED → GREEN → REFACTOR**

### ❌ WRONG - Code first

```typescript
// Écrire l'implémentation d'abord ❌
export function sum(a: number, b: number): number {
  return a + b;
}

// Puis le test ❌
it('should sum numbers', () => {
  expect(sum(2, 3)).toBe(5);
});
```

### ✅ CORRECT - Test first

```typescript
// 1. Écrire le test AVANT (RED)
describe('sum', () => {
  it('should add two numbers', () => {
    expect(sum(2, 3)).toBe(5); // Fonction n'existe pas encore
  });
});

// 2. Lancer les tests → FAIL ✅
// 3. Écrire le code minimum (GREEN)
export function sum(a: number, b: number): number {
  return a + b;
}

// 4. Lancer les tests → PASS ✅
// 5. Refactor si besoin (en gardant les tests verts)
```

**Règle d'or :** Jamais de code production sans test qui échoue d'abord.

---

## 📏 Code Quality Rules

### Complexité Maximum : 15 (SonarQube)

```typescript
// ❌ Trop complexe (> 15)
function processOrder(order: Order): void {
  if (order.status === 'pending') {
    if (order.items.length > 0) {
      for (const item of order.items) {
        if (item.stock > 0) {
          if (item.price > 0) {
            // ... nested logic
            // Complexity: 25+ ❌
          }
        }
      }
    }
  }
}

// ✅ Refactorisé (< 15)
function processOrder(order: Order): void {
  validateOrder(order);
  const validItems = filterValidItems(order.items);
  processItems(validItems);
}
```

### Nullish Coalescing (`??`) vs OR (`||`)

```typescript
// ❌ Mauvais - traite 0, '', false comme invalides
const count = userInput || 0;
const name = user.name || 'Anonymous';

// ✅ Bon - ne remplace que null/undefined
const count = userInput ?? 0; // 0 est valide
const name = user.name ?? 'Anonymous'; // '' est valide
const enabled = settings.feature ?? true; // false est valide
```

---

## 📁 Project Structure (Feature-Based)

**Grouper par fonctionnalité, pas par type**

### ❌ Type-based (scattered)

```
src/
├── components/  (UserProfile, PostList, CommentBox)
├── services/    (userService, postService)
├── hooks/       (useUser, usePost)
└── types/       (user.ts, post.ts)
```

### ✅ Feature-based (cohesive)

```
src/
├── features/
│   ├── user/
│   │   ├── components/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── __tests__/
│   │   └── index.ts         # Public API
│   │
│   ├── posts/
│   │   └── ...
│   │
│   └── auth/
│       └── ...
│
└── shared/                  # Generic utilities only
    ├── components/
    ├── hooks/
    └── utils/
```

**Bénéfices :**

- ✅ Tout pour "user" est dans `features/user/`
- ✅ Facile de trouver, modifier, supprimer une feature
- ✅ Tests co-localisés avec le code

---

## 🔧 Tools Configured

### ESLint + SonarJS

- **@typescript-eslint** - TypeScript strict rules
- **eslint-plugin-sonarjs** - Code quality (complexity, duplicates, etc.)
- **No `: any`** - Enforced automatically
- **Cognitive complexity** - Max 15 per function

### Prettier

- Code formatting automatique
- Single quotes, trailing commas, 100 print width

### Husky + lint-staged

- Pre-commit: lint + format + tests relatifs
- Commit-msg: conventional format validation
- Pre-push: build + tests complets + coverage

### Vitest

- Tests unitaires ultra-rapides
- 80% coverage minimum enforced
- Watch mode par défaut

### TypeScript Strict Mode

```json
{
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noImplicitReturns": true,
  "noUncheckedIndexedAccess": true
}
```

---

## 📖 Documentation

Le fichier **`AGENT.md`** contient TOUTES les règles et best practices :

- 🎯 Core Philosophy
- 🛡️ Automated Guardrails
- 📘 TypeScript Best Practices
- 🧪 TDD Workflow
- 📏 Code Organization
- 🎨 Code Style
- ⚠️ Common Mistakes

**Pour les agents IA :** Lire `AGENT.md` avant chaque session de coding.

---

## 🚦 Scripts Disponibles

```bash
npm test              # Vitest watch mode
npm run test:run      # Single run
npm run test:coverage # Coverage report (80% min)

npm run lint          # ESLint check
npm run lint:fix      # Auto-fix linting errors

npm run format        # Prettier check
npm run format:fix    # Auto-format code

npm run type-check    # TypeScript validation
npm run build         # Compile to dist/

npm run validate      # Lint + type-check + tests
```

---

## 🎓 Basé sur

- **Agent Coding Guide 2026** - Agentic workflows
- **Rapports Shenron** - Architecture, Quality, Testing, TypeScript analysis
- **SonarQube standards** - Cognitive complexity, code smells
- **Expériences SocialVibe** - Real-world learnings
- **Clean Code principles** - Uncle Bob, Martin Fowler

---

## 🔄 Updates

Ce template évolue continuellement. Prochaines étapes :

- [ ] Ajout de guides détaillés (React, NestJS, etc.)
- [ ] Exemples de features complètes
- [ ] Templates de prompts pour agents IA
- [ ] Integration SonarQube Cloud

---

**Version**: 1.0.0  
**Créé par**: HAL pour Nadhoir ATTOUMANI  
**Date**: 2026-02-01  
**Repo**: https://github.com/naovich/vibecoding
