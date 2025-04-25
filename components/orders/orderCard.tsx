import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import Button from '@/components/base/Button';
import MultiPlaceholder from '../common/multiplePlaceholder';
import { getStatusColor, formatDate } from '../../utils/order-helpers';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

interface OrderCardProps {
  order: any;
  expanded: boolean;
  onPress?: () => void;
}

// @ts-ignore
const OrderCard = ({ order, expanded, onPress }: OrderCardProps) => {
  const router = useRouter();

  // Get current state
  const currentState = useMemo(() => {
    const currentStateObj = order.customer_state_activity_log?.find(
      (state: any) => state.is_current_state
    );
    return currentStateObj ? currentStateObj.state_name : 'Processing';
  }, [order]);

  // Get multiple item names for display
  const itemsDisplay = useMemo(() => {
    if (!order.order_item || order.order_item?.length === 0) {
      return '-';
    }

    if (order.order_item.length === 1) {
      return order.order_item[0];
    }

    return `${order.order_item[0]} and ${
      order.order_item.length - 1
    } more item${order.order_item.length - 1 > 1 ? 's' : ''}`;
  }, [order.order_item]);

  const getStatusIndex = (stage: string) => {
    const stages = ['order_confirmed', 'in_transit', 'order_completed'];
    return stages.indexOf(stage);
  };

  // Use the order_stage or derive from customer_state_activity_log
  const statusIndex = order.order_stage
    ? getStatusIndex(order.order_stage)
    : order.customer_state_activity_log?.findIndex(
        (state: any) => state.is_current_state
      ) || 0;

  const handleViewOrder = () => {
    if (onPress) {
      onPress();
    } else {
      // Use router.push with the correct path that matches your folder structure
      const orderId = order.order_id || order.pi_document_no;
      // @ts-ignore
      router.push(`/order/${orderId}`);
    }
  };

  return (
    <Animated.View style={styles.cardWrapper} entering={FadeIn.duration(300)}>
      <View style={styles.card}>
        {/* Card Header with ID */}
        <Text style={styles.orderId}>
          {order.pi_document_no || order.order_id || '-'}
        </Text>

        {/* Product Title */}
        <Text style={styles.orderTitle}>
          {order.order_title || itemsDisplay}
        </Text>

        {/* PO Reference and View Button Row */}
        <View style={styles.detailsRow}>
          <View style={styles.detailsColumn}>
            <Text style={styles.detailsLabel}>PO Reference Number</Text>
            <Text style={styles.detailsValue}>
              {order.po_reference_no || order.order_po_reference_number || '—'}
            </Text>
          </View>

          <View style={styles.viewOrderButtonContainer}>
            <Button
              variant="outlined-secondary"
              onPress={handleViewOrder}
              style={styles.viewOrderButton}
            >
              View Order
            </Button>
          </View>
        </View>

        {/* Payment Details Row */}
        <View style={styles.detailsRow}>
          <View style={styles.detailsColumn}>
            <Text style={styles.detailsLabel}>Payment Terms</Text>
            <Text style={styles.detailsValue}>
              {order.payment_terms_display_value || order.payment_terms || '—'}
            </Text>
          </View>

          <View style={styles.detailsColumn}>
            <Text style={styles.detailsLabel}>Due Payment/Total Payment</Text>
            <Text style={styles.detailsValue}>
              {order.currency || order.currency_code}{' '}
              {parseFloat(
                order.amount_due || order.total_amount || 0
              ).toLocaleString()}
              /{order.currency || order.currency_code}{' '}
              {parseFloat(
                order.total || order.total_amount || 0
              ).toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Payment Date and Sales POC */}
        <View style={styles.detailsRow}>
          <View style={styles.detailsColumn}>
            <Text style={styles.detailsLabel}>Latest Payment Date</Text>
            <Text style={styles.detailsValue}>
              {formatDate(
                order.latest_payment_date || order.order_confirmed_date
              ) || '—'}
            </Text>
          </View>

          <View style={styles.detailsColumn}>
            <Text style={styles.detailsLabel}>Elchemy Sales POC</Text>
            {order.sales_reps ? (
              <MultiPlaceholder names={order.sales_reps} />
            ) : (
              <View style={styles.pocContainer}>
                <Text style={styles.pocText}>
                  {order.sales_poc || 'Multiple'}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Order Status Timeline */}
        <View style={styles.timelineContainer}>
          <View style={styles.timelineLine} />

          {/* Confirmed Status */}
          <View style={styles.timelineItem}>
            <View
              style={[
                styles.timelineCircle,
                statusIndex >= 0 && styles.timelineCircleActive,
              ]}
            >
              {statusIndex >= 0 && <View style={styles.timelineCircleInner} />}
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
              {statusIndex >= 0 && (
                <Text style={styles.timelineDate}>
                  {formatDate(order.order_confirmed_date)}
                </Text>
              )}
            </View>
          </View>

          {/* In Transit Status */}
          <View style={styles.timelineItem}>
            <View
              style={[
                styles.timelineCircle,
                statusIndex >= 1 && styles.timelineCircleActive,
                statusIndex === 1 && styles.timelineCircleCurrent,
              ]}
            >
              {statusIndex >= 1 && <View style={styles.timelineCircleInner} />}
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

          {/* Completed Status */}
          <View style={styles.timelineItem}>
            <View
              style={[
                styles.timelineCircle,
                statusIndex >= 2 && styles.timelineCircleActive,
              ]}
            >
              {statusIndex >= 2 && <View style={styles.timelineCircleInner} />}
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

        {/* Expanded Content */}
        {expanded && (
          <View style={styles.expandedContent}>
            {/* Add any expanded content here if needed */}
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    overflow: 'hidden',
  },
  orderId: {
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 8,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailsColumn: {
    flex: 1,
  },
  detailsLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  detailsValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  viewOrderButtonContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  viewOrderButton: {
    minHeight: 36,
    minWidth: 100,
  },
  timelineContainer: {
    position: 'relative',
    marginTop: 8,
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
  timelineItem: {
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
  pocContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  pocText: {
    fontSize: 12,
    color: '#4B5563',
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
});

export default OrderCard;
