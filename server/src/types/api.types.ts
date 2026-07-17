/**
 * Standard pagination metadata envelope for lists.
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Standard envelope for success API responses.
 */
export interface ApiResponse<T> {
  status: 'success';
  data: T;
  meta?: PaginationMeta;
}

/**
 * Standard envelope for API error responses.
 */
export interface ApiErrorResponse {
  status: 'error' | 'fail';
  error: string;
  message: string;
  errors?: Record<string, string[]>;
}
