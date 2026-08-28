import { NextRequest, NextResponse } from "next/server";
import { db, tenants as tenantsTable } from "@/lib/db";
import { store } from "@/lib/store";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (db && slug) {
    try {
      const dbTenants = await db.select().from(tenantsTable).where(eq(tenantsTable.slug, slug));
      if (dbTenants.length > 0) {
        return NextResponse.json({ source: "postgresql", tenant: dbTenants[0] });
      }
    } catch (err) {
      console.warn("PostgreSQL tenant query failed", err);
    }
  }

  const tenant = store.getTenant(slug || undefined);
  return NextResponse.json({ source: "memory", tenant });
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = store.updateTenant(body);

    if (db) {
      try {
        await db.insert(tenantsTable).values({
          id: updated.id,
          name: updated.name,
          slug: updated.slug,
          rut: updated.rut,
          phone: updated.phone,
          email: updated.email,
          city: updated.city,
          address: updated.address,
          whitelabel: updated.whitelabel,
        }).onConflictDoUpdate({
          target: tenantsTable.id,
          set: {
            name: updated.name,
            slug: updated.slug,
            rut: updated.rut,
            phone: updated.phone,
            email: updated.email,
            city: updated.city,
            address: updated.address,
            whitelabel: updated.whitelabel,
          },
        });
      } catch (dbErr) {
        console.error("Error upserting tenant in PostgreSQL", dbErr);
      }
    }

    return NextResponse.json({ success: true, tenant: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
