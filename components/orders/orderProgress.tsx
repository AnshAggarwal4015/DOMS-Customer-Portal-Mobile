// app/components/order/OrderProgress.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { fetchOrderProgress } from '@/services/orderService';

interface OrderProgressProps {
  orderId: string;
}

interface ActivityLog {
  activity_log: string;
  timestamp: string;
  actor?: string;
}

const OrderProgress: React.FC<OrderProgressProps> = ({ orderId }) => {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadActivityLogs = async () => {
      try {
        setLoading(true);
        const response = await fetchOrderProgress(orderId);

        if (response.success && response.data) {
          setActivityLogs(response.data);
        } else {
          setError('Failed to load activity logs');
        }
      } catch (error) {
        console.error('Error fetching activity logs:', error);
        setError('Error connecting to server');
      } finally {
        setLoading(false);
      }
    };

    loadActivityLogs();
  }, [orderId]);

  // Format date to readable format
  const formatDate = (dateString: string): { date: string; time: string } => {
    const date = new Date(dateString);

    // Format: 28th Jun 2024
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();

    // Add ordinal suffix to day
    const ordinalSuffix = (day: number): string => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1:
          return 'st';
        case 2:
          return 'nd';
        case 3:
          return 'rd';
        default:
          return 'th';
      }
    };

    const formattedDate = `${day}${ordinalSuffix(day)} ${month} ${year}`;

    // Format: 11:59
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;

    return { date: formattedDate, time: formattedTime };
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

  if (activityLogs.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No activity logs available for this order.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.timelineContainer}>
        {activityLogs.map((log, index) => {
          const isLast = index === activityLogs.length - 1;
          const formattedDateTime = formatDate(log.timestamp);
          const actor = log.actor || 'Elchemy Internal Member';

          return (
            <View key={index} style={styles.timelineItem}>
              {/* Card with content */}
              <View style={styles.cardRow}>
                <View style={styles.card}>
                  <Text style={styles.activityText}>{log.activity_log}</Text>
                  <Text style={styles.timestampText}>
                    {formattedDateTime.date} at {formattedDateTime.time} by{' '}
                    {actor}
                  </Text>
                </View>
                <TouchableOpacity style={styles.eButton}>
                  <Text style={styles.eButtonText}>E</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
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
  timelineContainer: {
    padding: 16,
  },
  timelineItem: {
    alignItems: 'center',
    marginBottom: 16,
  },
  cardRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 8, // Space between card and dot
    zIndex: 2, // Make sure card stays above the line
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
    marginBottom: 6,
  },
  timestampText: {
    fontSize: 12,
    color: '#6B7280',
  },
  eButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  eButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111827',
  },
});

export default OrderProgress;
