import React from "react";
import { Tenant } from "@/types";
import { ValuationResult } from "@/lib/chilean-utils/valuation";
import { formatCLP } from "@/lib/chilean-utils/financing";
import { LicensePlateBadge } from "@/components/shared/LicensePlateBadge";
import { Button } from "@/components/ui/button";
import { Printer, MessageCircle, X, CheckCircle2, Building2 } from "lucide-react";

interface TradeInProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant;
  licensePlate: string;
  brand: string;
  model: string;
  version: string;
  year: number;
  mileage: number;
  clientName?: string;
  clientPhone?: string;
  result: ValuationResult;
}

export function TradeInProposalModal({
  isOpen,
  onClose,
  tenant,
  licensePlate,
  brand,
  model,
  version,
  year,
  mileage,
  clientName,
  clientPhone,
  result,
}: TradeInProposalModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Hola ${clientName || "estimado/a"}, adjuntamos la propuesta de tasación oficial de tu ${brand} ${model} (${year}) en ${tenant.name}:\n\n` +
      `• Valor Comercial de Mercado: ${formatCLP(result.estimatedMarketPrice)}\n` +
      `• Oferta de Retoma en Parte de Pago: ${formatCLP(result.recommendedOffer)}\n` +
      `• Vigencia: 5 días hábiles.\n\n` +
      `¿Coordinamos la revisión física y firma en nuestra sucursal?`
    );
    window.open(`https://wa.me/${clientPhone?.replace(/[^0-9]/g, "")}?text=${text}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-black text-sm">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-sm">Propuesta Comercial de Retoma</div>
              <div className="text-[11px] text-slate-400">{tenant.name} • RUT: {tenant.rut}</div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-slate-800">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-semibold">CLIENTE SOLICITANTE</div>
              <div className="font-bold text-base text-slate-900">{clientName || "Cliente Particular"}</div>
              <div className="text-xs text-slate-500">{clientPhone || "Teléfono no registrado"}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400 font-semibold">FECHA DE EMISIÓN</div>
              <div className="font-bold text-xs text-slate-900">{new Date().toLocaleDateString("es-CL")}</div>
              <div className="text-[10px] text-emerald-600 font-semibold">Válida por 5 días</div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 font-semibold">VEHÍCULO A RECIBIR</div>
              <div className="font-black text-base text-slate-900">{brand} {model} {version} ({year})</div>
              <div className="text-xs text-slate-500">Kilometraje: {mileage.toLocaleString("es-CL")} km</div>
            </div>
            <LicensePlateBadge plate={licensePlate} size="md" />
          </div>

          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Desglose Técnico y Oferta Final
            </div>
            <div className="space-y-2 text-xs divide-y divide-slate-100">
              <div className="flex justify-between pt-2">
                <span className="text-slate-600">Valor de Mercado de Referencia:</span>
                <span className="font-bold text-slate-900">{formatCLP(result.estimatedMarketPrice)}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-600">Revisión de Seguridad & Detailing:</span>
                <span className="font-semibold text-slate-700">- {formatCLP(result.reconditioningEstimateCLP)}</span>
              </div>
              <div className="flex justify-between pt-2 text-base font-extrabold text-blue-700 bg-blue-50/60 p-2.5 rounded-lg">
                <span>OFERTA DE COMPRA EN PARTE DE PAGO:</span>
                <span>{formatCLP(result.recommendedOffer)}</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 space-y-1">
            <div className="font-bold">Condiciones de la Oferta:</div>
            <div>• Sujeto a inspección visual y prueba de ruta en el concesionario.</div>
            <div>• El vehículo debe encontrarse libre de prendas, multas de TAG impagas y con papeles al día.</div>
          </div>
        </div>

        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <Button variant="outline" size="sm" onClick={handlePrint} className="text-xs font-bold gap-1.5">
            <Printer className="w-4 h-4" />
            <span>Imprimir Propuesta</span>
          </Button>
          <Button size="sm" onClick={handleShareWhatsApp} className="text-xs font-bold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white">
            <MessageCircle className="w-4 h-4" />
            <span>Enviar por WhatsApp</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
