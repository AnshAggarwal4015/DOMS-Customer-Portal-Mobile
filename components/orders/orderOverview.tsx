// app/components/order/OrderOverview.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { fetchOrderOverview } from '@/services/orderService';
import { formatCurrency, formatDate } from '@/utils/order-helpers';
import { Search, X } from 'lucide-react-native';

interface OrderOverviewProps {
  orderId: string;
}

interface SearchOption {
  id: string;
  label: string;
  section: string;
}

const OrderOverview: React.FC<OrderOverviewProps> = ({ orderId }) => {
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const [searchOptions, setSearchOptions] = useState<SearchOption[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<SearchOption[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const sectionRefs = useRef<{ [key: string]: any }>({});

  useEffect(() => {
    const loadOrderData = async () => {
      try {
        setLoading(true);
        const response = await fetchOrderOverview(orderId);

        if (response.success && response.data) {
          setOrderData(response.data);
          generateSearchOptions(response.data);
        } else {
          setError('Failed to load order details');
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError('Error connecting to server');
      } finally {
        setLoading(false);
      }
    };

    loadOrderData();
  }, [orderId]);

  useEffect(() => {
    // Filter search options based on search query
    if (searchQuery.trim() === '') {
      setFilteredOptions([]);
      return;
    }

    const filtered = searchOptions.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredOptions(filtered);
  }, [searchQuery, searchOptions]);

  // Generate search options from order data
  const generateSearchOptions = (data: any) => {
    if (!data) return;

    const options: SearchOption[] = [
      { id: 'exporter', label: 'Exporter', section: 'exporter' },
      {
        id: 'exporter_name',
        label: data.elchemy_entity?.name || 'N/A',
        section: 'exporter',
      },
      {
        id: 'exporter_address',
        label: data.elchemy_entity?.address || 'N/A',
        section: 'exporter',
      },
      {
        id: 'exporter_gst',
        label: data.elchemy_entity?.gst_number || 'N/A',
        section: 'exporter',
      },

      { id: 'customer', label: 'Customer', section: 'customer' },
      {
        id: 'customer_name',
        label: data.customer_name || 'N/A',
        section: 'customer',
      },
      {
        id: 'customer_address',
        label: data.customer_address?.readable_address || 'N/A',
        section: 'customer',
      },
      {
        id: 'customer_phone',
        label: data.customer_poc?.phone_number || 'N/A',
        section: 'customer',
      },
      {
        id: 'customer_email',
        label: data.customer_poc?.email || 'N/A',
        section: 'customer',
      },

      { id: 'consignee', label: 'Consignee', section: 'consignee' },
      {
        id: 'consignee_name',
        label: data.consignee_name || 'N/A',
        section: 'consignee',
      },
      {
        id: 'consignee_address',
        label: data.consignee_office_address || 'N/A',
        section: 'consignee',
      },

      { id: 'order_details', label: 'Order Details', section: 'order_details' },
      {
        id: 'transportation_mode',
        label:
          'Mode of Transportation: ' +
          (data.transportation_mode_display_value || 'N/A'),
        section: 'order_details',
      },
      {
        id: 'inco_terms',
        label: 'Inco Terms: ' + (data.inco_terms_display_value || 'N/A'),
        section: 'order_details',
      },
      {
        id: 'country_origin',
        label:
          'Country of Origin: ' +
          (data.country_of_origin_display_value || 'N/A'),
        section: 'order_details',
      },
      {
        id: 'country_destination',
        label:
          'Country of Final Destination: ' +
          (data.country_of_final_destination_display_value || 'N/A'),
        section: 'order_details',
      },
      {
        id: 'port_loading',
        label:
          'Port of Loading: ' + (data.port_of_loading_display_value || 'N/A'),
        section: 'order_details',
      },
      {
        id: 'port_discharge',
        label:
          'Port of Discharge: ' +
          (data.port_of_discharge_display_value || 'N/A'),
        section: 'order_details',
      },
      {
        id: 'po_reference',
        label: 'PO Reference Number: ' + (data.po_reference_no || 'N/A'),
        section: 'order_details',
      },

      { id: 'item_details', label: 'Item Details', section: 'item_details' },

      {
        id: 'packaging_details',
        label: 'Packaging Details',
        section: 'packaging_details',
      },
      {
        id: 'gross_weight',
        label: 'Gross Weight: ' + (data.total_gross_wt_in_KG || 'N/A'),
        section: 'packaging_details',
      },
      {
        id: 'net_weight',
        label: 'Net Weight: ' + (data.total_net_wt_in_KG || 'N/A'),
        section: 'packaging_details',
      },

      {
        id: 'shipment_details',
        label: 'Shipment Details',
        section: 'shipment_details',
      },
      {
        id: 'vessel_name',
        label: 'Vessel Name: ' + (data.vessel_name || 'N/A'),
        section: 'shipment_details',
      },
      {
        id: 'shipping_line',
        label: 'Shipping Line: ' + (data.shipping_line || 'N/A'),
        section: 'shipment_details',
      },

      { id: 'bl_details', label: 'BL Details', section: 'bl_details' },
      {
        id: 'bl_number',
        label: 'BL Number: ' + (data.bl_number || 'Not Available'),
        section: 'bl_details',
      },

      {
        id: 'payment_details',
        label: 'Payment Details',
        section: 'payment_details',
      },
      {
        id: 'payment_term',
        label: 'Payment Term: ' + (data.payment_terms_display_value || 'N/A'),
        section: 'payment_details',
      },

      { id: 'remarks', label: 'Remarks', section: 'remarks' },
      { id: 'estimates', label: 'Estimates', section: 'estimates' },
    ];

    // Add item details for each product
    if (data.order_item) {
      data.order_item.forEach((item: any, index: number) => {
        options.push(
          {
            id: `item_${index}`,
            label: `Item ${index + 1}: ${item.product_name}`,
            section: 'item_details',
          },
          {
            id: `item_${index}_package`,
            label: item.package_details,
            section: 'item_details',
          },
          {
            id: `item_${index}_origin`,
            label: `Origin: ${item.country_of_origin_display_value}`,
            section: 'item_details',
          },
          {
            id: `item_${index}_hscode`,
            label: `HS Code: ${item.hs_code}`,
            section: 'item_details',
          }
        );
      });
    }

    setSearchOptions(options);
  };

  // Scroll to section when search option is selected
  const scrollToSection = (sectionKey: string) => {
    if (sectionRefs.current[sectionKey] && scrollViewRef.current) {
      sectionRefs.current[sectionKey].measureLayout(
        scrollViewRef.current,
        (_: number, y: number) => {
          scrollViewRef.current?.scrollTo({ y: y - 20, animated: true });
        },
        () => console.log('Failed to measure layout')
      );
    }

    // Clear search after navigating
    setSearchQuery('');
    setSearchFocused(false);
  };

  const formatItemName = (name: string, index: number) => {
    return `Item ${index + 1}\n${name}`;
  };

  // Define styles for "On Time" and "Delayed" status indicators
  const getStatusClass = (status: string, delay: number | string) => {
    if (status === null || status === '-') return styles.statusPending;
    if (delay && delay !== 0 && delay !== '0' && delay !== '') {
      return styles.statusDelayed;
    }
    return styles.statusOnTime;
  };

  // Get appropriate status text
  const getStatusText = (status: string, delay: number | string) => {
    if (status === null || status === '-') return '-';
    if (delay && delay !== 0 && delay !== '0' && delay !== '') {
      return `Delayed by ${delay} days`;
    }
    return 'On Time';
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

  if (!orderData) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No order data available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View
          style={[
            styles.searchInputContainer,
            searchFocused && styles.searchInputContainerFocused,
          ]}
        >
          <Search size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Start Searching"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => {
              // Delayed blur to allow selecting an option
              setTimeout(() => {
                if (searchQuery.trim() === '') {
                  setSearchFocused(false);
                }
              }, 200);
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                setSearchFocused(false);
              }}
              style={styles.clearButton}
            >
              <X size={18} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>

        {/* Search Results Dropdown */}
        {/* {searchFocused && filteredOptions.length > 0 && (
          <View style={styles.searchResultsContainer}>
            {filteredOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.searchResultItem}
                onPress={() => scrollToSection(option.section)}
              >
                <Text style={styles.searchResultText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )} */}
        {searchFocused && filteredOptions.length > 0 && (
          <ScrollView
            style={styles.searchResultsContainer}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
          >
            {filteredOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.searchResultItem}
                onPress={() => scrollToSection(option.section)}
              >
                <Text style={styles.searchResultText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Exporter */}
        <View
          style={styles.section}
          ref={(ref) => {
            sectionRefs.current['exporter'] = ref;
          }}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.redBarLeft} />
            <Text style={styles.sectionTitle}>Exporter</Text>
          </View>
          <View style={styles.sectionContent}>
            <Text style={styles.companyName}>
              {orderData.elchemy_entity?.name || 'N/A'}
            </Text>
            <Text style={styles.companyAddress}>
              {orderData.elchemy_entity?.address || 'N/A'}
            </Text>
            <Text style={styles.companyGst}>
              GST - {orderData.elchemy_entity?.gst_number || 'N/A'}
            </Text>
          </View>
        </View>

        {/* Customer */}
        <View
          style={styles.section}
          ref={(ref) => {
            sectionRefs.current['customer'] = ref;
          }}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.redBarLeft} />
            <Text style={styles.sectionTitle}>Customer</Text>
          </View>
          <View style={styles.sectionContent}>
            <Text style={styles.companyName}>
              {orderData.customer_name || 'N/A'}
            </Text>
            <Text style={styles.companyAddress}>
              {orderData.customer_address?.readable_address || 'N/A'}
            </Text>
            <Text style={styles.contactInfo}>
              Tel: {orderData.customer_poc?.phone_number || 'N/A'}
            </Text>
            <Text style={styles.contactInfo}>
              Email: {orderData.customer_poc?.email || 'N/A'}
            </Text>
          </View>
        </View>

        {/* Consignee */}
        <View
          style={styles.section}
          ref={(ref) => {
            sectionRefs.current['consignee'] = ref;
          }}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.redBarLeft} />
            <Text style={styles.sectionTitle}>Consignee</Text>
          </View>
          <View style={styles.sectionContent}>
            <Text style={styles.companyName}>
              {orderData.consignee_name || 'N/A'}
            </Text>
            <Text style={styles.companyAddress}>
              {orderData.consignee_office_address || 'N/A'}
            </Text>
            <Text style={styles.contactInfo}>
              Tel: {orderData.consignee_phone_number || 'N/A'}
            </Text>
          </View>
        </View>

        {/* Order Details */}
        <View
          style={styles.section}
          ref={(ref) => {
            sectionRefs.current['order_details'] = ref;
          }}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Order Details</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Mode of Transportation</Text>
              <Text style={styles.detailValue}>
                {orderData.transportation_mode_display_value || 'N/A'}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Inco Terms</Text>
              <Text style={styles.detailValue}>
                {orderData.inco_terms_display_value || 'N/A'}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Country of Origin</Text>
              <Text style={styles.detailValue}>
                {orderData.country_of_origin_display_value || 'N/A'}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                Country of Final Destination
              </Text>
              <Text style={styles.detailValue}>
                {orderData.country_of_final_destination_display_value || 'N/A'}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Port of Loading</Text>
              <Text style={styles.detailValue}>
                {orderData.port_of_loading_display_value} -{' '}
                {orderData.port_of_loading_country_display_value || 'N/A'}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Port of Discharge</Text>
              <Text style={styles.detailValue}>
                {orderData.port_of_discharge_display_value} -{' '}
                {orderData.port_of_discharge_country_display_value || 'N/A'}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Place of Delivery</Text>
              <Text style={styles.detailValue}>
                {orderData.place_of_delivery || 'N/A'}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>PO Reference Number</Text>
              <Text style={styles.detailValue}>
                {orderData.po_reference_no || 'N/A'}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>PO Date</Text>
              <Text style={styles.detailValue}>Not Available</Text>
            </View>
          </View>
        </View>

        {/* Item Details */}
        <View
          style={styles.section}
          ref={(ref) => {
            sectionRefs.current['item_details'] = ref;
          }}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Item Details</Text>
          </View>
          <View style={styles.sectionContent}>
            {orderData.order_item &&
              orderData.order_item.map((item: any, index: number) => (
                <View key={item.order_item_id} style={styles.itemContainer}>
                  <Text style={styles.itemTitle}>
                    {formatItemName(item.product_name, index)}
                  </Text>
                  <Text style={styles.itemDetails}>{item.package_details}</Text>
                  <Text style={styles.itemDetails}>
                    Origin: {item.country_of_origin_display_value}
                  </Text>
                  <Text style={styles.itemDetails}>
                    HS Code: {item.hs_code}
                  </Text>

                  <View style={styles.itemPriceContainer}>
                    <View style={styles.itemPriceColumn}>
                      <Text style={styles.itemPriceLabel}>Quantity</Text>
                      <Text style={styles.itemPriceValue}>
                        {parseFloat(item.quantity).toFixed(4)} MT
                      </Text>
                    </View>

                    <View style={styles.itemPriceColumn}>
                      <Text style={styles.itemPriceLabel}>Price/Unit</Text>
                      <Text style={styles.itemPriceValue}>
                        USD {parseFloat(item.selling_price).toFixed(2)}
                      </Text>
                    </View>

                    <View style={styles.itemPriceColumn}>
                      <Text style={styles.itemPriceLabel}>Total Amount</Text>
                      <Text style={styles.itemPriceValue}>
                        USD {parseFloat(item.total_amount).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}

            {/* Custom Items (Freight, Insurance, etc.) */}
            {orderData.custom_items &&
              orderData.custom_items.map((item: any) => (
                <View key={item.custom_item_id} style={styles.customItemRow}>
                  <Text style={styles.customItemName}>{item.name}</Text>
                  <Text style={styles.customItemValue}>
                    USD {parseFloat(item.amount).toFixed(2)}
                  </Text>
                </View>
              ))}

            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>
                Total: USD {parseFloat(orderData.total).toFixed(2)}
              </Text>
              <Text style={styles.totalInWords}>
                Amount in words: USD{' '}
                {numberToWords(parseFloat(orderData.total))}
              </Text>
            </View>
          </View>
        </View>

        {/* Packaging Details */}
        <View
          style={styles.section}
          ref={(ref) => {
            sectionRefs.current['packaging_details'] = ref;
          }}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Packaging Details</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Gross Weight</Text>
              <Text style={styles.detailValue}>
                {orderData.total_gross_wt_in_KG} KG
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Net Weight</Text>
              <Text style={styles.detailValue}>
                {orderData.total_net_wt_in_KG} KG
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>No of Pallets</Text>
              <Text style={styles.detailValue}>
                {orderData.total_pallets_packed}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Palletization</Text>
              <Text style={styles.detailValue}>
                {orderData.palletization ? 'Yes' : 'No'}
              </Text>
            </View>
          </View>
        </View>

        {/* Shipment Details */}
        <View
          style={styles.section}
          ref={(ref) => {
            sectionRefs.current['shipment_details'] = ref;
          }}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shipment Details</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Vessel Name</Text>
              <Text style={styles.detailValue}>
                {orderData.vessel_name || 'N/A'}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Voyage Number</Text>
              <Text style={styles.detailValue}>
                {orderData.voyage_number || 'Not Available'}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Shipping Line</Text>
              <Text style={styles.detailValue}>
                {orderData.shipping_line || 'N/A'}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Container Details</Text>
              <Text style={styles.detailValue}>
                {orderData.container_info && orderData.container_info.length > 0
                  ? `${orderData.container_info[0].no_of_container} X ${orderData.container_info[0].container_type}`
                  : 'N/A'}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Container Numbers</Text>
              <Text style={styles.detailValue}>
                {orderData.container_info &&
                orderData.container_info.length > 0 &&
                orderData.container_info[0].container_numbers
                  ? orderData.container_info[0].container_numbers.join(', ')
                  : 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* BL Details */}
        <View
          style={styles.section}
          ref={(ref) => {
            sectionRefs.current['bl_details'] = ref;
          }}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>BL Details</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>BL Number</Text>
              <Text style={styles.detailValue}>
                {orderData.bl_number || 'Not Available'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>BL Date</Text>
              <Text style={styles.detailValue}>
                {orderData.bl_date
                  ? formatDate(orderData.bl_date)
                  : 'Not Available'}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Details */}
        <View
          style={styles.section}
          ref={(ref) => {
            sectionRefs.current['payment_details'] = ref;
          }}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment Details</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment Term</Text>
              <Text style={styles.detailValue}>
                {orderData.payment_terms_display_value || 'N/A'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                Export Bill Bank Reference Number
              </Text>
              <Text style={styles.detailValue}>Not Available</Text>
            </View>
          </View>
        </View>

        {/* Remarks */}
        <View
          style={styles.section}
          ref={(ref) => {
            sectionRefs.current['remarks'] = ref;
          }}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Remarks</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                Customer Additional Remarks
              </Text>
              <Text style={styles.detailValue}>
                {orderData.additional_remarks || 'Not Available'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>CI Remarks</Text>
              <Text style={styles.detailValue}>
                {orderData.ci_remarks || 'Not Available'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>PI Remarks</Text>
              <Text style={styles.detailValue}>
                {orderData.pi_remarks
                  ? getPIRemarks(orderData.pi_remarks)
                  : 'Not Available'}
              </Text>
            </View>
          </View>
        </View>

        {/* Estimates */}
        <View
          style={styles.section}
          ref={(ref) => {
            sectionRefs.current['estimates'] = ref;
          }}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Estimates</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.estimatesTable}>
              <View style={styles.estimatesHeader}>
                <Text style={[styles.estimatesHeaderCell, { flex: 2 }]}>
                  State Type
                </Text>
                <Text style={[styles.estimatesHeaderCell, { flex: 2 }]}>
                  Estimated Date
                </Text>
                <Text style={[styles.estimatesHeaderCell, { flex: 1 }]}>
                  Status
                </Text>
              </View>

              {orderData.task_estimates &&
                orderData.task_estimates.map((task: any) => {
                  const isCompleted = task.actual_date !== null;
                  const estimatedDate = task.estimated_date
                    ? formatDate(task.estimated_date)
                    : '-';

                  // Calculate delay in days if both dates are available
                  let delay = '-';
                  if (task.actual_date && task.estimated_date) {
                    const actualDate = new Date(task.actual_date);
                    const estDate = new Date(task.estimated_date);
                    const diffTime = actualDate.getTime() - estDate.getTime();
                    const diffDays = Math.ceil(
                      diffTime / (1000 * 60 * 60 * 24)
                    );
                    if (diffDays > 0) {
                      delay = diffDays.toString();
                    }
                  }

                  return (
                    <View key={task.id} style={styles.estimatesRow}>
                      <View style={[styles.estimatesCell, { flex: 2 }]}>
                        <Text style={styles.estimatesCellText}>
                          {task.state_type_value}
                        </Text>
                      </View>
                      <View style={[styles.estimatesCell, { flex: 2 }]}>
                        <Text style={styles.estimatesCellText}>
                          {estimatedDate}
                        </Text>
                      </View>
                      <View style={[styles.estimatesCell, { flex: 1 }]}>
                        <View style={getStatusClass(task.actual_date, delay)}>
                          <Text style={styles.statusText}>
                            {getStatusText(task.actual_date, delay)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// Helper function to convert numbers to words
const numberToWords = (num: number): string => {
  // This is a simplified version. In a real app, you'd use a proper library
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedNum = formatter.format(num);
  return formattedNum.replace('$', '') + ' US Dollars';
};

// Helper function to extract PI remarks
const getPIRemarks = (piRemarks: string): string => {
  try {
    const parsed = JSON.parse(piRemarks);
    if (parsed.string) {
      return parsed.string;
    }
    return 'Not Available';
  } catch (e) {
    return piRemarks || 'Not Available';
  }
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  contentContainer: {
    paddingBottom: 24,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    zIndex: 10,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 4,
    paddingHorizontal: 12,
    height: 40,
  },
  searchInputContainerFocused: {
    borderColor: '#EF4444',
    borderWidth: 1.5,
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
  clearButton: {
    padding: 4,
  },
  searchResultsContainer: {
    position: 'absolute',
    top: 62,
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 4,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 20,
  },
  searchResultItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchResultText: {
    fontSize: 14,
    color: '#111827',
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
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionHeader: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  redBarLeft: {
    width: 4,
    height: 20,
    backgroundColor: '#EF4444',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  sectionContent: {
    padding: 16,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  companyAddress: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
  },
  companyGst: {
    fontSize: 14,
    color: '#4B5563',
  },
  contactInfo: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 2,
  },
  detailRow: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 16,
    marginBottom: 16,
    backgroundColor: '#FCFCFC',
    borderRadius: 6,
    padding: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
    marginBottom: 10,
  },
  itemDetails: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 6,
  },
  itemPriceContainer: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 6,
  },
  itemPriceColumn: {
    flex: 1,
  },
  itemPriceLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  itemPriceValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  customItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  customItemName: {
    fontSize: 14,
    color: '#4B5563',
  },
  customItemValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  totalContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 6,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  totalInWords: {
    fontSize: 14,
    color: '#4B5563',
    fontStyle: 'italic',
  },
  estimatesTable: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  estimatesHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  estimatesHeaderCell: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
  estimatesRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    alignItems: 'center',
  },
  estimatesCell: {
    flex: 1,
  },
  estimatesCellText: {
    fontSize: 14,
    color: '#111827',
  },
  statusOnTime: {
    backgroundColor: '#ECFDF5',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  statusDelayed: {
    backgroundColor: '#FEF2F2',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  statusPending: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111827',
  },
});

export default OrderOverview;
