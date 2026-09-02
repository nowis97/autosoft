## Purpose

Provides a conversational vehicle valuation interface ("Tasador GAIA") with natural language parsing, instant stock appraisal, and integration with Chilean automotive market scrapers.

## ADDED Requirements

### Requirement: Natural language valuation prompt input
The system SHALL parse unstructured valuation queries (e.g., "Toyota Corolla 2020 con 45.000") and extract brand, model, year, and mileage.

#### Scenario: Submitting natural language valuation
- **WHEN** the user types "Toyota Corolla 2020 con 45.000" and presses enter
- **THEN** the system parses the inputs and triggers market valuation algorithms

### Requirement: Quick appraisal from active inventory
The system SHALL provide a "Tasar desde inventario" shortcut allowing instant valuation of any vehicle currently in the dealership's stock.

#### Scenario: Appraising in-stock vehicle
- **WHEN** the user selects a vehicle from the inventory stock picker
- **THEN** GAIA calculates market range, quick offer, recommended offer, and estimated profit

### Requirement: Chilean market portal cross-referencing
The system SHALL cross-reference market price listings from Chileautos, Yapo, and Mercado Libre with Chilean tax appraisal tables to estimate resale margins.

#### Scenario: Displaying market comparative range
- **WHEN** a valuation calculation completes
- **THEN** the system displays the lower, average, and higher market price bounds alongside historical valuation records
