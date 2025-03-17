import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/styles/shared/colors/colors';
import { typography } from '@/styles/shared/typography/typography';
import { IconArrowRight } from '@tabler/icons-react-native';

interface PromoCardProps {
  title: string;
  highlight: string;
  description?: string;
  onPress?: () => void;
}

export function PromoCard({ title, highlight, description, onPress }: PromoCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.textContent}>
          <Text style={[typography.subtitle1, styles.highlight]} numberOfLines={1}>
            {highlight}
          </Text>
          <Text style={[typography.h3, styles.title]} numberOfLines={2}>
            {title}
          </Text>
          {description && (
            <Text style={[typography.caption, styles.description]} numberOfLines={2}>
              {description}
            </Text>
          )}
        </View>
        <IconArrowRight size={24} color="#169e69" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 4,
    backgroundColor: '#e8f6ef', // Lighter version of #169e69
  },
  content: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContent: {
    flex: 1,
    gap: 4,
    marginRight: 16,
  },
  highlight: {
    color: '#169e69',
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    color: '#169e69',
    fontSize: 16,
    marginTop: 4,
  },
  description: {
    color: '#169e69',
    marginTop: 4,
    fontSize: 14,
    opacity: 0.8,
  },
}); 