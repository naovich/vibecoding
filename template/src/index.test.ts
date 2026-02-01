import { describe, it, expect, vi } from 'vitest';
import { main } from './index.js';

describe('main', () => {
  it('should call greet and log the message', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    main();
    
    expect(consoleSpy).toHaveBeenCalledWith('Hello, Developer! Welcome to VibeCoding.');
    
    consoleSpy.mockRestore();
  });
});
