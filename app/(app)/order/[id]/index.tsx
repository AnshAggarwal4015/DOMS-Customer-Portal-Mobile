// app/(app)/order/[id]/index.tsx
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { formatDate } from '@/utils/order-helpers';
import { useAccessToken } from '@/stores/auth';

// Import services and types
import { fetchOrderOverview } from '@/services/orderService';
import {
  OrderDetails as OrderDetailsType,
  StateActivityLog,
  TaskEstimate,
} from '@/types/orders';

// Import all the order component modules we've created
import OrderOverview from '@/components/orders/orderOverview';
import OrderDocuments from '@/components/orders/orderDocuments';
import OrderTracking from '@/components/orders/orderTracking';
import StuffingPhotos from '@/components/orders/stuffingPhotos';
import OrderProgress from '@/components/orders/orderProgress';
import People from '@/components/orders/people';

export default function OrderDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const token = useAccessToken();
  const [order, setOrder] = useState<OrderDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadOrderDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await fetchOrderOverview(id as string);

        if (response.success && response.data) {
          setOrder(response.data);
          setError(null);
        } else {
          setError('Failed to load order details');
          console.error('API Error:', response);
        }
      } catch (error) {
        setError('Error connecting to server');
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetails();
  }, [id, token]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (error || !order) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Order not found'}</Text>
        <TouchableOpacity
          style={styles.backButtonContainer}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Get the current status from the activity log
  const getCurrentState = (): string => {
    const currentState = order.customer_state_activity_log?.find(
      (state: StateActivityLog) => state.is_current_state
    );
    return currentState ? currentState.state_name : '';
  };

  // Determine status index for the timeline
  const getStatusIndex = (): number => {
    // The three main stages we show in the timeline
    const timelineStages = [
      'Order Confirmed',
      'Shipment In Transit',
      'Order Completed',
    ];

    // Find the current state
    const currentState = order.customer_state_activity_log?.find(
      (state: StateActivityLog) => state.is_current_state
    );

    if (!currentState) return 0;

    // Map the API state name to our timeline stages
    const stateName = currentState.state_name;

    if (stateName === 'Order Confirmed') return 0;
    if (
      stateName === 'Shipment In Transit' ||
      stateName === 'Shipment Departure from POL' ||
      stateName === 'Export Clearance Obtained' ||
      stateName === 'Shipment Arrival at POD'
    )
      return 1;
    if (stateName === 'Order Completed') return 2;

    return 0;
  };

  const statusIndex = getStatusIndex();

  // Get the product display name
  const getProductDisplay = (): string => {
    if (!order.order_item || order.order_item.length === 0) {
      return '-';
    }

    if (order.order_item.length === 1) {
      return order.order_item[0].product_name;
    }

    return `${order.order_item[0].product_name} and ${
      order.order_item.length - 1
    } more item${order.order_item.length - 1 > 1 ? 's' : ''}`;
  };

  // Render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OrderOverview orderId={order.order_id} />;
      case 'documents':
        return <OrderDocuments orderId={order.order_id} />;
      case 'tracking':
        return <OrderTracking orderId={order.order_id} />;
      case 'photos':
        return <StuffingPhotos orderId={order.order_id} />;
      case 'progress':
        return <OrderProgress orderId={order.order_id} />;
      case 'people':
        return <People orderId={order.order_id} />;
      default:
        return <OrderOverview orderId={order.order_id} />;
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* Header with back button */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={20} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Orders List</Text>
        </View>
      </View>

      <ScrollView style={styles.container}>
        {/* Order Details Card */}
        <View style={styles.card}>
          {/* Product Section */}
          <View style={styles.section}>
            <View style={styles.sectionIconContainer}>
              <Text style={styles.sectionIcon}>📦</Text>
            </View>
            <View style={styles.productInfoContainer}>
              <Text style={styles.sectionLabel}>Product</Text>
              <Text style={styles.sectionValue}>{getProductDisplay()}</Text>
            </View>
          </View>

          {/* Proforma Invoice Section */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionLabel}>Proforma Invoice</Text>
            <Text style={styles.sectionValue}>{order.pi_document_no}</Text>
          </View>

          {/* PO Reference Number Section */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionLabel}>PO Reference Number</Text>
            <Text style={styles.sectionValue}>{order.po_reference_no}</Text>
          </View>

          {/* Payment Terms Section */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionLabel}>Payment Terms</Text>
            <Text style={styles.sectionValue}>
              {order.payment_terms_display_value}
            </Text>
          </View>

          {/* Due Payment/Total Payment Section */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionLabel}>Due Payment/Total Payment</Text>
            <Text style={styles.sectionValue}>
              {order.currency} {parseFloat(order.amount_due).toLocaleString()}/
              {order.currency} {parseFloat(order.total).toLocaleString()}
            </Text>
          </View>

          {/* Latest Payment Date Section */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionLabel}>Latest Payment Date</Text>
            <Text style={styles.sectionValue}>
              {order.latest_payment_date
                ? formatDate(order.latest_payment_date)
                : '-'}
            </Text>
          </View>

          {/* Estimated Arrival Date Section */}
          {order.task_estimates && (
            <View style={styles.infoSection}>
              <Text style={styles.sectionLabel}>Estimated Arrival Date</Text>
              <Text style={styles.sectionValue}>
                {order.task_estimates.find(
                  (task: TaskEstimate) =>
                    task.state_type === 'Shipment Arrival at POD'
                )?.estimated_date_value
                  ? formatDate(
                      order.task_estimates.find(
                        (task: TaskEstimate) =>
                          task.state_type === 'Shipment Arrival at POD'
                      )?.estimated_date_value || ''
                    )
                  : '-'}
              </Text>
            </View>
          )}

          {/* Order Status Timeline */}
          <View style={styles.timelineContainer}>
            <View style={styles.timelineLine} />

            {/* Order Confirmed Stage */}
            <View style={styles.timelineStage}>
              <View
                style={[
                  styles.timelineCircle,
                  statusIndex >= 0 && styles.timelineCircleActive,
                ]}
              >
                {statusIndex >= 0 && (
                  <View style={styles.timelineCircleInner} />
                )}
              </View>
              <View style={styles.timelineTextContainer}>
                <Text
                  style={[
                    styles.timelineText,
                    statusIndex >= 0 && styles.timelineTextActive,
                  ]}
                >
                  Order Confirmed
                </Text>
                {statusIndex >= 0 &&
                  order.customer_state_activity_log?.find(
                    (state: StateActivityLog) =>
                      state.state_name === 'Order Confirmed'
                  )?.actual_date && (
                    <Text style={styles.timelineDate}>
                      {formatDate(
                        order.customer_state_activity_log.find(
                          (state: StateActivityLog) =>
                            state.state_name === 'Order Confirmed'
                        )?.actual_date || ''
                      )}
                    </Text>
                  )}
              </View>
            </View>

            {/* Shipment In Transit Stage */}
            <View style={styles.timelineStage}>
              <View
                style={[
                  styles.timelineCircle,
                  statusIndex >= 1 && styles.timelineCircleActive,
                  statusIndex === 1 && styles.timelineCircleCurrent,
                ]}
              >
                {statusIndex >= 1 && (
                  <View style={styles.timelineCircleInner} />
                )}
              </View>
              <View style={styles.timelineTextContainer}>
                <Text
                  style={[
                    styles.timelineText,
                    statusIndex >= 1 && styles.timelineTextActive,
                  ]}
                >
                  Shipment In Transit
                </Text>
              </View>
            </View>

            {/* Order Completed Stage */}
            <View style={styles.timelineStage}>
              <View
                style={[
                  styles.timelineCircle,
                  statusIndex >= 2 && styles.timelineCircleActive,
                ]}
              >
                {statusIndex >= 2 && (
                  <View style={styles.timelineCircleInner} />
                )}
              </View>
              <View style={styles.timelineTextContainer}>
                <Text
                  style={[
                    styles.timelineText,
                    statusIndex >= 2 && styles.timelineTextActive,
                  ]}
                >
                  Order Completed
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      {/* Tabs for different sections */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
            onPress={() => setActiveTab('overview')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'overview' && styles.activeTabText,
              ]}
            >
              Overview
            </Text>
            {activeTab === 'overview' && (
              <View style={styles.activeTabIndicator} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'documents' && styles.activeTab]}
            onPress={() => setActiveTab('documents')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'documents' && styles.activeTabText,
              ]}
            >
              Documents
            </Text>
            {activeTab === 'documents' && (
              <View style={styles.activeTabIndicator} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'tracking' && styles.activeTab]}
            onPress={() => setActiveTab('tracking')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'tracking' && styles.activeTabText,
              ]}
            >
              Tracking
            </Text>
            {activeTab === 'tracking' && (
              <View style={styles.activeTabIndicator} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'photos' && styles.activeTab]}
            onPress={() => setActiveTab('photos')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'photos' && styles.activeTabText,
              ]}
            >
              Photos
            </Text>
            {activeTab === 'photos' && (
              <View style={styles.activeTabIndicator} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'progress' && styles.activeTab]}
            onPress={() => setActiveTab('progress')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'progress' && styles.activeTabText,
              ]}
            >
              Progress
            </Text>
            {activeTab === 'progress' && (
              <View style={styles.activeTabIndicator} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'people' && styles.activeTab]}
            onPress={() => setActiveTab('people')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'people' && styles.activeTabText,
              ]}
            >
              People
            </Text>
            {activeTab === 'people' && (
              <View style={styles.activeTabIndicator} />
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
      {/* Render the active tab content */}
      <View style={styles.tabContentContainer}>{renderTabContent()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: 40,
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#111827',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 8,
    justifyContent: 'center',
  },
  backButtonContainer: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  poNumber: {
    fontSize: 14,
    color: '#6B7280',
  },
  card: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  section: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    flexDirection: 'row',
  },
  infoSection: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sectionIconContainer: {
    width: 36,
    height: 36,
    backgroundColor: '#F9FAFB',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  productInfoContainer: {
    flex: 1,
  },
  sectionIcon: {
    fontSize: 18,
  },
  sectionLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  sectionValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  timelineContainer: {
    position: 'relative',
    marginTop: 24,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timelineLine: {
    position: 'absolute',
    top: 20,
    left: 12,
    right: 12,
    height: 2,
    backgroundColor: '#E5E7EB',
    zIndex: 1,
  },
  timelineStage: {
    alignItems: 'center',
    zIndex: 2,
    flex: 1,
  },
  timelineCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  timelineCircleActive: {
    borderColor: '#059669',
  },
  timelineCircleCurrent: {
    borderColor: '#0284C7',
    backgroundColor: '#0284C7',
  },
  timelineCircleInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#059669',
  },
  timelineTextContainer: {
    alignItems: 'center',
  },
  timelineText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  timelineTextActive: {
    fontWeight: '500',
    color: '#111827',
  },
  timelineDate: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  tabContentContainer: {
    flex: 1,
    marginBottom: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    height: 64, // Increased fixed height
  },
  tab: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 15, // Larger font size
    color: '#6B7280',
  },
  activeTabText: {
    color: '#111827',
    fontWeight: '600',
    fontSize: 15, // Match the increased size
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    width: '100%',
    backgroundColor: '#EF4444',
  },
});
