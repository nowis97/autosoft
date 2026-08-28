import React, { useRef } from "react";
import { UploadCloud, Image as ImageIcon, CheckCircle2, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface StudioPhoto {
  id: string;
  url: string;
  originalUrl: string;
  isCover: boolean;
  angle: "PORTADA" | "LATERAL" | "TRASERA" | "INTERIOR" | "TABLERO";
  processedWithBackground?: string;
  hasBranding?: boolean;
}

interface PhotoUploaderDropzoneProps {
  photos: StudioPhoto[];
  onPhotosChange: (photos: StudioPhoto[]) => void;
  selectedPhotoId: string;
  onSelectPhoto: (id: string) => void;
}

export function PhotoUploaderDropzone({
  photos,
  onPhotosChange,
  selectedPhotoId,
  onSelectPhoto,
}: PhotoUploaderDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddDemoPhotos = () => {
    const demoPhotos: StudioPhoto[] = [
      {
        id: `photo-${Date.now()}-1`,
        url: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&auto=format&fit=crop&q=80",
        originalUrl: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&auto=format&fit=crop&q=80",
        isCover: true,
        angle: "PORTADA",
      },
      {
        id: `photo-${Date.now()}-2`,
        url: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&auto=format&fit=crop&q=80",
        originalUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&auto=format&fit=crop&q=80",
        isCover: false,
        angle: "LATERAL",
      },
      {
        id: `photo-${Date.now()}-3`,
        url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop&q=80",
        originalUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop&q=80",
        isCover: false,
        angle: "INTERIOR",
      },
    ];
    onPhotosChange(demoPhotos);
    onSelectPhoto(demoPhotos[0].id);
  };

  const handleSetCover = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = photos.map((p) => ({
      ...p,
      isCover: p.id === id,
    }));
    onPhotosChange(updated);
  };

  const handleDeletePhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = photos.filter((p) => p.id !== id);
    onPhotosChange(filtered);
    if (selectedPhotoId === id && filtered.length > 0) {
      onSelectPhoto(filtered[0].id);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/40 rounded-2xl p-6 text-center cursor-pointer transition-all space-y-2 group"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleAddDemoPhotos();
            }
          }}
        />
        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
          <UploadCloud className="w-6 h-6" />
        </div>
        <div className="text-xs font-bold text-slate-800">
          Arrastra y suelta tus fotos aquí o haz clic para subir
        </div>
        <p className="text-[11px] text-slate-400">
          JPG, PNG o WebP de hasta 15MB por foto. Procesamiento por lote automático.
        </p>
        <div className="pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleAddDemoPhotos();
            }}
            className="text-[11px] font-semibold"
          >
            Cargar Lote de Prueba (3 Fotos)
          </Button>
        </div>
      </div>

      {photos.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span>Fotos del Vehículo ({photos.length})</span>
            <span>💡 Haz clic en una foto para editarla</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {photos.map((photo) => {
              const isSelected = selectedPhotoId === photo.id;

              return (
                <div
                  key={photo.id}
                  onClick={() => onSelectPhoto(photo.id)}
                  className={`relative aspect-4/3 rounded-xl overflow-hidden border-2 cursor-pointer transition-all group ${
                    isSelected
                      ? "border-blue-600 ring-2 ring-blue-600/30"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <img src={photo.url} alt="" className="w-full h-full object-cover" />

                  {photo.isCover && (
                    <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 fill-current" /> Portada
                    </div>
                  )}

                  <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-md">
                    {photo.angle}
                  </div>

                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {!photo.isCover && (
                      <button
                        onClick={(e) => handleSetCover(photo.id, e)}
                        className="p-1.5 bg-white text-slate-800 rounded-md hover:bg-blue-600 hover:text-white transition-colors"
                        title="Marcar como Portada"
                      >
                        <Star className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={(e) => handleDeletePhoto(photo.id, e)}
                      className="p-1.5 bg-white text-red-600 rounded-md hover:bg-red-600 hover:text-white transition-colors"
                      title="Eliminar foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
