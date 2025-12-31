import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateEventInput, CreateEventOutput } from "../../application/dtos/CreateEventDTO";
import type { CreateEventUseCase, DeleteEventUseCase } from "../../application/useCases";

const EVENTS_QUERY_KEY = ["events"] as const;

export function useCreateEventMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      input,
      useCase,
    }: {
      input: CreateEventInput;
      useCase: CreateEventUseCase;
    }): Promise<CreateEventOutput> => {
      return useCase.run(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
    },
    onError: (error) => {
      console.error("Error creating event:", error);
    },
  });
}

export function useDeleteEventMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      eventId,
      useCase,
    }: {
      eventId: string;
      useCase: DeleteEventUseCase;
    }): Promise<void> => {
      return useCase.run(eventId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
    },
    onError: (error) => {
      console.error("Error deleting event:", error);
    },
  });
}

export type { CreateEventInput };
export type { CreateEventOutput };
