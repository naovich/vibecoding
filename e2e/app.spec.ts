import { expect, test } from '@playwright/test';

test('la page charge et le compteur fonctionne', async ({ page }) => {
  await page.goto('/');

  // Vérifie le titre principal
  await expect(page.getByRole('heading', { level: 1 })).toContainText('VibeCoding');

  // Vérifie l'état initial du compteur
  const button = page.getByRole('button', { name: /compteur/i });
  await expect(button).toContainText('Compteur : 0');

  // Clique et vérifie l'incrément
  await button.click();
  await expect(button).toContainText('Compteur : 1');
});
