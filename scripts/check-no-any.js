#!/usr/bin/env node
import { globSync } from 'glob';
import fs from 'fs';

const files = globSync('src/**/*.ts', {
  ignore: ['**/*.test.ts', '**/*.spec.ts', '**/test/**', '**/__tests__/**']
});

let foundAny = false;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    // Regex to detect `: any` but not in comments
    if (/:\s*any(?!\w)/.test(line) && !line.trim().startsWith('//') && !line.trim().startsWith('*')) {
      console.error(`❌ Found ': any' in ${file}:${index + 1}`);
      console.error(`   ${line.trim()}`);
      foundAny = true;
    }
  });
});

if (foundAny) {
  console.error('\n🚫 Validation failed: Remove all `: any` usage!');
  console.error('💡 Use specific types or `unknown` instead.');
  process.exit(1);
}

console.log('✅ No `: any` found');
process.exit(0);
