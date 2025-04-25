// app/services/dashboardService.ts
import httpClient from './httpClient';
import { ENDPOINTS } from '@/constants/api';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import { Order } from '@/types/orders';

export type OrdersResponse = PaginatedResponse<Order>;

/**
 * Fetch orders for the dashboard
 * @param page Page number
 * @param searchText Optional search text
 * @returns Promise with orders data
 */
export async function fetchOrders(
  page: number = 1,
  searchText: string = ''
): Promise<ApiResponse<OrdersResponse>> {
  const params = {
    page,
    search_text: searchText || undefined, // Only include if not empty
  };

  try {
    const response = await httpClient.get(ENDPOINTS.ORDERS, params);
    return response;
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}

/**
 * Search orders
 * @param searchText Text to search for
 * @param page Page number
 * @returns Promise with search results
 */
export async function searchOrders(
  searchText: string,
  page: number = 1
): Promise<ApiResponse<OrdersResponse>> {
  return fetchOrders(page, searchText);
}
