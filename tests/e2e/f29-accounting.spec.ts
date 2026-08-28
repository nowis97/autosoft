import { test, expect } from '@playwright/test';

test.describe('E2E: Asistente Formulario F29 & Ley 21.420 IVA sobre Margen', () => {
  test('carga el asistente F29, muestra codigos del SII (502, 503, 91) y boton de exportar CSV', async ({ page }) => {
    await page.goto('/app/invoicing/f29');

    // Verificar encabezado
    await expect(page.locator('h1')).toContainText('Asistente de Declaración Mensual Formulario F29');
    await expect(page.locator('text=Ley 21.420 IVA sobre Margen')).toBeVisible();

    // Verificar códigos del SII
    await expect(page.locator('text=Código 502').first()).toBeVisible();
    await expect(page.locator('text=Código 503').first()).toBeVisible();
    await expect(page.locator('text=Código 91').first()).toBeVisible();

    // Verificar botón de exportar CSV
    await expect(page.locator('button:has-text("Exportar CSV para Contador")')).toBeVisible();
  });
});
