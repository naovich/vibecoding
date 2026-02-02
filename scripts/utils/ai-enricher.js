#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';

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
  const fileContent = fs.readFileSync(fileInfo.path, 'utf-8');

  const prompt = `Analyze this TypeScript/React file and provide brief descriptions:

File: ${fileInfo.path}

\`\`\`typescript
${fileContent}
\`\`\`

Respond with JSON only (no markdown):
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
    // Call Claude Code CLI
    const result = execSync(`claude --print "${prompt.replace(/"/g, '\\"')}"`, {
      encoding: 'utf-8',
      timeout: 30000,
      stdio: ['pipe', 'pipe', 'ignore'], // Ignore stderr
    });

    // Parse response
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
