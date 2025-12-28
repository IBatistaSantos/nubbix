export type TransactionContext = unknown;

export interface TransactionManager {
  runInTransaction<T>(callback: (tx: TransactionContext) => Promise<T>): Promise<T>;
}
