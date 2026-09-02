## Purpose

Provides a Kanban-based dealership task management system with direct associations to Chilean vehicle plates, priority flags, department classifications, and overdue alerts.

## ADDED Requirements

### Requirement: License plate-linked task Kanban board
The system SHALL present tasks across four status columns (Pendientes, En Progreso, Por Aprobar, Completadas) allowing each task to be linked directly to a vehicle's license plate and model.

#### Scenario: Creating a plate-linked task
- **WHEN** a user creates a new task selecting vehicle "LBDC80"
- **THEN** the task card renders the vehicle thumbnail, year, model name, and license plate badge

### Requirement: Department classification and priority filtering
The system SHALL categorize tasks by operational area (Documentación, Venta, General, Taller) and priority level (Alta, Media, Baja), allowing filter by area.

#### Scenario: Filtering tasks by department
- **WHEN** the user selects "Documentación" in the area filter
- **THEN** only tasks tagged with the Documentación department are displayed

### Requirement: Overdue day calculation and warning badges
The system SHALL calculate the elapsed days past a task's due date and display a prominent warning badge when overdue.

#### Scenario: Displaying overdue warning
- **WHEN** a task's due date is 15 days in the past
- **THEN** the task card displays a red alert stating "Vencida hace 15d"
