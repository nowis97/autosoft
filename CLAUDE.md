@AGENTS.md

## Deploy Configuration (configured by /setup-deploy)
- Platform: Vercel (Hobby Tier 100% Free) + Neon/Supabase (Serverless PostgreSQL 100% Free)
- Production URL: https://autosoft360.vercel.app (o tu dominio .cl personalizado)
- Deploy trigger: Automatic on push to `main` via Vercel GitHub integration
- Deploy status command: Poll production URL /manifest.webmanifest
- Merge method: squash
- Project type: Web Application / SaaS Multi-Tenant (Next.js 16 + TypeScript)
- Post-deploy health check: https://autosoft360.vercel.app/manifest.webmanifest

### Environment Variables required in Vercel Dashboard (Free Tier)
1. `DATABASE_URL` = postgres://... (PostgreSQL Serverless de Neon.tech o Supabase.com - 100% Gratis)
2. `WHATSAPP_VERIFY_TOKEN` = autosoft-whatsapp-token-2026
3. `WHATSAPP_APP_SECRET` = (App Secret de Meta for Developers)
4. `NEXT_PUBLIC_APP_URL` = https://autosoft360.vercel.app

### Step-by-Step 100% Free Deployment Instructions:
1. **Paso 1 (Base de Datos Gratis en 1 min):** Entra a [neon.tech](https://neon.tech) o [supabase.com](https://supabase.com), crea una base de datos PostgreSQL gratuita y copia el `Connection string` (DATABASE_URL).
2. **Paso 2 (Despliegue en Vercel Gratis):** Entra a [vercel.com](https://vercel.com), haz clic en "Add New Project", importa este repositorio de GitHub y en "Environment Variables" pega tu `DATABASE_URL`.
3. **Paso 3:** Haz clic en **Deploy**. ¡Tu SaaS automotriz chileno estará en vivo con SSL y CDN global a \$0 de costo!
