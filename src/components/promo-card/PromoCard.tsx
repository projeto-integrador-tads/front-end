import React from 'react';
import { View, Text } from 'react-native';
import { typography } from '@/styles/shared/typography/typography';
import { styles } from './styles';

interface PromoCardProps {
  title: string;
  highlight: string;
  date: string;
}

export function PromoCard({ title, highlight, date }: PromoCardProps) {
  return (
    <View style={styles.promotionCard}>
      <Text style={[typography.h3, styles.promotionTitle]}>
        {title}
      </Text>
      <Text style={[typography.h2, styles.promotionHighlight]}>
        {highlight}
      </Text>
      <Text style={[typography.caption, styles.promotionDate]}>
        {date}
      </Text>
    </View>
  );
} 