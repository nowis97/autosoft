# 🚗 AutoSoft 360 (v2.0)
## El Sistema Operativo Integral para Concesionarios y Automotoras en Chile

AutoSoft 360 es una plataforma SaaS integral (DMS + CRM + ERP + Compliance Normativo) diseñada específicamente para la industria automotriz chilena, integrando la gestión física del inventario con las regulaciones del **Servicio de Impuestos Internos (SII - Ley 21.420 / DTE 33 / Formulario F29)**, la **Ley Pro-Consumidor (Ley 21.398)** y la **Notaría Digital y Firma Electrónica (Ley 19.799)**.

---

## 📚 Documentación y Manuales Maestros

* 📘 [**Manual Completo de Procesos Operativos y Tributarios (`docs/MANUAL_DE_PROCESOS.md`)**](./docs/MANUAL_DE_PROCESOS.md): Documento detallado con los 24 procesos del negocio, 10 diagramas de flujo Mermaid, roles y formulaciones matemáticas.
* 🏛️ [**Documento de Diseño Maestro (`DESIGN.md`)**](./DESIGN.md): Arquitectura de software, diagnóstico de mercado y especificación técnica de los módulos core.
* 🎨 [**Sistema de Diseño Visual (`DESIGN_SYSTEM.md`)**](./DESIGN_SYSTEM.md): Tokens de diseño, paleta cromática y tipografías.

---

## 🗺️ Mapa de Módulos del Sistema

| Módulo | Ruta | Descripción |
|---|---|---|
| **Panel Ejecutivo** | [`/app`](http://localhost:3000/app) | Dashboard multidimensional de 4 vistas (Comercial, Inventario, Vendedores, Web) con alertas IA y F29. |
| **Inventario DMS & Pipeline** | [`/app/inventory`](http://localhost:3000/app/inventory) | Tablero Kanban de 7 etapas (`Revisión Mecánica` ➔ `Retirado`) y Modal de Alta con IA (`/api/scraper/plate`). |
| **Tareas Operativas** | [`/app/tasks`](http://localhost:3000/app/tasks) | Kanban de tareas operacionales vinculadas a patentes y áreas con alertas de atraso. |
| **Documentos & Contratos** | [`/app/documents`](http://localhost:3000/app/documents) | Generador de 7 plantillas oficiales (Nota de Venta, Compra, Consignación, Reserva, Cotización, etc.). |
| **Inspección Técnica & Yard Mode** | [`/app/inspection`](http://localhost:3000/app/inspection) | Protocolo de 50 puntos, mapa 2D de daños de carrocería y modo móvil PWA (`/yard-mode`). |
| **Taller & Costo Real** | [`/app/service`](http://localhost:3000/app/service) | Órdenes de trabajo acumuladas automáticamente al costo real de la unidad. |
| **Tasador GAIA IA** | [`/app/valuation`](http://localhost:3000/app/valuation) | Tasación predictiva, asistente conversacional y conversor de retoma a inventario. |
| **Marketing & Redes** | [`/app/marketing`](http://localhost:3000/app/marketing) | Generador de creatividades HD, copys con IA y publicación directa en Instagram Business. |
| **CRM & Copiloto de Ventas** | [`/app/crm`](http://localhost:3000/app/crm) | Pipeline de leads con scoring IA y enlaces directos de WhatsApp con contexto. |
| **Financiamiento F&I** | [`/app/financing`](http://localhost:3000/app/financing) | Simulador de crédito automotriz chileno con amortización francesa y tasas de mercado. |
| **Facturación Electrónica SII** | [`/app/invoicing`](http://localhost:3000/app/invoicing) | Factura de Usados DTE 33 con régimen IVA sobre margen comercial (Ley 21.420). |
| **Formulario F29 SII** | [`/app/invoicing/f29`](http://localhost:3000/app/invoicing/f29) | Liquidación contable mensual automática de códigos F29 (502, 503, 511, 538, 151, 91). |
| **Transferencias Digitales** | [`/app/transfers`](http://localhost:3000/app/transfers) | Mandato notarial digital y solicitud de transferencia en Registro Civil (Ley 19.799). |
| **Consignaciones** | [`/app/consignments`](http://localhost:3000/app/consignments) | Mandato mercantil de terceros con precio piso y comisión garantizada. |
| **Sindicación Multicanal** | [`/app/syndication`](http://localhost:3000/app/syndication) | Feeds XML automáticos para Chileautos, Mercado Libre y Yapo. |
| **Storefront Público** | [`/site/[tenantSlug]`](http://localhost:3000/site/automotora-oriente) | Portal web público whitelabel con pasarela Webpay Plus. |

---

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo en http://localhost:3000
npm run dev

# Ejecutar suite de pruebas unitarias (Vitest)
npm test

# Compilar para producción (Turbopack)
npm run build
```

---

## 🧪 Calidad y Pruebas
* **Test Suite:** 36 archivos de test, **109 tests unitarios aprobados (100% éxito)**.
* **TypeScript:** Estricto, 0 errores de tipado.
* **Turbopack:** 38 rutas dinámicas y estáticas optimizadas.
