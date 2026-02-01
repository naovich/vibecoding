import React, { useState } from 'react';

function App(): React.JSX.Element {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 font-display text-white bg-linear-135 from-primary-600 to-accent-600">
      <header className="text-center mb-12">
        <h1 className="text-6xl font-extrabold mb-4 drop-shadow-(--shadow-glow)">🤖 VibeCoding</h1>
        <p className="text-xl opacity-90 max-w-2xl">
          Template React + TypeScript avec TDD, ESLint strict et SonarJS
        </p>
      </header>

      <main className="w-full max-w-3xl space-y-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-(--radius-card) p-8 shadow-(--shadow-soft) text-center">
          <button
            onClick={() => setCount((count) => count + 1)}
            className="bg-white text-primary-600 px-8 py-4 rounded-(--radius-button) text-lg font-semibold transition-all duration-200 ease-(--ease-snappy) hover:-translate-y-1 hover:shadow-(--shadow-glow)"
          >
            Compteur : {count}
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-(--radius-card) p-8 shadow-(--shadow-soft)">
          <h2 className="text-3xl font-bold mb-6">✨ Features</h2>
          <ul className="space-y-4 text-lg font-display">
            <li className="pb-4 border-b border-white/10">✅ TypeScript Strict Mode</li>
            <li className="pb-4 border-b border-white/10">✅ TDD avec Vitest</li>
            <li className="pb-4 border-b border-white/10">
              ✅ ESLint + SonarJS (complexité max 15)
            </li>
            <li className="pb-4 border-b border-white/10">✅ Prettier + Husky hooks</li>
            <li className="pb-4 border-b border-white/10">✅ Coverage 80% minimum</li>
            <li className="pb-4 border-b border-white/10">✅ Feature-based folders</li>
            <li className="pb-4 border-b border-white/10">✅ Tailwind CSS v4</li>
            <li>✅ CSS Theme Variables</li>
          </ul>
        </div>
      </main>

      <footer className="mt-12 text-center opacity-80">
        <p className="font-mono">
          Voir <code className="bg-white/20 px-2 py-1 rounded">AGENT.md</code> pour les règles
          complètes
        </p>
      </footer>
    </div>
  );
}

export default App;
