# AGENT.md - Guide for AI Coding Agents 🤖

**Version:** 1.0.0  
**Last Updated:** 2026-02-01  
**Purpose:** This file contains ALL the rules, best practices, and guidelines for AI agents working on this codebase.

---

## 📚 Before You Start

**Read these files in order:**

1. **README.md** - Project overview, setup, and quick start
2. **FILE_TREE.md** - Complete project structure (auto-generated)
3. **CODEBASE.md** - All exported functions/components with JSDoc (auto-generated)

These files are updated automatically on every commit.

---

## 🎯 Core Philosophy

**Your Mission:** Write clean, maintainable, bug-free code that passes all automated checks.

**Golden Rules:**

1. ✅ **Search before creating** - Always check if component/utility exists
2. ✅ **DRY principle** - Extract common patterns, avoid duplication
3. ✅ **Zero tolerance for `: any`** - Use specific types or `unknown`
4. ✅ **TDD workflow** - Write tests FIRST (RED → GREEN → REFACTOR)
5. ✅ **Files under 500 lines** - Split larger files into modules
6. ✅ **Fix ALL warnings** - ESLint, TypeScript, SonarQube before commit
7. ✅ **Commits follow convention** - `type(scope): description`

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

## ⚛️ React Best Practices

### 1. Component Type Definitions

❌ **Avoid React.FC (deprecated pattern):**

```typescript
const MyComponent: React.FC<Props> = ({ name }) => {
  return <div>{name}</div>;
};
```

✅ **Use direct interface instead:**

```typescript
interface Props {
  name: string;
  age?: number;
}

function MyComponent({ name, age }: Props): JSX.Element {
  return (
    <div>
      {name} {age && `(${age})`}
    </div>
  );
}

// Or with arrow function
const MyComponent = ({ name, age }: Props): JSX.Element => {
  return <div>{name}</div>;
};
```

**Why:** React.FC has known issues with children typing and doesn't provide real benefits. Direct props typing is clearer and more flexible.

### 2. Component Composition Over Duplication

❌ **Duplicating large components:**

```typescript
function UserCard() {
  return (
    <div className="rounded-lg border bg-white p-4 shadow">
      <img src={user.avatar} className="h-12 w-12 rounded-full" />
      <h3 className="text-lg font-bold">{user.name}</h3>
      <p className="text-gray-600">{user.email}</p>
    </div>
  );
}

function ProductCard() {
  return (
    <div className="rounded-lg border bg-white p-4 shadow">
      <img src={product.image} className="h-12 w-12 rounded-full" />
      <h3 className="text-lg font-bold">{product.name}</h3>
      <p className="text-gray-600">{product.price}</p>
    </div>
  );
}
```

✅ **Compose small, reusable components:**

```typescript
interface CardProps {
  children: React.ReactNode;
}

function Card({ children }: CardProps): JSX.Element {
  return <div className="rounded-lg border bg-white p-4 shadow">{children}</div>;
}

interface CardHeaderProps {
  image: string;
  title: string;
  subtitle: string;
}

function CardHeader({ image, title, subtitle }: CardHeaderProps): JSX.Element {
  return (
    <>
      <img src={image} className="h-12 w-12 rounded-full" />
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-gray-600">{subtitle}</p>
    </>
  );
}

// Now compose
function UserCard() {
  return (
    <Card>
      <CardHeader image={user.avatar} title={user.name} subtitle={user.email} />
    </Card>
  );
}

function ProductCard() {
  return (
    <Card>
      <CardHeader image={product.image} title={product.name} subtitle={product.price} />
    </Card>
  );
}
```

### 3. Conditional Rendering

❌ **AVOID nested ternary (unreadable):**

```typescript
function Status({ type }: { type: string }) {
  return (
    <div>
      {type === 'success' ? (
        'Success'
      ) : type === 'error' ? (
        'Error'
      ) : type === 'warning' ? (
        'Warning'
      ) : (
        'Info'
      )}
    </div>
  );
}
```

✅ **Use switch with IIFE for complex conditions:**

```typescript
function Status({ type }: { type: string }): JSX.Element {
  return (
    <div>
      {(() => {
        switch (type) {
          case 'success':
            return <span className="text-green-600">Success</span>;
          case 'error':
            return <span className="text-red-600">Error</span>;
          case 'warning':
            return <span className="text-yellow-600">Warning</span>;
          default:
            return <span className="text-blue-600">Info</span>;
        }
      })()}
    </div>
  );
}
```

✅ **Or extract to helper function:**

```typescript
function getStatusComponent(type: string): JSX.Element {
  switch (type) {
    case 'success':
      return <span className="text-green-600">Success</span>;
    case 'error':
      return <span className="text-red-600">Error</span>;
    case 'warning':
      return <span className="text-yellow-600">Warning</span>;
    default:
      return <span className="text-blue-600">Info</span>;
  }
}

function Status({ type }: { type: string }): JSX.Element {
  return <div>{getStatusComponent(type)}</div>;
}
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

### 8. JSDoc Documentation (IMPORTANT)

**JSDoc helps generate CODEBASE.md** - a map of all functions/components that prevents code duplication.

✅ **Write JSDoc for all exported functions:**

```typescript
/**
 * Create a new user with email validation
 * @param data - User input data
 * @returns Promise with created user
 */
export function createUser(data: UserInput): Promise<User> {
  // ...
}
```

✅ **JSDoc for React components:**

```typescript
/**
 * User profile component displaying avatar, name, and bio
 * @param props - Component props
 */
export function UserProfile({ user, onEdit }: UserProfileProps): JSX.Element {
  // ...
}
```

**Why JSDoc matters:**

- `npm run map` extracts JSDoc to generate CODEBASE.md
- Claude Code reads CODEBASE.md before creating new code
- Prevents duplication (knows what already exists)
- ESLint warns if JSDoc is missing on exported functions

**Without JSDoc:** Just signatures in CODEBASE.md  
**With JSDoc:** Full descriptions + usage examples

### 9. RegExp Best Practices

❌ **Use String.match() (less performant, inconsistent):**

```typescript
const text = 'Hello world';
const match = text.match(/world/);
if (match) {
  console.log(match[0]); // 'world'
}
```

✅ **Use RegExp.exec() for better performance and consistency:**

```typescript
const text = 'Hello world';
const regex = /world/;
const match = regex.exec(text);
if (match) {
  console.log(match[0]); // 'world'
}
```

✅ **For global matches, RegExp.exec() is the only option:**

```typescript
const text = 'cat bat hat';
const regex = /\b(\w)at\b/g;
let match;

while ((match = regex.exec(text)) !== null) {
  console.log(`Found ${match[0]}, first letter: ${match[1]}`);
}
// Output:
// Found cat, first letter: c
// Found bat, first letter: b
// Found hat, first letter: h
```

**Why:**

- `RegExp.exec()` is more performant
- Consistent API for both single and global matches
- Required for iterating over all matches with `/g` flag
- SonarJS rule `prefer-regexp-exec` enforces this

---

## 🎨 Styling with Tailwind CSS

### 1. Always Use Tailwind Classes First

❌ **Don't write custom CSS when Tailwind class exists:**

```css
/* Bad - custom CSS */
.button {
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  border-radius: 0.375rem;
}
```

✅ **Use Tailwind utility classes:**

```typescript
<button className="rounded-md bg-blue-500 px-4 py-2">Click me</button>
```

### 2. Custom CSS Only When Necessary

**When Tailwind doesn't provide what you need:**

```css
/* index.css - Create CSS variables for custom colors */
@theme {
  /* Custom Colors */
  --color-brand-primary: oklch(0.58 0.25 280);
  --color-brand-secondary: oklch(0.48 0.22 330);

  /* Custom Shadows */
  --shadow-glow: 0 0 20px oklch(0.7 0.3 280 / 0.5);

  /* Custom Easings */
  --ease-fluid: cubic-bezier(0.3, 0, 0, 1);
}
```

**Then use in Tailwind:**

```typescript
<div className="bg-brand-primary shadow-glow">Custom themed component</div>
```

### 3. When to Use Custom CSS Classes

✅ **Complex animations or very specific styles:**

```css
/* index.css */
@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 0 0 20px var(--color-brand-primary);
  }
  50% {
    box-shadow: 0 0 40px var(--color-brand-primary);
  }
}

.pulse-glow-animation {
  animation: pulse-glow 2s ease-in-out infinite;
}
```

```typescript
<div className="pulse-glow-animation">Pulsing element</div>
```

**Rule:** Try Tailwind first, use custom CSS only when Tailwind can't do it.

---

## 🔍 Code Reusability & DRY

### 1. ALWAYS Search Before Creating

❌ **Creating duplicate code without checking:**

```typescript
// Creating new function without checking if similar exists
export function formatUserName(user: User): string {
  return `${user.firstName} ${user.lastName}`;
}
```

✅ **Search first, reuse if exists:**

```bash
# Search for existing formatters
grep -r "format.*Name" src/

# Search for similar functions
grep -r "firstName.*lastName" src/

# Use existing function if found
import { formatFullName } from '@/shared/utils/string';
```

### 2. Extract Common Patterns

❌ **Repeated logic in multiple places:**

```typescript
// In UserProfile.tsx
const fullName = `${user.firstName} ${user.lastName}`;

// In UserCard.tsx
const fullName = `${user.firstName} ${user.lastName}`;

// In UserList.tsx
const fullName = `${user.firstName} ${user.lastName}`;
```

✅ **Create shared utility:**

```typescript
// src/shared/utils/user.helpers.ts
export function getFullName(user: { firstName: string; lastName: string }): string {
  return `${user.firstName} ${user.lastName}`;
}

// Now use everywhere
import { getFullName } from '@/shared/utils/user.helpers';
const fullName = getFullName(user);
```

### 3. Check for Similar Files

**Before creating new components/utilities:**

```bash
# Search for similar components
find src -name "*Button*"
find src -name "*Card*"

# Search for similar functionality
grep -r "export.*function.*validate" src/
grep -r "export.*interface.*User" src/

# Check if pattern already exists
grep -r "onClick.*submit" src/
```

### 4. Refactor When You See Duplication

**3rd time you write similar code = time to refactor**

```typescript
// ❌ Duplication threshold reached
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateUsername(username: string): boolean {
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}

function validatePassword(password: string): boolean {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

// ✅ Extract common pattern
function createValidator(regex: RegExp): (value: string) => boolean {
  return (value: string) => regex.test(value);
}

const validateEmail = createValidator(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
const validateUsername = createValidator(/^[a-zA-Z0-9_]{3,20}$/);
const validatePassword = createValidator(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/);
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
├── user/                     # Feature: User management
│   ├── components/
│   │   ├── UserProfile.tsx
│   │   ├── UserSettings.tsx
│   │   └── UserAvatar.tsx
│   ├── hooks/
│   │   └── useUser.ts
│   ├── services/
│   │   └── user.service.ts
│   ├── types/
│   │   └── user.types.ts
│   ├── utils/
│   │   └── user.helpers.ts
│   ├── __tests__/
│   │   ├── UserProfile.test.tsx
│   │   └── user.service.test.ts
│   └── index.ts              # Public API
│
├── auth/                     # Feature: Authentication
│   ├── components/
│   ├── services/
│   ├── hooks/
│   └── index.ts
│
├── posts/                    # Feature: Posts/Content
│   ├── components/
│   ├── services/
│   └── index.ts
│
└── shared/                   # Truly shared utilities
    ├── components/           # Generic Button, Input, etc.
    ├── hooks/                # useDebounce, useLocalStorage
    └── utils/                # formatDate, validateEmail
```

**Benefits:**

- ✅ Everything for "user" feature is in `src/user/`
- ✅ Easy to find, modify, delete entire features
- ✅ Clear dependencies (imports from other features are visible)
- ✅ Tests co-located with code
- ✅ Scalable (add features without restructuring)
- ✅ Flat structure, less nesting

**Rules:**

1. **Keep features isolated** - Avoid cross-feature imports when possible
2. **Use index.ts** - Export public API from each feature
3. **Shared goes in `/shared`** - Only truly generic stuff
4. **Co-locate tests** - Tests live with the code they test

**Example import:**

```typescript
// ✅ Import from feature's public API
import { UserProfile, useUser } from '@/user';

// ❌ Don't import internal details
import { UserProfile } from '@/user/components/UserProfile';
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
  "trailingComma": "es5",
  "endOfLine": "lf"
}
```

**Line Endings:**

- **Always LF** (`\n`), never CRLF (`\r\n`)
- Enforced by Prettier (`endOfLine: "lf"`)
- Enforced by ESLint (`linebreak-style: ["error", "unix"]`)
- Git auto-converts on Windows (see `.gitattributes`)

**Why:**

- Consistency across Windows/Linux/Mac
- Prevents parser issues with CRLF
- Smaller diffs in version control
- Standard in open source

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

**Node.js Best Practices:**

```typescript
// ❌ Use bare module names
import fs from 'fs';
import path from 'path';
import url from 'url';

// ✅ Use node: protocol (recommended since Node 16+)
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
```

**Why:** The `node:` protocol makes it explicit that you're importing Node.js built-ins, not npm packages. Prevents confusion and potential security issues.

**String replacement:**

```typescript
// ❌ Use replace() for global replacement (doesn't replace all occurrences)
const text = 'hello world hello';
const result = text.replace('hello', 'hi'); // Only replaces first occurrence
// Result: "hi world hello" ❌

// ✅ Use replaceAll() for global replacement
const text = 'hello world hello';
const result = text.replaceAll('hello', 'hi'); // Replaces all occurrences
// Result: "hi world hi" ✅

// ❌ Using regex with g flag (less readable)
const result = text.replace(/hello/g, 'hi');

// ✅ Use replaceAll() (clearer intent)
const result = text.replaceAll('hello', 'hi');
```

**Why:** `replaceAll()` is more explicit about intent and safer than regex with global flag.

**Number methods:**

```typescript
// ❌ Use global isNaN() (coerces values)
isNaN('hello'); // true (unexpected coercion)
isNaN(undefined); // true
isNaN({}); // true

// ✅ Use Number.isNaN() (no coercion, more reliable)
Number.isNaN('hello'); // false (string is not NaN)
Number.isNaN(NaN); // true (only NaN is NaN)
Number.isNaN(undefined); // false
```

**Why:** `Number.isNaN()` is more predictable and doesn't perform type coercion. Same applies to `Number.isFinite()`, `Number.isInteger()`.

**parseInt with radix:**

```typescript
// ❌ Missing radix parameter (can lead to unexpected results)
const num = parseInt('08'); // Might be parsed as octal in older environments
const hex = parseInt('0x10'); // Works but implicit

// ✅ Always specify radix
const num = parseInt('08', 10); // Explicitly base-10: 8
const hex = parseInt('10', 16); // Explicitly base-16: 16
const binary = parseInt('1010', 2); // Explicitly base-2: 10
```

**Why:** Without radix, `parseInt()` can misinterpret strings (e.g., leading zeros as octal). Always be explicit.

**Prefer for-of loops:**

```typescript
// ❌ Traditional for loop (more verbose, error-prone)
for (let i = 0; i < items.length; i++) {
  const item = items[i];
  console.log(item.name);
}

// ✅ Use for-of loop (simpler, safer)
for (const item of items) {
  console.log(item.name);
}

// ❌ forEach with index when you don't need it
items.forEach((item, index) => {
  console.log(item.name); // Not using index
});

// ✅ Use for-of
for (const item of items) {
  console.log(item.name);
}

// ✅ When you need the index, forEach is fine
items.forEach((item, index) => {
  console.log(`${index}: ${item.name}`);
});

// ✅ Or use entries()
for (const [index, item] of items.entries()) {
  console.log(`${index}: ${item.name}`);
}
```

**Why:** `for-of` is simpler, more readable, and less error-prone than traditional `for` loops with counters. Use `forEach()` or `.entries()` when you need the index.

**Top-level await (ES modules):**

```typescript
// ❌ Wrapping async code in an IIFE or async function call
async function main() {
  const data = await fetchData();
  console.log(data);
}
main();

// ❌ Using .then() chains unnecessarily
fetchData().then((data) => {
  console.log(data);
});

// ✅ Use top-level await (ES modules)
const data = await fetchData();
console.log(data);
```

**Why:** Modern JavaScript (ES2022+) supports top-level `await` in ES modules. It's simpler, cleaner, and avoids unnecessary function wrappers.

**Requirements:**

- File must be an ES module (`"type": "module"` in package.json or `.mjs` extension)
- Node.js 14.8+ or modern browsers

**When NOT to use:**

- CommonJS modules (no top-level await support)
- Libraries that need to support older environments

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

**CRITICAL: Search for existing code first!**

```bash
# Before creating a new component
find src -name "*Button*"
find src -name "*Modal*"

# Before creating a new utility
grep -r "export.*function.*format" src/
grep -r "export.*function.*validate" src/

# Before creating a new hook
find src -name "use*.ts"
grep -r "export.*function.*use" src/

# Search for similar patterns
grep -r "firstName.*lastName" src/
grep -r "onClick.*submit" src/
```

**Rule:** If similar code exists, reuse or refactor it. Don't duplicate!

### 2. While Coding

```bash
# Watch mode for type checking
npm run type-check:watch

# Run tests in watch mode
npm test

# Lint and fix
npm run lint:fix
```

### 3. Before Commit - Complete Validation

**MANDATORY validation workflow (run in order):**

```bash
# 1. Format code with Prettier
npm run format

# 2. Fix linting issues (includes SonarJS rules)
npm run lint -- --fix

# 3. Check TypeScript types
npm run type-check

# 4. Run tests
npm run test:run

# 5. Verify production build
npm run build
```

**The pre-commit hook will automatically:**

- ✅ Run ESLint and fix issues (including SonarJS quality checks)
- ✅ Run Prettier and format code
- ✅ Check TypeScript types
- ✅ Check for `: any` usage
- ✅ Check file sizes (max 500 lines)
- ✅ Run tests for modified files

**If ANY check fails, your commit is blocked. Fix the issues and try again.**

### 3.1. Check IDE Diagnostics (SonarQube Issues)

**Before committing, check your IDE for SonarQube warnings:**

- 🔍 Look for yellow/orange squiggly lines (warnings)
- 🔍 Check "Problems" panel in VSCode
- 🔍 Review SonarLint suggestions if installed

**Common SonarQube issues to fix:**

```typescript
// ❌ Cognitive complexity too high (warning)
function processOrder() {
  // ... 100 lines of nested if/for/while
}

// ❌ Duplicate string literals (warning)
console.log('Invalid input');
console.log('Invalid input');
console.log('Invalid input');

// ❌ Identical functions (warning)
function getUserName() {
  /* ... */
}
function getAuthorName() {
  /* same logic */
}

// ❌ Unnecessary variable (warning)
const total = calculateTotal();
return total; // Just return calculateTotal()
```

**Fix ALL errors AND warnings before finalizing your commit.**

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

### Code Quality

- [ ] Searched for existing similar code (grep/find)
- [ ] Reused existing components/utilities when possible
- [ ] Extracted common patterns into shared utilities
- [ ] No code duplication (DRY principle)

### React & Component Design

- [ ] Used direct interface instead of React.FC
- [ ] No nested ternary operators (used switch/IIFE)
- [ ] Composed small components instead of duplicating large ones
- [ ] Used `RegExp.exec()` instead of `String.match()`

### Styling

- [ ] Used Tailwind classes when possible
- [ ] Created CSS variables in index.css for custom colors
- [ ] Custom CSS only when Tailwind can't do it

### TypeScript & Validation

- [ ] Code compiles (`npm run build`)
- [ ] Code is formatted (`npm run format`)
- [ ] No ESLint errors/warnings (`npm run lint -- --fix`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No `: any` in code
- [ ] All files < 500 lines

### Testing

- [ ] Tests written FIRST (TDD: RED → GREEN → REFACTOR)
- [ ] All tests pass (`npm run test:run`)
- [ ] Coverage ≥ 80%

### IDE & SonarQube

- [ ] No warnings in IDE diagnostics
- [ ] Fixed all SonarLint/SonarQube issues
- [ ] Cognitive complexity < 15 for all functions
- [ ] No duplicate string literals
- [ ] No identical functions

### Git

- [ ] Commit message follows convention (`type(scope): description`)

**If all checks pass, commit will succeed automatically.**

---

## 🎓 Remember

> "Code is read more often than it is written."  
> — Guido van Rossum

Write code that your future self (and other developers) will thank you for.

**Happy coding! 🚀**
