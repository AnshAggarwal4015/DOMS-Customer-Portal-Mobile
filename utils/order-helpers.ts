// Get status color
export const getStatusColor = (state: string) => {
  const lower = state.toLowerCase();
  if (lower.includes('completed')) return '#10b981'; // Green
  if (lower.includes('confirmed') || lower.includes('manufactured'))
    return '#0ea5e9'; // Blue
  if (lower.includes('awaiting') || lower.includes('pending')) return '#f59e0b'; // Orange
  if (lower.includes('cancel')) return '#ef4444'; // Red
  return '#6366f1'; // Default purple
};

// Format currency with locale
export const formatCurrency = (amount: string, currency: string) => {
  return `${currency} ${parseFloat(amount).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })}`;
};

// Format date to readable format
export const formatDate = (dateString: string | null) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Get current state from order
export const getCurrentState = (order: any): string => {
  const currentStateObj = order.customer_state_activity_log.find(
    (state: any) => state.is_current_state
  );
  return currentStateObj ? currentStateObj.state_name : 'Processing';
};

// Get display for order items (e.g., "Item1 and 2 more items")
export const getItemsDisplay = (items: string[]): string => {
  if (!items || items.length === 0) {
    return '-';
  }

  if (items.length === 1) {
    return items[0];
  }

  return `${items[0]} and ${items.length - 1} more item${
    items.length - 1 > 1 ? 's' : ''
  }`;
};
