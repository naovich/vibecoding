# CLAUDE.md

**⚠️ STOP - Read this first before writing any code**

This project has strict automated quality checks that will **block your commits** if rules are violated.

## Required Reading

👉 **[AGENT.md](./AGENT.md)** - Complete coding guidelines (READ THIS NOW)

Contains:

- TypeScript strict rules (no `: any`)
- React patterns (no React.FC, component composition)
- TDD workflow (write tests FIRST)
- Code reusability (search before creating)
- Tailwind CSS guidelines
- SonarJS quality rules
- Pre-commit validation workflow

## Before Every Task

1. **Search for existing code** - Don't duplicate
2. **Read relevant AGENT.md sections**
3. **Write tests FIRST** (TDD)
4. **Validate before finishing:**
   - `npm run format`
   - `npm run lint -- --fix`
   - `npm run type-check`
   - `npm run build`

Commits are **auto-blocked** if any check fails. Fix issues before committing.
