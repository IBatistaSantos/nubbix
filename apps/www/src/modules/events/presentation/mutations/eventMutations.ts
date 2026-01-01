import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateEventInput, CreateEventOutput } from "../../application/dtos/CreateEventDTO";
import type { DuplicateEventOutput } from "../../application/dtos/DuplicateEventDTO";
import type {
  CreateEventUseCase,
  DeleteEventUseCase,
  DuplicateEventUseCase,
} from "../../application/useCases";

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

export interface DuplicateEventInput {
  name: string;
  url: string;
  dates: Array<{
    date: string;
    startTime: string;
    endTime: string;
  }>;
}

export function useDuplicateEventMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      eventId,
      input,
      useCase,
    }: {
      eventId: string;
      input: DuplicateEventInput;
      useCase: DuplicateEventUseCase;
    }): Promise<DuplicateEventOutput> => {
      return useCase.run({ eventId, ...input });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
    },
    onError: (error) => {
      console.error("Error duplicating event:", error);
    },
  });
}

export type { CreateEventInput };
export type { CreateEventOutput };
