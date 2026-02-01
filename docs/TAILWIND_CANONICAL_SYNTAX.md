# 🎨 Tailwind v4 - Syntaxe Canonique

Guide pour comprendre et éviter le warning `suggestCanonicalClasses` dans Tailwind CSS v4.

---

## ⚠️ Le Warning

```
The class drop-shadow-[var(--shadow-glow)] can be written as
drop-shadow-(--shadow-glow) (suggestCanonicalClasses)
```

### Pourquoi ce warning ?

Tailwind CSS v4 introduit une **syntaxe plus courte et canonique** pour référencer les CSS variables dans les arbitrary values.

---

## 🔄 Avant vs Après

### ❌ Ancienne syntaxe (v3 / non-canonique)

```tsx
<div className="drop-shadow-[var(--shadow-glow)]">
  <div className="bg-[var(--color-primary-500)]">
  <div className="text-[var(--font-display)]">
```

**Problèmes :**

- Plus verbeux (`var()` est redondant)
- Moins lisible
- Non-canonique dans Tailwind v4

### ✅ Nouvelle syntaxe (v4 / canonique)

```tsx
<div className="drop-shadow-(--shadow-glow)">
  <div className="bg-(--color-primary-500)">
  <div className="text-(--font-display)">
```

**Avantages :**

- Plus court (pas besoin de `var()`)
- Plus lisible
- Syntaxe recommandée par Tailwind v4
- Fonctionne de la même manière

---

## 🛡️ Protection Automatique

Le projet VibeCoding inclut un **script de vérification automatique** qui bloque les commits avec la syntaxe non-canonique.

### Script : `check-tailwind-syntax.js`

**Ce qu'il fait :**

1. Scanne tous les fichiers `.tsx` et `.jsx`
2. Détecte les patterns `[var(--...)]`
3. Suggère la syntaxe canonique `(--...)`
4. Bloque le commit si détecté

### Quand s'exécute-t-il ?

**Pre-commit hook** :

```bash
git commit -m "..."
# 🎨 Checking Tailwind CSS syntax...
# ✅ All Tailwind classes use canonical syntax
```

**Manuellement** :

```bash
npm run check:tailwind
```

### Exemple de blocage

Si vous essayez de commit avec la mauvaise syntaxe :

```bash
git commit -m "Add component"

❌ src/MyComponent.tsx:12
   Non-canonical syntax: [var(--shadow-glow)]
   Use instead:          (--shadow-glow)

   <div className="bg-red-500 drop-shadow-[var(--shadow-glow)]">

🚫 Non-canonical Tailwind syntax detected!
💡 Tailwind v4 prefers (--variable) over [var(--variable)]
   This makes classes shorter and more readable.
```

---

## 🔧 Correction Manuelle

### Rechercher les occurrences

```bash
# Trouver tous les usages non-canoniques
grep -r "\[var(--" src/
```

### Remplacer globalement

**Rechercher :** `[var(--([^)]+))]`  
**Remplacer par :** `(--$1)`

**Exemple avec sed :**

```bash
find src -name "*.tsx" -type f -exec sed -i 's/\[var(--\([^)]*\))\]/(--\1)/g' {} +
```

---

## 📋 Checklist Migration

Si vous avez un projet Tailwind v3 :

- [ ] Rechercher tous les `[var(--` dans le code
- [ ] Remplacer par `(--`
- [ ] Supprimer `var()` et les crochets `[]`
- [ ] Garder les parenthèses `()`
- [ ] Lancer `npm run check:tailwind`
- [ ] Commit

---

## 🎯 Cas d'Usage Courants

### Couleurs

```tsx
// ❌ Non-canonique
<div className="bg-[var(--color-primary-500)]" />

// ✅ Canonique
<div className="bg-(--color-primary-500)" />
```

### Shadows

```tsx
// ❌ Non-canonique
<div className="drop-shadow-[var(--shadow-glow)]" />

// ✅ Canonique
<div className="drop-shadow-(--shadow-glow)" />
```

### Spacing

```tsx
// ❌ Non-canonique
<div className="mt-[var(--spacing-lg)]" />

// ✅ Canonique
<div className="mt-(--spacing-lg)" />
```

### Fonts

```tsx
// ❌ Non-canonique
<div className="font-[var(--font-display)]" />

// ✅ Canonique
<div className="font-(--font-display)" />
```

### Border Radius

```tsx
// ❌ Non-canonique
<div className="rounded-[var(--radius-card)]" />

// ✅ Canonique
<div className="rounded-(--radius-card)" />
```

---

## 🔍 Différences Techniques

Les deux syntaxes **fonctionnent de la même manière** au runtime :

```css
/* Les deux génèrent le même CSS */
.drop-shadow-\[var\(--shadow-glow\)\] {
  filter: drop-shadow(var(--shadow-glow));
}

.drop-shadow-\(--shadow-glow\) {
  filter: drop-shadow(var(--shadow-glow));
}
```

La différence est **purement syntaxique** dans le HTML/JSX.

---

## 💡 Pourquoi Tailwind v4 Préfère Cette Syntaxe ?

1. **Plus concise** - Moins de caractères
2. **Plus lisible** - Moins de bruit visuel
3. **Cohérence** - Aligne avec d'autres arbitrary values
4. **Performance** - Légèrement plus rapide à parser

---

## 📚 Ressources

- [Tailwind CSS v4.0 Blog](https://tailwindcss.com/blog/tailwindcss-v4)
- [Arbitrary Values Documentation](https://tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values)
- [CSS Custom Properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

---

**Créé pour VibeCoding** - Template React + TypeScript avec Tailwind v4 🚀
