#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

/**
 * Enrich file info with AI-generated descriptions using Claude Code CLI
 * @param {Array} fileInfos - Array of parsed file information
 * @returns {Promise<Array>} - Enriched file information
 */
export async function enrichWithAI(fileInfos) {
  console.log(`🤖 Enriching ${fileInfos.length} files with AI descriptions...`);

  const enrichedInfos = [];

  for (const fileInfo of fileInfos) {
    try {
      console.log(`   Analyzing ${fileInfo.path}...`);
      const enriched = await enrichFile(fileInfo);
      enrichedInfos.push(enriched);
    } catch (error) {
      console.warn(`   ⚠️  Failed to enrich ${fileInfo.path}: ${error.message}`);
      enrichedInfos.push(fileInfo); // Keep original
    }
  }

  console.log('✅ AI enrichment complete');
  return enrichedInfos;
}

/**
 * Enrich a single file using Claude Code
 */
async function enrichFile(fileInfo) {
  // Resolve absolute path
  const absolutePath = path.isAbsolute(fileInfo.path)
    ? fileInfo.path
    : path.join(rootDir, fileInfo.path);

  const fileContent = fs.readFileSync(absolutePath, 'utf-8');

  const prompt = `Analyze this TypeScript/React file and provide brief descriptions.

File: ${fileInfo.path}

\`\`\`typescript
${fileContent}
\`\`\`

Respond with JSON only (no markdown code blocks):
{
  "fileDescription": "Brief file purpose (1 sentence)",
  "functions": {
    "functionName": "What it does (1 sentence)"
  },
  "components": {
    "ComponentName": "What it renders (1 sentence)"
  }
}`;

  try {
    // Write prompt to temp file to avoid shell escaping issues
    const tmpFile = path.join(rootDir, '.tmp-ai-prompt.txt');
    fs.writeFileSync(tmpFile, prompt, 'utf-8');

    // Find Claude Code CLI (try common locations - cross-platform)
    const homeDir = process.env.HOME || process.env.USERPROFILE; // Linux/Mac: HOME, Windows: USERPROFILE
    const isWindows = process.platform === 'win32';
    
    const claudePaths = [
      // Linux/Mac paths
      path.join(homeDir, 'bin/bin/claude'),
      path.join(homeDir, '.local/bin/claude'),
      // Windows paths
      path.join(homeDir, 'AppData/Local/Programs/claude/claude.exe'),
      path.join(homeDir, 'AppData/Roaming/npm/claude.cmd'),
      path.join(homeDir, '.claude/claude.exe'),
      // Global npm install
      path.join(homeDir, 'AppData/Roaming/npm/node_modules/@anthropic/claude-code/bin/claude.cmd'),
      'claude', // fallback to PATH
    ];

    let claudePath = 'claude';
    for (const p of claudePaths) {
      if (p !== 'claude' && fs.existsSync(p)) {
        claudePath = p;
        console.log(`   ℹ️  Found Claude Code at: ${claudePath}`);
        break;
      }
    }
    
    // If not found in common locations, check if it's in PATH
    if (claudePath === 'claude') {
      console.log(`   ℹ️  Using Claude Code from PATH (or will fail if not available)`);
    }

    // Call Claude Code CLI with prompt from stdin (cross-platform)
    const catCommand = isWindows ? 'type' : 'cat';
    const result = execSync(`${catCommand} "${tmpFile}" | "${claudePath}" --print`, {
      encoding: 'utf-8',
      timeout: 30000,
      cwd: rootDir,
      shell: isWindows ? 'cmd.exe' : '/bin/sh',
    });

    // Clean up temp file
    fs.unlinkSync(tmpFile);

    // Parse response - look for JSON
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON in response');
    }

    const descriptions = JSON.parse(jsonMatch[0]);

    // Apply descriptions
    if (descriptions.fileDescription && !fileInfo.description) {
      fileInfo.description = descriptions.fileDescription;
    }

    fileInfo.exports.functions.forEach((func) => {
      if (descriptions.functions?.[func.name] && !func.description) {
        func.description = descriptions.functions[func.name];
      }
    });

    fileInfo.exports.components.forEach((comp) => {
      if (descriptions.components?.[comp.name] && !comp.description) {
        comp.description = descriptions.components[comp.name];
      }
    });

    return fileInfo;
  } catch (error) {
    throw new Error(`Claude Code failed: ${error.message}`);
  }
}
