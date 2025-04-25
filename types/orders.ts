// app/types/order.ts

// Order list item (dashboard view)
export interface Order {
  order_id: string;
  order_number: string;
  po_reference_no: string;
  pi_document_no: string;
  customer_display_name: string;
  supplier_display_name: string;
  latest_state: string;
  latest_state_display_value: string;
  payment_terms: string;
  payment_terms_display_value: string;
  currency: string;
  amount_due: string;
  total_amount: string;
  latest_payment_date: string | null;
  created_date: string;
  modified_date: string;
}

// Order item detail
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

// Order status/activity log
export interface StateActivityLog {
  state_name: string;
  actual_date: string | null;
  estimated_date: string | null;
  is_current_state: boolean;
  logs?: Array<any>;
}

// Task estimate information
export interface TaskEstimate {
  id: number;
  estimated_date_value: string | null;
  state_type_value: string;
  state_type: string;
  actual_date: string | null;
  order: string;
  estimated_date: string | null;
}

// Detailed order information (order details page)
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

// User information (for POCs)
export interface User {
  user_id: string;
  given_name: string;
  family_name: string;
  phone_number: string;
  email: string;
  profile_image: string | null;
}

// Point of Contact
export interface POC {
  order_poc_id: string;
  order: string;
  user: User[];
  internal_team: string;
  poc_type: string;
  created_by: string;
  last_updated_by: string;
}

export interface ActivityLog {
  activity_log: string;
  timestamp: string;
}
