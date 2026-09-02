## Purpose

Provides an executive multidimensional dashboard partitioned into Comercial, Inventario, Vendedores, and Web views, integrating live Chilean SII F29 tax calculations, margin breakdowns, proactive alerts, and salesperson performance.

## ADDED Requirements

### Requirement: Multi-tab executive dashboard views
The system SHALL provide four selectable operational tabs on the main dashboard: Comercial, Inventario, Vendedores, and Web.

#### Scenario: Switching between views
- **WHEN** the user selects the "Inventario" tab in the dashboard
- **THEN** the system displays stock health metrics, turnover rate, and brand breakdown without reloading the page

### Requirement: Commercial KPIs and real-time profitability breakdown
The system SHALL calculate and display Total Sales, Cost of Sales, Gross Margin (with Bruto/Neto toggle), and Total Inventory Value, providing a profitability formula deducting salesperson commissions and additional reconditioning expenses.

#### Scenario: Profitability breakdown calculation
- **WHEN** a vehicle sale is recorded with acquisition cost and commission
- **THEN** the dashboard updates the Net Margin as Gross Margin minus seller commissions minus additional expenses

### Requirement: Chilean SII F29 VAT summary widget
The system SHALL summarize the current month VAT balance displaying VAT Debit (taxable sales), VAT Credit (invoiced purchases and operational expenses), and the net tax payable or fiscal credit balance (IVA a favor).

#### Scenario: Positive tax credit display
- **WHEN** VAT Credit exceeds VAT Debit for the period
- **THEN** the system displays the net balance with a negative indicator highlighting "IVA a favor"

### Requirement: Proactive smart alert and suggestion center
The system SHALL display categorized alerts for pending sale approvals, vehicles without photos, uncontacted leads, expiring vehicle paperwork, and AI-driven inventory acquisition suggestions based on brand turnover speed.

#### Scenario: Triggering buying suggestion
- **WHEN** a brand has an average turnover under 40 days and gross margin above 20%
- **THEN** the system shows an AI suggestion card recommending buying more vehicles of that brand

### Requirement: Sales team leaderboard and commission export
The system SHALL display ranked seller cards showing total sales volume, share percentage, units sold, accumulated commissions, average ticket size, and effective commission rate, allowing CSV export.

#### Scenario: Exporting commission report
- **WHEN** the manager clicks "Exportar comisiones"
- **THEN** the system generates a downloadable file with individual seller breakdowns for the selected date range
