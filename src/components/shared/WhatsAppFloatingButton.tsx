import React from "react";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface WhatsAppFloatingButtonProps {
  phone: string;
  vehicleTitle?: string;
  licensePlate?: string;
  price?: string;
  className?: string;
}

export function WhatsAppFloatingButton({
  phone,
  vehicleTitle,
  licensePlate,
  price,
  className,
}: WhatsAppFloatingButtonProps) {
  const cleanPhone = phone.replace(/[^0-9]/g, "");

  let defaultMessage = "Hola, me gustaría consultar por vehículos disponibles en su catálogo.";
  if (vehicleTitle) {
    defaultMessage = `Hola, me interesa el vehículo *${vehicleTitle}*${
      licensePlate ? ` (Patente ${licensePlate})` : ""
    }${price ? ` publicado en ${price}` : ""}. ¿Sigue disponible para ver o simular financiamiento?`;
  }

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#25D366] text-white rounded-full font-bold shadow-lg hover:bg-[#20bd5a] hover:scale-105 transition-all duration-200",
        className
      )}
      title="Escríbenos por WhatsApp"
    >
      <MessageCircle className="w-5 h-5 fill-current" />
      <span className="text-sm font-semibold hidden sm:inline">Consultar por WhatsApp</span>
    </a>
  );
}
