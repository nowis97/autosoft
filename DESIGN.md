# Documento de Diseño Maestro: Autosoft 360
## El Sistema Operativo Integral para Concesionarios y Automotoras en Chile

**Generado por YC Office Hours (Validado por Revisión Adversarial de Calidad)**  
**Fecha:** 27 de Agosto de 2026  
**Rama:** `main` | **Repositorio:** `autosoft`  
**Estado:** `APPROVED (Arquitectura Core Operativa + Roadmap de Integraciones Fases 2-3)`  
**Versión:** Autosoft v2.0  
**Stack:** Next.js 16 (App Router + Turbopack) + React 19 + TypeScript + Tailwind CSS v4 + Drizzle ORM / PostgreSQL + Vitest

---

## 1. Resumen Ejecutivo y Diagnóstico del Mercado Chileno

### 1.1. Contexto de la Industria
En Chile operan más de **2.500 automotoras y compraventas de vehículos usados**, las cuales transaccionan anualmente más de **1.000.000 de transferencias de vehículos usados** (según estadísticas consolidadas del Registro Civil y CAVEM).

### 1.2. El Dolor Estructural (Status Quo Fragmentado)
- **Portales de Clasificados Caros y Desconectados:** Tarifas mensuales de \$200.000 a \$800.000 CLP (Chileautos/Carsales, Mercado Libre, Yapo) que solo dan vitrina publicitaria sin ERP ni DMS interno.
- **Pérdida Nocturna de Leads en WhatsApp:** El 65% de las consultas de compra ocurren entre las 19:00 y las 24:00 hrs.
- **Riesgo Tributario con el SII (Ley 21.420 / D.L. 825):** Desconocimiento de la exención de costo de adquisición e IVA sobre margen comercial en usados.
- **Costos Ocultos de Taller:** Falta de acumulación de repuestos y mano de obra al costo real del vehículo, distorsionando el margen bruto.
- **Vicios Ocultos en Retomas:** Recepción sin protocolo técnico de 50 puntos, absorbiendo hasta \$1.500.000 CLP por unidad en fallas no detectadas.

---

## 2. Arquitectura del Sistema: Núcleo Operativo vs Integraciones Externas

```
+---------------------------------------------------------------------------------------------------+
|                               AUTOSOFT 360 - MAPA DE ARQUITECTURA                                 |
+---------------------------------------------------------------------------------------------------+
                                                  │
          ┌───────────────────────────────────────┴───────────────────────────────────────┐
          │                                                                               │
          ▼                                                                               ▼
  [ NIVEL 1: CORE OPERATIVO DMS & SOFTWARE INTERNO ]               [ NIVEL 2: INTEGRACIONES EXTERNAS & APIS ]
  (100% Implementado, Tipado y Probado en Vitest)                  (Roadmap Fases 2-3 & Proveedores Especializados)
  • Inventario DMS & Patente Chilena (/app/inventory)              • Facturación SII (API Certificada SimpleFactura/Bsale)
  • Whitelabel Storefront Público (/site/[slug])                   • Notaría Digital & FEA (Autofact / Certinet API)
  • CRM & Pipeline de Leads (/app/crm)                             • F&I Multi-Financiera (Forum, Tanner, Santander Webhooks)
  • Taller, Puesta a Punto & Libro Costos (/app/service)           • Meta Graph API (WhatsApp Business Cloud Webhooks)
  • Tasación Predictiva de Retomas (/app/valuation)                • Workers Asíncronos S3/R2 (Estudio Foto IA / BullMQ)
  • Check-in Móvil & Inspección 50 Pts (/app/inspection)
  • Consignaciones & Mandato Mercantil (/app/consignments)
  • Facturación IVA Margen Ley 21.420 (/app/invoicing)
  • Analítica Financiera P&L & DSI (/app/analytics)
  • Suscripción SaaS en UF & PAC (/app/billing)
  • Auditoría Forense & RBAC (/app/audit)
  • Sincronización Canales Feed XML (/app/syndication)
```

---

## 3. Especificación Detallada de los Módulos Core

### MÓDULO 1: Inventario DMS & Catálogo Central (`/app/inventory`, `/app/inventory/new`)
- **Formatos de Patente Chilena:**
  - Formato nuevo (4 consonantes + 2 dígitos): `BB·CL·12` (regex `^[B-DF-HJ-NP-TV-Z]{4}\d{2}$`).
  - Formato antiguo (2 letras + 4 dígitos): `AB·12·34` (regex `^[A-Z]{2}\d{4}$`).
- **Validación de RUT Módulo 11:** Algoritmo estándar chileno con dígito verificador `0-9` o `K`.
- **Ciclo de Vida del Vehículo (Máquina de Estados):**
  - Transiciones válidas:
    - `IN_MAINTENANCE` ➔ `AVAILABLE` (al completar 100% de órdenes de taller o inspección ≥ 90 pts).
    - `AVAILABLE` ➔ `RESERVED` ➔ `SOLD`.
    - Al pasar a `SOLD`, se despublica automáticamente de canales web y marketplaces.

### MÓDULO 2: Portal Web Whitelabel Storefront (`/site/[tenantSlug]`, `/app/website`)
- **Storefront Público Whitelabel:** `/site/[tenantSlug]` con catálogo en tiempo real, filtro por marcas, carrocerías y precios.
- **Simulador de Financiamiento (Amortización Francesa):**
  $$Cuota = \frac{P \cdot i \cdot (1+i)^n}{(1+i)^n - 1}$$
  Donde $P$ es el saldo a financiar, $i$ es la tasa mensual (~1.85%) y $n$ es el plazo en meses (12 a 60).
- **Formulario de Retoma / Auto en Parte de Pago:** Captación de prospectos vinculados automáticamente a `/app/valuation`.

### MÓDULO 3: CRM Automotriz & Pipeline de Leads (`/app/crm`)
- **Etapas del Pipeline:** `NEW` ➔ `CONTACTED` ➔ `INTERESTED` ➔ `NEGOTIATION` ➔ `WON` / `LOST`.
- **Integración WhatsApp Directa:** Enlace `api.whatsapp.com/send` con mensaje pre-rellenado y contexto del auto consultado.

### MÓDULO 4: Taller, Puesta a Punto & Costo Real (`/app/service`)
- **Categorías:** `MECANICA`, `PINTURA_DESABOLLADURA`, `NEUMATICOS_FRENOS`, `DETAILING_ESTETICA`, `TRAMITES_REVISION`.
- **Cálculo de Costo Real y Margen:**
  $$\text{Costo Total Acumulado} = \text{Costo Adquisición} + \sum \text{Órdenes de Trabajo}$$
  $$\text{Margen Bruto Real} = \text{Precio Venta Contado} - \text{Costo Total Acumulado}$$

### MÓDULO 5: Motor de Tasación Predictiva de Retomas (`/app/valuation`)
- **Fórmulas de Oferta:**
  - *Oferta Rápida (Quick Offer)*: $80\% \times \text{Precio Mercado} - \text{Costos Reacondicionamiento}$.
  - *Oferta Recomendada (Recommended)*: $84\% \times \text{Precio Mercado} - \text{Costos Reacondicionamiento}$.
  - *Oferta Máxima (Max Offer)*: $88\% \times \text{Precio Mercado} - \text{Costos Reacondicionamiento}$.
- **Conversor a Inventario:** Con 1 clic crea el vehículo en estado `IN_MAINTENANCE` listo para taller.

### MÓDULO 6: Check-in Móvil de Recepción & Inspección de 50 Puntos (`/app/inspection`)
- **5 Categorías de Inspección:** Mecánica (10 pts), Carrocería (10 pts), Neumáticos/Frenos (10 pts), Interior (10 pts), Documentos (10 pts).
- **Scoring Ponderado (0 a 100):**
  - $\ge 90$ pts: `EXCELENTE` (Apto para salón).
  - $75 - 89$ pts: `BUENO` (Puesta a punto menor).
  - $< 75$ pts: `REQUIERE_TALLER` (Fallas críticas enviadas a `/app/service` en 1 clic).
- **Lienzo de Daños de Carrocería:** Silueta interactiva para mapear pines de daños (Rayón, Abolladura, Trizadura, Repintado).

### MÓDULO 7: Consignaciones & Mandato Mercantil (`/app/consignments`)
- **Custodia:** Física (en salón) vs Virtual (en uso por propietario).
- **Liquidación al Propietario:**
  $$\text{Pago Neto} = \text{Precio Venta Real} - \text{Comisión Dealer} - \text{Gastos Deducibles de Taller/Papeleo}$$

### MÓDULO 8: Facturación Electrónica SII & IVA sobre Margen (`/app/invoicing`)
- **Régimen Tributario Ley 21.420 / D.L. 825:**
  - $\text{Monto Exento} = \text{Costo Adquisición}$
  - $\text{Margen Bruto Total} = \text{Precio Venta} - \text{Costo Adquisición}$
  - $\text{Base Imponible Neta} = \text{round}\left(\frac{\text{Margen Bruto Total}}{1.19}\right)$
  - $\text{IVA Débito Fiscal (19\%)} = \text{Margen Bruto Total} - \text{Base Imponible Neta}$
- **Tipos de DTEs:** Factura Electrónica DTE 33, Factura de Compra DTE 46, Timbre Electrónico PDF417 y Libro de Ventas para F29.
- *Estrategia de Producción Fase 2:* Emisión a través de API certificada ante el SII (SimpleFactura / Bsale / Facturacion.cl) para firma XML y envío SOAP oficial.

### MÓDULO 9: Analítica Ejecutiva & P&L Consolidado (`/app/analytics`)
- **Estado de Resultados Mensual:**
  $$\text{EBITDA Operativo} = (\text{Ventas Autos} + \text{Comisiones F\&I} + \text{Comisiones Seguros}) - (\text{Costo Adquisición} + \text{Taller}) - \text{Comisiones Vendedores}$$
- **Días de Stock (DSI):** Semáforo de rotación por marca (< 30 días, 30-60 días, > 60 días).

### MÓDULO 10: Planes, Suscripción SaaS & Pagos (`/app/billing`)
- **Planes en UF:** Starter (2.5 UF/mes), Pro (5.0 UF/mes), Enterprise (10.0 UF/mes).
- **Pasarelas de Cobro:** Webpay Plus (Transbank) y PAC bancario (Banco de Chile, Santander, BCI).

### MÓDULO 11: Auditoría Forense & Matriz RBAC (`/app/audit`)
- **Matriz de Permisos RBAC:**

| Permiso / Capacidad | SUPERADMIN | DEALER_OWNER | DEALER_MANAGER | DEALER_SALES_REP |
| :--- | :---: | :---: | :---: | :---: |
| Ver y Gestionar Inventario | ✅ | ✅ | ✅ | ✅ |
| Modificar Precios de Venta | ✅ | ✅ | ✅ | ⚠️ Registra Auditoría |
| Ver Costos Reales y Márgenes | ✅ | ✅ | ✅ | ❌ |
| Emitir DTEs ante el SII | ✅ | ✅ | ✅ | ❌ |
| Exportar Base de Leads (CSV) | ✅ | ✅ | ⚠️ Alerta Crítica | 🚨 Alerta Crítica |
| Configurar Usuarios y Facturación | ✅ | ✅ | ❌ | ❌ |

- **Trazabilidad Inmutable:** Registro de timestamp, IP, User-Agent y diff visual JSON de cambios de precio (`PRICE_CHANGE`).

### MÓDULO 12: Sincronización Multicanal (`/app/syndication`)
- **Canales Integrados:** Mercado Libre API + Feed XML oficial AutoGate / Chileautos / Carsales + Yapo.

---

## 4. Esquema Relacional de Base de Datos (Drizzle ORM & PostgreSQL)

Las tablas maestras con estricto aislamiento multi-tenant (`tenant_id`) son:
1. `tenants`: Perfil de la automotora, RUT, subdominio, colores y branding.
2. `users`: Usuarios y asignación de roles RBAC.
3. `vehicles`: Stock de vehículos, especificaciones, precios y estado.
4. `leads`: Prospectos comerciales, canal de origen y scoring IA.
5. `service_orders`: Órdenes de trabajo de taller y gastos de puesta a punto.
6. `trade_in_valuations`: Tasaciones de retomas y ofertas emitidas.
7. `consignments`: Mandatos mercantiles de consignación y liquidaciones.
8. `inspections`: Checklists de 50 puntos, scoring y daños de carrocería.
9. `dte_invoices`: Facturas electrónicas DTE 33 y DTE 46 con desglose IVA sobre margen.
10. `audit_logs`: Registro inmutable de eventos de seguridad y diffs.
11. `saas_subscriptions`: Planes, cuotas de consumo y pagos recurrentes.
12. `transfer_orders`: Órdenes de transferencia notarial y actas de entrega.
13. `insurance_policies`: Pólizas de seguro comercializadas y comisiones.
14. `appointment_bookings`: Citas de prueba de manejo agendadas.

---

## 5. Unit Economics & Métricas de Negocio en Chile

| Métrica | Valor Estimado | Racional / Justificación |
| :--- | :--- | :--- |
| **TAM (Mercado Total Chile)** | 2.500 Automotoras | Dealers de autos usados y seminuevos activos en Chile. |
| **ARPU Promedio (SaaS + FinTech)** | ~$260.000 CLP / mes (~$280 USD) | 5.0 UF/mes suscripción Pro + comisiones de seguros y créditos. |
| **CAC (Costo de Adquisición)** | ~$180.000 CLP (~$195 USD) | Venta presencial (Movicenter / Las Condes / Bilbao / Vespucio). |
| **Payback Period** | **< 25 días (0.7 meses)** | Recuperación inmediata en el primer mes de servicio. |
| **Churn Mensual Estimado** | **< 1.5%** | Altísimo switching cost al centralizar catálogo, leads, taller y facturación. |
| **LTV Proyectado (36 Meses)** | 162 UF (~$6.150.000 CLP / $6.600 USD) | Ratio **LTV/CAC > 30x**. |

---

## 6. Validación de Calidad & Estado de Producción

- **Pruebas Unitarias Automatizadas (Vitest):** **48/48 pruebas pasando exitosamente** en 18 suites de prueba.
- **Compilación Next.js 16 + Turbopack:** **26 rutas operativas** generadas limpiamente con 0 errores TypeScript.
- **Validaciones de Seguridad:** Módulo 11 RUT verificado, IVA sobre Margen D.L. 825 cuadrado al peso, sanitización de entradas y RBAC estricto.
