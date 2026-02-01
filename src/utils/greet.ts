/**
 * Greeting utility function
 *
 * Example of a simple, well-typed function with proper documentation.
 */

export function greet(name: string): string {
  if (!name || name.trim() === '') {
    throw new Error('Name cannot be empty');
  }

  return `Hello, ${name.trim()}! Welcome to VibeCoding.`;
}
