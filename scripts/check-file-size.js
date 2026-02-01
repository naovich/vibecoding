#!/usr/bin/env node
import { globSync } from 'glob';
import fs from 'fs';

const MAX_LINES = 500;
const files = globSync('src/**/*.ts', {
  ignore: ['**/*.test.ts', '**/*.spec.ts', '**/test/**']
});

let foundLarge = false;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n').length;
  
  if (lines > MAX_LINES) {
    console.error(`❌ ${file}: ${lines} lines (max: ${MAX_LINES})`);
    console.error(`   💡 Split this file into smaller, focused modules`);
    foundLarge = true;
  }
});

if (foundLarge) {
  console.error(`\n🚫 Validation failed: Files exceed ${MAX_LINES} lines!`);
  console.error('💡 Large files are hard to maintain. Split them into smaller modules.');
  process.exit(1);
}

console.log(`✅ All files under ${MAX_LINES} lines`);
process.exit(0);
