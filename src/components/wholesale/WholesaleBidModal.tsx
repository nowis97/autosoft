import React, { useState } from "react";
import { WholesaleListing } from "@/types";
import { calculateWholesaleSettlement } from "@/lib/wholesale/wholesale-calculator";
import { formatCLP } from "@/lib/chilean-utils/financing";
import { Button } from "@/components/ui/button";
import { Gavel, X, Check, ShieldCheck, ArrowRight } from "lucide-react";

interface WholesaleBidModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: WholesaleListing;
  onPlaceBid: (listingId: string, amountCLP: number) => void;
}

export function WholesaleBidModal({
  isOpen,
  onClose,
  listing,
  onPlaceBid,
}: WholesaleBidModalProps) {
  const minBid = (listing.currentHighestBidCLP || listing.startingPriceCLP) + 100000;
  const [bidAmount, setBidAmount] = useState(minBid);

  if (!isOpen) return null;

  const settlement = calculateWholesaleSettlement(bidAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPlaceBid(listing.id, bidAmount);
    onClose();
  };

  const handleBuyNow = () => {
    onPlaceBid(listing.id, listing.buyNowPriceCLP);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center font-bold text-sm">
              <Gavel className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-sm">Pujar en Subasta Wholesale B2B</div>
              <div className="text-[11px] text-slate-400">Intercambio inter-automotoras verificado</div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Vehicle Info */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="font-bold text-slate-900 text-sm">
              {listing.brand} {listing.model} ({listing.year})
            </div>
            <div className="text-slate-500 text-[11px] font-mono mt-0.5">
              Patente: <strong>{listing.licensePlate}</strong> • {listing.mileage.toLocaleString("es-CL")} km • Vendedor: {listing.sellerTenantName}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                ✓ Inspección: {listing.inspectionScore}/100 pts
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                ⏱ {listing.daysInStock} días DSI
              </span>
            </div>
          </div>

          {/* Current Bidding Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Puja Más Alta Actual</div>
              <div className="text-base font-black text-slate-900 mt-0.5">
                {formatCLP(listing.currentHighestBidCLP || listing.startingPriceCLP)}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {listing.highestBidderTenantName || "Sin pujas aún"}
              </div>
            </div>

            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
              <div className="text-[10px] font-bold text-purple-600 uppercase">Compra Inmediata</div>
              <div className="text-base font-black text-purple-950 mt-0.5">
                {formatCLP(listing.buyNowPriceCLP)}
              </div>
              <div className="text-[10px] text-purple-700">Cierre garantizado</div>
            </div>
          </div>

          {/* Bid Input */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Tu Monto de Oferta (Mínimo: {formatCLP(minBid)})
            </label>
            <input
              type="number"
              min={minBid}
              step={50000}
              value={bidAmount}
              onChange={(e) => setBidAmount(parseInt(e.target.value, 10))}
              className="w-full h-10 px-3 border border-slate-200 rounded-lg text-base font-black text-slate-900 font-mono"
            />
          </div>

          {/* Settlement Breakdown (Fee 1.5%) */}
          <div className="p-3.5 bg-slate-900 text-white rounded-xl space-y-1.5">
            <div className="flex justify-between text-slate-300 text-[11px]">
              <span>Precio Wholesale Ofertado:</span>
              <span className="font-mono">{formatCLP(settlement.wholesalePriceCLP)}</span>
            </div>
            <div className="flex justify-between text-purple-400 text-[11px]">
              <span>Fee Plataforma B2B (1.5%):</span>
              <span className="font-mono">+{formatCLP(settlement.platformFeeCLP)}</span>
            </div>
            <div className="pt-1.5 border-t border-slate-800 flex justify-between font-black text-xs text-white">
              <span>Total a Pagar por el Comprador:</span>
              <span className="text-emerald-400 font-mono">{formatCLP(settlement.totalBuyerPaysCLP)}</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleBuyNow}
              className="text-xs font-bold text-purple-700 border-purple-300 hover:bg-purple-50"
            >
              Comprar Ya ({formatCLP(listing.buyNowPriceCLP)})
            </Button>

            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
                Cancelar
              </Button>
              <Button type="submit" size="sm" className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white">
                Confirmar Puja
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
