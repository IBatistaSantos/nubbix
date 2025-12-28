import { describe, it, expect, beforeEach } from "bun:test";
import { DependencyContainer } from "../DependencyContainer";

describe("DependencyContainer", () => {
  let container: DependencyContainer;

  beforeEach(() => {
    container = new DependencyContainer();
  });

  describe("register", () => {
    it("should register a factory", () => {
      container.register("test", () => ({ value: "test" }));

      expect(container.has("test")).toBe(true);
    });

    it("should resolve registered dependency", () => {
      container.register("test", () => ({ value: "test" }));

      const instance = container.resolve<{ value: string }>("test");
      expect(instance.value).toBe("test");
    });

    it("should create new instance on each resolve", () => {
      let counter = 0;
      container.register("test", () => ({ value: ++counter }));

      const instance1 = container.resolve<{ value: number }>("test");
      const instance2 = container.resolve<{ value: number }>("test");

      expect(instance1.value).toBe(1);
      expect(instance2.value).toBe(2);
      expect(instance1).not.toBe(instance2);
    });
  });

  describe("registerSingleton", () => {
    it("should register singleton", () => {
      container.registerSingleton("singleton", () => ({ value: "test" }));

      expect(container.has("singleton")).toBe(true);
    });

    it("should return same instance on multiple resolves", () => {
      container.registerSingleton("singleton", () => ({ value: Math.random() }));

      const instance1 = container.resolve<{ value: number }>("singleton");
      const instance2 = container.resolve<{ value: number }>("singleton");

      expect(instance1.value).toBe(instance2.value);
      expect(instance1).toBe(instance2);
    });
  });

  describe("resolve", () => {
    it("should throw error when dependency not found", () => {
      expect(() => container.resolve("notFound")).toThrow("Dependency 'notFound' not found");
    });

    it("should resolve registered dependency", () => {
      container.register("test", () => "resolved");

      expect(container.resolve<string>("test")).toBe("resolved");
    });
  });

  describe("has", () => {
    it("should return false for unregistered dependency", () => {
      expect(container.has("notFound")).toBe(false);
    });

    it("should return true for registered dependency", () => {
      container.register("test", () => ({}));
      expect(container.has("test")).toBe(true);
    });

    it("should return true for registered singleton", () => {
      container.registerSingleton("singleton", () => ({}));
      expect(container.has("singleton")).toBe(true);
    });
  });

  describe("clear", () => {
    it("should clear all registered dependencies", () => {
      container.register("test1", () => ({}));
      container.registerSingleton("test2", () => ({}));

      container.clear();

      expect(container.has("test1")).toBe(false);
      expect(container.has("test2")).toBe(false);
    });
  });
});
