## Context

AutoSoft contains deeply specialized Chilean automotive engines (SII F29 tax engine, DTE electronic billing, 50-point inspection mapper, digital notary Ley 19.799, and scrapers). GoAuto provides an intuitive, high-velocity UX benchmark featuring multi-tab executive dashboards, 7-stage vehicle preparation Kanban boards, license-plate-linked task management, interactive legal contract builders, and sales approval commission drawers.

This design establishes the architectural blueprint to fuse GoAuto UX components directly onto AutoSoft core engines.

## Goals / Non-Goals

**Goals:**
- Unify the executive experience under a 4-tab dashboard (`Comercial`, `Inventario`, `Vendedores`, `Web`) wired to real AutoSoft calculations.
- Introduce an operational task Kanban board (`/app/tasks`) linked to vehicle plates with overdue tracking.
- Enhance vehicle inventory with a 7-stage Kanban pipeline and an AI intake screen with 3D Orb animation.
- Implement an interactive 7-template contract engine with live financial breakdowns and digital notary hooks.
- Deliver a dedicated sales approval drawer with multi-base commission calculations (% vs $, margin vs total).
- Connect GAIA conversational valuation and Instagram marketing directly to AutoSoft valuation and syndication feeds.

**Non-Goals:**
- Replacing existing Chilean legal calculation algorithms that are already unit-tested and verified.
- Creating separate disconnected databases; all new views must operate against the central unified tenant store.

## Decisions

### 1. Component Architecture & Route Structure
- **Dashboard (`/app`)**: Split into modular components `CommercialTab`, `InventoryTab`, `SellersTab`, `WebTab` with shared filters and reactive KPI calculation hooks.
- **Tasks (`/app/tasks`)**: Create a new Kanban board component supporting drag-and-drop or state toggles, vehicle picker modals, and overdue calculation utilities.
- **Inventory (`/app/inventory`)**: Implement a view toggle between `TableView` and `PipelineKanbanView` with 7 stages (`REVISION_MECANICA`, `PREPARACION`, `LISTO_FOTO`, `PUBLICADO`, `RESERVADO`, `VENDIDO`, `RETIRADO`).
- **Documents (`/app/documents`)**: Implement `DocumentGenerator` with 7 template schemas, live preview, editable field inputs, and PDF/Notary export buttons.
- **Sales Approval Drawer**: Create `SalesApprovalDrawer` component callable from Alerts or Sales tables.

### 2. State & Domain Model Extensions
- Extend `Vehicle` model in `src/types/index.ts` to include `pipelineStage: "REVISION_MECANICA" | "PREPARACION" | "LISTO_FOTO" | "PUBLICADO" | "RESERVADO" | "VENDIDO" | "RETIRADO"`.
- Introduce `DealerTask` interface in `src/types/index.ts` with `id`, `tenantId`, `vehicleId`, `title`, `description`, `priority`, `department`, `status`, `dueDate`, `assignedTo`.
- Introduce `SaleCommission` interface for commission splits and base calculation rules.
- Add corresponding CRUD and state mutators in `src/lib/store.ts`.

### 3. Integration with Chilean Core Engines
- **Tax Summary**: Connect `CommercialTab` to `calculateF29Summary()` and `calculateUsedCarInvoiceTaxes()`.
- **Intake AI**: Connect the intake modal to `scrapePlateData()` and `decodePadronPdf()`.
- **Document Signing**: Hook the Document Generator directly to `createDigitalNotaryMandate()`.

## Risks / Trade-offs

- **[UI Density on Mobile]** → Implement responsive horizontal scrolling tabs and compact card variants for mobile viewports.
- **[Calculation Discrepancies between Gross vs Net Margin]** → Maintain explicit formulas clearly showing deductions (Commissions, Reconditioning, Additional Expenses) in the UI tooltips.
