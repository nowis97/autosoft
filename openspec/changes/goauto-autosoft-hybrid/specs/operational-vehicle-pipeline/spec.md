## Purpose

Provides a 7-stage operational Kanban pipeline for inventory preparation and an AI-assisted rapid intake workflow utilizing license plate scanning and padrón decoding.

## ADDED Requirements

### Requirement: Seven-stage vehicle preparation Kanban pipeline
The system SHALL organize vehicles across seven sequential operational stages: Revisión Mecánica, Preparación, Listo para la foto, Publicado, Reservado, Vendido, and Retirado.

#### Scenario: Advancing vehicle stage
- **WHEN** a vehicle completes detailing and mechanical inspection
- **THEN** the user can drag or update the vehicle to the "Listo para la foto" column

### Requirement: Preparation progress indicator
The system SHALL display an actionable progress percentage bar on vehicle cards during the "Preparación" stage based on completed service order checklist items.

#### Scenario: Visualizing reconditioning progress
- **WHEN** 1 of 5 scheduled workshop repairs is completed
- **THEN** the vehicle card displays a 20% progress indicator

### Requirement: AI license plate intake screen
The system SHALL provide an animated intake loading state ("Analizando con IA") that queries Chilean vehicle registries and AutoSoft scraping engines by license plate.

#### Scenario: Automatic vehicle data auto-fill
- **WHEN** the user inputs a Chilean license plate into the intake modal
- **THEN** the system fetches brand, model, year, VIN, engine number, and estimated appraisal before opening the vehicle form
