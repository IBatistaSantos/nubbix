import { RouteDefinition, ModuleRoutes } from "../../../../shared/presentation/http/interfaces";
import { authMiddleware } from "../../../../infrastructure/http/middleware/authMiddleware";
import {
  createEventController,
  updateEventController,
  getEventController,
  listEventsController,
  deleteEventController,
  listEventDatesController,
  updateEventDatesController,
} from "../controllers";

export class EventRoutes implements ModuleRoutes {
  getRoutes(): RouteDefinition[] {
    return [
      {
        method: "POST",
        path: "/events",
        handler: createEventController,
        middleware: [authMiddleware()],
      },
      {
        method: "GET",
        path: "/events",
        handler: listEventsController,
        middleware: [authMiddleware()],
      },
      {
        method: "GET",
        path: "/events/:id",
        handler: getEventController,
        middleware: [authMiddleware()],
      },
      {
        method: "PUT",
        path: "/events/:id",
        handler: updateEventController,
        middleware: [authMiddleware()],
      },
      {
        method: "DELETE",
        path: "/events/:id",
        handler: deleteEventController,
        middleware: [authMiddleware()],
      },
      {
        method: "GET",
        path: "/events/:id/dates",
        handler: listEventDatesController,
        middleware: [authMiddleware()],
      },
      {
        method: "PATCH",
        path: "/events/:id/dates",
        handler: updateEventDatesController,
        middleware: [authMiddleware()],
      },
    ];
  }
}

export const eventRoutes = new EventRoutes();
