#!/usr/bin/env node
import fs from 'fs';
import { glob } from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseFile } from './utils/typescript-parser.js';
import { buildMarkdown } from './utils/markdown-builder.js';
import { enrichWithAI } from './utils/ai-enricher.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Check for --ai flag
const useAI = process.argv.includes('--ai');

console.log('📚 Generating codebase map...');
if (useAI) {
  console.log('🤖 AI enrichment enabled (Claude Code will generate descriptions)');
}

async function generateCodebaseMap() {
  try {
    // Find all TypeScript/TSX files
    const files = await glob('src/**/*.{ts,tsx}', {
      cwd: rootDir,
      absolute: true,
      ignore: [
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.spec.ts',
        '**/*.spec.tsx',
        '**/test/**',
        '**/__tests__/**',
        '**/dist/**',
        '**/coverage/**',
        '**/*.d.ts',
      ],
    });

    if (files.length === 0) {
      console.log('⚠️  No TypeScript files found in src/');
      return;
    }

    console.log(`📂 Found ${files.length} files to analyze`);

    // Parse all files
    const fileInfos = files
      .map((file) => {
        const relativePath = path.relative(rootDir, file);
        return parseFile(file);
      })
      .filter((info) => info !== null) // Remove failed parses
      .filter((info) => hasExports(info)); // Only files with exports

    console.log(`✅ Successfully parsed ${fileInfos.length} files`);

    // Enrich with AI if requested
    let finalFileInfos = fileInfos;
    if (useAI) {
      finalFileInfos = await enrichWithAI(fileInfos);
    }

    // Build markdown
    const markdown = buildMarkdown(finalFileInfos);

    // Write CODEBASE.md
    const outputPath = path.join(rootDir, 'CODEBASE.md');
    fs.writeFileSync(outputPath, markdown, 'utf-8');

    console.log(`✅ CODEBASE.md generated successfully`);
    console.log(`   Location: ${outputPath}`);
    console.log(
      `   Files documented: ${fileInfos.length}`
    );
  } catch (error) {
    console.error('❌ Error generating codebase map:', error.message);
    process.exit(1);
  }
}

/**
 * Check if file has any exports
 */
function hasExports(fileInfo) {
  const { exports } = fileInfo;
  return (
    exports.functions.length > 0 ||
    exports.components.length > 0 ||
    exports.types.length > 0 ||
    exports.constants.length > 0
  );
}

// Run
generateCodebaseMap();
