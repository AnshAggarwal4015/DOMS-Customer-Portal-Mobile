// app/components/order/StuffingPhotos.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Pressable,
  Modal,
} from 'react-native';
import { fetchOrderStuffingPhotos } from '@/services/orderService';
import { X, ArrowLeft, ArrowRight } from 'lucide-react-native';

interface StuffingPhotosProps {
  orderId: string;
}

interface PhotoItem {
  name: string;
  image_object: string;
}

interface StuffingPhotosResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PhotoItem[];
}

const { width } = Dimensions.get('window');
const numColumns = 2;
const ITEM_WIDTH = width / numColumns - 20; // 20 is the gap between items

const StuffingPhotos: React.FC<StuffingPhotosProps> = ({ orderId }) => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [photoIndex, setPhotoIndex] = useState<number>(-1);

  const loadPhotos = useCallback(
    async (pageNum: number, refresh: boolean = false) => {
      try {
        if (refresh) {
          setRefreshing(true);
        } else if (pageNum === 1) {
          setLoading(true);
        }

        const response = await fetchOrderStuffingPhotos(orderId);

        if (response.success && response.data) {
          const newPhotos = response.data.results;
          setPhotos(refresh ? newPhotos : [...photos, ...newPhotos]);
          setHasMore(response.data.next !== null);
        } else {
          setError('Failed to load stuffing photos');
        }
      } catch (error) {
        console.error('Error fetching stuffing photos:', error);
        setError('Error connecting to server');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [orderId, photos]
  );

  useEffect(() => {
    loadPhotos(1);
  }, [orderId]);

  const handleRefresh = () => {
    setPage(1);
    loadPhotos(1, true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadPhotos(nextPage);
    }
  };

  const openPhotoViewer = (photo: PhotoItem, index: number) => {
    setSelectedPhoto(photo);
    setPhotoIndex(index);
  };

  const closePhotoViewer = () => {
    setSelectedPhoto(null);
    setPhotoIndex(-1);
  };

  const navigatePhoto = (direction: 'next' | 'prev') => {
    if (!photos.length) return;

    const newIndex =
      direction === 'next'
        ? (photoIndex + 1) % photos.length
        : (photoIndex - 1 + photos.length) % photos.length;

    setPhotoIndex(newIndex);
    setSelectedPhoto(photos[newIndex]);
  };

  const renderPhotoItem = ({
    item,
    index,
  }: {
    item: PhotoItem;
    index: number;
  }) => (
    <TouchableOpacity
      style={styles.photoItem}
      onPress={() => openPhotoViewer(item, index)}
    >
      <Image
        source={{ uri: item.image_object }}
        style={styles.photoImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  const extractFilename = (fullPath: string) => {
    const parts = fullPath.split('/');
    return parts[parts.length - 1];
  };

  if (loading && !refreshing && photos.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (error && photos.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (photos.length === 0 && !loading) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No stuffing photos available for this order.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={photos}
        renderItem={renderPhotoItem}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        numColumns={numColumns}
        contentContainerStyle={styles.photoGrid}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        initialNumToRender={4}
        ListFooterComponent={
          loading && photos.length > 0 ? (
            <ActivityIndicator
              style={styles.loadingMore}
              size="small"
              color="#3b82f6"
            />
          ) : null
        }
      />

      {/* Photo Viewer Modal */}
      <Modal
        visible={selectedPhoto !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={closePhotoViewer}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {selectedPhoto ? extractFilename(selectedPhoto.name) : ''}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closePhotoViewer}
            >
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigatePhoto('prev')}
            >
              <ArrowLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>

            {selectedPhoto && (
              <Image
                source={{ uri: selectedPhoto.image_object }}
                style={styles.fullImage}
                resizeMode="contain"
              />
            )}

            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigatePhoto('next')}
            >
              <ArrowRight size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.photoCounter}>
            <Text style={styles.counterText}>
              {photoIndex + 1} / {photos.length}
            </Text>
          </View>
        </View>
      </Modal>
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
  photoGrid: {
    padding: 12,
  },
  photoItem: {
    flex: 1,
    margin: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    height: ITEM_WIDTH, // Make it square
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  loadingMore: {
    padding: 16,
  },
  // Modal styles
  modalContainer: {
    paddingTop: 40,
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'space-between',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButton: {
    padding: 16,
    zIndex: 10,
  },
  fullImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  photoCounter: {
    padding: 16,
    alignItems: 'center',
  },
  counterText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});

export default StuffingPhotos;
