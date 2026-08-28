import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, X, ShieldCheck, CheckCircle2 } from "lucide-react";

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePaymentMethod: (data: any) => void;
}

export function PaymentMethodModal({
  isOpen,
  onClose,
  onSavePaymentMethod,
}: PaymentMethodModalProps) {
  const [methodType, setMethodType] = useState<"CREDIT_CARD" | "PAC_DEBIT">("CREDIT_CARD");
  const [bankName, setBankName] = useState("Banco de Chile");
  const [cardNumber, setCardNumber] = useState("**** **** **** 8841");
  const [accountNumber, setAccountNumber] = useState("00-128-49120-01");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePaymentMethod({
      type: methodType,
      brand: methodType === "CREDIT_CARD" ? "Visa" : undefined,
      last4: methodType === "CREDIT_CARD" ? cardNumber.slice(-4) : accountNumber.slice(-4),
      bankName,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-sm">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-sm">Método de Pago Chileno</div>
              <div className="text-[11px] text-slate-400">Webpay Plus o Débito PAC Bancario</div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMethodType("CREDIT_CARD")}
              className={`p-3 rounded-xl border text-left font-semibold ${
                methodType === "CREDIT_CARD"
                  ? "bg-blue-50 border-blue-600 text-blue-900 font-bold"
                  : "bg-white border-slate-200 text-slate-600"
              }`}
            >
              💳 Tarjeta de Crédito
              <div className="text-[10px] font-normal text-slate-400">Webpay / OneClick</div>
            </button>
            <button
              type="button"
              onClick={() => setMethodType("PAC_DEBIT")}
              className={`p-3 rounded-xl border text-left font-semibold ${
                methodType === "PAC_DEBIT"
                  ? "bg-purple-50 border-purple-600 text-purple-900 font-bold"
                  : "bg-white border-slate-200 text-slate-600"
              }`}
            >
              🏦 PAC Automático
              <div className="text-[10px] font-normal text-slate-400">Débito Cta. Corriente</div>
            </button>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Banco Chileno</label>
            <select
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full h-9 px-3 border border-slate-200 rounded-lg bg-white font-medium"
            >
              <option value="Banco de Chile">Banco de Chile / Edwards</option>
              <option value="Banco Santander">Banco Santander Chile</option>
              <option value="BCI">BCI / Banco de Crédito e Inversiones</option>
              <option value="BancoEstado">BancoEstado</option>
              <option value="Scotiabank">Scotiabank Chile</option>
              <option value="Itaú">Itaú Corpbanca</option>
              <option value="Banco BICE">Banco BICE</option>
              <option value="Banco Security">Banco Security</option>
            </select>
          </div>

          {methodType === "CREDIT_CARD" ? (
            <div className="space-y-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Número de Tarjeta</label>
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full h-9 px-3 border border-slate-200 rounded-lg font-mono font-bold"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Número de Cuenta Corriente</label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full h-9 px-3 border border-slate-200 rounded-lg font-mono font-bold"
                />
              </div>
            </div>
          )}

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Encriptación bancaria SSL 256-bit y facturación con DTE tributario mensual.</span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
              Cancelar
            </Button>
            <Button type="submit" size="sm" className="text-xs font-bold bg-blue-600 text-white">
              Guardar Método de Pago
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
