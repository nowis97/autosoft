import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import crypto from "crypto";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN || "autosoft-whatsapp-token-2026";

  if (mode === "subscribe" && token && token === expectedToken) {
    return new Response(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Unauthorized verification token" }, { status: 403 });
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();

    // Verify Meta HMAC-SHA256 signature if app secret is configured
    const appSecret = process.env.WHATSAPP_APP_SECRET;
    const signatureHeader = request.headers.get("x-hub-signature-256");

    if (appSecret && signatureHeader) {
      const computedHash = "sha256=" + crypto.createHmac("sha256", appSecret).update(rawBody).digest("hex");
      const isValid =
        signatureHeader.length === computedHash.length &&
        crypto.timingSafeEqual(Buffer.from(signatureHeader), Buffer.from(computedHash));

      if (!isValid) {
        return NextResponse.json({ error: "Invalid X-Hub-Signature-256 signature" }, { status: 401 });
      }
    }

    const body = rawBody ? JSON.parse(rawBody) : {};
    const vehicles = store.getVehicles().filter((v) => v.status === "AVAILABLE");

    // Process incoming message
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (message) {
      const fromPhone = message.from;
      const textBody = message.text?.body || "";

      // Auto-create lead in CRM if new phone number
      const existingLeads = store.getLeads();
      const exists = existingLeads.find((l) => l.phone.includes(fromPhone));

      if (!exists) {
        store.createLead({
          tenantId: "tenant-oriente-1",
          name: `Lead WhatsApp (${fromPhone})`,
          phone: `+${fromPhone}`,
          channel: "WHATSAPP",
          status: "NEW",
          notes: `Mensaje entrante automático: "${textBody}"`,
          aiLeadScore: 78,
          aiTemperature: "WARM",
          aiSummary: "Prospecto captado automáticamente por Webhook de WhatsApp.",
        });
      }
    }

    return NextResponse.json({ status: "received", availableVehiclesCount: vehicles.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
