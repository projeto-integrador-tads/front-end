import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/styles/shared/colors/colors';
import { typography } from '@/styles/shared/typography/typography';
import { IconArrowRight } from '@tabler/icons-react-native';

interface RideCardProps {
  id: string;
  startCity: string;
  endCity: string;
  date: string;
  price: string;
  onPress?: () => void;
}

export function RideCard({ startCity, endCity, date, price, onPress }: RideCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <Text style={[typography.caption, styles.date]}>{date}</Text>

        <View style={styles.routeContainer}>
          <View style={styles.locationContainer}>
            <View style={[styles.locationDot, styles.startDot]} />
            <Text style={[typography.subtitle1, styles.city]} numberOfLines={1}>
              {startCity}
            </Text>
          </View>
          
          <View style={styles.routeLine}>
            <IconArrowRight size={20} color={colors.neutral.gray3} />
          </View>
          
          <View style={styles.locationContainer}>
            <View style={[styles.locationDot, styles.endDot]} />
            <Text style={[typography.subtitle1, styles.city]} numberOfLines={1}>
              {endCity}
            </Text>
          </View>
        </View>

        <View style={styles.priceContainer}>
          <Text style={[typography.caption, styles.priceLabel]}>Valor</Text>
          <Text style={[typography.subtitle1, styles.priceValue]}>
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(parseFloat(price))}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    marginBottom: 16,
    marginHorizontal: 4,
    padding: 16,
    shadowColor: colors.neutral.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  content: {
    gap: 16,
  },
  date: {
    color: colors.neutral.gray2,
    alignSelf: 'flex-end',
  },
  routeContainer: {
    gap: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  startDot: {
    backgroundColor: colors.primary.normal.default,
  },
  endDot: {
    backgroundColor: colors.status.success,
  },
  routeLine: {
    alignItems: 'center',
  },
  city: {
    color: colors.neutral.black,
    flex: 1,
  },
  priceContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.neutral.gray4,
    paddingTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceLabel: {
    color: colors.neutral.gray2,
  },
  priceValue: {
    color: colors.primary.normal.default,
  },
}); 