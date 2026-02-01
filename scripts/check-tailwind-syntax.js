#!/usr/bin/env node

/**
 * Check for non-canonical Tailwind CSS class syntax
 * Detects [var(--...)] patterns that should be (--...) in v4
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Pattern to detect [var(--...)] in className attributes
const NON_CANONICAL_PATTERN = /className="[^"]*\[var\(--[^)]+\)[^\]]*\][^"]*"/g;
const VAR_IN_BRACKETS = /\[var\(--([^)]+)\)\]/g;

let hasErrors = false;

/**
 * Check a single file for non-canonical Tailwind syntax
 * @param {string} filePath
 */
function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const matches = line.match(NON_CANONICAL_PATTERN);
    if (matches) {
      matches.forEach((match) => {
        const varMatches = [...match.matchAll(VAR_IN_BRACKETS)];
        varMatches.forEach(([fullMatch, varName]) => {
          hasErrors = true;
          const lineNumber = index + 1;
          const suggestion = fullMatch.replace(/\[var\(--([^)]+)\)\]/, '(--$1)');

          console.error(
            `\n❌ ${path.relative(rootDir, filePath)}:${lineNumber}`
          );
          console.error(`   Non-canonical syntax: ${fullMatch}`);
          console.error(`   Use instead:          ${suggestion}`);
          console.error(
            `   \n   ${line.trim().substring(0, 100)}${line.length > 100 ? '...' : ''}`
          );
        });
      });
    }
  });
}

/**
 * Main function
 */
async function main() {
  console.log('🔍 Checking for non-canonical Tailwind CSS syntax...');

  // Find all TSX/JSX files
  const files = await glob('src/**/*.{tsx,jsx}', {
    cwd: rootDir,
    absolute: true,
    ignore: ['**/node_modules/**', '**/dist/**', '**/coverage/**'],
  });

  if (files.length === 0) {
    console.log('⚠️  No TSX/JSX files found');
    process.exit(0);
  }

  files.forEach(checkFile);

  if (hasErrors) {
    console.error('\n🚫 Non-canonical Tailwind syntax detected!');
    console.error('💡 Tailwind v4 prefers (--variable) over [var(--variable)]');
    console.error(
      '   This makes classes shorter and more readable.\n'
    );
    process.exit(1);
  }

  console.log('✅ All Tailwind classes use canonical syntax');
  process.exit(0);
}

main();
