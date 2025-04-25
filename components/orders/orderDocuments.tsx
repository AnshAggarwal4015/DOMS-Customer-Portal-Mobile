// app/components/order/OrderDocuments.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Linking,
  FlatList,
} from 'react-native';
import { fetchOrderDocuments } from '@/services/orderService';
import { API_BASE_URL } from '@/constants/api';
import { getAccessToken } from '@/stores/auth';
import { Eye, Download } from 'lucide-react-native';

// TODO: OnDownload All an API Should be called
// TODO: View ke case mein blob api call hoti hai, that is missing now

interface OrderDocumentsProps {
  orderId: string;
}

interface Document {
  document_type_display_value: string;
  display_name: string;
  order_item_name?: string;
  customer_document_info: {
    id: number;
    document_object: string;
    created_at: string;
  };
  customer_tags: string[];
  created_by: string;
}

interface DocumentsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Document[];
}

const OrderDocuments: React.FC<OrderDocumentsProps> = ({ orderId }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDocs, setSelectedDocs] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [selectAll, setSelectAll] = useState<boolean>(false);

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setLoading(true);
        const response = await fetchOrderDocuments(orderId);

        if (response.success && response.data) {
          setDocuments(response.data.results);
        } else {
          setError('Failed to load documents');
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
        setError('Error connecting to server');
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [orderId]);

  const toggleDocumentSelection = (docId: number) => {
    setSelectedDocs((prev) => ({
      ...prev,
      [docId]: !prev[docId],
    }));
  };

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    const newSelectedDocs: any = {};
    if (newSelectAll) {
      documents.forEach((doc) => {
        newSelectedDocs[doc.customer_document_info.id] = true;
      });
    }
    setSelectedDocs(newSelectedDocs);
  };

  const downloadDocument = async (documentPath: string, filename: string) => {
    try {
      // Typically in a mobile app, you'd use a file download library here
      // This is a placeholder implementation that opens the document in browser
      const token = getAccessToken();
      const url = `${API_BASE_URL}/${documentPath}`;

      // For mobile implementation you'd use something like:
      // FileSystem.downloadAsync(url, FileSystem.documentDirectory + filename);
      // or use react-native-file-viewer, etc.

      // This opens the URL in browser - replace with proper download implementation
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  const downloadSelected = () => {
    const selectedDocuments = documents.filter(
      (doc) => selectedDocs[doc.customer_document_info.id]
    );

    // For demo purposes, we're just going to open the first one
    if (selectedDocuments.length > 0) {
      downloadDocument(
        selectedDocuments[0].customer_document_info.document_object,
        selectedDocuments[0].display_name
      );
    }

    // In a real implementation, you would:
    // 1. Create a zip file of all selected documents
    // 2. Provide the zip file for download
  };

  const viewDocument = (documentPath: string) => {
    try {
      const token = getAccessToken();
      const url = `${API_BASE_URL}/${documentPath}`;
      Linking.openURL(url);
    } catch (error) {
      console.error('Error viewing document:', error);
    }
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

  if (documents.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No documents found for this order.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={downloadSelected}
        >
          <Download size={16} color="#EF4444" />
          <Text style={styles.downloadText}>Download All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.documentsContainer}>
        <View style={styles.tableHeader}>
          <View style={styles.checkboxColumn}>
            <TouchableOpacity style={styles.checkbox} onPress={toggleSelectAll}>
              {selectAll && <Text style={styles.checkmarkText}>✓</Text>}
            </TouchableOpacity>
          </View>
          <View style={styles.nameColumn}>
            <Text style={styles.headerText}>Document Name</Text>
          </View>
          <View style={styles.actionColumn}>
            {/* Action column header is empty */}
          </View>
        </View>

        <FlatList
          data={documents}
          keyExtractor={(item) => item.customer_document_info.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.documentRow}>
              <View style={styles.checkboxColumn}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() =>
                    toggleDocumentSelection(item.customer_document_info.id)
                  }
                >
                  {selectedDocs[item.customer_document_info.id] && (
                    <Text style={styles.checkmarkText}>✓</Text>
                  )}
                </TouchableOpacity>
              </View>
              <View style={styles.nameColumn}>
                <Text style={styles.documentName}>{item.display_name}</Text>
              </View>
              <View style={styles.actionColumn}>
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() =>
                    viewDocument(item.customer_document_info.document_object)
                  }
                >
                  <Eye size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 16,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  documentsContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  documentRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  checkboxColumn: {
    width: 40,
    alignItems: 'center',
  },
  nameColumn: {
    flex: 1,
  },
  actionColumn: {
    width: 50,
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 18,
  },
  documentName: {
    fontSize: 14,
    color: '#111827',
  },
  viewButton: {
    padding: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
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
});

export default OrderDocuments;
