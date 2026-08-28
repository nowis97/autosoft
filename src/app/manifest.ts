import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Autosoft 360 - Dealer & Yard Mobile",
    short_name: "Autosoft 360",
    description: "Plataforma de Gestion Automotriz & Check-In Movil de Patio para Concesionarias",
    start_url: "/app/inspection/yard-mode",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#2563eb",
    orientation: "portrait",
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
