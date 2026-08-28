import { test, expect } from '@playwright/test';

test.describe('E2E: Showroom Público & Whitelabel Storefront', () => {
  test('carga el catálogo público para clientes con buscador y cotizador de retoma', async ({ page }) => {
    await page.goto('/site/automotora-oriente');

    // Verificar banner del showroom
    await expect(page.locator('h1')).toContainText('Encuentra tu próximo auto');

    // Verificar badge de garantía y financiamiento
    await expect(page.locator('text=Garantía Mecánica Incluida')).toBeVisible();
    await expect(page.locator('text=Recibimos tu Auto en Parte de Pago')).toBeVisible();

    // Verificar presencia del botón WhatsApp flotante
    await expect(page.locator('text=Consultar por WhatsApp').first()).toBeVisible();
  });
});
