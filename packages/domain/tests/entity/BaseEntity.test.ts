import { describe, it, expect, beforeEach } from "bun:test";
import { BaseEntity, BaseProps } from "../../src/entity/BaseEntity";
import { ID } from "../../src/vo/ID";
import { Status } from "../../src/vo/Status";
import { faker } from "@faker-js/faker";

class TestEntity extends BaseEntity {
  constructor(props: BaseProps) {
    super(props);
  }

  static asFaker(overrides?: Partial<BaseProps>): TestEntity {
    return new TestEntity({
      ...BaseEntity.generateBaseFakerProps(),
      ...overrides,
    });
  }
}

describe("BaseEntity", () => {
  describe("constructor", () => {
    it("should create an entity with default values", () => {
      const entity = new TestEntity({});

      expect(entity.id).toBeInstanceOf(ID);
      expect(entity.id.value).toBeDefined();
      expect(entity.createdAt).toBeInstanceOf(Date);
      expect(entity.updatedAt).toBeInstanceOf(Date);
      expect(entity.deletedAt).toBeNull();
      expect(entity.status.isActive()).toBe(true);
    });

    it("should create an entity with provided values", () => {
      const now = new Date();
      const id = ID.create("test-id");
      const status = Status.inactive();

      const entity = new TestEntity({
        id: id.value,
        createdAt: now,
        updatedAt: now,
        deletedAt: now,
        status,
      });

      expect(entity.id.value).toBe(id.value);
      expect(entity.createdAt).toEqual(now);
      expect(entity.updatedAt).toEqual(now);
      expect(entity.deletedAt).toEqual(now);
      expect(entity.status).toBe(status);
    });
  });

  describe("deactivate", () => {
    it("should deactivate the entity", () => {
      const entity = new TestEntity({});
      const initialUpdatedAt = entity.updatedAt;

      // Wait a bit to ensure updatedAt changes
      Bun.sleepSync(10);

      entity.deactivate();

      expect(entity.status.isInactive()).toBe(true);
      expect(entity.deletedAt).toBeInstanceOf(Date);
      expect(entity.updatedAt.getTime()).toBeGreaterThan(
        initialUpdatedAt.getTime()
      );
    });
  });

  describe("activate", () => {
    it("should activate the entity", () => {
      const entity = new TestEntity({});
      entity.deactivate();

      const initialUpdatedAt = entity.updatedAt;
      Bun.sleepSync(10);

      entity.activate();

      expect(entity.status.isActive()).toBe(true);
      expect(entity.deletedAt).toBeNull();
      expect(entity.updatedAt.getTime()).toBeGreaterThan(
        initialUpdatedAt.getTime()
      );
    });
  });

  describe("toJSON", () => {
    it("should return a JSON representation", () => {
      const now = new Date();
      const id = ID.create("test-id");
      const entity = new TestEntity({
        id: id.value,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      });

      const json = entity.toJSON();

      expect(json).toEqual({
        id: id.value,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        status: "active",
      });
    });
  });

  describe("generateBaseFakerProps", () => {
    it("should generate base faker props", () => {
      const props = BaseEntity.generateBaseFakerProps.call(TestEntity);

      expect(props.id).toBeDefined();
      expect(props.createdAt).toBeInstanceOf(Date);
      expect(props.updatedAt).toBeInstanceOf(Date);
      expect(props.deletedAt).toBeNull();
      expect(props.status?.isActive()).toBe(true);
    });
  });

  describe("asFaker", () => {
    it("should create an entity with faker data", () => {
      const entity = TestEntity.asFaker();

      expect(entity).toBeInstanceOf(TestEntity);
      expect(entity.id).toBeInstanceOf(ID);
      expect(entity.status.isActive()).toBe(true);
    });

    it("should allow overriding faker props", () => {
      const customId = ID.create("custom-id");
      const entity = TestEntity.asFaker({
        id: customId.value,
      });

      expect(entity.id.value).toBe(customId.value);
    });
  });
});

