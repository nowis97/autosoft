## Why

AutoSoft cuenta con robustos motores de negocio específicos para Chile (cálculo tributario SII F29, DTE 33/34/46, notarías digitales Ley 19.799, garantías Ley 21.398, inspección de 50 puntos y financiamiento), pero requiere elevar su experiencia de usuario y flujo visual al nivel del estándar de mercado demostrado por plataformas como GoAuto (`portal.goauto.cl`). Esta propuesta fusiona ambos mundos: integra las interfaces de usuario de alta fidelidad, tableros Kanban multidimensionales y flujos operacionales basados en patentes con los motores analíticos, legales y tributarios ya implementados en el núcleo de AutoSoft.

## What Changes

- **Dashboard Ejecutivo Multidimensional**: Implementación de 4 vistas unificadas (`Comercial`, `Inventario`, `Vendedores`, `Web`), alertas predictivas inteligentes, gráficos multivariables de rendimiento, desglose de rentabilidad bruta/neta y resumen de IVA F29 en tiempo real.
- **Pipeline Operativo de Vehículos**: Nueva vista Kanban de 7 estados operativos (`Revisión Mecánica`, `Preparación` con % de avance, `Listo para la foto`, `Publicado`, `Reservado`, `Vendido`, `Retirado`) con pantalla animada de ingesta rápida por patente (Orbe IA).
- **Gestión de Tareas Operativas Automotrices**: Tablero Kanban de tareas vinculado directamente a patentes y vehículos (`/app/tasks`), con alertas de vencimiento por días y categorización por áreas de negocio.
- **Generador de Documentos y Contratos Chilenos**: Módulo interactivo con 7 plantillas legales oficiales (`Nota de Venta`, `Nota de Compra`, `Consignación`, `Reservación`, `Cotización`, `Cierre de Negocio`, `Ficha Técnica`), desglose de gastos y conexión con Notaría Digital.
- **Aprobación de Venta y Liquidación de Comisiones**: Drawer de cierre comercial con calculadora avanzada de comisiones (base Total vs Margen, tipo % vs $ fijo, split entre colaboradores) y sincronización con facturación SII.
- **Tasador Inteligente GAIA**: Interfaz de tasación por lenguaje natural conectada a los algoritmos de valoración de mercado y tasación fiscal de AutoSoft.
- **Centro de Marketing e Integración con Redes**: Flujo de publicación directa en Instagram Business y sincronización multicanal (MercadoLibre / ChileAutos).

## Capabilities

### New Capabilities
- `dashboard-multidimensional`: Tablero de control ejecutivo en 4 vistas (Comercial, Inventario, Vendedores, Web) con KPIs en tiempo real, desglose de rentabilidad y widget tributario F29.
- `operational-vehicle-pipeline`: Flujo visual Kanban de 7 fases para la preparación y publicación de autos con orbe IA de escaneo de patente.
- `operational-task-management`: Gestión Kanban de tareas operativas del concesionario asociadas a patentes y vehículos con detección de vencimientos.
- `chilean-contract-generator`: Generador y editor interactivo de 7 plantillas contractuales automotrices chilenas con desglose financiero y firma notarial digital.
- `sales-approval-commissions`: Drawer de aprobación de ventas, cálculo y partición de comisiones para vendedores, y disparo de DTE contable.
- `gaia-smart-valuation`: Módulo conversacional y rápido de tasación comercial ("Tasador GAIA") asistido por IA y referencias de mercado.
- `marketing-syndication-portal`: Selector y publicador visual de inventario para Instagram Business y portales de clasificados.

### Modified Capabilities

## Impact

- **Frontend & UI**: Nuevas rutas y componentes visuales en `src/components/` y `src/app/app/` (`dashboard`, `tasks`, `pipeline`, `documents`, `sales`, `valuation`, `marketing`).
- **Domain Models & State**: Expansión de tipos en `src/types/index.ts` y estado en `src/lib/store.ts` para soportar estados de tareas, pipeline de 7 fases y comisiones dinámicas.
- **Engines & Backend**: Integración con `f29-engine.ts`, `tax-invoicing.ts`, `digital-notary.ts`, `inspection-engine.ts` y `plate-scraper.ts`.
