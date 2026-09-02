## Purpose

Provides a deal closure and approval drawer for dealership managers with a flexible sales commission engine and automatic SII tax document triggering.

## ADDED Requirements

### Requirement: Sale approval modal drawer
The system SHALL provide an approval drawer displaying vehicle details, buyer name, sale price, payment method, assigned salesperson, and commission calculation options.

#### Scenario: Opening sale approval
- **WHEN** a manager clicks on a pending sale alert or sale record
- **THEN** the approval drawer opens with pre-populated vehicle and buyer information

### Requirement: Commission calculation engine
The system SHALL support calculating seller commissions based on either Total Sale Price or Gross Margin, selectable as percentage (%) or fixed Chilean peso amount ($).

#### Scenario: Calculating commission on gross margin
- **WHEN** a manager selects "Margen" base with a 10% commission on a vehicle having $2.000.000 margin
- **THEN** the calculated commission amount displays as $200.000

### Requirement: Multi-collaborator commission split
The system SHALL provide an option to split the calculated commission among multiple salespeople or collaborators.

#### Scenario: Splitting commission equally
- **WHEN** commission splitting is enabled across two sales agents
- **THEN** the system distributes the commission equally and logs each rep's share

### Requirement: DTE and inventory state update on approval
The system SHALL transition the vehicle status to "SOLD", log the sale in accounting, update the sellers leaderboard, and offer immediate DTE (Factura/Boleta) issuance.

#### Scenario: Approving sale
- **WHEN** the manager clicks "Aprobar"
- **THEN** the vehicle moves to SOLD status and the dashboard commercial revenue updates immediately
