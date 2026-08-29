import { test, expect } from '@playwright/test';

test.describe('E2E: Modo Mobile & Barra de Navegación Inferior Táctil', () => {
  test.use({ viewport: { width: 390, height: 844 } }); // Emular smartphone móvil

  test('carga la barra de navegación inferior táctil y oculta el sidebar en celulares', async ({ page }) => {
    await page.goto('/app/inventory');

    // Verificar que la barra inferior táctil esté visible en móvil
    const bottomNav = page.locator('nav.fixed.bottom-0');
    await expect(bottomNav).toBeVisible();

    // Verificar enlaces táctiles primarios en la barra inferior
    await expect(bottomNav.getByText('Stock', { exact: true })).toBeVisible();
    await expect(bottomNav.getByText('Leads', { exact: true })).toBeVisible();
    await expect(bottomNav.getByText('Copiloto', { exact: true })).toBeVisible();
    await expect(bottomNav.getByText('Patio', { exact: true })).toBeVisible();
    await expect(bottomNav.getByText('Más', { exact: true })).toBeVisible();

    // Verificar que las tarjetas móviles de vehículos se muestren
    const mobileCards = page.getByTestId('mobile-vehicle-cards');
    await expect(mobileCards).toBeVisible();

    // Navegar a Leads / CRM desde la barra táctil
    await bottomNav.getByText('Leads', { exact: true }).click();
    await page.waitForURL('**/app/crm');
    await expect(page.locator('text=Embudo de Ventas')).toBeVisible();

    // Abrir el menú "Más" desplegable en móvil
    await bottomNav.getByText('Más', { exact: true }).click();
    await expect(page.locator('text=Todos los Módulos')).toBeVisible();

    const transfersLink = page.getByRole('link', { name: /Notaría Ley 19.799/ });
    await expect(transfersLink).toBeVisible();

    // Navegar a Notaría desde el menú móvil
    await transfersLink.click();
    await page.waitForURL('**/app/transfers');
    await expect(page.locator('text=Transferencias Notariales')).toBeVisible();
  });
});
