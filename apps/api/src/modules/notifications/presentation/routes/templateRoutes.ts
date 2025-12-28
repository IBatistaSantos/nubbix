import { RouteDefinition, ModuleRoutes } from "../../../../shared/presentation/http/interfaces";
import { createTemplateController } from "../controllers/CreateTemplateController";
import { updateTemplateController } from "../controllers/UpdateTemplateController";
import { getTemplateController } from "../controllers/GetTemplateController";
import { listTemplatesController } from "../controllers/ListTemplatesController";
import { deleteTemplateController } from "../controllers/DeleteTemplateController";
import { getTemplateByContextController } from "../controllers/GetTemplateByContextController";

export class TemplateRoutes implements ModuleRoutes {
  getRoutes(): RouteDefinition[] {
    return [
      {
        method: "POST",
        path: "/templates",
        handler: createTemplateController,
      },
      {
        method: "GET",
        path: "/templates/:id",
        handler: getTemplateController,
      },
      {
        method: "GET",
        path: "/templates",
        handler: listTemplatesController,
      },
      {
        method: "PUT",
        path: "/templates/:id",
        handler: updateTemplateController,
      },
      {
        method: "DELETE",
        path: "/templates/:id",
        handler: deleteTemplateController,
      },
      {
        method: "GET",
        path: "/templates/by-context",
        handler: getTemplateByContextController,
      },
    ];
  }
}

export const templateRoutes = new TemplateRoutes();
