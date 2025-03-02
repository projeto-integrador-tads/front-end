import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/styles/shared/colors/colors';
import { Skeleton } from '../skeleton/Skeleton';

export function PromoCardSkeleton() {
  return (
    <View style={styles.card}>
      <Skeleton width={200} height={24} style={styles.title} />
      <Skeleton width={250} height={32} style={styles.highlight} />
      <Skeleton width={150} height={16} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary.light.default,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  title: {
    marginBottom: 12,
  },
  highlight: {
    marginBottom: 8,
  },
}); 