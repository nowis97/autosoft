# Autosoft - Backlog de Tareas & Roadmap (TODOS)

Este archivo registra las funcionalidades y mejoras planificadas para fases posteriores, manteniendo el MVP enfocado y libre de sobreingeniería prematura.

---

## Fase 2: Monetización F&I & Analítica Avanzada

### TODO-201: Integración API con Entidades de Crédito Automotriz (Forum, Tanner, Santander, Autofin)
* **Qué:** Integrar endpoints oficiales de evaluación crediticia para respuesta de pre-aprobación en tiempo real.
* **Por qué:** Reducir el tiempo de aprobación de crédito de horas a minutos y automatizar el cobro de comisiones de intermediación para la automotora.
* **Contexto:** En la Fase 1 se utiliza derivación estandarizada por dossier/webhook a ejecutivos asignados. En la Fase 2 se conectarán APIs REST directas conforme se firmen los convenios B2B.
* **Depende de:** Volumen transaccional inicial y acuerdos comerciales firmados.

### TODO-202: Dashboard de Analítica Predictiva y Días en Stock (DSI)
* **Qué:** Algoritmo de sugerencia de ajuste de precios según días en stock y precios del mercado en Chileautos/MercadoLibre.
* **Por qué:** Alertar al dueño cuando un vehículo supera los 45 días sin venderse para proteger el capital de trabajo.

---

## Fase 3: Ecosistema Transaccional & Aftermarket

### TODO-301: Transferencias Notariales Digitales
* **Qué:** Integración con partners como Autofact / Certinet para inicio y firma electrónica de contratos de compraventa y transferencia vehicular ante Registro Civil.
* **Por qué:** Eliminar las visitas presenciales a notaría y centralizar el estado de la transferencia en el panel.

### TODO-302: Cotizador y Emisión de Seguros Automotrices Embebido
* **Qué:** Integración con corredoras de seguros para emitir pólizas al momento de la entrega del vehículo y liquidar comisión a la automotora.

### TODO-303: Módulo de TAG y GPS / Corta Corriente
* **Qué:** Solicitud de despacho de TAG y agendamiento de instalación de GPS / corta corriente requerido por aseguradoras.
