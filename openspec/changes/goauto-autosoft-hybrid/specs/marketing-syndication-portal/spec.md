## Purpose

Provides a visual vehicle selector and workflow for creating and scheduling Instagram Business posts as well as managing multi-portal automotive syndication.

## ADDED Requirements

### Requirement: Instagram Business vehicle selector
The system SHALL display an interactive gallery of vehicles from inventory with publication status filters for generating Instagram marketing content.

#### Scenario: Selecting a vehicle for social post
- **WHEN** the user selects a published vehicle card
- **THEN** the system loads the vehicle imagery, specifications, and opens the social media post composer

### Requirement: AI caption generator for social media
The system SHALL generate formatted Instagram captions including emojis, key equipment features, price, and dealership contact details.

#### Scenario: Generating Instagram caption
- **WHEN** the user clicks "Generar copy con IA"
- **THEN** the system generates an engaging caption tailored for Chilean automotive buyers

### Requirement: Multi-portal syndication management
The system SHALL provide management screens for connecting and checking synchronization status for ChileAutos, Mercado Libre, and custom dealership web domains.

#### Scenario: Monitoring sync health
- **WHEN** the user navigates to the marketing syndication hub
- **THEN** the system displays live connection status and pending feeds for each external portal
