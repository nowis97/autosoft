import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const tenant = store.getTenant();

  // Strict deny-by-default token authorization
  if (!tenant.chileautosToken || token !== tenant.chileautosToken) {
    return new NextResponse("Unauthorized Feed Token", { status: 401 });
  }

  const vehicles = store.getVehicles().filter((v) => v.publishedToChileautos && v.status === "AVAILABLE");

  const xmlVehicles = vehicles
    .map((v) => {
      const imagesXml = (v.images || [])
        .map((img, i) => `        <Photo order="${i + 1}">${img}</Photo>`)
        .join("\n");

      return `
    <Vehicle>
      <StockNumber>${v.id}</StockNumber>
      <Registration>${v.licensePlate}</Registration>
      <Make>${v.brand}</Make>
      <Model>${v.model}</Model>
      <Badge>${v.version}</Badge>
      <Year>${v.year}</Year>
      <Odometer>${v.mileage}</Odometer>
      <Price>${v.priceCash}</Price>
      <PriceFinanced>${v.priceFinanced || v.priceCash}</PriceFinanced>
      <BodyType>${v.bodyType}</BodyType>
      <Transmission>${v.transmission}</Transmission>
      <FuelType>${v.fuelType}</FuelType>
      <Colour>${v.color}</Colour>
      <Description><![CDATA[${v.description}]]></Description>
      <Features>
        ${(v.features || []).map((f) => `<Feature>${f}</Feature>`).join("\n        ")}
      </Features>
      <Photos>
${imagesXml}
      </Photos>
    </Vehicle>`;
    })
    .join("\n");

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<AutogateInventory version="2.0">
  <Dealer>
    <Name>${tenant.name}</Name>
    <RUT>${tenant.rut}</RUT>
    <Phone>${tenant.phone}</Phone>
    <Email>${tenant.email}</Email>
    <GeneratedAt>${new Date().toISOString()}</GeneratedAt>
    <TotalVehicles>${vehicles.length}</TotalVehicles>
  </Dealer>
  <Vehicles>
${xmlVehicles}
  </Vehicles>
</AutogateInventory>`;

  return new NextResponse(xmlContent, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
