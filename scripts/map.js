#!/usr/bin/env node
/**
 * Wrapper script for generate-codebase-map.js
 * Ensures arguments are properly passed on all platforms (Windows, Linux, Mac)
 */
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get all arguments after 'node scripts/map.js'
const args = process.argv.slice(2);

// DEBUG: Log what the wrapper receives
console.log(`🔍 DEBUG wrapper - process.argv: ${JSON.stringify(process.argv)}`);
console.log(`🔍 DEBUG wrapper - args: ${JSON.stringify(args)}`);

// Build the command with proper argument passing
const scriptPath = join(__dirname, 'generate-codebase-map.js');
const command = `node "${scriptPath}" ${args.join(' ')}`;

console.log(`🔍 DEBUG wrapper - command: ${command}`);

try {
  execSync(command, { 
    stdio: 'inherit',  // Pass through all output
    shell: true        // Use shell for cross-platform compatibility
  });
} catch (error) {
  process.exit(error.status || 1);
}
