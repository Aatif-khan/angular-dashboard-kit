/**
 * Helper representing a simple dictionary object mapping keys to values.
 */
export type Dictionary<T = any> = Record<string, T>;

/**
 * Utility helper type representing a value that can be null or undefined.
 */
export type Nullable<T> = T | null | undefined;

/**
 * Reusable audit metadata properties for database schemas and objects.
 */
export interface Auditable {
  createdAt: Date;
  updatedAt: Date;
}
