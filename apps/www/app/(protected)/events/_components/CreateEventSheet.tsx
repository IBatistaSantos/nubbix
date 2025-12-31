"use client";

import { useEffect } from "react";
import { Button } from "@nubbix/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@nubbix/ui/sheet";
import { X } from "lucide-react";
import { useCreateEventController } from "../../../../src/modules/events/presentation/controllers/useCreateEventController";
import { EventBasicInfoForm } from "./EventBasicInfoForm";
import { EventTypeSelector } from "./EventTypeSelector";
import { EventUrlInput } from "./EventUrlInput";
import { EventDatesManager } from "./EventDatesManager";
import { EventAddressForm } from "./EventAddressForm";
import { EventCapacityInput } from "./EventCapacityInput";
import { EventTicketSalesToggle } from "./EventTicketSalesToggle";
import { EventTagsManager } from "./EventTagsManager";

export function CreateEventSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const controller = useCreateEventController(() => {
    onOpenChange(false);
  });

  useEffect(() => {
    if (!open) {
      controller.resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const needsAddress = controller.type === "hybrid" || controller.type === "in-person";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        hideCloseButton
        className="w-full sm:max-w-2xl bg-white border border-slate-200 shadow-xl rounded-l-2xl m-2 sm:m-4 mb-2 sm:mb-4 p-0 flex flex-col top-16 h-[calc(100vh-4rem-2rem)] !right-2 sm:!right-4"
      >
        <div className="px-6 sm:px-8 pt-6 pb-4 border-b border-slate-200 flex-shrink-0 relative">
          <SheetHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <SheetTitle className="text-2xl font-bold text-slate-900 tracking-tight">
                  Criar Novo Evento
                </SheetTitle>
                <SheetDescription className="text-slate-600 text-sm leading-relaxed mt-2">
                  Preencha os dados abaixo para criar um novo evento. Todos os campos marcados com *
                  são obrigatórios.
                </SheetDescription>
              </div>
              <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none ml-4">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </SheetClose>
            </div>
          </SheetHeader>
        </div>

        <form onSubmit={controller.handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6 sm:px-8 pr-4 sm:pr-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-slate-400 [&::-webkit-scrollbar]:ml-2">
            <div className="space-y-10 py-6">
              <EventBasicInfoForm
                register={controller.register}
                errors={controller.formState.errors}
              />

              <EventTypeSelector
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                control={controller.control as any}
                errors={controller.formState.errors}
              />

              <EventUrlInput
                register={controller.register}
                errors={controller.formState.errors}
                setValue={controller.setValue}
                watch={controller.watch}
              />

              <EventDatesManager
                dateFields={controller.dateFields}
                register={controller.register}
                errors={controller.formState.errors}
                onAdd={controller.addDate}
                onRemove={controller.removeDate}
                onUpdate={controller.updateDate}
              />

              {needsAddress && (
                <EventAddressForm
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  control={controller.control as any}
                  errors={controller.formState.errors}
                />
              )}

              <EventCapacityInput
                register={controller.register}
                errors={controller.formState.errors}
              />

              <EventTicketSalesToggle
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                control={controller.control as any}
              />

              <EventTagsManager
                tags={controller.tags}
                errors={controller.formState.errors}
                onAdd={controller.addTag}
                onRemove={controller.removeTag}
              />
            </div>
          </div>

          <div className="flex-shrink-0 bg-white border-t border-slate-200 pt-4 pb-4 px-6 sm:px-8 mb-2 sm:mb-4 flex gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                controller.resetForm();
                onOpenChange(false);
              }}
              className="flex-1 h-11"
              disabled={controller.isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="default"
              className="flex-1 h-11 bg-brand-primary hover:bg-brand-primary-hover text-white"
              disabled={controller.isLoading}
            >
              {controller.isLoading ? "Criando..." : "Criar Evento"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
