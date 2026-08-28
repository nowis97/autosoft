import { test, expect } from '@playwright/test';

test.describe('E2E: Consulta de Patente Real VVSV74 en Interfaz Web', () => {
  test('al escribir la patente real VVSV74 en el formulario, autocompleta inmediatamente los datos', async ({ page }) => {
    await page.goto('/app/inventory/new');

    // Localizar input de patente
    const plateInput = page.locator('#plate');
    await expect(plateInput).toBeVisible();

    // Escribir la patente real VVSV74
    await plateInput.fill('VVSV74');

    // Verificar que el badge de patente muestre VV·SV·74
    await expect(page.locator('text=VV·SV·74')).toBeVisible();

    // Verificar que los campos de marca, modelo, año y precio se hayan precargado
    const brandInput = page.locator('#brand');
    const modelInput = page.locator('#model');
    const yearInput = page.locator('#year');
    const priceCashInput = page.locator('#priceCash');

    await expect(brandInput).not.toHaveValue('');
    await expect(modelInput).not.toHaveValue('');
    await expect(yearInput).toHaveValue('2026');
    await expect(priceCashInput).not.toHaveValue('');

    // Verificar banner de éxito
    await expect(page.locator('text=precargados')).toBeVisible({ timeout: 4000 });
  });
});
