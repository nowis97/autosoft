import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const MODULES = [
  { name: '1. Inventario DMS', url: 'http://localhost:3000/app/inventory' },
  { name: '2. Nuevo Auto (Padrón)', url: 'http://localhost:3000/app/inventory/new' },
  { name: '3. CRM Leads & Pipeline', url: 'http://localhost:3000/app/crm' },
  { name: '4. Financiamiento F&I', url: 'http://localhost:3000/app/financing' },
  { name: '5. Notaría Ley 19.799', url: 'http://localhost:3000/app/transfers' },
  { name: '6. Asistente F29 SII', url: 'http://localhost:3000/app/invoicing/f29' },
  { name: '7. Subastas Wholesale B2B', url: 'http://localhost:3000/app/wholesale' },
  { name: '8. Tasación de Retomas', url: 'http://localhost:3000/app/valuation' },
  { name: '9. Modo Patio PWA', url: 'http://localhost:3000/app/inspection/yard-mode' },
  { name: '10. Copiloto WhatsApp', url: 'http://localhost:3000/app/copilot' },
  { name: '11. Asistente de Inicio', url: 'http://localhost:3000/app/onboarding' },
  { name: '12. Showroom Público', url: 'http://localhost:3000/site/auto-oriente' },
];

async function runMobileAudit() {
  console.log("===============================================================");
  console.log("📱 AUDITANDO VISUALMENTE 12 MÓDULOS EN VIEWPORT MOBILE (390x844)");
  console.log("===============================================================");

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();
  const results: any[] = [];
  const screenshotsDir = path.join(process.cwd(), '.gstack', 'design-reports', 'mobile-screenshots');
  fs.mkdirSync(screenshotsDir, { recursive: true });

  for (const mod of MODULES) {
    try {
      const response = await page.goto(mod.url, { waitUntil: 'domcontentloaded', timeout: 10000 });
      await page.waitForTimeout(600);

      // Check horizontal overflow (no horizontal scrollbar)
      const hasHorizontalOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth + 2;
      });

      // Check MobileBottomNav visibility if it is an /app route
      let bottomNavVisible = false;
      if (mod.url.includes('/app') && !mod.url.includes('yard-mode')) {
        bottomNavVisible = await page.locator('nav.fixed.bottom-0').isVisible().catch(() => false);
      } else {
        bottomNavVisible = true;
      }

      const slug = mod.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const screenshotPath = path.join(screenshotsDir, slug + '.png');
      await page.screenshot({ path: screenshotPath, fullPage: false });

      const status = response && response.status() === 200 && !hasHorizontalOverflow ? "PERFECTO" : "CON_ADVERTENCIA";

      results.push({
        module: mod.name,
        status,
        horizontalOverflow: hasHorizontalOverflow ? "⚠️ SÍ" : "✅ NO (0px)",
        bottomNav: bottomNavVisible ? "✅ Visible" : "–",
        screenshot: slug + '.png',
      });

      console.log(`✅ [${mod.name}] -> Estado: ${status} | Overflow: ${hasHorizontalOverflow ? "SÍ" : "NO"} | BottomNav: ${bottomNavVisible ? "OK" : "N/A"}`);
    } catch (err: any) {
      console.error(`❌ Error en ${mod.name}:`, err.message);
      results.push({
        module: mod.name,
        status: "ERROR",
        error: err.message,
      });
    }
  }

  await browser.close();

  console.log("===============================================================");
  console.log("📊 RESULTADOS CONSOLIDADOS DE AUDITORÍA MOBILE (12 MÓDULOS):");
  console.table(results.map(r => ({
    Módulo: r.module,
    Estado: r.status,
    "Scroll Horizontal": r.horizontalOverflow || "ERROR",
    "Barra Táctil": r.bottomNav || "ERROR",
  })));
}

runMobileAudit().catch(console.error);
