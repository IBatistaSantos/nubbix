"use client";

import { Card, CardContent, CardFooter } from "@nubbix/ui/card";
import { Button } from "@nubbix/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export function CreateEventCard() {
  return (
    <Card className="group rounded-xl border-2 border-dashed border-slate-200 bg-white hover:border-brand-primary/50 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col">
      <CardContent className="p-6 flex-grow relative flex flex-col justify-center items-center text-center">
        <div className="size-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-brand-primary/5">
          <Plus className="size-8 text-slate-400 group-hover:text-brand-primary transition-colors" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Novo Evento</h3>
        <p className="text-sm text-slate-500 max-w-xs">
          Comece do zero ou use um de nossos modelos pré-definidos.
        </p>
      </CardContent>
      <CardFooter className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-center">
        <Link href="/events/new">
          <Button
            variant="ghost"
            className="text-sm font-semibold text-brand-primary hover:text-brand-primary-hover"
          >
            Criar Agora
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
