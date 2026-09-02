## 1. Domain Models and Store Foundations

- [x] 1.1 Update `src/types/index.ts` to add `VehiclePipelineStage`, `DealerTask`, `DealerTaskPriority`, `DealerTaskDepartment`, `SaleApprovalRecord`, and `CommissionRule` types and verify TypeScript compilation with `npm run build` or `npx tsc --noEmit`
- [x] 1.2 Extend `src/lib/store.ts` with task CRUD actions, vehicle pipeline transitions, and sales commission approval methods and verify with unit tests in `tests/unit/store.test.ts`

## 2. Multidimensional Executive Dashboard

- [x] 2.1 Build the 4-tab dashboard container in `src/components/analytics/ExecutiveDashboard.tsx` supporting Comercial, Inventario, Vendedores, and Web views and verify rendering on `/app`
- [x] 2.2 Implement `CommercialTab` with KPI cards, multi-line performance chart, profitability formula breakdown, and live SII F29 VAT widget linked to `src/lib/accounting/f29-engine.ts` and verify calculations
- [x] 2.3 Implement `InventoryTab` (stock health, brand turnover donut chart), `SellersTab` (sales leaderboard and commission export), and `WebTab` (storefront conversion metrics) and verify tab switching

## 3. Operational Vehicle Pipeline and AI Ingestion

- [x] 3.1 Implement the 7-stage Kanban pipeline view (`src/components/inventory/VehiclePipelineKanban.tsx`) for `Revisión Mecánica`, `Preparación`, `Listo para la foto`, `Publicado`, `Reservado`, `Vendido`, and `Retirado` and verify stage progression
- [x] 3.2 Build the AI vehicle intake screen (`src/components/inventory/VehicleIntakeModal.tsx`) with animated 3D Orb loading state connecting to `PadronDecoder` and `PlateScraper` and verify mock plate querying

## 4. License Plate-Linked Task Kanban

- [x] 4.1 Create the task management page and Kanban component (`src/app/app/tasks/page.tsx` and `src/components/tasks/TaskKanban.tsx`) with Pendientes, En Progreso, Por Aprobar, and Completadas columns and verify task creation
- [x] 4.2 Add vehicle plate linking, department filtering (`Documentación`, `Venta`, `Taller`, `General`), and overdue day calculations (`⚠️ Vencida hace Xd`) and verify alert indicators

## 5. Chilean Document Generator and Legal Templates

- [x] 5.1 Implement the document generator workspace (`src/app/app/documents/page.tsx` and `src/components/documents/DocumentTemplateViewer.tsx`) supporting the 7 Chilean templates (Nota de Venta, Nota de Compra, Consignación, Reservación, Cotización, Cierre de Negocio, Ficha Técnica) and verify template switching
- [x] 5.2 Build the itemized financial breakdown editor (Price, Adjustment, Gestoría, Insurance, Accessories) and integrate RUT validation and Digital Notary CUV/hash generation and verify total computations

## 6. Deal Closing and Commission Approval Drawer

- [x] 6.1 Create the `SalesApprovalDrawer` component with payment method selection, salesperson assignment, and commission calculator (Total vs Margin base, % vs $ fixed, and collaborator split) and verify calculations
- [x] 6.2 Wire approval action to mark vehicle as SOLD, update dashboard metrics, and prompt SII DTE generation and verify state updates

## 7. GAIA Smart Valuation and Social Marketing

- [x] 7.1 Implement `TasadorGAIA` conversational UI in `src/app/app/valuation/page.tsx` with natural language query parsing and "Tasar desde inventario" shortcut connected to `TradeInValuation` and verify query results
- [x] 7.2 Implement Instagram Business publisher in `src/app/app/marketing/page.tsx` with vehicle inventory picker, AI copy generator, and publication scheduling and verify feed previews

## 8. Integration and Verification

- [x] 8.1 Create comprehensive unit tests in `tests/unit/goauto-hybrid.test.ts` covering dashboard calculations, task overdue rules, commission splits, and contract totals and verify all unit tests pass
- [x] 8.2 Run full project build and test suite (`npm run build` and `npm test`) to verify zero regressions across the codebase

