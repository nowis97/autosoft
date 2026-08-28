import { NextRequest, NextResponse } from "next/server";
import { db, pgClient, isDbConnected, tenants as tenantsTable, vehicles as vehiclesTable, leads as leadsTable } from "@/lib/db";
import { store } from "@/lib/store";

export async function GET() {
  return NextResponse.json({
    isDbConnected,
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    status: isDbConnected ? "CONNECTED" : "DISCONNECTED (Set DATABASE_URL in Vercel to activate)",
  });
}

export async function POST(req: NextRequest) {
  if (!db || !pgClient) {
    return NextResponse.json({
      success: false,
      error: "No DATABASE_URL configured in environment variables",
    }, { status: 503 });
  }

  try {
    const { action } = await req.json().catch(() => ({ action: "seed" }));

    if (action === "clear") {
      await db.delete(vehiclesTable);
      await db.delete(leadsTable);
      store.clearMockData();
      return NextResponse.json({ success: true, message: "Database tables cleared cleanly" });
    }

    // Seed/Sync current store into PostgreSQL
    const tenant = store.getTenant();
    await db.insert(tenantsTable).values({
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      rut: tenant.rut,
      phone: tenant.phone,
      email: tenant.email,
      city: tenant.city,
      address: tenant.address,
      whitelabel: tenant.whitelabel,
    }).onConflictDoNothing();

    const vehicles = store.getVehicles();
    for (const v of vehicles) {
      await db.insert(vehiclesTable).values({
        id: v.id,
        tenantId: v.tenantId || tenant.id,
        brand: v.brand,
        model: v.model,
        version: v.version,
        year: v.year,
        mileage: v.mileage,
        transmission: v.transmission as any,
        fuelType: v.fuelType as any,
        bodyType: v.bodyType as any,
        color: v.color,
        licensePlate: v.licensePlate,
        vin: v.vin,
        engineNumber: v.engineNumber,
        priceCash: v.priceCash,
        priceFinanced: v.priceFinanced,
        acquisitionCost: v.acquisitionCost,
        status: v.status as any,
        photos: v.photos || [],
        daysInStock: v.daysInStock || 1,
        syndication: v.syndication || { chileautos: false, mercadolibre: false, yapo: false },
      }).onConflictDoNothing();
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${vehicles.length} vehicles to PostgreSQL database successfully`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
