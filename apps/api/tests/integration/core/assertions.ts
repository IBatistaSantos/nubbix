import { expect } from "bun:test";

export class TestAssertions {
  static expectSuccess<T>(response: { status: number; data: T }, expectedStatus = 201) {
    expect(response.status).toBe(expectedStatus);
    expect(response.data).toBeDefined();
    return response.data;
  }

  static expectError(response: any, expectedStatus?: number) {
    if (expectedStatus) {
      expect(response.status).toBe(expectedStatus);
    } else {
      expect(response).toBeDefined();
    }
  }

  static expectEntityExists<T>(entity: T | null, message = "Entity should exist") {
    expect(entity).toBeDefined();
    expect(entity).not.toBeNull();
    return entity as T;
  }

  static expectProperty<T>(entity: T, property: keyof T | string, expectedValue: any) {
    expect((entity as any)[property]).toBe(expectedValue);
  }
}
