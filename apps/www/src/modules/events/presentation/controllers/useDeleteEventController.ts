"use client";

import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useDeleteEventMutation } from "../mutations/eventMutations";
import { getEventErrorMessage } from "../utils/eventErrorUtils";
import { ApiClientError } from "../../../../shared/http/ApiClientError";
import { useHttpClient } from "../../../../shared/http/useHttpClient";
import { DeleteEventUseCase } from "../../application/useCases";

export function useDeleteEventController(onSuccess?: () => void) {
  const deleteEventMutation = useDeleteEventMutation();

  const httpClient = useHttpClient();
  const deleteEventUseCase = useMemo(() => new DeleteEventUseCase(httpClient), [httpClient]);

  const deleteEvent = useCallback(
    async (eventId: string, eventName: string) => {
      try {
        await deleteEventMutation.mutateAsync({
          eventId,
          useCase: deleteEventUseCase,
        });

        toast.success("Evento excluído com sucesso!", {
          description: `O evento "${eventName}" foi excluído permanentemente.`,
          duration: 5000,
        });

        onSuccess?.();
      } catch (error) {
        console.error("Error deleting event:", error);

        if (error instanceof ApiClientError) {
          const errorMessage = getEventErrorMessage(error) || "Erro ao excluir evento";
          toast.error("Erro ao excluir evento", {
            description: errorMessage,
            duration: 5000,
          });
        } else {
          toast.error("Erro inesperado", {
            description: "Ocorreu um erro inesperado ao excluir o evento. Tente novamente.",
            duration: 5000,
          });
        }

        throw error;
      }
    },
    [deleteEventMutation, deleteEventUseCase, onSuccess]
  );

  return {
    deleteEvent,
    isLoading: deleteEventMutation.isPending,
    error: deleteEventMutation.error,
  };
}
