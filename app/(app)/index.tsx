// app\(app)\index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Import services and types
import { fetchOrders, OrdersResponse } from '@/services/dashboardService';
import { PageInfo } from '@/types/api';

// Import components
import OrderCard from '@/components/orders/orderCard';
import { Order } from '@/types/orders';

const { width } = Dimensions.get('window');

// Debounce delay in milliseconds
const DEBOUNCE_DELAY = 500;

interface DashboardState {
  orders: Order[];
  loading: boolean;
  refreshing: boolean;
  error: string;
  expandedOrderId: string | null;
  pageInfo: PageInfo;
}

export default function OrderDashboard() {
  const router = useRouter();

  const [state, setState] = useState<DashboardState>({
    orders: [],
    loading: true,
    refreshing: false,
    error: '',
    expandedOrderId: null,
    pageInfo: {
      total_count: 0,
      page_size: 10,
      current_page: 1,
      total_pages: 1,
    },
  });

  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');

  // Implement debouncing for search text
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  // Fetch orders when debounced search text changes or pagination changes
  useEffect(() => {
    loadOrders(1); // Reset to first page when search changes
  }, [debouncedSearchText]);

  useEffect(() => {
    if (debouncedSearchText === searchText) {
      loadOrders(state.pageInfo.current_page);
    }
  }, [state.pageInfo.current_page, searchText]);

  const loadOrders = async (page: number, isRefreshing = false) => {
    try {
      setState((prev) => ({
        ...prev,
        loading: !isRefreshing ? true : prev.loading,
        refreshing: isRefreshing,
        pageInfo: {
          ...prev.pageInfo,
          current_page: page,
        },
      }));

      const response = await fetchOrders(page, debouncedSearchText);

      if (response.success && response.data.results) {
        const { data } = response;
        setState((prev) => ({
          ...prev,
          orders: data.results,
          error: '',
          loading: false,
          refreshing: false,
          pageInfo: {
            ...prev.pageInfo,
            total_count: data?.count ?? prev.pageInfo.total_count,
            total_pages: Math.ceil(data?.count / prev.pageInfo.page_size),
          },
        }));
      } else {
        setState((prev) => ({
          ...prev,
          error: 'Failed to fetch orders',
          loading: false,
          refreshing: false,
        }));
      }
    } catch (err) {
      console.error(err);
      setState((prev) => ({
        ...prev,
        error: 'Error connecting to server',
        loading: false,
        refreshing: false,
      }));
    }
  };

  const onRefresh = () => {
    loadOrders(1, true);
  };

  // Handle order card view
  const handleViewOrder = (orderId: string) => {
    // console.log(`View order: ${orderId}`);
    // Navigate to order details page
    router.push(`/order/${orderId}`);
  };

  // Pagination control
  const goToPrevPage = () => {
    if (state.pageInfo.current_page > 1) {
      loadOrders(state.pageInfo.current_page - 1);
    }
  };

  const goToNextPage = () => {
    if (state.pageInfo.current_page < state.pageInfo.total_pages) {
      loadOrders(state.pageInfo.current_page + 1);
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchText(text);
  };

  const { orders, loading, refreshing, error, expandedOrderId, pageInfo } =
    state;
  const { current_page, total_pages, total_count } = pageInfo;

  // Show "loading" screen only on the first load
  if (loading && current_page === 1 && orders.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E74C3C" />
        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    );
  }

  // If an error occurred and no orders are displayed
  if (error && orders.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#ef4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => loadOrders(current_page)}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.orderCountHeader}>
          <Text style={styles.headerTitle}>Orders</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{total_count}</Text>
          </View>
        </View>

        {/* Search box */}
        <View style={styles.searchContainer}>
          <Feather
            name="search"
            size={16}
            color="#9CA3AF"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={handleSearchChange}
          />
          <TouchableOpacity style={styles.searchInfoButton}>
            <Feather name="info" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#E74C3C']}
            tintColor="#E74C3C"
            title="Refreshing orders..."
            titleColor="#64748b"
          />
        }
      >
        {/* Loading overlay (if fetching more) */}
        {loading && orders.length > 0 && (
          <View style={styles.overlayLoading}>
            <ActivityIndicator size="large" color="#E74C3C" />
          </View>
        )}

        {orders.length === 0 && !loading ? (
          <View style={styles.noOrdersContainer}>
            <Feather name="inbox" size={48} color="#9CA3AF" />
            <Text style={styles.noOrdersText}>
              {searchText ? 'No orders match your search' : 'No orders found'}
            </Text>
          </View>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.order_id}
              order={order}
              expanded={expandedOrderId === order.order_id}
              onPress={() => handleViewOrder(order.order_id)}
            />
          ))
        )}

        {/* Pagination Controls - only show if there are orders and more than one page */}
        {orders.length > 0 && total_pages > 1 && (
          <View style={styles.paginationWrapper}>
            <Text style={styles.paginationText}>
              {current_page} of {total_pages}
            </Text>
            <View style={styles.paginationButtons}>
              <TouchableOpacity
                disabled={current_page <= 1}
                onPress={goToPrevPage}
                style={[
                  styles.paginationButton,
                  current_page <= 1 && styles.paginationButtonDisabled,
                ]}
              >
                <Feather
                  name="chevron-left"
                  size={20}
                  color={current_page <= 1 ? '#D1D5DB' : '#6B7280'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                disabled={current_page >= total_pages}
                onPress={goToNextPage}
                style={[
                  styles.paginationButton,
                  current_page >= total_pages &&
                    styles.paginationButtonDisabled,
                ]}
              >
                <Feather
                  name="chevron-right"
                  size={20}
                  color={current_page >= total_pages ? '#D1D5DB' : '#6B7280'}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerContainer: {
    padding: 16,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  orderCountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginRight: 8,
  },
  countBadge: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 6,
  },
  countText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    height: '100%',
  },
  searchInfoButton: {
    padding: 4,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    minHeight: 300,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#E74C3C',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  noOrdersContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noOrdersText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  paginationWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'center',
  },
  paginationText: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 8,
  },
  paginationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paginationButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginLeft: 8,
  },
  paginationButtonDisabled: {
    backgroundColor: '#F3F4F6',
  },
  overlayLoading: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    zIndex: 1000,
    alignItems: 'center',
  },
});
