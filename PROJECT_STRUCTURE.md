# 📚 Structure du Projet VibeCoding

> Documentation générée automatiquement le 02/02/2026 02:23:05

> ⚡ Mode AI : Cette documentation contient uniquement les fichiers modifiés/créés récemment (5 fichiers)

## 📂 Arborescence

- 📁 **root/**
  - 📁 **scripts/**
    - 📁 **utils/**
      - 📄 ai-enricher.js
      - 📄 markdown-builder.js
    - 📄 generate-codebase-map.js
    - 📄 generate-docs.ts
  - 📄 CODEBASE.md

---

## 📄 Contenu des fichiers

## 📁 root/scripts/

## 📁 root/scripts/utils/

### root/scripts/utils/ai-enricher.js

```javascript
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

    // Find Claude Code CLI (try common locations)
    const claudePaths = [
      path.join(process.env.HOME, 'bin/bin/claude'),
      path.join(process.env.HOME, '.local/bin/claude'),
      'claude', // fallback to PATH
    ];

    let claudePath = 'claude';
    for (const p of claudePaths) {
      if (p !== 'claude' && fs.existsSync(p)) {
        claudePath = p;
        break;
      }
    }

    // Call Claude Code CLI with prompt from stdin
    const result = execSync(`cat "${tmpFile}" | "${claudePath}" --print`, {
      encoding: 'utf-8',
      timeout: 30000,
      cwd: rootDir,
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
```

### root/scripts/utils/markdown-builder.js

```javascript
#!/usr/bin/env node

/**
 * Build markdown documentation from parsed files
 * @param {Array} fileInfos - Array of parsed file information
 * @returns {string} - Markdown content
 */
export function buildMarkdown(fileInfos) {
  const sections = [];

  // Header
  sections.push('# CODEBASE.md');
  sections.push('');
  sections.push('*Auto-generated - Do not edit manually*');
  sections.push(`*Last updated: ${new Date().toISOString().split('T')[0]}*`);
  sections.push('');
  sections.push('---');
  sections.push('');

  // Group files by directory
  const grouped = groupByDirectory(fileInfos);

  // Generate sections
  Object.entries(grouped).forEach(([dir, files]) => {
    sections.push(`## 📁 ${dir}/`);
    sections.push('');

    files.forEach((fileInfo) => {
      sections.push(buildFileSection(fileInfo));
    });

    sections.push('---');
    sections.push('');
  });

  return sections.join('\n');
}

/**
 * Group files by directory
 */
function groupByDirectory(fileInfos) {
  const grouped = {};

  fileInfos.forEach((fileInfo) => {
    // Normalize path to use forward slashes (cross-platform)
    const normalizedPath = fileInfo.path.replace(/\\/g, '/');
    const parts = normalizedPath.split('/');
    const dir = parts.slice(0, -1).join('/');
    const dirKey = dir || 'root';

    if (!grouped[dirKey]) {
      grouped[dirKey] = [];
    }
    grouped[dirKey].push(fileInfo);
  });

  return grouped;
}

/**
 * Build section for a single file
 */
function buildFileSection(fileInfo) {
  const sections = [];
  // Normalize path to use forward slashes (cross-platform)
  const normalizedPath = fileInfo.path.replace(/\\/g, '/');
  const fileName = normalizedPath.split('/').pop();

  sections.push(`### ${fileName}`);
  sections.push('');

  // File description
  if (fileInfo.description) {
    sections.push(`**Description:** ${fileInfo.description}`);
    sections.push('');
  }

  // Functions
  if (fileInfo.exports.functions.length > 0) {
    sections.push('**Functions:**');
    fileInfo.exports.functions.forEach((func) => {
      sections.push(buildFunctionDoc(func));
    });
    sections.push('');
  }

  // Components
  if (fileInfo.exports.components.length > 0) {
    sections.push('**Components:**');
    fileInfo.exports.components.forEach((comp) => {
      sections.push(buildComponentDoc(comp));
    });
    sections.push('');
  }

  // Types
  if (fileInfo.exports.types.length > 0) {
    sections.push('**Types:**');
    fileInfo.exports.types.forEach((type) => {
      sections.push(buildTypeDoc(type));
    });
    sections.push('');
  }

  // Constants
  if (fileInfo.exports.constants.length > 0) {
    sections.push('**Constants:**');
    fileInfo.exports.constants.forEach((constant) => {
      sections.push(buildConstantDoc(constant));
    });
    sections.push('');
  }

  return sections.join('\n');
}

/**
 * Build function documentation
 */
function buildFunctionDoc(func) {
  const sections = [];
  const signature = `${func.isAsync ? 'async ' : ''}${func.name}(${func.params.join(', ')}): ${func.returns}`;

  sections.push(`- \`${signature}\`${func.isDefault ? ' *(default export)*' : ''}`);

  if (func.description) {
    sections.push(`  - ${func.description}`);
  }

  return sections.join('\n');
}

/**
 * Build component documentation
 */
function buildComponentDoc(comp) {
  const sections = [];
  const signature = comp.props ? `${comp.name}(props: ${comp.props})` : comp.name;

  sections.push(`- \`${signature}\`${comp.isDefault ? ' *(default export)*' : ''}`);

  if (comp.description) {
    sections.push(`  - ${comp.description}`);
  }

  return sections.join('\n');
}

/**
 * Build type documentation
 */
function buildTypeDoc(type) {
  const sections = [];
  sections.push(`- \`${type.name}\` (${type.kind})`);

  if (type.description) {
    sections.push(`  - ${type.description}`);
  }

  return sections.join('\n');
}

/**
 * Build constant documentation
 */
function buildConstantDoc(constant) {
  const sections = [];
  sections.push(`- \`${constant.name}\``);

  if (constant.description) {
    sections.push(`  - ${constant.description}`);
  }

  return sections.join('\n');
}
```

### root/scripts/generate-codebase-map.js

```javascript
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
        const fileInfo = parseFile(file);
        if (fileInfo) {
          // Replace absolute path with relative path (normalized to forward slashes)
          fileInfo.path = relativePath.replace(/\\/g, '/');
        }
        return fileInfo;
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
    console.log(`   Files documented: ${fileInfos.length}`);
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
```

### root/scripts/generate-docs.ts

```typescript
#!/usr/bin/env tsx

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative, sep, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');
const SRC_DIR = join(PROJECT_ROOT, 'src');
const OUTPUT_FILE = join(PROJECT_ROOT, 'PROJECT_STRUCTURE.md');

// Fichiers/dossiers à ignorer
const IGNORE_PATTERNS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  'coverage',
  '.env',
  '.env.local',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
];

// Extensions de fichiers à documenter
const VALID_EXTENSIONS = [
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.json',
  '.css',
  '.scss',
  '.md',
  '.html',
  '.yml',
  '.yaml',
];

interface FileNode {
  name: string;
  path: string;
  relativePath: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  content?: string;
}

/**
 * Obtient la liste des fichiers modifiés/créés récemment via git
 */
function getModifiedFiles(): Set<string> {
  const modifiedFiles = new Set<string>();

  try {
    // Fichiers modifiés non commités
    const status = execSync('git status --porcelain', {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8',
    });

    status.split('\n').forEach((line) => {
      const match = line.match(/^\s*[MADRCU?]\s+(.+)$/);
      if (match) {
        const filePath = match[1].trim();
        modifiedFiles.add(join(PROJECT_ROOT, filePath));
      }
    });

    // Fichiers du dernier commit
    const lastCommit = execSync('git diff-tree --no-commit-id --name-only -r HEAD', {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8',
    });

    lastCommit.split('\n').forEach((line) => {
      const filePath = line.trim();
      if (filePath) {
        modifiedFiles.add(join(PROJECT_ROOT, filePath));
      }
    });
  } catch (error) {
    console.warn('⚠️  Git non disponible, tous les fichiers seront documentés');
  }

  return modifiedFiles;
}

/**
 * Vérifie si un fichier/dossier doit être ignoré
 */
function shouldIgnore(name: string, path: string): boolean {
  return IGNORE_PATTERNS.some(
    (pattern) =>
      name === pattern ||
      path.includes(`${sep}${pattern}${sep}`) ||
      path.endsWith(`${sep}${pattern}`)
  );
}

/**
 * Vérifie si un fichier a une extension valide
 */
function hasValidExtension(filename: string): boolean {
  return VALID_EXTENSIONS.some((ext) => filename.endsWith(ext));
}

/**
 * Construit l'arbre des fichiers
 */
function buildFileTree(dirPath: string, aiMode: boolean, modifiedFiles: Set<string>): FileNode[] {
  const items = readdirSync(dirPath);
  const nodes: FileNode[] = [];

  for (const item of items) {
    const fullPath = join(dirPath, item);
    // Normalize path to use forward slashes (cross-platform)
    const relativePath = relative(PROJECT_ROOT, fullPath).replace(/\\/g, '/');

    if (shouldIgnore(item, fullPath)) {
      continue;
    }

    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      const children = buildFileTree(fullPath, aiMode, modifiedFiles);
      if (children.length > 0) {
        nodes.push({
          name: item,
          path: fullPath,
          relativePath,
          type: 'directory',
          children,
        });
      }
    } else if (stats.isFile() && hasValidExtension(item)) {
      // En mode AI, ne documenter que les fichiers modifiés
      if (aiMode && modifiedFiles.size > 0 && !modifiedFiles.has(fullPath)) {
        continue;
      }

      let content = '';
      try {
        content = readFileSync(fullPath, 'utf-8');
      } catch (error) {
        content = '[Erreur de lecture du fichier]';
      }

      nodes.push({
        name: item,
        path: fullPath,
        relativePath,
        type: 'file',
        content,
      });
    }
  }

  return nodes.sort((a, b) => {
    // Dossiers en premier, puis fichiers
    if (a.type !== b.type) {
      return a.type === 'directory' ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });
}

/**
 * Génère le markdown pour l'arbre
 */
function generateTreeMarkdown(nodes: FileNode[], level: number = 0): string {
  let markdown = '';
  const indent = '  '.repeat(level);

  for (const node of nodes) {
    if (node.type === 'directory') {
      markdown += `${indent}- 📁 **${node.name}/**\n`;
      if (node.children) {
        markdown += generateTreeMarkdown(node.children, level + 1);
      }
    } else {
      markdown += `${indent}- 📄 ${node.name}\n`;
    }
  }

  return markdown;
}

/**
 * Génère le markdown pour le contenu des fichiers
 */
function generateContentMarkdown(nodes: FileNode[], parentPath: string = ''): string {
  let markdown = '';

  for (const node of nodes) {
    const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name;

    if (node.type === 'directory') {
      markdown += `\n## 📁 ${currentPath}/\n\n`;
      if (node.children) {
        markdown += generateContentMarkdown(node.children, currentPath);
      }
    } else {
      markdown += `### ${currentPath}\n\n`;

      // Déterminer le langage pour le code block
      const ext = node.name.split('.').pop() || '';
      const langMap: Record<string, string> = {
        ts: 'typescript',
        tsx: 'tsx',
        js: 'javascript',
        jsx: 'jsx',
        json: 'json',
        css: 'css',
        scss: 'scss',
        md: 'markdown',
        html: 'html',
        yml: 'yaml',
        yaml: 'yaml',
      };
      const language = langMap[ext] || ext;

      markdown += `\`\`\`${language}\n${node.content}\n\`\`\`\n\n`;
    }
  }

  return markdown;
}

/**
 * Fonction principale
 */
function main() {
  const args = process.argv.slice(2);
  const aiMode = args.includes('--ai');

  console.log('🚀 Génération de la documentation du projet...\n');

  if (aiMode) {
    console.log('🤖 Mode AI activé : seuls les fichiers modifiés/créés seront documentés\n');
  }

  // Obtenir les fichiers modifiés si en mode AI
  const modifiedFiles = aiMode ? getModifiedFiles() : new Set<string>();

  if (aiMode && modifiedFiles.size > 0) {
    console.log(`📝 Fichiers détectés (${modifiedFiles.size}) :`);
    modifiedFiles.forEach((file) => {
      console.log(`   - ${relative(PROJECT_ROOT, file)}`);
    });
    console.log('');
  }

  // En mode AI, documenter tout le projet (pas seulement src/)
  const rootDir = aiMode && modifiedFiles.size > 0 ? PROJECT_ROOT : SRC_DIR;

  // Construire l'arbre
  const tree = buildFileTree(rootDir, aiMode, modifiedFiles);

  if (tree.length === 0) {
    console.log('✨ Aucun fichier à documenter (rien de modifié)');
    return;
  }

  // Générer le markdown
  let markdown = `# 📚 Structure du Projet VibeCoding\n\n`;
  markdown += `> Documentation générée automatiquement le ${new Date().toLocaleString('fr-FR')}\n\n`;

  if (aiMode && modifiedFiles.size > 0) {
    markdown += `> ⚡ Mode AI : Cette documentation contient uniquement les fichiers modifiés/créés récemment (${modifiedFiles.size} fichiers)\n\n`;
  }

  const rootLabel = rootDir === PROJECT_ROOT ? 'root' : 'src';

  markdown += `## 📂 Arborescence\n\n`;
  markdown += `- 📁 **${rootLabel}/**\n`;
  markdown += generateTreeMarkdown(tree, 1);

  markdown += `\n---\n\n`;
  markdown += `## 📄 Contenu des fichiers\n\n`;
  markdown += generateContentMarkdown(tree, rootLabel);

  // Écrire le fichier
  writeFileSync(OUTPUT_FILE, markdown, 'utf-8');

  console.log(`✅ Documentation générée avec succès !`);
  console.log(`📁 Fichier : ${relative(PROJECT_ROOT, OUTPUT_FILE)}`);
  console.log(`📊 Fichiers documentés : ${countFiles(tree)}`);
}

/**
 * Compte le nombre de fichiers dans l'arbre
 */
function countFiles(nodes: FileNode[]): number {
  let count = 0;
  for (const node of nodes) {
    if (node.type === 'file') {
      count++;
    } else if (node.children) {
      count += countFiles(node.children);
    }
  }
  return count;
}

// Exécution
main();
```

### root/CODEBASE.md

```markdown
# CODEBASE.md

_Auto-generated - Do not edit manually_
_Last updated: 2026-02-02_

---

## 📁 src/

### App.tsx

**Components:**

- `App` _(default export)_

---
```
