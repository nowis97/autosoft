import React from "react";
import { InvoiceDTE, Tenant } from "@/types";
import { formatCLP } from "@/lib/chilean-utils/financing";
import { Button } from "@/components/ui/button";
import { FileText, X, Printer, ShieldCheck, QrCode } from "lucide-react";

interface ElectronicInvoiceViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceDTE;
  tenant: Tenant;
}

export function ElectronicInvoiceViewModal({
  isOpen,
  onClose,
  invoice,
  tenant,
}: ElectronicInvoiceViewModalProps) {
  if (!isOpen) return null;

  const dteTitle =
    invoice.dteType === "33"
      ? "FACTURA ELECTRÓNICA"
      : invoice.dteType === "46"
      ? "FACTURA DE COMPRA ELECTRÓNICA"
      : "FACTURA NO AFECTA O EXENTA ELECTRÓNICA";

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center font-bold text-sm">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-sm">Documento Tributario Electrónico (DTE {invoice.dteType})</div>
              <div className="text-[11px] text-slate-400">Folio N° {invoice.folio} • Aceptado por el SII</div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chilean Tax Invoice Official Layout */}
        <div className="p-6 space-y-4 text-xs text-slate-800 font-sans max-h-[72vh] overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="space-y-1">
              <h2 className="text-lg font-black text-slate-900">{tenant.name}</h2>
              <div className="text-[11px] text-slate-600 font-bold">GIRO: COMPRAVENTA DE VEHÍCULOS AUTOMOTORES USADOS</div>
              <div className="text-[11px] text-slate-500">{tenant.address}, {tenant.city}</div>
              <div className="text-[11px] text-slate-500">Tel: {tenant.phone} | Web: www.{tenant.slug}.cl</div>
            </div>

            {/* Red Box SII Stamp Header */}
            <div className="border-2 border-red-600 text-red-600 rounded-lg p-3 text-center min-w-[200px] shrink-0 font-bold">
              <div className="text-sm font-black">R.U.T.: {tenant.rut}</div>
              <div className="text-xs uppercase tracking-wider py-1 font-extrabold">{dteTitle}</div>
              <div className="text-sm font-black">N° {invoice.folio}</div>
              <div className="text-[9px] uppercase tracking-tight text-slate-500 mt-1">S.I.I. - SANTIAGO ORIENTE</div>
            </div>
          </div>

          {/* Receiver Info */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-500 block text-[10px]">SEÑOR(ES):</span>
                <strong className="text-slate-900">{invoice.receiverName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">R.U.T.:</span>
                <strong className="text-slate-900">{invoice.receiverRut}</strong>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-500 block text-[10px]">DIRECCIÓN:</span>
                <span>{invoice.receiverAddress}, {invoice.receiverCity}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">FECHA DE EMISIÓN:</span>
                <span>{new Date(invoice.issuedAt).toLocaleDateString("es-CL")}</span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Descripción del Ítem</th>
                  <th className="py-2.5 px-3 text-right">Monto Exento</th>
                  <th className="py-2.5 px-3 text-right">Monto Afecto</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{invoice.description}</div>
                    <div className="text-[10px] text-slate-400">Régimen Especial IVA sobre Margen de Comercialización (Ley 21.420)</div>
                  </td>
                  <td className="py-3 px-3 text-right text-slate-700 font-semibold">{formatCLP(invoice.exemptAmountCLP)}</td>
                  <td className="py-3 px-3 text-right text-blue-600 font-semibold">{formatCLP(invoice.netTaxableAmountCLP)}</td>
                  <td className="py-3 px-3 text-right font-black text-slate-900">{formatCLP(invoice.totalCLP)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tax Breakdown Totals */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-2">
            {/* Timbre Electrónico SII */}
            <div className="border-2 border-slate-800 rounded-xl p-3 max-w-[280px] space-y-1 text-center font-mono text-[9px] bg-slate-50 shrink-0">
              <div className="font-bold text-[10px] text-slate-900">TIMBRE ELECTRÓNICO S.I.I.</div>
              <div className="text-slate-500">Res. 80 de 2014 - Verifique documento en www.sii.cl</div>
              <div className="py-1 flex items-center justify-center text-slate-700">
                <QrCode className="w-16 h-16 text-slate-900" />
              </div>
              <div className="text-[8px] text-slate-400 break-all">{invoice.siiTrackId}</div>
            </div>

            {/* Totals Table */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs flex-1 max-w-[280px] self-end">
              <div className="flex justify-between text-slate-600">
                <span>Monto Exento:</span>
                <strong className="text-slate-900">{formatCLP(invoice.exemptAmountCLP)}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Monto Neto Afecto (Margen):</span>
                <strong className="text-blue-600">{formatCLP(invoice.netTaxableAmountCLP)}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>I.V.A. (19%):</span>
                <strong className="text-red-600">{formatCLP(invoice.vat19CLP)}</strong>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-black text-slate-900">
                <span>TOTAL FACTURADO:</span>
                <span className="text-emerald-600">{formatCLP(invoice.totalCLP)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Documento emitido con Firma Electrónica Avanzada</span>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={onClose} className="text-xs">
              Cerrar
            </Button>
            <Button size="sm" onClick={() => window.print()} className="text-xs font-bold gap-1.5 bg-blue-600 text-white">
              <Printer className="w-4 h-4" />
              <span>Imprimir DTE</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
