import { test, expect } from '@playwright/test';

test.describe('E2E: Inventario DMS & Gestión de Stock', () => {
  test('permite navegar al inventario, visualizar patentes chilenas y verificar vehículos', async ({ page }) => {
    await page.goto('/app/inventory');

    // Verificar título principal
    await expect(page.locator('h1')).toContainText('Inventario de Vehículos (DMS)');

    // Verificar presencia de patentes chilenas formateadas
    const plateBadge = page.locator('text=BB·CL·12').first();
    await expect(plateBadge).toBeVisible();

    // Verificar presencia de vehículos cargados
    await expect(page.locator('text=Toyota RAV4').first()).toBeVisible();
    await expect(page.locator('text=Mazda CX-5').first()).toBeVisible();
  });
});
