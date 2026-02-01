# Sources & Références - VibeCoding

## 📚 Sources Existantes Trouvées

### 1. Agent Coding Guide 2026
**Localisation:** `/mnt/d/hal/Recherche/Agent-Coding-Guide-2026/`

**Fichiers:**
- `rapport-agent-coding-guide.md` (v1)
- `rapport-agent-coding-guide-v2.md` (v2)
- `rapport-agent-coding-guide-v3.md` (v3) ⭐ **Le plus complet**

**Contenu clé:**
- ✅ Agentic Coding Workflows (Explore → Plan → Code → Commit)
- ✅ Eval Loops & Feedback Cycles
- ✅ CLAUDE.md & Project Rules
- ✅ Model Selection Strategy
- ✅ Context Engineering
- ✅ MCP (Model Context Protocol) & Tools
- ✅ Subagents & Parallelization
- ✅ Guardrails & Safety Patterns
- ✅ Prompt Engineering Avancé 2026
- ✅ Case Studies avec workflows agentic
- ✅ Benchmarks et métriques 2026

**Évolution SWE I → SWE II:**
- **2024 (SWE I):** Junior developer, nécessite guidage explicite
- **2026 (SWE II):** Mid-level developer, navigation proactive du codebase

---

### 2. Rapports Shenron AI
**Localisation:** `/mnt/d/hal/dev/Shenron/rapport/`

#### 2.1 Architecture Report (`architecture-report.md`)
**Contenu:**
- ✅ Patterns identifiés (Render-Agnostic, Slot System, Reference Pattern)
- ✅ Structure de dossiers (design/ vs builder/)
- ✅ Couplage et cohésion (Store-Component coupling)
- ✅ Recommandations (Hooks Facade, Migration Slot System)

**Learnings clés:**
```
✅ Render-Agnostic Interfaces (width: number vs borderWidth: "2px")
✅ Reference Pattern (IDs vers palettes vs copie de valeurs)
✅ Slot System (title, cta, brand - structure sémantique)
⚠️ Store-Component Coupling (4-5 stores par composant = tests complexes)
```

#### 2.2 Quality Report (`quality-report.md`)
**Contenu:**
- ✅ Configuration ESLint moderne (Flat Config, ESLint 9+)
- ✅ React Hooks Rules respectées (useMemo, useCallback, useEffect cleanup)
- ✅ TypeScript strict mode
- ✅ Prettier intégration

**Configuration ESLint référence:**
```javascript
// eslint.config.js - Flat Config (ESLint 9+)
- TypeScript ESLint (@typescript-eslint)
- React Hooks Plugin
- React Refresh Plugin
- Prettier intégration
- Storybook support
```

#### 2.3 Testing Report (`testing-report.md`)
**Statistiques:**
- ✅ **131 fichiers de tests**
- ✅ **1483 tests passants (100%)**
- ✅ Temps d'exécution: ~13 secondes
- ✅ Ratio: ~1 test pour 9 lignes de code

**Organisation:**
```
📁 src/hooks/__tests__/
📁 src/store/__tests__/
📁 src/components/**/*.test.tsx
📁 src/utils/**/*.test.ts
```

#### 2.4 TypeScript Report (`typescript-report.md`)
**Points clés:**
- ✅ Strict mode activé
- ✅ Path aliases (`@/*`, `@components/*`)
- ✅ **0 déclarations explicites `: any`**
- ✅ Usage de `any` limité aux tests uniquement

**Configuration stricte:**
```json
{
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noFallthroughCasesInSwitch": true,
  "noUncheckedSideEffectImports": true
}
```

---

### 3. Recherche Web (React 2026)

**Source:** Technostacks, Kinsta, Vercel, React.dev (Février 2026)

**Tendances React 2026:**
- ✅ Functional components & Hooks (standard)
- ✅ Performance: React.memo, useMemo, useCallback
- ✅ Concurrent rendering (useTransition, useDeferredValue)
- ✅ Automatic batching
- ✅ Server Components (RSC)
- ✅ Purity in Components and Hooks (règle clé React)

**Vercel React Best Practices:**
- Impact ratings: CRITICAL → LOW
- Code examples: What breaks + How to fix

---

## 🎯 Sources Manquantes (À Créer)

### Node.js Best Practices
- **Référence:** Node.js Best Practices (GitHub ~100k stars)
- **Contenu:** Async patterns, error handling, security, performance

### NestJS Patterns
- **Référence:** NestJS Documentation + Enterprise patterns
- **Expérience:** SocialVibe (Auth, Posts, WebSockets, Prisma)

### SonarQube Rules
- **Référence:** SonarQube Documentation
- **Contenu:** Rules, Metrics, Code Smells

### Clean Architecture
- **Référence:** Uncle Bob (Clean Architecture book)
- **Contenu:** Hexagonal, CQRS, DDD patterns

### TDD Philosophy
- **Référence:** Kent Beck, Martin Fowler
- **Contenu:** Red-Green-Refactor, AAA pattern

---

## 📊 Mapping Sources → Sections VibeCoding

| Section VibeCoding | Sources Principales |
|--------------------|---------------------|
| **main/** | Agent Coding Guide V3 (sections générales) |
| **react/** | React.dev Rules, Vercel Best Practices, Shenron Quality Report |
| **typescript/** | Shenron TypeScript Report, TypeScript Handbook 5.x |
| **tdd/** | Shenron Testing Report, Testing Library principles |
| **nodejs/** | Node.js Best Practices (GitHub), Express docs |
| **nestjs/** | SocialVibe architecture, NestJS docs |
| **sonarqube/** | SonarQube Documentation |
| **tools/** | Shenron Quality Report (ESLint config), Husky docs |
| **architecture/** | Shenron Architecture Report, Clean Architecture |
| **agentic-workflows/** | Agent Coding Guide V3 (sections 21-28) |
| **context-engineering/** | Agent Coding Guide V3 (Context Engineering) |
| **prompts/** | Expériences réelles, Agent Coding Guide V3 |
| **examples/** | SocialVibe, Shenron, templates réels |

---

## 🔗 Références Externes

### Documentation Officielle
- React.dev: https://react.dev
- TypeScript Handbook: https://www.typescriptlang.org/docs/
- NestJS: https://docs.nestjs.com
- Vitest: https://vitest.dev
- Playwright: https://playwright.dev
- ESLint: https://eslint.org
- Prettier: https://prettier.io

### Guides Communautaires
- Airbnb JavaScript Style Guide
- Google TypeScript Style Guide
- Node.js Best Practices (GitHub)

### Livres
- Clean Code (Robert C. Martin)
- Clean Architecture (Robert C. Martin)
- Refactoring (Martin Fowler)

---

**Date de compilation:** 2026-02-01  
**Par:** HAL
