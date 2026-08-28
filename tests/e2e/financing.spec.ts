import { test, expect } from '@playwright/test';

test.describe('E2E: Financiamiento Automotriz & Scoring F&I', () => {
  test('abre el modal de Certificado Oficial de Pre-Aprobación y muestra desglose financiero', async ({ page }) => {
    await page.goto('/app/financing');

    // Verificar encabezado
    await expect(page.locator('h1')).toContainText('Financiamiento Automotriz');

    // Localizar botón de Certificado en la tabla y hacer clic
    const certButton = page.locator('button:has-text("Certificado")').first();
    await expect(certButton).toBeVisible();
    await certButton.click();

    // Verificar apertura del Modal
    const modalHeader = page.locator('text=Certificado Oficial de Pre-Aprobación F&I');
    await expect(modalHeader).toBeVisible();

    // Verificar desglose financiero en el certificado
    await expect(page.locator('text=CRÉDITO AUTOMOTRIZ PRE-APROBADO')).toBeVisible();
    await expect(page.locator('button:has-text("Enviar por WhatsApp")')).toBeVisible();
  });
});
