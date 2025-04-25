// app/types/api.ts

// Common API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Pagination response structure
export interface PaginatedResponse<T> {
  count: number;
  results: T[];
  page_size?: number;
  page_number?: number;
}

// Page information for UI components
export interface PageInfo {
  total_count: number;
  page_size: number;
  current_page: number;
  total_pages: number;
}
