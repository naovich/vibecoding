# 🎨 CSS Theme Variables - Tailwind v4

Guide d'utilisation des CSS variables du thème personnalisé VibeCoding.

---

## 📋 Vue d'ensemble

Ce projet utilise les **CSS Theme Variables** de Tailwind v4 pour exposer tous les design tokens sous forme de variables CSS natives. Cela permet de :

✅ Accéder aux tokens partout (CSS, inline styles, JavaScript)  
✅ Créer des thèmes dynamiques facilement  
✅ Animer les propriétés du thème  
✅ Partager les valeurs avec des librairies externes

---

## 🎨 Thème Actuel

### Couleurs - Vibrant Tech Theme

**Primary (Violet/Indigo)**

```css
--color-primary-50 à --color-primary-950
```

Utilise **OKLCH** pour des couleurs plus vives et vibrantes.

**Accent (Rose/Magenta)**

```css
--color-accent-50 à --color-accent-900
```

### Typographie

```css
--font-display:
  'Inter Variable', ui-sans-serif, system-ui, sans-serif --font-mono: 'Fira Code', ui-monospace,
  monospace;
```

### Breakpoints Personnalisés

```css
--breakpoint-3xl: 1920px --breakpoint-4xl: 2560px;
```

### Spacing Personnalisé

```css
--spacing-xs: 0.5rem --spacing-sm: 0.75rem --spacing-md: 1rem --spacing-lg: 1.5rem
  --spacing-xl: 2rem --spacing-2xl: 3rem --spacing-3xl: 4rem;
```

### Easings Personnalisés

```css
--ease-fluid: cubic-bezier(0.3, 0, 0, 1) --ease-snappy: cubic-bezier(0.2, 0, 0, 1)
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Shadows Personnalisées

```css
--shadow-glow:
  0 0 20px oklch(0.7 0.3 280 / 0.5) --shadow-soft: 0 4px 6px -1px oklch(0 0 0 / 0.1),
  0 2px 4px -2px oklch(0 0 0 / 0.1);
```

### Border Radius Personnalisé

```css
--radius-card: 1rem --radius-button: 0.5rem;
```

---

## 💡 Utilisation

### 1. Classes Tailwind (recommandé)

Les variables sont automatiquement mappées aux classes Tailwind :

```tsx
<div className="bg-primary-500 text-accent-200 font-display">Hello</div>
```

### 2. Inline Styles (pour valeurs dynamiques)

Parfait pour animations ou valeurs calculées :

```tsx
<div
  style={{
    background: `linear-gradient(135deg, var(--color-primary-600), var(--color-accent-600))`,
    borderRadius: 'var(--radius-card)',
    boxShadow: 'var(--shadow-glow)',
  }}
>
  Contenu
</div>
```

### 3. CSS Custom

```css
.my-component {
  color: var(--color-primary-500);
  font-family: var(--font-display);
  border-radius: var(--radius-button);
  transition: all 0.3s var(--ease-snappy);
}

.my-component:hover {
  box-shadow: var(--shadow-glow);
}
```

### 4. JavaScript / Animation Libraries

```tsx
import { motion } from 'framer-motion';

<motion.div
  animate={{
    backgroundColor: 'var(--color-primary-500)',
  }}
  transition={{
    ease: [0.2, 0, 0, 1], // var(--ease-snappy)
  }}
/>;
```

---

## 🔧 Ajouter de Nouvelles Variables

Édite `src/index.css` dans le bloc `@theme` :

```css
@theme {
  /* Ajoute tes variables ici */
  --color-success-500: oklch(0.6 0.2 145);
  --color-warning-500: oklch(0.7 0.2 60);
  --color-error-500: oklch(0.6 0.25 25);

  --font-heading: 'Montserrat', sans-serif;

  --spacing-huge: 8rem;

  --ease-elastic: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

Les variables deviennent **instantanément disponibles** partout dans l'app !

---

## 🌈 Pourquoi OKLCH ?

Les couleurs en **OKLCH** (au lieu de RGB) offrent :

✅ **Plus vives** - Gamut P3 complet  
✅ **Perceptuellement uniformes** - Les incréments sont visuellement cohérents  
✅ **Meilleurs gradients** - Pas de zones grises/ternes  
✅ **Ajustements faciles** - Modifier lightness/chroma/hue indépendamment

**Format :** `oklch(lightness chroma hue)`

```css
/* Lightness: 0-1 | Chroma: 0-0.4 | Hue: 0-360 */
--color-primary-500: oklch(0.58 0.25 280);
```

---

## 📚 Ressources

- [Tailwind v4 - CSS Theme Variables](https://tailwindcss.com/blog/tailwindcss-v4#css-theme-variables)
- [OKLCH Color Picker](https://oklch.com/)
- [CSS Custom Properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

---

## 🎯 Exemples Concrets

### Thème Sombre/Clair

```css
@theme {
  --color-bg: oklch(0.98 0 0);
  --color-text: oklch(0.2 0 0);
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: oklch(0.15 0 0);
    --color-text: oklch(0.95 0 0);
  }
}
```

### Animation de Couleur

```tsx
const [hue, setHue] = useState(280);

<div
  style={{
    background: `oklch(0.6 0.25 ${hue})`,
    transition: 'background 0.5s var(--ease-fluid)',
  }}
  onClick={() => setHue(hue + 30)}
/>;
```

### Responsive Spacing

```tsx
<div
  className="p-4 md:p-8"
  style={{
    padding: 'clamp(var(--spacing-sm), 5vw, var(--spacing-xl))',
  }}
/>
```

---

**Créé pour VibeCoding** - Template React + TypeScript avec Tailwind v4 🚀
