import { NextRequest, NextResponse } from "next/server";
import { scrapeChileanVehiclePlate } from "@/lib/chilean-utils/plate-scraper";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ plate: string }> }
) {
  try {
    const { plate } = await params;
    if (!plate) {
      return NextResponse.json({ error: "Parámetro 'plate' requerido" }, { status: 400 });
    }

    const result = await scrapeChileanVehiclePlate(plate);
    return NextResponse.json({
      success: true,
      vehicle: result,
      cached: false,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Error al consultar patente" },
      { status: 400 }
    );
  }
}
