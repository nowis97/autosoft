import { test, expect } from '@playwright/test';

test.describe('E2E: Wizard de Inicio Rápido (4 Pasos)', () => {
  test('permite a un nuevo dueño completar el onboarding, subir su primer auto y probar el copiloto en vivo', async ({ page }) => {
    await page.goto('/app/onboarding');

    // Paso 1: Identidad de la Automotora
    await expect(page.locator('h2')).toContainText('Paso 1: Identidad de tu Automotora');
    await page.locator('input[placeholder="Ej: Automotora Los Andes SpA"]').fill('Automotora Los Andes SpA');
    await page.locator('input[placeholder="77.123.456-7"]').fill('76.452.189-7');
    await page.locator('input[placeholder="+56 9 8765 4321"]').fill('+56 9 8765 4321');
    await page.locator('input[placeholder="Ej: Santiago, Vitacura"]').fill('Santiago');
    await page.locator('button:has-text("Siguiente: Cargar Mi Primer Auto")').click();

    // Paso 2: Carga de Primer Auto
    await expect(page.locator('h2')).toContainText('Paso 2: Carga tu Primer Auto');
    await page.locator('input[placeholder="BBCL12"]').fill('BBCL12');
    await page.locator('input[placeholder="Ej: Toyota"]').fill('Toyota');
    await page.locator('input[placeholder="Ej: RAV4"]').fill('RAV4');
    await page.locator('button:has-text("Siguiente: Probar Copiloto IA en Vivo")').click();

    // Paso 3: Test del Copiloto de WhatsApp
    await expect(page.locator('h2')).toContainText('Paso 3: Prueba tu Copiloto IA');
    await expect(page.locator('text=Toyota RAV4').first()).toBeVisible();

    // Probar prompt rápido de cuota
    await page.locator('button:has-text("4 millones de pie")').click();
    await expect(page.locator('text=Forum/Tanner')).toBeVisible({ timeout: 5000 });

    // Avanzar a Paso 4
    await page.locator('button:has-text("Ver Mi Showroom Listo")').click();

    // Paso 4: Showroom & Despegue
    await expect(page.locator('h2')).toContainText('¡Felicitaciones! Tu Automotora Está en Vivo');
    await expect(page.locator('text=Link de tu Showroom Público')).toBeVisible();
    await expect(page.locator('a:has-text("Entrar a Mi Panel de Control")')).toBeVisible();
  });
});
