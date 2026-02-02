import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import sonarjs from 'eslint-plugin-sonarjs';
import tailwindcss from 'eslint-plugin-better-tailwindcss';
import importPlugin from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import promisePlugin from 'eslint-plugin-promise';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  {
    ignores: [
      'node_modules/**',
      'scripts/**',
      '*.config.ts',
      '*.config.js',
      'dist/**',
      'coverage/**',
    ],
  },
  {
    files: ['**/*.{ts,tsx}'],
    settings: {
      react: {
        version: 'detect',
      },
      tailwindcss: {
        config: './tailwind.config.js',
        cssFile: './src/index.css',
      },
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        document: 'readonly',
        window: 'readonly',
        navigator: 'readonly',
        HTMLElement: 'readonly',
        JSX: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'react': reactPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'sonarjs': sonarjs,
      'tailwindcss': tailwindcss,
      'import': importPlugin,
      'simple-import-sort': simpleImportSort,
      'promise': promisePlugin,
    },
    rules: {
      // TypeScript strict rules
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      '@typescript-eslint/explicit-function-return-type': ['warn', {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
      }],
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'warn',
      
      // React rules
      'react/react-in-jsx-scope': 'off', // Not needed with React 17+
      'react/prop-types': 'off', // Using TypeScript
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      
      // Tailwind CSS rules
      'tailwindcss/enforce-canonical-classes': 'error', // Canonical syntax (replaces custom script)
      'tailwindcss/enforce-shorthand-classes': 'warn', // Use shorthand utilities when possible
      'tailwindcss/enforce-consistent-class-order': 'warn', // Order classes consistently
      'tailwindcss/no-duplicate-classes': 'error', // Remove duplicates
      'tailwindcss/no-unknown-classes': 'off', // Disabled: too strict with @theme custom values
      
      // File quality rules (replaces check-file-size.js)
      'max-lines': ['error', {
        max: 500,
        skipBlankLines: true,
        skipComments: true,
      }],
      
      // SonarJS - Code quality rules (v3.0.6)
      // Complexity
      'sonarjs/cognitive-complexity': ['error', 15],
      
      // Duplications
      'sonarjs/no-duplicate-string': 'warn',
      'sonarjs/no-identical-functions': 'error',
      
      // Simplification
      'sonarjs/no-collapsible-if': 'warn',
      'sonarjs/prefer-immediate-return': 'warn',
      
      // General best practices
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      
      // Import rules - prevent import errors and enforce best practices
      'import/no-unresolved': 'error', // Prevent broken imports
      'import/named': 'error', // Ensure named imports exist
      'import/default': 'error', // Ensure default exports exist
      'import/namespace': 'error', // Ensure imported namespaces contain dereferenced properties
      'import/no-duplicates': 'error', // No duplicate imports
      'import/no-cycle': 'error', // Prevent circular dependencies
      'import/no-self-import': 'error', // Prevent importing itself
      
      // Simple import sort - auto-sort imports (auto-fixable)
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      
      // Promise rules - async/await best practices
      'promise/always-return': 'error', // Ensure promises always return
      'promise/catch-or-return': 'error', // Ensure promises have .catch() or return
      'promise/no-nesting': 'warn', // Avoid nested promises (use async/await)
      'promise/no-return-wrap': 'error', // Avoid wrapping values in Promise.resolve/reject unnecessarily
      'promise/param-names': 'error', // Enforce standard parameter names (resolve, reject)
      'promise/valid-params': 'error', // Ensure correct number of arguments to Promise functions
    },
  },
  prettier,
];
