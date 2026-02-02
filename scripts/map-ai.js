#!/usr/bin/env node
/**
 * Wrapper to run generate-codebase-map.js with AI mode enabled
 * Sets AI_MODE environment variable (cross-platform solution for Windows/Linux/Mac)
 */
process.env.AI_MODE = 'true';

// Import and run the main script
import('./generate-codebase-map.js');
