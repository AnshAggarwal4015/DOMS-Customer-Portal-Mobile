// app/components/order/People.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Mail, Phone } from 'lucide-react-native';
import { fetchOrderPOCs } from '@/services/orderService';
import { POC, User } from '@/types/orders';

interface PeopleProps {
  orderId: string;
}

const People: React.FC<PeopleProps> = ({ orderId }) => {
  const [pocs, setPocs] = useState<POC[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Group POCs by internal team
  const groupedPOCs = pocs.reduce((acc, poc) => {
    if (!acc[poc.internal_team]) {
      acc[poc.internal_team] = [];
    }
    acc[poc.internal_team].push(poc);
    return acc;
  }, {} as Record<string, POC[]>);

  useEffect(() => {
    const loadPOCs = async () => {
      try {
        setLoading(true);
        const response = await fetchOrderPOCs(orderId);

        if (response.success && response.data) {
          setPocs(response.data);
        } else {
          setError('Failed to load contacts');
        }
      } catch (error) {
        console.error('Error fetching POCs:', error);
        setError('Error connecting to server');
      } finally {
        setLoading(false);
      }
    };

    loadPOCs();
  }, [orderId]);

  const handleEmailPress = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handlePhonePress = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const getInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return firstInitial + lastInitial;
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

  if (pocs.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No contacts found for this order.</Text>
      </View>
    );
  }

  const renderContactInfo = (user: User) => {
    return (
      <View style={styles.contactCard} key={user.user_id}>
        <View style={styles.contactHeader}>
          {user.profile_image ? (
            <Image source={{ uri: user.profile_image }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitials}>
                {getInitials(user.given_name, user.family_name)}
              </Text>
            </View>
          )}
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>
              {user.given_name} {user.family_name}
            </Text>
            <Text style={styles.contactEmail}>{user.email}</Text>
          </View>
        </View>

        <View style={styles.contactActions}>
          {user.phone_number && (
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => handlePhonePress(user.phone_number)}
            >
              <Phone size={16} color="#4B5563" />
              <Text style={styles.contactButtonText}>Call</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => handleEmailPress(user.email)}
          >
            <Mail size={16} color="#4B5563" />
            <Text style={styles.contactButtonText}>Email</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const formatPOCType = (pocType: string): string => {
    // Convert snake_case to Title Case with spaces
    return pocType
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.supportSection}>
        <Text style={styles.supportText}>
          If you face any issues please contact{' '}
          <Text
            style={styles.supportEmail}
            onPress={() => handleEmailPress('support@elchemy.com')}
          >
            support@elchemy.com
          </Text>
        </Text>
        <Text style={styles.supportText}>
          Incase of any escalations please reach out to{' '}
          <Text
            style={styles.supportEmail}
            onPress={() => handleEmailPress('leadership@elchemy.com')}
          >
            leadership@elchemy.com
          </Text>
        </Text>
      </View>

      {Object.entries(groupedPOCs).map(([team, teamPOCs]) => (
        <View key={team} style={styles.teamSection}>
          <Text style={styles.teamTitle}>{team}</Text>
          {teamPOCs.map((poc) => (
            <View key={poc.order_poc_id}>
              {poc.user.map((user) => (
                <View key={user.user_id}>{renderContactInfo(user)}</View>
              ))}
            </View>
          ))}
        </View>
      ))}
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
  supportSection: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    borderRadius: 8,
    margin: 16,
  },
  supportText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 4,
  },
  supportEmail: {
    color: '#EF4444',
    fontWeight: '500',
  },
  teamSection: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
  },
  teamTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  contactCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarInitials: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  contactEmail: {
    fontSize: 12,
    color: '#6B7280',
  },
  contactRole: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 4,
  },
  contactActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 8,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginRight: 8,
  },
  contactButtonText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#4B5563',
  },
});

export default People;
