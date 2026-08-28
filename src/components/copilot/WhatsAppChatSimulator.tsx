"use client";

import React, { useState, useRef, useEffect } from "react";
import { Tenant, Vehicle, ChatMessage, LeadTemperature } from "@/types";
import { processCopilotMessage, CopilotResponse } from "@/lib/ai/sales-copilot";
import { LeadScoringBadge } from "./LeadScoringBadge";
import { Button } from "@/components/ui/button";
import {
  Send,
  Bot,
  User,
  Sparkles,
  CheckCheck,
  Phone,
  Video,
  Calendar,
  ShieldCheck,
  Mic,
  Car,
} from "lucide-react";
import { formatCLP } from "@/lib/chilean-utils";

interface WhatsAppChatSimulatorProps {
  tenant: Tenant;
  inventory: Vehicle[];
  onAppointmentCreated?: (appo: any) => void;
}

const PRESET_LEADS = [
  {
    id: "felipe",
    name: "Felipe Albornoz",
    phone: "+56 9 9123 4567",
    avatar: "👨‍💼",
    defaultPrompt: "¿Cuánto me queda la cuota del Toyota RAV4 con 5 millones de pie a 48 meses?",
    audioPrompt: "Hola qué tal, vi el RAV4 publicado en Chileautos y quería consultar si dan financiamiento con 5 millones de pie.",
  },
  {
    id: "marcela",
    name: "Marcela Contreras",
    phone: "+56 9 8234 5678",
    avatar: "👩‍💼",
    defaultPrompt: "Hola! Me interesa la Mazda CX-5 Roja, ¿reciben mi Hyundai Accent 2018 en parte de pago?",
    audioPrompt: "Hola buenas tardes, me encanta la CX-5 roja 2022, ¿me pueden tasar mi auto actual para darlo en parte de pago?",
  },
  {
    id: "ignacio",
    name: "Ignacio Larraín",
    phone: "+56 9 7345 6789",
    avatar: "🚜",
    defaultPrompt: "Buenas tardes, quiero ir a probar la Ford Ranger este sábado a las 11:00 am para mi agrícola.",
    audioPrompt: "Estimados, busco una camioneta de trabajo para el campo. ¿Puedo ir a ver y probar la Ranger 4x4 este sábado?",
  },
];

export function WhatsAppChatSimulator({
  tenant,
  inventory,
  onAppointmentCreated,
}: WhatsAppChatSimulatorProps) {
  const [selectedLead, setSelectedLead] = useState(PRESET_LEADS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-0",
      sender: "COPILOT",
      text: "¡Hola! Bienvenido a " + tenant.name + ". Soy tu asistente automotriz virtual con IA 24/7. ¿En qué vehículo de nuestro stock te gustaría recibir información, financiamiento o coordinar un test drive?",
      timestamp: "23:14",
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentScore, setCurrentScore] = useState(30);
  const [currentTemp, setCurrentTemp] = useState<LeadTemperature>("COLD");
  const [lastMatchedVehicle, setLastMatchedVehicle] = useState<Vehicle | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string, isAudio = false) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: "user-" + Date.now(),
      sender: "USER",
      text: isAudio ? '🎙️ [Mensaje de Voz Transcrito]: "' + text + '"' : text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      const response: CopilotResponse = processCopilotMessage(text, newHistory, tenant, inventory);

      setCurrentScore(response.leadScore);
      setCurrentTemp(response.temperature);
      if (response.matchedVehicle) {
        setLastMatchedVehicle(response.matchedVehicle);
      }

      const botMsg: ChatMessage = {
        id: "copilot-" + Date.now(),
        sender: "COPILOT",
        text: response.replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedAction: response.suggestedAction,
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, botMsg]);

      if (response.extractedAppointment && onAppointmentCreated) {
        onAppointmentCreated({
          leadName: selectedLead.name,
          leadPhone: selectedLead.phone,
          vehicleName: response.extractedAppointment.vehicleName,
          date: response.extractedAppointment.date,
          time: response.extractedAppointment.time,
        });
      }
    }, 800);
  };

  const handleSendAudioPrompt = () => {
    setIsPlayingAudio(true);
    setTimeout(() => {
      setIsPlayingAudio(false);
      handleSendMessage(selectedLead.audioPrompt, true);
    }, 1200);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[680px]">
      {/* WhatsApp Header */}
      <div className="bg-[#075E54] text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-[#128C7E] border-2 border-white/40 flex items-center justify-center font-bold text-sm">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#075E54]" />
          </div>
          <div>
            <div className="font-extrabold text-sm flex items-center gap-1.5">
              <span>Copiloto IA • {tenant.name}</span>
              <span className="bg-[#25D366] text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase">
                En línea 24/7
              </span>
            </div>
            <div className="text-[11px] text-emerald-100 flex items-center gap-1">
              <span>Cliente: <strong>{selectedLead.name}</strong> ({selectedLead.phone})</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LeadScoringBadge score={currentScore} temperature={currentTemp} showBar={false} />
        </div>
      </div>

      {/* Preset Persona Selector & Audio Trigger */}
      <div className="bg-slate-100 p-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 shrink-0">Prospecto:</span>
          {PRESET_LEADS.map((lead) => (
            <button
              key={lead.id}
              onClick={() => {
                setSelectedLead(lead);
                handleSendMessage(lead.defaultPrompt);
              }}
              className={
                "px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 " +
                (selectedLead.id === lead.id
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200")
              }
            >
              <span>{lead.avatar}</span>
              <span>{lead.name}</span>
            </button>
          ))}
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={handleSendAudioPrompt}
          disabled={isPlayingAudio || isTyping}
          className="text-xs font-bold gap-1.5 bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50 h-7 px-3 shadow-2xs"
        >
          <Mic className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>{isPlayingAudio ? "🎙️ Transcribiendo audio..." : "Simular Nota de Voz"}</span>
        </Button>
      </div>

      {/* Chat Messages Body with WhatsApp Wallpaper */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#e5ddd5]/40">
        {messages.map((msg) => {
          const isUser = msg.sender === "USER";

          return (
            <div
              key={msg.id}
              className={"flex flex-col " + (isUser ? "items-end" : "items-start")}
            >
              <div
                className={
                  "max-w-[85%] rounded-2xl px-4 py-3 text-xs shadow-2xs space-y-2 " +
                  (isUser
                    ? "bg-[#dcf8c6] text-slate-900 rounded-tr-none"
                    : "bg-white text-slate-900 rounded-tl-none border border-slate-200")
                }
              >
                <div className="leading-relaxed whitespace-pre-wrap">{msg.text}</div>

                {/* Rich Car Card in WhatsApp when vehicle matched */}
                {!isUser && lastMatchedVehicle && (
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 mt-2 space-y-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-12 h-12 rounded-lg overflow-hidden relative shrink-0 bg-slate-200">
                        {lastMatchedVehicle.images?.[0] ? (
                          <img
                            src={lastMatchedVehicle.images[0]}
                            alt={lastMatchedVehicle.brand}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Car className="w-6 h-6 m-auto text-slate-400 mt-3" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-extrabold text-slate-900 truncate text-[11px]">
                          {lastMatchedVehicle.brand} {lastMatchedVehicle.model} ({lastMatchedVehicle.year})
                        </div>
                        <div className="text-[10px] text-blue-700 font-bold font-mono">
                          {formatCLP(lastMatchedVehicle.priceCash)} CLP
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400">
                  <span>{msg.timestamp}</span>
                  {isUser && <CheckCheck className="w-3.5 h-3.5 text-blue-500" />}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-white px-3.5 py-2 rounded-2xl w-fit shadow-2xs border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
            <span className="text-[11px] ml-1 font-medium">Copiloto IA consultando stock y financiamiento...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Escribe como cliente (ej. ¿Tienen crédito con 20% de pie?)..."
          className="flex-1 h-11 px-4 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        />
        <Button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className="h-11 px-5 bg-[#25D366] hover:bg-emerald-600 text-slate-950 font-black rounded-2xl text-xs gap-1.5 shadow-xs"
        >
          <Send className="w-4 h-4" />
          <span>Enviar</span>
        </Button>
      </form>
    </div>
  );
}
