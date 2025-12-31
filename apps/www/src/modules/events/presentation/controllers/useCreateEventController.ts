"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useCreateEventMutation, type CreateEventInput } from "../mutations/eventMutations";
import {
  createEventFormSchema,
  type CreateEventFormInput,
  type EventDateForm,
} from "../../application/dtos/CreateEventDTO";
import {
  getEventErrorMessage,
  getFieldDisplayName,
  mapBackendErrorsToFormErrors,
} from "../utils/eventErrorUtils";
import { generateDateId, validateUrl } from "../utils/eventValidationUtils";
import { ApiClientError } from "../../../../shared/http/apiClient";

export function useCreateEventController(onSuccess?: () => void) {
  const createEventMutation = useCreateEventMutation();

  const form = useForm<CreateEventFormInput>({
    // @ts-expect-error - Zod v4 type inference issue with @hookform/resolvers
    resolver: zodResolver(createEventFormSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      description: "",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type: "" as any,
      url: "",
      dates: [],
      maxCapacity: undefined,
      ticketSales: {
        enabled: false,
      },
      tags: [],
      address: null,
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

  const watchType = form.watch("type");
  const watchDates = form.watch("dates");
  const watchedTags = form.watch("tags");
  const watchTags = useMemo(() => watchedTags || [], [watchedTags]);

  useEffect(() => {
    if (watchType === "digital") {
      form.setValue("address", null, { shouldValidate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchType]);

  const watchedUrl = form.watch("url");
  const urlError = useMemo(() => {
    return validateUrl(watchedUrl);
  }, [watchedUrl]);

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

  const addTag = useCallback(
    (tag: string) => {
      const trimmedTag = tag.trim();
      if (!trimmedTag) return;

      const currentTags = watchTags;
      if (currentTags.includes(trimmedTag)) {
        return;
      }

      if (currentTags.length >= 30) {
        form.setError("tags", {
          type: "manual",
          message: "Máximo de 30 tags permitidas",
        });
        return;
      }

      form.setValue("tags", [...currentTags, trimmedTag], {
        shouldValidate: true,
      });
      form.clearErrors("tags");
    },
    [watchTags, form]
  );

  const removeTag = useCallback(
    (tagToRemove: string) => {
      const currentTags = watchTags.filter((t) => t !== tagToRemove);
      form.setValue("tags", currentTags, { shouldValidate: true });
      form.clearErrors("tags");
    },
    [watchTags, form]
  );

  const scrollToFirstError = useCallback(() => {
    setTimeout(() => {
      const firstErrorKey = Object.keys(form.formState.errors)[0];
      if (firstErrorKey) {
        let errorElement: HTMLElement | null = null;

        if (firstErrorKey === "name") {
          errorElement = document.getElementById("name");
        } else if (firstErrorKey === "url") {
          errorElement = document.getElementById("url");
        } else if (firstErrorKey === "type") {
          errorElement = document.querySelector('[type="button"]') as HTMLElement;
        } else if (firstErrorKey === "dates") {
          errorElement = document.querySelector('[type="date"]') as HTMLElement;
        } else if (firstErrorKey === "address") {
          errorElement = document.getElementById("address-street");
        } else if (firstErrorKey === "maxCapacity") {
          errorElement = document.getElementById("maxCapacity");
        }

        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
          errorElement.focus();
        }
      }
    }, 100);
  }, [form.formState.errors]);

  const handleSubmit = form.handleSubmit(
    async (data) => {
      try {
        const payload: CreateEventInput = {
          name: data.name.trim(),
          ...(data.description?.trim() && { description: data.description.trim() }),
          type: data.type as "digital" | "hybrid" | "in-person",
          url: data.url.trim(),
          dates: data.dates.map((d: { date: string; startTime: string; endTime: string }) => ({
            date: d.date,
            startTime: d.startTime,
            endTime: d.endTime,
          })),
          maxCapacity: data.maxCapacity ?? null,
          ticketSales: {
            enabled: data.ticketSales.enabled,
            status: data.ticketSales.enabled ? "open" : "closed",
          },
          tags: data.tags && data.tags.length > 0 ? data.tags : undefined,
          address:
            data.type === "hybrid" || data.type === "in-person"
              ? data.address
                ? {
                    street: data.address.street.trim(),
                    city: data.address.city.trim(),
                    state: data.address.state.trim(),
                    country: data.address.country.trim(),
                    zip: data.address.zip?.trim() || null,
                  }
                : null
              : null,
        };

        await createEventMutation.mutateAsync(payload);

        toast.success("Evento criado com sucesso!", {
          description: `O evento "${data.name}" foi criado e está disponível na plataforma.`,
          duration: 5000,
        });

        form.reset();
        setTimeout(() => {
          onSuccess?.();
        }, 500);
      } catch (error) {
        console.error("Error creating event:", error);

        if (error instanceof ApiClientError) {
          if (error.errors) {
            const formErrors = mapBackendErrorsToFormErrors(error.errors);
            const errorMessages: string[] = [];

            Object.entries(error.errors).forEach(([key, messages]) => {
              if (messages && messages.length > 0) {
                const fieldName = getFieldDisplayName(key);
                errorMessages.push(`${fieldName}: ${messages[0]}`);
              }
            });

            Object.entries(formErrors).forEach(([key, message]) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              form.setError(key as any, {
                type: "server",
                message,
              });
            });

            toast.error("Erro ao criar evento", {
              description:
                errorMessages.length > 0
                  ? errorMessages.join(". ")
                  : "Verifique os campos marcados e tente novamente.",
              duration: 6000,
            });
          } else {
            const errorMessage = getEventErrorMessage(error) || "Erro ao criar evento";
            toast.error("Erro ao criar evento", {
              description: errorMessage,
              duration: 5000,
            });
          }

          if (error.status === 409) {
            const conflictError =
              "Esta URL já está em uso. Por favor, escolha uma URL diferente para o seu evento.";
            form.setError("url", {
              type: "server",
              message: conflictError,
            });

            toast.error("URL já em uso", {
              description: conflictError,
              duration: 5000,
            });
          }
        } else {
          const unexpectedError = "Erro inesperado ao criar evento. Tente novamente.";
          toast.error("Erro inesperado", {
            description: unexpectedError,
            duration: 5000,
          });
        }
      }
    },
    () => {
      scrollToFirstError();
      toast.error("Erro de validação", {
        description: "Por favor, corrija os campos marcados em vermelho antes de continuar.",
      });
    }
  );

  const resetForm = useCallback(() => {
    form.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    register: form.register,
    control: form.control,
    handleSubmit,
    resetForm,
    watch: form.watch,
    setValue: form.setValue,
    formState: form.formState,
    dateFields,
    addDate,
    removeDate: removeDateById,
    updateDate: updateDateField,
    tags: watchTags,
    addTag,
    removeTag,
    urlError,
    type: watchType,
    isLoading: createEventMutation.isPending,
    error: createEventMutation.error,
  };
}
