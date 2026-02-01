# VibeCoding Template 🚀

**TypeScript + Vitest + Complete Guardrails**

A production-ready TypeScript template with **automated quality checks** that prevent bad code from entering your repository.

---

## ✨ Features

✅ **TypeScript Strict Mode** - Zero tolerance for type errors  
✅ **Vitest** - Fast unit testing with coverage enforcement  
✅ **ESLint + Prettier** - Code quality and formatting  
✅ **Husky Hooks** - Pre-commit and pre-push validation  
✅ **Commitlint** - Conventional commit messages  
✅ **Custom Guardrails** - No `: any`, file size limits, coverage thresholds  

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Tests

```bash
npm test              # Watch mode
npm run test:run      # Run once
npm run test:coverage # With coverage report
```

### 3. Development

```bash
npm run type-check:watch  # Type checking in watch mode
npm run lint              # Check for issues
npm run lint:fix          # Auto-fix issues
npm run format            # Format all files
```

### 4. Build

```bash
npm run build
```

---

## 🛡️ Automated Guardrails

This template prevents common mistakes **automatically**:

### Pre-Commit (runs before every commit)
- ✅ ESLint checks all staged files
- ✅ Prettier formats all staged files
- ✅ TypeScript type checking
- ✅ Blocks `: any` usage
- ✅ Blocks files > 500 lines
- ✅ Runs tests for modified files

### Pre-Push (runs before git push)
- ✅ Full TypeScript build
- ✅ All tests must pass
- ✅ Coverage must be ≥ 80%

### Commit Message (enforced format)
```
type(scope): description

Examples:
✅ feat: add user authentication
✅ fix(api): resolve timeout issue
✅ docs: update README
```

---

## 📁 Project Structure

```
template/
├── src/
│   ├── index.ts              # Entry point
│   └── utils/
│       ├── greet.ts          # Example utility
│       └── greet.test.ts     # Example test
├── scripts/
│   ├── check-no-any.js       # Blocks `: any` usage
│   ├── check-file-size.js    # Enforces 500-line limit
│   ├── enforce-coverage.js   # Enforces 80% coverage
│   └── check-unused-deps.js  # Checks for unused dependencies
├── .husky/
│   ├── pre-commit            # Pre-commit validation
│   ├── pre-push              # Pre-push validation
│   └── commit-msg            # Commit message validation
├── tsconfig.json             # TypeScript strict config
├── vitest.config.ts          # Vitest configuration
├── eslint.config.js          # ESLint flat config
├── .prettierrc.json          # Prettier configuration
├── commitlint.config.js      # Commit message rules
├── .lintstagedrc.json        # Lint-staged config
├── AGENT.md                  # 📖 AI Agent guidelines
└── package.json              # Scripts and dependencies
```

---

## 📖 For AI Agents

**If you are an AI coding agent, READ THIS:**

👉 **[AGENT.md](./AGENT.md)** - Complete guidelines and best practices

This file contains:
- ✅ All rules you must follow
- ✅ What will block your commits
- ✅ TypeScript best practices
- ✅ Testing requirements
- ✅ Code organization standards
- ✅ Common mistakes to avoid

---

## 🎯 Scripts Reference

### Development
```bash
npm run type-check        # Check types (no build)
npm run type-check:watch  # Watch mode
npm test                  # Run tests in watch mode
npm run test:run          # Run tests once
npm run test:coverage     # Generate coverage report
npm run test:ui           # Interactive test UI
```

### Code Quality
```bash
npm run lint              # Check for issues
npm run lint:fix          # Auto-fix issues
npm run format            # Format all files
npm run format:check      # Check if formatted
```

### Validation
```bash
npm run validate          # Lint + Type + Tests
npm run validate:full     # + Coverage check
npm run check:any         # Check for : any usage
npm run check:file-size   # Check file sizes
npm run check:coverage    # Check coverage thresholds
```

### Build
```bash
npm run build             # Compile TypeScript
```

---

## 🔧 Configuration

### TypeScript (`tsconfig.json`)
- Strict mode enabled
- No unused locals/parameters
- Path aliases configured (`@/*`)

### ESLint (`eslint.config.js`)
- Flat config (ESLint 9+)
- TypeScript rules
- No `: any` allowed
- No `console.log` in production

### Vitest (`vitest.config.ts`)
- Coverage thresholds: 80% minimum
- Path aliases matching TypeScript

### Commitlint (`commitlint.config.js`)
- Conventional commits enforced
- Types: feat, fix, docs, style, refactor, perf, test, chore, ci, revert

---

## 🚨 Common Issues

### "Pre-commit blocked: ESLint errors"
```bash
npm run lint:fix  # Auto-fix
```

### "Pre-commit blocked: `: any` detected"
```bash
npm run check:any  # See where
# Fix by using specific types or unknown
```

### "Pre-commit blocked: File too large"
```bash
npm run check:file-size  # See which file
# Split into smaller modules
```

### "Pre-push blocked: Coverage < 80%"
```bash
npm run test:coverage  # See report
open coverage/index.html  # Visual report
# Write more tests
```

---

## 📚 Learn More

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vitest Documentation](https://vitest.dev/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [ESLint Rules](https://eslint.org/docs/rules/)

---

## 📝 License

ISC

---

**Built with ❤️ using VibeCoding principles**
