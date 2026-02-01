/**
 * VibeCoding Template - Entry Point
 *
 * This template demonstrates best practices for TypeScript development
 * with automated guardrails to prevent common mistakes.
 */

import { greet } from './utils/greet.js';

export function main(): void {
  const message = greet('Developer');
  // eslint-disable-next-line no-console
  console.log(message);
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
