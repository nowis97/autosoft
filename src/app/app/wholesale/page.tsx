"use client";

import React, { useState } from "react";
import { store } from "@/lib/store";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { WholesaleBidModal } from "@/components/wholesale/WholesaleBidModal";
import { WholesaleListing } from "@/types";
import { formatCLP } from "@/lib/chilean-utils/financing";
import { Button } from "@/components/ui/button";
import { Gavel, Plus, ShieldCheck, Clock, CheckCircle2, Building2, TrendingDown } from "lucide-react";

export default function WholesalePage() {
  const tenant = store.getTenant();
  const vehicles = store.getVehicles();
  const [listings, setListings] = useState(store.getWholesaleListings());
  const [selectedListing, setSelectedListing] = useState<WholesaleListing | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handlePlaceBid = (listingId: string, amountCLP: number) => {
    store.placeWholesaleBid(listingId, tenant.id, tenant.name, amountCLP);
    setListings([...store.getWholesaleListings()]);
    setSuccessMessage(`¡Puja de ${formatCLP(amountCLP)} registrada exitosamente en la Red Wholesale B2B!`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleCreateFastWholesaleListing = () => {
    const slowVehicle = vehicles.find((v) => v.daysInStock && v.daysInStock > 30) || vehicles[0];
    if (slowVehicle) {
      store.createWholesaleListing({
        sellerTenantId: tenant.id,
        sellerTenantName: tenant.name,
        vehicleId: slowVehicle.id,
        brand: slowVehicle.brand,
        model: slowVehicle.model,
        year: slowVehicle.year,
        mileage: slowVehicle.mileage,
        licensePlate: slowVehicle.licensePlate,
        daysInStock: slowVehicle.daysInStock || 45,
        inspectionScore: 90,
        startingPriceCLP: Math.round(slowVehicle.priceCash * 0.78),
        buyNowPriceCLP: Math.round(slowVehicle.priceCash * 0.84),
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      });
      setListings([...store.getWholesaleListings()]);
      setSuccessMessage(`¡Vehículo ${slowVehicle.brand} ${slowVehicle.model} publicado a precio Wholesale en la red inter-dealer!`);
      setTimeout(() => setSuccessMessage(null), 4000);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Red de Subastas & Wholesale B2B Inter-Concesionarios"
        subtitle="Mercado privado para liquidar stock de rotación lenta (>45 días DSI) y comprar lotes a colegas con fee de 1.5%"
      />

      <main className="p-6 max-w-7xl w-full space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Subastas Activas en Red</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{listings.filter((l) => l.status === "OPEN").length}</div>
            <div className="text-xs text-slate-400 mt-1">Concesionarios verificados</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Fee de Intercambio B2B</div>
            <div className="text-2xl font-black text-purple-600 mt-1">1.5%</div>
            <div className="text-xs text-purple-600 font-semibold mt-1">Sobre valor de adjudicación</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Descuento Promedio Wholesale</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">-18%</div>
            <div className="text-xs text-emerald-600 font-semibold mt-1">vs Precio a público</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Garantía Técnica</div>
            <div className="text-2xl font-black text-blue-600 mt-1">100%</div>
            <div className="text-xs text-blue-500 font-semibold mt-1">Checklist 50 Pts certificado</div>
          </div>
        </div>

        {/* Action Header */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Gavel className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-bold uppercase">Mercado B2B Mayorista</div>
              <div className="font-extrabold text-slate-900 text-sm">
                Red Inter-Automotoras Santiago & Regiones
              </div>
            </div>
          </div>

          <Button
            onClick={handleCreateFastWholesaleListing}
            className="font-bold text-xs gap-1.5 shadow-sm bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Plus className="w-4 h-4" />
            <span>Liquidar Auto Lento a Wholesale</span>
          </Button>
        </div>

        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {listings.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4 hover:border-purple-300 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-purple-600 uppercase bg-purple-50 px-2 py-0.5 rounded-md">
                    {item.sellerTenantName}
                  </span>
                  <h3 className="text-base font-black text-slate-900 mt-1">
                    {item.brand} {item.model} ({item.year})
                  </h3>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    Patente: <strong>{item.licensePlate}</strong> • {item.mileage.toLocaleString("es-CL")} km
                  </div>
                </div>

                <div className="text-right">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    item.status === "OPEN" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                  }`}>
                    {item.status === "OPEN" ? "Subasta Abierta" : "Adjudicado"}
                  </span>
                  <div className="text-[10px] text-slate-400 flex items-center justify-end gap-1 mt-1 font-semibold">
                    <Clock className="w-3 h-3" />
                    <span>Cierra en 3 días</span>
                  </div>
                </div>
              </div>

              {/* Price Row */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Puja Actual</div>
                  <div className="text-base font-black text-slate-900 mt-0.5">
                    {formatCLP(item.currentHighestBidCLP || item.startingPriceCLP)}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    Por: {item.highestBidderTenantName || "Sin ofertas"}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-purple-600 uppercase">Compra Directa</div>
                  <div className="text-base font-black text-purple-950 mt-0.5">
                    {formatCLP(item.buyNowPriceCLP)}
                  </div>
                  <div className="text-[10px] text-purple-700">Adjudicación inmediata</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                    ✓ Score: {item.inspectionScore}/100
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold">
                    ⏱ {item.daysInStock} días DSI
                  </span>
                </div>

                <Button
                  size="sm"
                  onClick={() => setSelectedListing(item)}
                  className="text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white gap-1.5"
                >
                  <Gavel className="w-3.5 h-3.5" />
                  <span>Pujar / Comprar</span>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {selectedListing && (
          <WholesaleBidModal
            isOpen={true}
            onClose={() => setSelectedListing(null)}
            listing={selectedListing}
            onPlaceBid={handlePlaceBid}
          />
        )}
      </main>
    </div>
  );
}
