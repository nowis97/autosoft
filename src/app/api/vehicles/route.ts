import { NextRequest, NextResponse } from "next/server";
import { db, vehicles as vehiclesTable, tenants as tenantsTable } from "@/lib/db";
import { store } from "@/lib/store";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tenantSlug = searchParams.get("tenant") || "auto-oriente";

  if (db) {
    try {
      const dbVehicles = await db.select().from(vehiclesTable);
      if (dbVehicles && dbVehicles.length > 0) {
        return NextResponse.json({ source: "postgresql", vehicles: dbVehicles });
      }
    } catch (err) {
      console.warn("PostgreSQL read failed, falling back to store", err);
    }
  }

  const vehicles = store.getVehicles();
  return NextResponse.json({ source: "memory", vehicles });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Save in in-memory store
    const created = store.createVehicle(body);

    // 2. Persist in PostgreSQL if connected
    if (db) {
      try {
        await db.insert(vehiclesTable).values({
          id: created.id,
          tenantId: created.tenantId || "tenant-oriente-1",
          brand: created.brand,
          model: created.model,
          version: created.version,
          year: created.year,
          mileage: created.mileage,
          transmission: created.transmission as any,
          fuelType: created.fuelType as any,
          bodyType: created.bodyType as any,
          color: created.color,
          licensePlate: created.licensePlate,
          vin: created.vin,
          engineNumber: created.engineNumber,
          priceCash: created.priceCash,
          priceFinanced: created.priceFinanced,
          acquisitionCost: created.acquisitionCost,
          status: created.status as any,
          photos: created.photos || [],
          daysInStock: created.daysInStock || 1,
          syndication: created.syndication || { chileautos: false, mercadolibre: false, yapo: false },
        });
      } catch (dbErr) {
        console.error("Error inserting vehicle into PostgreSQL", dbErr);
      }
    }

    return NextResponse.json({ success: true, vehicle: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create vehicle" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const clearAll = searchParams.get("clearAll") === "true";

    if (clearAll) {
      store.clearMockData();
      if (db) {
        try {
          await db.delete(vehiclesTable);
        } catch (dbErr) {
          console.error("Error clearing vehicles in PostgreSQL", dbErr);
        }
      }
      return NextResponse.json({ success: true, message: "Catalog cleared successfully" });
    }

    if (id) {
      store.deleteVehicle(id);
      if (db) {
        try {
          await db.delete(vehiclesTable).where(eq(vehiclesTable.id, id));
        } catch (dbErr) {
          console.error("Error deleting vehicle in PostgreSQL", dbErr);
        }
      }
      return NextResponse.json({ success: true, message: "Vehicle deleted successfully" });
    }

    return NextResponse.json({ error: "Missing id or clearAll parameter" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
