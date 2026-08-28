import React from "react";
import { InvoiceDTE } from "@/types";
import { formatCLP } from "@/lib/chilean-utils/financing";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle2, Download } from "lucide-react";

interface SalesBookTableProps {
  invoices: InvoiceDTE[];
  onViewInvoice: (invoice: InvoiceDTE) => void;
}

export function SalesBookTable({ invoices, onViewInvoice }: SalesBookTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          <span>Libro de Ventas Electrónico SII ({invoices.length} DTEs)</span>
        </h3>
        <span className="text-xs text-slate-400 font-semibold">Registro tributario para Declaración F29</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
            <tr>
              <th className="py-3 px-3">Folio / Tipo</th>
              <th className="py-3 px-3">Receptor (RUT)</th>
              <th className="py-3 px-3">Monto Exento</th>
              <th className="py-3 px-3">Base Afecta</th>
              <th className="py-3 px-3">IVA (19%)</th>
              <th className="py-3 px-3">Total Facturado</th>
              <th className="py-3 px-3">Estado SII</th>
              <th className="py-3 px-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50">
                <td className="py-3 px-3">
                  <div className="font-black text-slate-900">Folio N° {inv.folio}</div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    inv.dteType === "33" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                  }`}>
                    {inv.dteType === "33" ? "DTE 33 (Venta Usados)" : "DTE 46 (Factura Compra)"}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <div className="font-bold text-slate-900">{inv.receiverName}</div>
                  <div className="text-[10px] text-slate-400">{inv.receiverRut}</div>
                </td>
                <td className="py-3 px-3 text-slate-700">{formatCLP(inv.exemptAmountCLP)}</td>
                <td className="py-3 px-3 text-blue-600 font-semibold">{formatCLP(inv.netTaxableAmountCLP)}</td>
                <td className="py-3 px-3 text-red-600 font-bold">{formatCLP(inv.vat19CLP)}</td>
                <td className="py-3 px-3 font-black text-slate-900">{formatCLP(inv.totalCLP)}</td>
                <td className="py-3 px-3">
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit">
                    <CheckCircle2 className="w-3 h-3" /> Aceptado SII
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewInvoice(inv)}
                    className="text-[11px] font-bold h-7 px-2.5 gap-1 text-slate-800"
                  >
                    <FileText className="w-3 h-3" />
                    <span>Ver DTE</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
