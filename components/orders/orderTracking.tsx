// app/components/order/OrderTracking.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { fetchOrderTracking } from '@/services/orderService';
import { formatDate } from '@/utils/order-helpers';

interface OrderTrackingProps {
  orderId: string;
}

interface TrackingEvent {
  location: string;
  ship_activity: string;
  vessel_name: string;
  tentative_date: string;
  actual_date: string;
  is_reached: boolean;
  delay: number | string;
}

interface TrackingData {
  iframe_url: string;
  tracking_table_data: TrackingEvent[];
  transportation_mode: string;
  message: string;
}

const { width } = Dimensions.get('window');

const OrderTracking: React.FC<OrderTrackingProps> = ({ orderId }) => {
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'table'>('map');

  useEffect(() => {
    const loadTrackingData = async () => {
      try {
        setLoading(true);
        const response = await fetchOrderTracking(orderId);
        if (response.success && response.data) {
          setTrackingData(response.data);
        } else {
          setError('Failed to load tracking information');
        }
      } catch (error) {
        console.error('Error fetching tracking data:', error);
        setError('Error connecting to server');
      } finally {
        setLoading(false);
      }
    };

    loadTrackingData();
  }, [orderId]);

  const switchTab = (tab: 'map' | 'table') => {
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!trackingData) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No tracking data available for this order.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'map' && styles.activeTabButton,
          ]}
          onPress={() => switchTab('map')}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'map' && styles.activeTabButtonText,
            ]}
          >
            Map View
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'table' && styles.activeTabButton,
          ]}
          onPress={() => switchTab('table')}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'table' && styles.activeTabButtonText,
            ]}
          >
            Table View
          </Text>
        </TouchableOpacity>
      </View>

      {/* Transportation Mode */}
      <View style={styles.transportInfoContainer}>
        <Text style={styles.transportLabel}>Transportation Mode:</Text>
        <Text style={styles.transportValue}>
          {trackingData?.transportation_mode}
        </Text>
      </View>

      {activeTab === 'map' ? (
        <View style={styles.mapContainer}>
          {trackingData.iframe_url ? (
            <WebView
              // source={{ uri: trackingData.iframe_url }}
              style={styles.webview}
              startInLoadingState={true}
              renderLoading={() => (
                <ActivityIndicator
                  style={styles.webviewLoading}
                  size="large"
                  color="#3b82f6"
                />
              )}
            />
          ) : (
            <View style={styles.noMapContainer}>
              <Text style={styles.noMapText}>
                Map view is not available for this shipment.
              </Text>
            </View>
          )}
        </View>
      ) : (
        <ScrollView style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>
              Location
            </Text>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Activity</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Vessel</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.2 }]}>
              Expected
            </Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.2 }]}>Actual</Text>
            <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>Delay</Text>
          </View>

          {(trackingData.tracking_table_data || [])?.map((event, index) => (
            <View
              key={index}
              style={[
                styles.tableRow,
                event.is_reached && styles.completedRow,
                index === trackingData.tracking_table_data.length - 1 &&
                  styles.lastRow,
              ]}
            >
              <Text style={[styles.tableCell, { flex: 1.5 }]}>
                {event.location}
              </Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>
                {event.ship_activity}
              </Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>
                {event.vessel_name}
              </Text>
              <Text style={[styles.tableCell, { flex: 1.2 }]}>
                {event.tentative_date ? formatDate(event.tentative_date) : '-'}
              </Text>
              <Text style={[styles.tableCell, { flex: 1.2 }]}>
                {event.actual_date ? formatDate(event.actual_date) : '-'}
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  { flex: 0.8 },
                  typeof event.delay === 'number' &&
                    event.delay > 0 &&
                    styles.delayText,
                ]}
              >
                {event.delay ? `${event.delay}d` : '-'}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    margin: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  activeTabButton: {
    backgroundColor: '#F3F4F6',
    borderBottomWidth: 2,
    borderBottomColor: '#EF4444',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabButtonText: {
    color: '#111827',
  },
  transportInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  transportLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginRight: 8,
  },
  transportValue: {
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 8,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  webview: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  webviewLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noMapText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  tableContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tableHeaderCell: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  completedRow: {
    backgroundColor: '#F9FAFB',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  tableCell: {
    fontSize: 12,
    color: '#111827',
  },
  delayText: {
    color: '#EF4444',
    fontWeight: '500',
  },
});

export default OrderTracking;
