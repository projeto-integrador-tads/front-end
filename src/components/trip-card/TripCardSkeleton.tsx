import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { colors } from '@/styles/shared/colors/colors';

export function TripCardSkeleton() {
  return (
    <View style={[styles.container, { opacity: 0.5 }]}>
      <View style={[styles.image, { backgroundColor: colors.neutral.gray4 }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={{ width: 120, height: 24, backgroundColor: colors.neutral.gray4, borderRadius: 4 }} />
          <View style={{ width: 80, height: 20, backgroundColor: colors.neutral.gray4, borderRadius: 4 }} />
        </View>
        <View style={{ width: 160, height: 20, backgroundColor: colors.neutral.gray4, borderRadius: 4 }} />
      </View>
    </View>
  );
} 