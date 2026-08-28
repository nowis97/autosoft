import React from "react";
import { store } from "@/lib/store";
import { StorefrontHeader } from "@/components/site/StorefrontHeader";
import { StorefrontFooter } from "@/components/site/StorefrontFooter";
import { WhatsAppFloatingButton } from "@/components/shared/WhatsAppFloatingButton";

export default async function StorefrontLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = await params;
  const tenant = store.getTenant(tenantSlug);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <StorefrontHeader tenant={tenant} />
        <main>{children}</main>
      </div>

      <WhatsAppFloatingButton phone={tenant.whatsapp} />
      <StorefrontFooter tenant={tenant} />
    </div>
  );
}
