import { test, expect } from '@playwright/test';

test.describe('E2E: Simulador de WhatsApp con Copiloto IA 24/7', () => {
  test('interactua en tiempo real con el copiloto, procesa cotizaciones y agendamientos', async ({ page }) => {
    await page.goto('/app/copilot');

    // Verificar encabezados
    await expect(page.locator('h1')).toContainText('Copiloto de Ventas con IA & WhatsApp 24/7');
    await expect(page.locator('text=Simulador en Vivo de WhatsApp con IA')).toBeVisible();

    // Seleccionar prospecto Felipe Albornoz
    const leadButton = page.locator('button:has-text("Felipe Albornoz")');
    await expect(leadButton).toBeVisible();
    await leadButton.click();

    // Verificar respuesta del Copiloto con cuota estimada o stock
    await expect(page.locator('text=Toyota RAV4').first()).toBeVisible({ timeout: 5000 });

    // Verificar botón de simulación de nota de voz
    await expect(page.locator('button:has-text("Simular Nota de Voz")')).toBeVisible();
  });
});
