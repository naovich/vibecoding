#!/usr/bin/env node
import fs from 'node:fs';

const MIN_COVERAGE = 80;
const coverageFile = 'coverage/coverage-summary.json';

if (!fs.existsSync(coverageFile)) {
  console.error('❌ No coverage report found.');
  console.error('💡 Run `npm run test:coverage` first.');
  process.exit(1);
}

const coverage = JSON.parse(fs.readFileSync(coverageFile, 'utf-8'));
if (!coverage?.total) {
  console.error('❌ Format du rapport de coverage invalide (champ "total" manquant).');
  process.exit(1);
}
const total = coverage.total;

const metrics = ['lines', 'statements', 'functions', 'branches'];
let failed = false;

console.log('\n📊 Code Coverage:');
metrics.forEach(metric => {
  const pct = total[metric].pct;
  const icon = pct >= MIN_COVERAGE ? '✅' : '❌';
  console.log(`${icon} ${metric.padEnd(12)}: ${pct.toFixed(2)}% (min: ${MIN_COVERAGE}%)`);
  if (pct < MIN_COVERAGE) {
    failed = true;
  }
});

if (failed) {
  console.error(`\n🚫 Validation failed: Coverage below ${MIN_COVERAGE}%`);
  console.error('💡 Write more tests to increase coverage.');
  process.exit(1);
}

console.log(`\n✅ Coverage meets requirements (${MIN_COVERAGE}%+)`);
process.exit(0);
