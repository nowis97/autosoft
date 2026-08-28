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
      whatsapp: tenant.phone || "+56 9 8765 4321",
      email: tenant.email || null,
      city: tenant.city,
      address: tenant.address || "Av. Principal 123",
      primaryColor: tenant.whitelabel?.primaryColor || "#2563eb",
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
        vin: v.vin || null,
        priceCash: v.priceCash,
        priceFinanced: v.priceFinanced || null,
        acquisitionCost: v.acquisitionCost || null,
        status: v.status as any,
        description: v.description || "",
        features: v.features || [],
        images: v.images || [],
        publishedToWeb: v.publishedToWeb ?? true,
        publishedToMercadolibre: v.publishedToMercadolibre ?? true,
        publishedToChileautos: v.publishedToChileautos ?? true,
        publishedToYapo: v.publishedToYapo ?? true,
        daysInStock: v.daysInStock || 1,
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
