import { test, expect } from '@playwright/test';

test.describe('E2E: Subastas Wholesale B2B', () => {
  test('carga el marketplace inter-automotoras y muestra fee del 1.5%', async ({ page }) => {
    await page.goto('/app/wholesale');

    // Verificar título
    await expect(page.locator('h1')).toContainText('Wholesale B2B');

    // Verificar regla de fee de intercambio B2B
    await expect(page.locator('text=Fee de Intercambio B2B')).toBeVisible();
    await expect(page.locator('text=1.5%').first()).toBeVisible();

    // Verificar listado de subastas activas
    await expect(page.locator('text=Nissan Kicks').first()).toBeVisible();
  });
});
