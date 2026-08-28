"use client";

import React, { useState } from "react";
import Link from "next/link";
import { store } from "@/lib/store";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink, CheckCircle2 } from "lucide-react";

export default function WebsiteSettingsPage() {
  const [tenant, setTenant] = useState(store.getTenant());
  const [name, setName] = useState(tenant.name);
  const [slug, setSlug] = useState(tenant.slug);
  const [customDomain, setCustomDomain] = useState(tenant.customDomain || "");
  const [tagline, setTagline] = useState(tenant.tagline || "");
  const [phone, setPhone] = useState(tenant.phone);
  const [whatsapp, setWhatsapp] = useState(tenant.whatsapp);
  const [address, setAddress] = useState(tenant.address);
  const [city, setCity] = useState(tenant.city);
  const [primaryColor, setPrimaryColor] = useState(tenant.primaryColor || "#2563EB");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = store.updateTenant({
      name,
      slug,
      customDomain: customDomain || undefined,
      tagline,
      phone,
      whatsapp,
      address,
      city,
      primaryColor,
    });
    setTenant(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const publicUrl = `/site/${tenant.slug}`;

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Mi Sitio Web Público"
        subtitle="Personaliza el diseño, colores, dominio e información de contacto de tu portal"
      />

      <main className="p-6 max-w-4xl w-full space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider">
              Tu Catálogo está en línea
            </span>
            <h2 className="text-xl font-extrabold">{tenant.name}</h2>
            <p className="text-xs text-blue-100">
              Accede a tu web en: <strong className="underline">autosoft.cl/site/{tenant.slug}</strong>
              {tenant.customDomain && ` o ${tenant.customDomain}`}
            </p>
          </div>

          <Link href={publicUrl} target="_blank">
            <Button variant="secondary" className="font-bold gap-1.5 shadow-sm text-xs">
              <span>Abrir Sitio Público</span>
              <ExternalLink className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {saved && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Configuración de tu sitio web actualizada y publicada en tiempo real.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
              1. Dominio y Dirección Web
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="slug">Subdominio Autosoft</Label>
                <div className="flex items-center mt-1">
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                    className="rounded-r-none font-mono"
                  />
                  <span className="h-10 px-3 bg-slate-100 border border-l-0 border-slate-200 rounded-r-lg text-xs text-slate-500 font-mono flex items-center">
                    .autosoft.cl
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="customDomain">Dominio Personalizado (Opcional)</Label>
                <Input
                  id="customDomain"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="www.automotoraoriente.cl"
                  className="font-mono mt-1"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Apunta el registro CNAME a <code className="bg-slate-100 px-1 py-0.5 rounded">cname.autosoft.cl</code>
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
              2. Branding y Personalización Visual
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nombre Comercial de la Automotora</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="color">Color de Acento de la Marca</Label>
                <div className="flex items-center gap-3 mt-1">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 p-1"
                  />
                  <Input
                    id="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="tagline">Eslogan / Frase Destacada</Label>
              <Input
                id="tagline"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Seminuevos garantizados y financiamiento a tu medida"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
              3. Datos de Contacto y Ubicación (Footer & WhatsApp)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Teléfono de Contacto</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="whatsapp">Número de WhatsApp (con código +56)</Label>
                <Input
                  id="whatsapp"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">Dirección de la Sucursal</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="city">Comuna / Ciudad</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="font-bold px-8 shadow-md">
              Guardar Cambios y Actualizar Web
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
