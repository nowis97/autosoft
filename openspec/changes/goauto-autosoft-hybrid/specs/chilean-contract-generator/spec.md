## Purpose

Provides an interactive document generator supporting 7 standardized Chilean automotive contract templates with financial itemization, RUT validation, and digital notary integration.

## ADDED Requirements

### Requirement: Seven standardized automotive contract templates
The system SHALL provide template generation and editing for: Nota de Venta, Nota de Compra, Consignación, Reservación, Cotización, Cierre de Negocio, and Ficha Técnica.

#### Scenario: Switching document templates
- **WHEN** the user selects "Nota de Compra" from the template bar
- **THEN** the preview dynamically updates structure, clauses, and fields relevant to vehicle purchasing

### Requirement: Itemized financial breakdown
The system SHALL support dynamic line items for Base Published Price, Price Adjustment (-), Gestoría (+), Additional Insurance (+), and Accessories (+), computing the final total.

#### Scenario: Computing contract total with adjustments
- **WHEN** a vehicle price is $16.000.000 with -$1.000.000 discount and +$50.000 gestoría
- **THEN** the document reflects a total payable sum of $15.050.000

### Requirement: Chilean RUT and legal clause validation
The system SHALL validate buyer and dealership RUT numbers with modulo 11 checksums and embed standard Chilean legal warranty, delivery, and encumbrance clauses.

#### Scenario: Entering invalid RUT
- **WHEN** an invalid Chilean RUT format is entered into the client details
- **THEN** the system prevents document issuance and highlights the input error

### Requirement: Digital notary integration
The system SHALL allow sending generated documents to the AutoSoft digital notary engine to generate SHA-256 validation hashes and CUV verification codes.

#### Scenario: Generating notarized document
- **WHEN** the user clicks to notarize a finalized Nota de Venta
- **THEN** the system generates a unique verification hash and embeds signature placeholders
