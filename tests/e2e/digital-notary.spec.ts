import { test, expect } from '@playwright/test';

test.describe('E2E: Notaría Digital & Mandato de Transferencia (Ley 19.799)', () => {
  test('abre el modal de Mandato Notarial y muestra CUV, cláusulas legales y botón de WhatsApp', async ({ page }) => {
    await page.goto('/app/transfers');

    // Clic en botón de Mandato Notarial en la tabla de transferencias
    const notaryButton = page.locator('button:has-text("Mandato Notarial")').first();
    await expect(notaryButton).toBeVisible();
    await notaryButton.click();

    // Verificar título del modal y Ley 19.799
    await expect(page.locator('text=Notaría Online • Ley 19.799')).toBeVisible();
    await expect(page.locator('text=MANDATO ESPECIAL AMPLIO').first()).toBeVisible();

    // Verificar presencia del Código Único de Verificación (CUV)
    await expect(page.locator('text=CUV-').first()).toBeVisible();

    // Verificar botón de envío a WhatsApp
    await expect(page.locator('text=Enviar a WhatsApp')).toBeVisible();
  });
});
