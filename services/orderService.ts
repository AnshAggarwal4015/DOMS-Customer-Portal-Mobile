// app/services/orderService.ts
import httpClient from './httpClient';

// Type definitions for response data
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface OrderItem {
  order_item_id: string;
  product_name: string;
  selling_price: string;
  quantity: string;
  total_amount: string;
  country_of_origin_display_value: string;
  package_details: string;
  description: string;
  hs_code: string;
  is_pre_shipment_sample_required: boolean;
  is_hazardous: boolean;
}

export interface StateActivityLog {
  state_name: string;
  actual_date: string | null;
  estimated_date: string | null;
  is_current_state: boolean;
  logs?: Array<any>;
}

export interface TaskEstimate {
  id: number;
  estimated_date_value: string | null;
  state_type_value: string;
  state_type: string;
  actual_date: string | null;
  order: string;
  estimated_date: string | null;
}

export interface OrderDetails {
  order_item: OrderItem[];
  customer_state_activity_log: StateActivityLog[];
  po_reference_no: string;
  pi_document_no: string;
  payment_terms_display_value: string;
  amount_due: string;
  total: string;
  currency: string;
  latest_payment_date: string | null;
  task_estimates: TaskEstimate[];
  order_id: string;
}

export interface User {
  user_id: string;
  given_name: string;
  family_name: string;
  phone_number: string;
  email: string;
  profile_image: string | null;
}

export interface POC {
  order_poc_id: string;
  order: string;
  user: User[];
  internal_team: string;
  poc_type: string;
  created_by: string;
  last_updated_by: string;
}

/**
 * Fetch order overview details
 * @param id Order ID
 * @returns Promise with order details
 */
export async function fetchOrderOverview(
  id: string
): Promise<ApiResponse<OrderDetails>> {
  const endpoint = `/customer/dashboard/order/${id}/overview/`;

  try {
    const response = await httpClient.get(endpoint);
    return response;
  } catch (error: any) {
    console.error('Error fetching order overview:', error);
    throw error;
  }
}

/**
 * Fetch points of contact for an order
 * @param id Order ID
 * @returns Promise with POC data
 */
export async function fetchOrderPOCs(id: string): Promise<ApiResponse<POC[]>> {
  const endpoint = `/customer/dashboard/order/${id}/pocs/`;

  try {
    const response = await httpClient.get(endpoint);
    return response;
  } catch (error: any) {
    console.error('Error fetching order POCs:', error);
    throw error;
  }
}

/**
 * Fetch order documents
 * @param id Order ID
 * @returns Promise with documents data
 */
export async function fetchOrderDocuments(
  id: string
): Promise<ApiResponse<any>> {
  const endpoint = `/customer/dashboard/order/${id}/documents/`;

  try {
    const response = await httpClient.get(endpoint);
    return response;
  } catch (error: any) {
    console.error('Error fetching order documents:', error);
    throw error;
  }
}

/**
 * Fetch order tracking information
 * @param id Order ID
 * @returns Promise with tracking data
 */
export async function fetchOrderTracking(
  id: string
): Promise<ApiResponse<any>> {
  const endpoint = `/customer/dashboard/order/${id}/shipment-tracking/`;

  try {
    const response = await httpClient.get(endpoint);
    return response;
  } catch (error: any) {
    console.error('Error fetching order tracking:', error);
    throw error;
  }
}

/**
 * Fetch order stuffing photos
 * @param id Order ID
 * @returns Promise with stuffing photos data
 */
export async function fetchOrderStuffingPhotos(
  id: string
): Promise<ApiResponse<any>> {
  const endpoint = `/customer/dashboard/order/${id}/stuffing-images/`;

  try {
    const response = await httpClient.get(endpoint);
    return response;
  } catch (error: any) {
    console.error('Error fetching stuffing photos:', error);
    throw error;
  }
}

/**
 * Fetch order progress information
 * @param id Order ID
 * @returns Promise with progress data
 */
export async function fetchOrderProgress(
  id: string
): Promise<ApiResponse<any>> {
  const endpoint = `/customer/dashboard/order/${id}/activity-logs/`;

  try {
    const response = await httpClient.get(endpoint);
    return response;
  } catch (error: any) {
    console.error('Error fetching order progress:', error);
    throw error;
  }
}
