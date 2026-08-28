import React from "react";
import { LeadTemperature } from "@/types";
import { Flame, Zap, Snowflake } from "lucide-react";

interface LeadScoringBadgeProps {
  score: number;
  temperature: LeadTemperature;
  showBar?: boolean;
}

export function LeadScoringBadge({ score, temperature, showBar = true }: LeadScoringBadgeProps) {
  let badgeStyle = "bg-slate-100 text-slate-700 border-slate-300";
  let label = "Frío (Consulta)";
  let Icon = Snowflake;

  if (temperature === "HOT") {
    badgeStyle = "bg-rose-50 text-rose-700 border-rose-200";
    label = "🔥 Caliente (Listo para Comprar)";
    Icon = Flame;
  } else if (temperature === "WARM") {
    badgeStyle = "bg-amber-50 text-amber-700 border-amber-200";
    label = "⚡ Tibio (Interesado)";
    Icon = Zap;
  }

  return (
    <div className="space-y-1.5 inline-block">
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${badgeStyle}`}>
        <Icon className="w-3.5 h-3.5 fill-current" />
        <span>{label}</span>
        <span className="opacity-60 text-[10px]">({score}/100)</span>
      </div>

      {showBar && (
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              temperature === "HOT"
                ? "bg-rose-500"
                : temperature === "WARM"
                ? "bg-amber-500"
                : "bg-slate-400"
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
      )}
    </div>
  );
}
