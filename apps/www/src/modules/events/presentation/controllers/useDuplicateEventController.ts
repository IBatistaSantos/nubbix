"use client";

import { useCallback, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useDuplicateEventMutation } from "../mutations/eventMutations";
import type { Event } from "../queries/eventQueries";
import {
  duplicateEventFormSchema,
  type DuplicateEventFormInput,
  type EventDateForm,
} from "../../application/dtos/DuplicateEventDTO";
import { generateDateId, normalizeUrl } from "../utils/eventValidationUtils";
import type { DuplicateEventInput } from "../../application/dtos/DuplicateEventDTO";
import { useHttpClient } from "../../../../shared/http/useHttpClient";
import { DuplicateEventUseCase } from "../../application/useCases";

export function useDuplicateEventController(originalEvent: Event, onSuccess?: () => void) {
  const duplicateEventMutation = useDuplicateEventMutation();
  const httpClient = useHttpClient();
  const duplicateEventUseCase = useMemo(() => new DuplicateEventUseCase(httpClient), [httpClient]);

  const form = useForm<DuplicateEventFormInput>({
    // @ts-expect-error - Zod v4 type inference issue with @hookform/resolvers
    resolver: zodResolver(duplicateEventFormSchema),
    mode: "onBlur",
    defaultValues: {
      name: `${originalEvent.name} - Cópia`,
      url: "",
      dates: [],
    },
  });

  const {
    fields: dateFields,
    append: appendDate,
    remove: removeDate,
    update: updateDate,
  } = useFieldArray({
    control: form.control,
    name: "dates",
  });

  const watchDates = form.watch("dates");

  const addDate = useCallback(() => {
    const newDate: EventDateForm = {
      id: generateDateId(),
      date: "",
      startTime: "",
      endTime: "",
    };
    appendDate(newDate);
    form.clearErrors("dates");
  }, [appendDate, form]);

  const removeDateById = useCallback(
    (index: number) => {
      removeDate(index);
      form.clearErrors("dates");
    },
    [removeDate, form]
  );

  const updateDateField = useCallback(
    (index: number, field: keyof EventDateForm, value: string) => {
      const currentDate = watchDates[index];
      if (currentDate) {
        updateDate(index, { ...currentDate, [field]: value });
        form.clearErrors("dates");
      }
    },
    [updateDate, watchDates, form]
  );

  const handleSubmit = form.handleSubmit(
    async (data) => {
      try {
        const eventName = data.name.trim();

        const payload: Omit<DuplicateEventInput, "eventId"> = {
          name: eventName,
          url: normalizeUrl(data.url.trim()),
          dates: data.dates.map((d) => ({
            date: d.date,
            startTime: d.startTime,
            endTime: d.endTime,
          })),
        };

        await duplicateEventMutation.mutateAsync({
          eventId: originalEvent.id,
          input: payload,
          useCase: duplicateEventUseCase,
        });

        toast.success("Evento duplicado com sucesso!", {
          description: `O evento "${eventName}" foi criado com sucesso.`,
          duration: 5000,
        });

        form.reset();
        onSuccess?.();
      } catch (error) {
        console.error("Error duplicating event:", error);
        toast.error("Erro ao duplicar evento", {
          description: "Ocorreu um erro ao duplicar o evento. Tente novamente.",
          duration: 5000,
        });
      }
    },
    () => {
      toast.error("Erro de validação", {
        description: "Por favor, corrija os campos marcados em vermelho antes de continuar.",
      });
    }
  );

  const resetForm = useCallback(() => {
    const currentDates = form.getValues("dates");
    for (let i = currentDates.length - 1; i >= 0; i--) {
      removeDate(i);
    }

    form.reset({
      name: originalEvent.name,
      url: "",
      dates: [],
    });
  }, [form, originalEvent.name, removeDate]);

  return {
    register: form.register,
    control: form.control,
    handleSubmit,
    watch: form.watch,
    setValue: form.setValue,
    formState: form.formState,
    dateFields,
    addDate,
    removeDate: removeDateById,
    updateDate: updateDateField,
    resetForm,
    isLoading: duplicateEventMutation.isPending,
    error: duplicateEventMutation.error,
  };
}
