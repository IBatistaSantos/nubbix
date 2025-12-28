export class DependencyContainer {
  private instances = new Map<string, any>();
  private factories = new Map<string, () => any>();

  register<T>(key: string, factory: () => T): void {
    this.factories.set(key, factory);
  }

  registerSingleton<T>(key: string, factory: () => T): void {
    if (!this.instances.has(key)) {
      this.instances.set(key, factory());
    }
  }

  resolve<T>(key: string): T {
    if (this.instances.has(key)) {
      return this.instances.get(key) as T;
    }

    const factory = this.factories.get(key);
    if (!factory) {
      throw new Error(`Dependency '${key}' not found`);
    }

    return factory() as T;
  }

  has(key: string): boolean {
    return this.instances.has(key) || this.factories.has(key);
  }

  clear(): void {
    this.instances.clear();
    this.factories.clear();
  }
}

export const container = new DependencyContainer();
