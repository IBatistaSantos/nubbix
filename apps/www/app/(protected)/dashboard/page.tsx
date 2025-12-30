"use client";

import { Bot, TrendingUp, Sparkles, Lock } from "lucide-react";
import { Button } from "@nubbix/ui/button";

export default function DashboardPage() {
  return (
    <div className="flex-grow flex items-center justify-center px-4">
      <div className="max-w-4xl w-full flex flex-col items-center justify-center py-12">
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-12 overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative flex flex-col items-center text-center z-10">
            <div className="relative mb-8 group">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary to-purple-500 rounded-full opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative size-24 md:size-32 bg-gradient-to-br from-slate-50 to-slate-100 rounded-full flex items-center justify-center shadow-inner border border-slate-200">
                <div
                  className="absolute inset-2 rounded-full border border-slate-200 border-dashed animate-spin"
                  style={{ animationDuration: "10s" }}
                ></div>
                <Bot className="text-5xl md:text-6xl text-brand-primary" />
              </div>

              <div
                className="absolute -top-2 -right-4 bg-white px-3 py-1 rounded-full shadow-md border border-slate-100 flex items-center gap-1 animate-bounce"
                style={{ animationDelay: "0.5s" }}
              >
                <TrendingUp className="text-base text-green-500" />
                <span className="text-xs font-bold text-slate-600">Insights</span>
              </div>
              <div
                className="absolute -bottom-2 -left-4 bg-white px-3 py-1 rounded-full shadow-md border border-slate-100 flex items-center gap-1 animate-bounce"
                style={{ animationDelay: "1s" }}
              >
                <Sparkles className="text-base text-purple-500" />
                <span className="text-xs font-bold text-slate-600">Automação</span>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 tracking-tight">
              Desbloqueie o potencial da IA no seu Dashboard
            </h2>
            <p className="text-slate-500 text-base md:text-lg max-w-lg mb-10 leading-relaxed">
              Estamos finalizando as ferramentas que transformarão a gestão de seus eventos com
              análises avançadas e automação.
            </p>

            <div className="flex flex-col items-center gap-3">
              <Button
                disabled
                className="flex items-center gap-2 px-8 py-3 bg-slate-100 text-slate-400 font-semibold rounded-lg cursor-not-allowed select-none border border-transparent"
              >
                <Lock className="text-xl" />
                Explore a IA em breve
              </Button>
              <p className="text-xs text-slate-400 font-medium">
                Notificação será enviada no lançamento
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-6 text-sm text-slate-400">
          <span className="cursor-help hover:text-slate-500 transition-colors">Termos de uso</span>
          <span className="cursor-help hover:text-slate-500 transition-colors">Suporte</span>
          <span className="flex items-center gap-1">
            Status: <span className="w-2 h-2 rounded-full bg-yellow-500"></span>{" "}
            <span className="text-slate-500">Em desenvolvimento</span>
          </span>
        </div>
      </div>
    </div>
  );
}
