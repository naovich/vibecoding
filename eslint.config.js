import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import sonarjs from 'eslint-plugin-sonarjs';
import tailwindcss from 'eslint-plugin-better-tailwindcss';
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
        entryPoint: './src/index.css',
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
      'tailwindcss/enforce-consistent-class-order': 'off', // Disabled: needs proper entryPoint config
      'tailwindcss/no-duplicate-classes': 'error', // Remove duplicates
      'tailwindcss/no-unknown-classes': 'off', // Disabled: needs proper entryPoint config for custom classes
      
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
    },
  },
  prettier,
];
