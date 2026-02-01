import { describe, it, expect } from 'vitest';
import { greet } from './greet.js';

describe('greet', () => {
  it('should greet with the provided name', () => {
    expect(greet('World')).toBe('Hello, World! Welcome to VibeCoding.');
  });

  it('should trim whitespace from name', () => {
    expect(greet('  Alice  ')).toBe('Hello, Alice! Welcome to VibeCoding.');
  });

  it('should throw error for empty name', () => {
    expect(() => greet('')).toThrow('Name cannot be empty');
  });

  it('should throw error for whitespace-only name', () => {
    expect(() => greet('   ')).toThrow('Name cannot be empty');
  });
});
