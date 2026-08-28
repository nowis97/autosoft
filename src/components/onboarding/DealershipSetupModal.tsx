"use client";

import React, { useState } from "react";
import { Building2, Check, AlertCircle, Save, X, Phone, MapPin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { store } from "@/lib/store";
import { validateRUT, formatRUT } from "@/lib/chilean-utils/rut";

interface DealershipSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DealershipSetupModal({ isOpen, onClose, onSuccess }: DealershipSetupModalProps) {
  const currentTenant = store.getTenant();

  const [name, setName] = useState(currentTenant.name || "");
  const [rut, setRut] = useState(currentTenant.rut || "");
  const [phone, setPhone] = useState(currentTenant.phone || "+56 9 ");
  const [email, setEmail] = useState(currentTenant.email || "");
  const [city, setCity] = useState(currentTenant.city || "Santiago");
  const [address, setAddress] = useState(currentTenant.address || "");
  const [slug, setSlug] = useState(currentTenant.slug || "mi-automotora");
  const [isSaved, setIsSaved] = useState(false);
  const [rutError, setRutError] = useState("");

  if (!isOpen) return null;

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = formatRUT(raw);
    setRut(formatted);
    if (formatted.length >= 8) {
      if (!validateRUT(formatted)) {
        setRutError("RUT inválido (revise dígito verificador Módulo 11)");
      } else {
        setRutError("");
      }
    } else {
      setRutError("");
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    const generatedSlug = val
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(generatedSlug || "mi-automotora");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rut && !validateRUT(rut)) {
      setRutError("Por favor ingrese un RUT chileno válido");
      return;
    }

    store.updateTenant({
      name,
      rut,
      phone,
      email,
      city,
      address,
      slug,
      whitelabel: {
        ...currentTenant.whitelabel,
        dealershipName: name,
        primaryColor: currentTenant.whitelabel?.primaryColor || "#0284c7",
      },
    });

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      if (onSuccess) onSuccess();
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Configurar Mi Automotora</h2>
              <p className="text-xs text-slate-400">Personaliza la identidad y showroom de tu negocio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label className="text-xs font-semibold text-slate-700">Nombre de la Automotora / Razón Social *</Label>
            <Input
              value={name}
              onChange={handleNameChange}
              placeholder="Ej: Automotora Los Andes SpA"
              required
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-semibold text-slate-700">RUT Empresa (Módulo 11) *</Label>
              <Input
                value={rut}
                onChange={handleRutChange}
                placeholder="77.123.456-7"
                required
                className="mt-1 font-mono text-sm"
              />
              {rutError && (
                <p className="text-[11px] text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {rutError}
                </p>
              )}
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Phone className="w-3 h-3" /> WhatsApp Ventas *
              </Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+56 9 8765 4321"
                required
                className="mt-1 font-mono text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Ciudad
              </Label>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ej: Santiago, Concepción"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700">Dirección Salón / Patio</Label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ej: Av. Las Condes 12345"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <Globe className="w-3 h-3" /> URL del Showroom Web
            </Label>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-400 font-mono">/site/</span>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                placeholder="mi-automotora"
                required
                className="font-mono text-sm"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} size="sm">
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              className={`gap-1.5 font-semibold ${isSaved ? "bg-emerald-600 hover:bg-emerald-600" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>¡Guardado!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Guardar Automotora</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
