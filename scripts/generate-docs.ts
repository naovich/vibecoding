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
    const relativePath = relative(PROJECT_ROOT, fullPath);

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
