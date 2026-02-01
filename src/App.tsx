import React, { useState } from 'react';
import './App.css';

function App(): React.JSX.Element {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <header className="app-header">
        <h1>🤖 VibeCoding</h1>
        <p>Template React + TypeScript avec TDD, ESLint strict et SonarJS</p>
      </header>

      <main className="app-main">
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>Compteur : {count}</button>
        </div>

        <div className="features">
          <h2>✨ Features</h2>
          <ul>
            <li>✅ TypeScript Strict Mode</li>
            <li>✅ TDD avec Vitest</li>
            <li>✅ ESLint + SonarJS (complexité max 15)</li>
            <li>✅ Prettier + Husky hooks</li>
            <li>✅ Coverage 80% minimum</li>
            <li>✅ Feature-based folders</li>
          </ul>
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Voir <code>AGENT.md</code> pour les règles complètes
        </p>
      </footer>
    </div>
  );
}

export default App;
