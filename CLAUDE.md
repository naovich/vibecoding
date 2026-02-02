# CLAUDE.md - Instructions for Claude Code

**👋 Hello Claude!**

This project has comprehensive coding guidelines and best practices.

## 📖 READ THIS FIRST

**Before writing any code, read the complete guide:**

➡️ **[AGENT.md](./AGENT.md)** ⬅️

This file contains ALL the rules, patterns, and workflows you MUST follow:

- ✅ TypeScript best practices (no `: any`, strict types)
- ✅ React patterns (no React.FC, component composition)
- ✅ Testing workflow (TDD: RED → GREEN → REFACTOR)
- ✅ Code reusability (search before creating, DRY principle)
- ✅ Tailwind CSS guidelines (use classes first, CSS variables)
- ✅ SonarJS quality rules (complexity limits, no duplication)
- ✅ Pre-commit/push hooks (auto-validation)

---

## 🚨 Critical Rules (Quick Reference)

1. **Search before creating** - Always check if component/utility exists
2. **Zero tolerance for `: any`** - Use specific types or `unknown`
3. **Write tests FIRST** - TDD workflow (test → implement → refactor)
4. **Fix ALL warnings** - ESLint, TypeScript, SonarQube
5. **Use Tailwind classes** - Custom CSS only when necessary
6. **Avoid nested ternary** - Use switch/IIFE for complex conditions
7. **Use direct interface** - Not React.FC for components
8. **Files < 500 lines** - Split larger files into modules

---

## 🔍 Before Every Task

```bash
# 1. Search for existing similar code
grep -r "export.*function.*similar" src/
find src -name "*Component*"

# 2. Read AGENT.md sections relevant to your task
# 3. Write tests FIRST (TDD)
# 4. Validate before finishing:
npm run format
npm run lint -- --fix
npm run type-check
npm run build
```

---

## ✅ Validation Checklist

Before finishing ANY task:

- [ ] Read relevant sections in [AGENT.md](./AGENT.md)
- [ ] Searched for existing similar code (no duplication)
- [ ] Tests written FIRST (TDD workflow)
- [ ] `npm run format` - Code formatted
- [ ] `npm run lint -- --fix` - No ESLint/SonarJS errors or warnings
- [ ] `npm run type-check` - No TypeScript errors
- [ ] `npm run build` - Production build works
- [ ] No IDE warnings (check diagnostics panel)

---

**📚 Full documentation: [AGENT.md](./AGENT.md)**

Happy coding! 🚀
