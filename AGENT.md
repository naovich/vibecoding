# AGENT.md - Guide for AI Coding Agents 🤖

**Version:** 1.0.0  
**Last Updated:** 2026-02-01  
**Purpose:** This file contains ALL the rules, best practices, and guidelines for AI agents working on this codebase.

---

## 🎯 Core Philosophy

**Your Mission:** Write clean, maintainable, bug-free code that passes all automated checks.

**Golden Rules:**

1. ✅ **If it can be checked automatically, it WILL be blocked automatically**
2. ✅ **Zero tolerance for `: any`** (use specific types or `unknown`)
3. ✅ **Every function has tests** (minimum 80% coverage)
4. ✅ **Files under 500 lines** (split larger files into modules)
5. ✅ **Commits follow conventional format** (`type(scope): description`)

---

## 🛡️ Automated Guardrails (What Will Block You)

### Pre-Commit Hooks (~10s)

These run BEFORE your commit is accepted:

```
❌ BLOCKS if ESLint errors found
❌ BLOCKS if Prettier formatting issues
❌ BLOCKS if TypeScript type errors
❌ BLOCKS if `: any` detected in code
❌ BLOCKS if any file > 500 lines
❌ BLOCKS if tests fail for modified files
```

### Commit Message Hook

```
❌ BLOCKS if commit message doesn't follow format
✅ Required format: type(scope): description

Examples:
✅ feat: add user authentication
✅ fix(api): resolve timeout issue
✅ docs: update README
❌ Add feature (no type)
❌ FEAT: add feature (uppercase type)
```

### Pre-Push Hooks (~60s)

These run BEFORE your push is accepted:

```
❌ BLOCKS if TypeScript build fails
❌ BLOCKS if any test fails
❌ BLOCKS if coverage < 80%
```

---

## 📘 TypeScript Best Practices

### 1. Strict Mode - ALWAYS

This project uses **strict TypeScript**. All these options are enabled:

```typescript
// ✅ Enabled by default in this project
strict: true;
noUnusedLocals: true;
noUnusedParameters: true;
noFallthroughCasesInSwitch: true;
noUncheckedIndexedAccess: true;
noImplicitReturns: true;
```

### 2. NO `any` - EVER

❌ **NEVER DO THIS:**

```typescript
const data: any = fetchData();
function process(item: any) { ... }
const result = JSON.parse(text) as any;
```

✅ **DO THIS INSTEAD:**

```typescript
// Use specific types
interface User {
  id: string;
  name: string;
}
const data: User = fetchData();

// Or use unknown + type guard
function process(item: unknown): void {
  if (isValidItem(item)) {
    // TypeScript knows the type here
  }
}

// Type JSON properly
interface ApiResponse {
  status: string;
  data: unknown;
}
const result = JSON.parse(text) as ApiResponse;
```

**Why:** `: any` disables type checking. It defeats the purpose of TypeScript.

### 3. Explicit Return Types

❌ **Avoid:**

```typescript
function calculateTotal(items: Item[]) {
  // Implicit return type
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

✅ **Prefer:**

```typescript
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

**Why:** Makes function contracts explicit and catches return type errors early.

### 4. Function Complexity - Maximum 15

❌ **Too Complex (Cognitive Complexity > 15):**

```typescript
function processOrder(order: Order): Result {
  if (order.items.length > 0) {
    if (order.customer.isPremium) {
      if (order.total > 1000) {
        if (order.shippingMethod === 'express') {
          // ... nested logic continues
        }
      }
    }
  }
  // Complexity: 25+ ❌
}
```

✅ **Refactored (Complexity < 15):**

```typescript
function processOrder(order: Order): Result {
  validateOrder(order);
  const discount = calculateDiscount(order);
  const shipping = calculateShipping(order);
  return finalizeOrder(order, discount, shipping);
}

function calculateDiscount(order: Order): number {
  if (!order.customer.isPremium) return 0;
  if (order.total < 1000) return 0;
  return order.total * 0.1;
}
```

**Why:** Keep functions simple and focused. SonarQube recommends max complexity of 15. Split complex functions into smaller, testable units.

### 5. Prefer `??` (Nullish Coalescing) Over `||`

❌ **Avoid `||` when you care about falsy values:**

```typescript
const count = userInput || 0; // ❌ Treats 0, '', false as invalid
const name = user.name || 'Anonymous'; // ❌ Treats '' as invalid
```

✅ **Use `??` for null/undefined only:**

```typescript
const count = userInput ?? 0; // ✅ Only replaces null/undefined
const name = user.name ?? 'Anonymous'; // ✅ Empty string is valid
const enabled = settings.feature ?? true; // ✅ false is valid
```

**When to use what:**

- `??` - When `0`, `''`, `false` are valid values
- `||` - When you want to treat all falsy values the same

### 6. Use Utility Types

```typescript
// Pick - Select specific properties
type UserPreview = Pick<User, 'id' | 'name'>;

// Omit - Exclude specific properties
type UserWithoutPassword = Omit<User, 'password'>;

// Partial - Make all properties optional
type PartialUser = Partial<User>;

// Required - Make all properties required
type RequiredUser = Required<PartialUser>;

// Record - Create object type with specific keys
type UserMap = Record<string, User>;
```

### 7. Prefer `unknown` Over `any`

```typescript
// ✅ Good - forces type checking
function processData(data: unknown): void {
  if (typeof data === 'string') {
    console.log(data.toUpperCase());
  } else if (isUser(data)) {
    console.log(data.name);
  }
}

// ❌ Bad - no type checking
function processData(data: any): void {
  console.log(data.toUpperCase()); // Runtime error if not string
}
```

---

## 🧪 Testing Best Practices

### 0. TDD - Test-Driven Development (MANDATORY)

**RED → GREEN → REFACTOR**

You MUST follow TDD workflow:

1. **🔴 RED:** Write the test FIRST (it will fail)
2. **🟢 GREEN:** Write minimal code to make it pass
3. **🔵 REFACTOR:** Clean up while keeping tests green

❌ **WRONG - Code first, test later:**

```typescript
// Write implementation first ❌
export function sum(a: number, b: number): number {
  return a + b;
}

// Then write test ❌
it('should sum numbers', () => {
  expect(sum(2, 3)).toBe(5);
});
```

✅ **CORRECT - Test first:**

```typescript
// Step 1: Write test FIRST (RED) ✅
describe('sum', () => {
  it('should add two positive numbers', () => {
    expect(sum(2, 3)).toBe(5);
  });

  it('should handle negative numbers', () => {
    expect(sum(-2, 3)).toBe(1);
  });

  it('should handle zero', () => {
    expect(sum(0, 5)).toBe(5);
  });
});

// Step 2: Run test → it FAILS (function doesn't exist yet)
// Step 3: Write minimal code to make it pass (GREEN) ✅
export function sum(a: number, b: number): number {
  return a + b;
}

// Step 4: Run test → it PASSES ✅
// Step 5: Refactor if needed (while keeping tests green)
```

**Workflow for every feature:**

```bash
# 1. Create test file
touch src/features/user/user.service.test.ts

# 2. Write tests (they will fail)
npm test # ❌ FAIL (expected)

# 3. Write implementation
# Edit src/features/user/user.service.ts

# 4. Run tests again
npm test # ✅ PASS (required before moving on)

# 5. Only commit when tests pass
git add .
git commit -m "feat(user): add user creation"
```

**Benefits:**

- ✅ Forces you to think about API before implementation
- ✅ Ensures every line of code has a test
- ✅ Prevents over-engineering (write only what's needed)
- ✅ Catches bugs immediately

**Rule:** Never write production code without a failing test first.

### 1. Test Coverage Requirements

**Minimum coverage:** 80% for lines, statements, functions, branches

```typescript
// Every function MUST have tests
export function calculateDiscount(price: number, percent: number): number {
  if (price < 0 || percent < 0 || percent > 100) {
    throw new Error('Invalid input');
  }
  return price * (percent / 100);
}
```

```typescript
// calculateDiscount.test.ts
describe('calculateDiscount', () => {
  it('should calculate discount correctly', () => {
    expect(calculateDiscount(100, 20)).toBe(20);
  });

  it('should handle 0% discount', () => {
    expect(calculateDiscount(100, 0)).toBe(0);
  });

  it('should handle 100% discount', () => {
    expect(calculateDiscount(100, 100)).toBe(100);
  });

  it('should throw for negative price', () => {
    expect(() => calculateDiscount(-10, 20)).toThrow('Invalid input');
  });

  it('should throw for invalid percent', () => {
    expect(() => calculateDiscount(100, -5)).toThrow('Invalid input');
    expect(() => calculateDiscount(100, 101)).toThrow('Invalid input');
  });
});
```

### 2. AAA Pattern (Arrange, Act, Assert)

```typescript
it('should update user profile', () => {
  // Arrange - Setup test data
  const user = { id: '1', name: 'Alice' };
  const updates = { name: 'Bob' };

  // Act - Execute the function
  const result = updateUser(user, updates);

  // Assert - Verify the result
  expect(result.name).toBe('Bob');
  expect(result.id).toBe('1');
});
```

### 3. Test File Naming

```
src/
├── utils/
│   ├── math.ts
│   ├── math.test.ts        ✅ Co-located with source
│   ├── string.ts
│   └── string.test.ts
```

### 4. What to Test

✅ **MUST test:**

- All public functions/methods
- Edge cases (empty arrays, null values, boundaries)
- Error conditions
- Business logic

❌ **DON'T test:**

- Third-party libraries
- Simple getters/setters with no logic
- TypeScript type definitions

---

## 📏 Code Organization

### 1. File Size Limit: 500 Lines

❌ **God File (850 lines):**

```
UserProfile.tsx
├─ Component (200 lines)
├─ Helper functions (150 lines)
├─ Validation logic (100 lines)
├─ API calls (200 lines)
└─ Styles (200 lines)
```

✅ **Split into Modules:**

```
user-profile/
├── UserProfile.tsx          (100 lines) - Main component
├── UserProfileForm.tsx      (80 lines)  - Form sub-component
├── UserProfileAvatar.tsx    (60 lines)  - Avatar component
├── userValidation.ts        (100 lines) - Validation logic
├── userApi.ts               (150 lines) - API calls
└── userHelpers.ts           (120 lines) - Helper functions
```

**Why:** Large files are hard to maintain, test, and understand.

### 2. Feature-Based Folder Structure (PREFERRED)

**Group by feature, not by type.** Everything related to a feature should live in the same folder.

❌ **BAD - Type-based (scattered):**

```
src/
├── components/
│   ├── UserProfile.tsx
│   ├── UserSettings.tsx
│   └── UserAvatar.tsx
├── services/
│   └── userService.ts
├── hooks/
│   └── useUser.ts
├── types/
│   └── user.ts
└── utils/
    └── userHelpers.ts
```

**Problem:** To understand the "user" feature, you need to jump between 5 different folders.

✅ **GOOD - Feature-based (cohesive):**

```
src/
├── features/
│   ├── user/
│   │   ├── components/
│   │   │   ├── UserProfile.tsx
│   │   │   ├── UserSettings.tsx
│   │   │   └── UserAvatar.tsx
│   │   ├── hooks/
│   │   │   └── useUser.ts
│   │   ├── services/
│   │   │   └── user.service.ts
│   │   ├── types/
│   │   │   └── user.types.ts
│   │   ├── utils/
│   │   │   └── user.helpers.ts
│   │   ├── __tests__/
│   │   │   ├── UserProfile.test.tsx
│   │   │   └── user.service.test.ts
│   │   └── index.ts          # Public API
│   │
│   ├── auth/
│   │   ├── components/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── index.ts
│   │
│   └── posts/
│       ├── components/
│       ├── services/
│       └── index.ts
│
└── shared/                   # Truly shared utilities
    ├── components/           # Generic Button, Input, etc.
    ├── hooks/                # useDebounce, useLocalStorage
    └── utils/                # formatDate, validateEmail
```

**Benefits:**

- ✅ Everything for "user" feature is in `features/user/`
- ✅ Easy to find, modify, delete entire features
- ✅ Clear dependencies (imports from other features are visible)
- ✅ Tests co-located with code
- ✅ Scalable (add features without restructuring)

**Rules:**

1. **Keep features isolated** - Avoid cross-feature imports when possible
2. **Use index.ts** - Export public API from each feature
3. **Shared goes in `/shared`** - Only truly generic stuff
4. **Co-locate tests** - Tests live with the code they test

**Example import:**

```typescript
// ✅ Import from feature's public API
import { UserProfile, useUser } from '@/features/user';

// ❌ Don't import internal details
import { UserProfile } from '@/features/user/components/UserProfile';
```

### 3. Naming Conventions

```typescript
// ✅ Files: camelCase or kebab-case
userService.ts;
user - service.ts;

// ✅ Classes: PascalCase
class UserService {}

// ✅ Functions: camelCase
function getUserById() {}

// ✅ Constants: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;

// ✅ Interfaces/Types: PascalCase
interface UserProfile {}
type UserId = string;

// ✅ Private properties: prefix with _
class User {
  private _password: string;
}
```

### 4. Import Organization

```typescript
// ✅ Good - Organized imports
// 1. External libraries
import { useState, useEffect } from 'react';
import axios from 'axios';

// 2. Internal utilities
import { validateEmail } from '@/utils/validation';
import { formatDate } from '@/utils/date';

// 3. Types
import type { User } from '@/types/user';

// 4. Relative imports
import { Header } from './Header';
import styles from './styles.module.css';
```

---

## 🎨 Code Style

### 1. Formatting (Prettier)

All code is automatically formatted by Prettier. Config:

```json
{
  "semi": true,
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

### 2. ESLint Rules (Auto-enforced)

```typescript
// ❌ console.log in production code
console.log('Debug:', data);

// ✅ Use console.warn or console.error only
console.warn('Warning:', message);
console.error('Error:', error);

// ❌ var keyword
var count = 0;

// ✅ const or let
const count = 0;
let mutableCount = 0;

// ❌ == or !=
if (value == null) {
}

// ✅ === or !==
if (value === null) {
}

// ❌ Missing braces
if (condition) doSomething();

// ✅ Always use braces
if (condition) {
  doSomething();
}
```

### 3. SonarJS Rules (Code Quality)

This project uses **eslint-plugin-sonarjs** to enforce code quality patterns recommended by SonarQube.

**Key rules enabled:**

```typescript
// ❌ Cognitive Complexity > 15
function processOrder(order: Order): void {
  if (order.status === 'pending') {
    if (order.items.length > 0) {
      for (const item of order.items) {
        if (item.stock > 0) {
          if (item.price > 0) {
            // Nested logic continues...
            // Complexity: 20+ ❌
          }
        }
      }
    }
  }
}

// ✅ Split into smaller functions (Complexity < 15)
function processOrder(order: Order): void {
  validateOrder(order);
  const validItems = filterValidItems(order.items);
  processItems(validItems);
}

// ❌ Duplicate string literals
const error1 = 'Invalid user input';
const error2 = 'Invalid user input';
const error3 = 'Invalid user input';

// ✅ Use constants
const ERROR_INVALID_INPUT = 'Invalid user input';
const error1 = ERROR_INVALID_INPUT;

// ❌ Identical functions
function getUserName(user: User): string {
  return user.firstName + ' ' + user.lastName;
}
function getAuthorName(author: Author): string {
  return author.firstName + ' ' + author.lastName;
}

// ✅ Extract common logic
function getFullName(person: { firstName: string; lastName: string }): string {
  return `${person.firstName} ${person.lastName}`;
}

// ❌ Collapsible if
if (user.isActive) {
  if (user.hasAccess) {
    doSomething();
  }
}

// ✅ Combine conditions
if (user.isActive && user.hasAccess) {
  doSomething();
}

// ❌ Unnecessary intermediate variable
function getTotal(items: Item[]): number {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  return total;
}

// ✅ Return immediately
function getTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

**All SonarJS rules will block your commit if violated.**

---

## ⚠️ Common Mistakes to Avoid

### 1. Non-Null Assertions (!.)

❌ **Dangerous:**

```typescript
const user = users.find((u) => u.id === id)!; // Assumes it exists
const name = user.name!; // Assumes name exists
```

✅ **Safe:**

```typescript
const user = users.find((u) => u.id === id);
if (!user) {
  throw new Error(`User ${id} not found`);
}
const name = user.name ?? 'Unknown';
```

### 2. Type Assertions (`as`)

❌ **Avoid:**

```typescript
const data = JSON.parse(text) as User; // Unsafe assumption
```

✅ **Better:**

```typescript
const data: unknown = JSON.parse(text);
if (isUser(data)) {
  // TypeScript knows data is User here
  console.log(data.name);
}

function isUser(data: unknown): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'name' in data &&
    typeof data.id === 'string' &&
    typeof data.name === 'string'
  );
}
```

### 3. Ignoring Errors

❌ **Silent failures:**

```typescript
try {
  riskyOperation();
} catch (error) {
  // Empty catch - error silently swallowed
}
```

✅ **Proper error handling:**

```typescript
try {
  riskyOperation();
} catch (error) {
  console.error('Operation failed:', error);
  throw new Error('Failed to complete operation');
}
```

### 4. Mutable Default Parameters

❌ **Dangerous:**

```typescript
function addItem(item: string, list: string[] = []): string[] {
  list.push(item); // Mutates the default array!
  return list;
}
```

✅ **Safe:**

```typescript
function addItem(item: string, list: string[] = []): string[] {
  return [...list, item]; // Returns new array
}
```

---

## 📚 Design Principles

### 1. DRY (Don't Repeat Yourself)

❌ **Repetition:**

```typescript
function calculateTotalPrice(items: Item[]): number {
  let total = 0;
  for (const item of items) {
    total += item.price * item.quantity;
  }
  return total * 1.2; // VAT
}

function calculateTotalPriceWithDiscount(items: Item[], discount: number): number {
  let total = 0;
  for (const item of items) {
    total += item.price * item.quantity;
  }
  return total * 1.2 * (1 - discount);
}
```

✅ **DRY:**

```typescript
function calculateSubtotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function calculateTotalPrice(items: Item[]): number {
  return calculateSubtotal(items) * 1.2;
}

function calculateTotalPriceWithDiscount(items: Item[], discount: number): number {
  return calculateTotalPrice(items) * (1 - discount);
}
```

### 2. KISS (Keep It Simple, Stupid)

❌ **Over-engineered:**

```typescript
class UserRepositoryFactoryBuilder {
  private config: Config;

  withConfig(config: Config): this {
    this.config = config;
    return this;
  }

  build(): UserRepositoryFactory {
    return new UserRepositoryFactory(this.config);
  }
}
```

✅ **Simple:**

```typescript
function createUserRepository(config: Config): UserRepository {
  return new UserRepository(config);
}
```

### 3. SOLID Principles

**Single Responsibility:**

```typescript
// ❌ Too many responsibilities
class UserManager {
  createUser() {}
  deleteUser() {}
  sendEmail() {} // Email responsibility
  logActivity() {} // Logging responsibility
}

// ✅ Single responsibility
class UserService {
  createUser() {}
  deleteUser() {}
}

class EmailService {
  sendEmail() {}
}

class ActivityLogger {
  logActivity() {}
}
```

---

## 🔧 Development Workflow

### 1. Before You Code

```bash
# Pull latest changes
git pull

# Install/update dependencies
npm install

# Run type check
npm run type-check
```

### 2. While Coding

```bash
# Watch mode for type checking
npm run type-check:watch

# Run tests in watch mode
npm test

# Lint and fix
npm run lint:fix
```

### 3. Before Commit

The pre-commit hook will automatically:

- ✅ Run ESLint and fix issues
- ✅ Run Prettier and format code
- ✅ Check TypeScript types
- ✅ Check for `: any` usage
- ✅ Check file sizes
- ✅ Run tests for modified files

If ANY check fails, your commit is blocked. Fix the issues and try again.

### 4. Commit Message Format

```bash
# ✅ Valid commits
git commit -m "feat: add user authentication"
git commit -m "fix(api): resolve timeout issue"
git commit -m "docs: update installation guide"
git commit -m "refactor(store): split monolithic store"
git commit -m "test: add E2E tests for checkout"

# ❌ Invalid commits (will be blocked)
git commit -m "Add feature"        # No type
git commit -m "FEAT: add feature"  # Uppercase type
git commit -m "feat: Add feature"  # Uppercase subject
git commit -m "feat: add feature." # Period at end
```

**Commit Types:**

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only
- `style` - Formatting (no code change)
- `refactor` - Code refactoring
- `perf` - Performance improvement
- `test` - Adding/updating tests
- `chore` - Maintenance (deps, config)
- `ci` - CI/CD changes
- `revert` - Revert previous commit

### 5. Before Push

The pre-push hook will run:

- ✅ Full TypeScript build
- ✅ All tests
- ✅ Coverage check (must be ≥ 80%)

**This takes ~60 seconds. Be patient.**

---

## 🚨 What To Do When Blocked

### "Pre-commit blocked: ESLint errors"

```bash
# See what's wrong
npm run lint

# Auto-fix what can be fixed
npm run lint:fix

# Fix remaining issues manually
```

### "Pre-commit blocked: `: any` detected"

```bash
# See where
npm run check:any

# Fix by using specific types or unknown
```

### "Pre-commit blocked: File too large"

```bash
# See which file
npm run check:file-size

# Split the file into smaller modules
```

### "Pre-push blocked: Coverage < 80%"

```bash
# See coverage report
npm run test:coverage

# Open HTML report
open coverage/index.html

# Write more tests for uncovered code
```

### "Commit message blocked"

```bash
# Check your commit message format
# Must be: type(scope): description
# Example: feat: add user login

# Fix and try again
git commit -m "feat: add user login feature"
```

---

## 📖 Additional Resources

### TypeScript

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TypeScript Cheat Sheet](https://www.typescriptlang.org/cheatsheets)

### Testing

- [Vitest Documentation](https://vitest.dev/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

### Code Style

- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)

---

## ✅ Quick Checklist Before Commit

- [ ] Code compiles (`npm run build`)
- [ ] All tests pass (`npm run test:run`)
- [ ] No `: any` in code (`npm run check:any`)
- [ ] All files < 500 lines (`npm run check:file-size`)
- [ ] Code is formatted (`npm run format`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] Commit message follows convention
- [ ] Tests written for new code

**If all checks pass, commit will succeed automatically.**

---

## 🎓 Remember

> "Code is read more often than it is written."  
> — Guido van Rossum

Write code that your future self (and other developers) will thank you for.

**Happy coding! 🚀**
