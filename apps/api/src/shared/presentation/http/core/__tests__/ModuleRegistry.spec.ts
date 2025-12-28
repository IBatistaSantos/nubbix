import { describe, it, expect, beforeEach } from "bun:test";
import { ModuleRegistry } from "../ModuleRegistry";
import { ModuleRoutes, RouteDefinition } from "../../interfaces";

class MockModuleRoutes implements ModuleRoutes {
  constructor(private routes: RouteDefinition[]) {}

  getRoutes(): RouteDefinition[] {
    return this.routes;
  }
}

describe("ModuleRegistry", () => {
  let registry: ModuleRegistry;

  beforeEach(() => {
    registry = new ModuleRegistry();
  });

  describe("register", () => {
    it("should register a module successfully", () => {
      const module = new MockModuleRoutes([
        { method: "GET", path: "/test", handler: async () => ({ status: 200, data: {} }) },
      ]);

      expect(() => registry.register("test", module)).not.toThrow();
      expect(registry.getRegisteredModules()).toContain("test");
    });

    it("should throw error when registering duplicate module", () => {
      const module = new MockModuleRoutes([]);
      registry.register("test", module);

      expect(() => registry.register("test", module)).toThrow(
        "Module 'test' is already registered"
      );
    });
  });

  describe("getAllRoutes", () => {
    it("should return all routes from registered modules", () => {
      const module1 = new MockModuleRoutes([
        { method: "GET", path: "/route1", handler: async () => ({ status: 200, data: {} }) },
      ]);
      const module2 = new MockModuleRoutes([
        { method: "POST", path: "/route2", handler: async () => ({ status: 201, data: {} }) },
      ]);

      registry.register("module1", module1);
      registry.register("module2", module2);

      const routes = registry.getAllRoutes();
      expect(routes).toHaveLength(2);
      expect(routes[0].path).toBe("/route1");
      expect(routes[1].path).toBe("/route2");
    });

    it("should cache routes after first call", () => {
      const module = new MockModuleRoutes([
        { method: "GET", path: "/test", handler: async () => ({ status: 200, data: {} }) },
      ]);

      registry.register("test", module);
      const routes1 = registry.getAllRoutes();
      const routes2 = registry.getAllRoutes();

      expect(routes1).toBe(routes2);
    });

    it("should throw error on duplicate routes", () => {
      const module1 = new MockModuleRoutes([
        { method: "GET", path: "/duplicate", handler: async () => ({ status: 200, data: {} }) },
      ]);
      const module2 = new MockModuleRoutes([
        { method: "GET", path: "/duplicate", handler: async () => ({ status: 200, data: {} }) },
      ]);

      registry.register("module1", module1);
      registry.register("module2", module2);

      expect(() => registry.getAllRoutes()).toThrow("Duplicate route detected");
    });

    it("should allow same path with different methods", () => {
      const module = new MockModuleRoutes([
        { method: "GET", path: "/resource", handler: async () => ({ status: 200, data: {} }) },
        { method: "POST", path: "/resource", handler: async () => ({ status: 201, data: {} }) },
      ]);

      registry.register("test", module);
      const routes = registry.getAllRoutes();

      expect(routes).toHaveLength(2);
    });
  });

  describe("getRegisteredModules", () => {
    it("should return empty array when no modules registered", () => {
      expect(registry.getRegisteredModules()).toEqual([]);
    });

    it("should return all registered module names", () => {
      registry.register("module1", new MockModuleRoutes([]));
      registry.register("module2", new MockModuleRoutes([]));

      const modules = registry.getRegisteredModules();
      expect(modules).toHaveLength(2);
      expect(modules).toContain("module1");
      expect(modules).toContain("module2");
    });
  });

  describe("clear", () => {
    it("should clear all registered modules", () => {
      registry.register("test", new MockModuleRoutes([]));
      registry.clear();

      expect(registry.getRegisteredModules()).toHaveLength(0);
      expect(registry.getAllRoutes()).toHaveLength(0);
    });

    it("should clear cache when clearing", () => {
      const module = new MockModuleRoutes([
        { method: "GET", path: "/test", handler: async () => ({ status: 200, data: {} }) },
      ]);

      registry.register("test", module);
      registry.getAllRoutes();
      registry.clear();

      const routes = registry.getAllRoutes();
      expect(routes).toHaveLength(0);
    });
  });
});
