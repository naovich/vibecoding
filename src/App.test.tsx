import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('should render title', () => {
    render(<App />);
    expect(screen.getByText(/VibeCoding/i)).toBeInTheDocument();
  });

  it('should render features list', () => {
    render(<App />);
    expect(screen.getByText(/TypeScript Strict Mode/i)).toBeInTheDocument();
    expect(screen.getByText(/TDD avec Vitest/i)).toBeInTheDocument();
  });

  it('should increment counter on button click', () => {
    render(<App />);
    const button = screen.getByRole('button', { name: /Compteur : 0/i });

    fireEvent.click(button);

    expect(screen.getByText(/Compteur : 1/i)).toBeInTheDocument();
  });

  it('should have proper structure', () => {
    const { container } = render(<App />);

    expect(container.querySelector('.app')).toBeInTheDocument();
    expect(container.querySelector('.app-header')).toBeInTheDocument();
    expect(container.querySelector('.app-main')).toBeInTheDocument();
    expect(container.querySelector('.app-footer')).toBeInTheDocument();
  });
});
