import { describe, it, expect, beforeEach } from "bun:test";
import { Repository } from "../../src/repository/Repository";
import { BaseEntity, BaseProps } from "../../src/entity/BaseEntity";
import { ID } from "../../src/vo/ID";

class TestEntity extends BaseEntity {
  constructor(props: BaseProps) {
    super(props);
  }
}

class InMemoryRepository implements Repository<TestEntity> {
  private entities: Map<string, TestEntity> = new Map();

  async findById(id: ID): Promise<TestEntity | null> {
    const entity = this.entities.get(id.value);
    return entity || null;
  }

  async save(entity: TestEntity): Promise<TestEntity> {
    this.entities.set(entity.id.value, entity);
    return entity;
  }

  async delete(id: ID): Promise<void> {
    this.entities.delete(id.value);
  }

  async exists(id: ID): Promise<boolean> {
    return this.entities.has(id.value);
  }
}

describe("Repository", () => {
  let repository: InMemoryRepository;

  beforeEach(() => {
    repository = new InMemoryRepository();
  });

  describe("findById", () => {
    it("should return entity when found", async () => {
      const entity = new TestEntity({});
      await repository.save(entity);

      const found = await repository.findById(entity.id);

      expect(found).not.toBeNull();
      expect(found?.id.value).toBe(entity.id.value);
    });

    it("should return null when not found", async () => {
      const id = ID.create("non-existent");

      const found = await repository.findById(id);

      expect(found).toBeNull();
    });
  });

  describe("save", () => {
    it("should save an entity", async () => {
      const entity = new TestEntity({});

      const saved = await repository.save(entity);

      expect(saved.id.value).toBe(entity.id.value);
      const found = await repository.findById(entity.id);
      expect(found).not.toBeNull();
    });

    it("should update an existing entity", async () => {
      const entity = new TestEntity({});
      await repository.save(entity);

      entity.deactivate();
      const updated = await repository.save(entity);

      expect(updated.status.isInactive()).toBe(true);
      const found = await repository.findById(entity.id);
      expect(found?.status.isInactive()).toBe(true);
    });
  });

  describe("delete", () => {
    it("should delete an entity", async () => {
      const entity = new TestEntity({});
      await repository.save(entity);

      await repository.delete(entity.id);

      const found = await repository.findById(entity.id);
      expect(found).toBeNull();
    });

    it("should not throw when deleting non-existent entity", async () => {
      const id = ID.create("non-existent");

      await expect(async () => {
        await repository.delete(id);
      }).not.toThrow();
    });
  });

  describe("exists", () => {
    it("should return true when entity exists", async () => {
      const entity = new TestEntity({});
      await repository.save(entity);

      const exists = await repository.exists(entity.id);

      expect(exists).toBe(true);
    });

    it("should return false when entity does not exist", async () => {
      const id = ID.create("non-existent");

      const exists = await repository.exists(id);

      expect(exists).toBe(false);
    });
  });
});
