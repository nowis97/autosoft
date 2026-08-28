# Changelog - Autosoft 360

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-08-28

### Added
- **DMS Core & Chilean Automotive Localization**:
  - Chilean License Plate validation algorithm (`BB·CL·12` new format & `AB·12·34` old format).
  - Chilean RUT validation with Módulo 11 check digit verification.
  - Multi-tenant PostgreSQL database schema with Drizzle ORM.
  - Valuation & Pricing Engine with days-in-stock depreciation curves.
- **Multichannel Portal Syndication**:
  - XML Autogate Feed generation for Chileautos (`/api/feeds/chileautos/[token]`).
  - Mercado Libre Chile REST API sync engine with auto-pause on sale.
  - Yapo.cl integration.
- **F&I Auto Loan Scoring & Pre-Approval**:
  - Automotive loan scoring for Chilean financial partners (Forum, Tanner, Santander Consumer, Eurocapital).
  - Official Pre-Approval Certificate generation with printable summary and QR code.
- **Notaría Online & Mandatos Electrónicos (Ley 19.799)**:
  - Digital Transfer Mandate generator under Chilean Civil Code Art. 2116.
  - CUV (Código Único de Verificación) and SHA-256 cryptographic document seal.
  - Direct 1-click WhatsApp/SMS signature request links.
- **Asistente Formulario F29 del SII (Ley 21.420)**:
  - Automated calculation of IVA exclusively over gross used car margin (Códigos 502, 503, 511, 538, 151, 152, 91).
  - Export to CSV compatible with Chilean accounting systems (Nubox, Defontana, Laudus, Excel).
- **PWA Mobile Yard Inspection Mode**:
  - Web App Manifest (`/manifest.webmanifest`) with high-resolution app icons.
  - 1-touch tactile check-in interface for yard mechanics with rear camera capture (`capture="environment"`).
  - Repair cost estimation in CLP by damage type and severity.
- **24/7 AI WhatsApp Copilot & Voice Note Simulator**:
  - Real-time conversational AI connected to live inventory.
  - Automatic down payment detection and monthly payment calculation.
  - Audio voice note simulator with realistic Chilean automotive transcription.
- **B2B Wholesale Auction Marketplace**:
  - Inter-dealership wholesale marketplace with automated 1.5% dealer fee calculation.
- **Security Hardening (CSO Mode)**:
  - Meta WhatsApp Webhook HMAC-SHA256 signature verification (`X-Hub-Signature-256`).
  - Deny-by-default access control for XML syndication feeds.
- **100% Free Tier Deployment Architecture**:
  - Vercel Next.js 16 configuration (`vercel.json`).
  - GitHub Actions automated CI test pipeline (`.github/workflows/ci.yml`).
  - 80/80 Unit tests passing in Vitest, 8/8 E2E browser tests passing in Playwright.
