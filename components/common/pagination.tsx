// src/components/common/Pagination.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
}: PaginationProps) => {
  return (
    <View style={styles.paginationContainer}>
      <TouchableOpacity
        style={[
          styles.pageButton,
          currentPage === 1 ? styles.disabledButton : null,
        ]}
        onPress={onPrevPage}
        disabled={currentPage === 1}
      >
        <Ionicons
          name="chevron-back"
          size={18}
          color={currentPage === 1 ? '#a1a1aa' : '#6366f1'}
        />
        <Text
          style={[
            styles.pageButtonText,
            currentPage === 1 ? styles.disabledText : null,
          ]}
        >
          Previous
        </Text>
      </TouchableOpacity>

      <View style={styles.pageInfo}>
        <Text style={styles.pageInfoText}>
          Page {currentPage} of {totalPages}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.pageButton,
          currentPage === totalPages ? styles.disabledButton : null,
        ]}
        onPress={onNextPage}
        disabled={currentPage === totalPages}
      >
        <Text
          style={[
            styles.pageButtonText,
            currentPage === totalPages ? styles.disabledText : null,
          ]}
        >
          Next
        </Text>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={currentPage === totalPages ? '#a1a1aa' : '#6366f1'}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 10,
  },
  pageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  pageButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6366f1',
  },
  disabledButton: {
    backgroundColor: '#f1f5f9',
    borderColor: '#e2e8f0',
  },
  disabledText: {
    color: '#a1a1aa',
  },
  pageInfo: {
    paddingHorizontal: 12,
  },
  pageInfoText: {
    fontSize: 14,
    color: '#64748b',
  },
});

export default Pagination;
