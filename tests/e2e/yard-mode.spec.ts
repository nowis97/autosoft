import { test, expect } from '@playwright/test';

test.describe('E2E: Modo Patio PWA & Check-in Móvil con Cámara', () => {
  test('carga la vista táctil móvil de patio y permite interactuar con los botones de 1-toque', async ({ page }) => {
    await page.goto('/app/inspection/yard-mode');

    // Verificar encabezado de Modo Patio PWA
    await expect(page.locator('h1')).toContainText('Check-in Rápido en Terreno');
    await expect(page.locator('text=Modo Patio PWA')).toBeVisible();

    // Verificar presencia de botones de 1 toque (OK / Obs / Falla)
    const okButton = page.locator('button:has-text("✓ OK")').first();
    await expect(okButton).toBeVisible();

    const obsButton = page.locator('button:has-text("⚠ Obs")').first();
    await expect(obsButton).toBeVisible();
    await obsButton.click();

    // Verificar botón de foto
    const photoButton = page.locator('button:has-text("Foto")').first();
    await expect(photoButton).toBeVisible();

    // Verificar barra de acción inferior para finalizar check-in
    await expect(page.locator('button:has-text("Finalizar Check-in de Patio")')).toBeVisible();
  });
});
