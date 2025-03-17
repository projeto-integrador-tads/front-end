import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/styles/shared/colors/colors';
import { typography } from '@/styles/shared/typography/typography';
import { IconArrowRight, IconClock, IconMapPin, IconUsers, IconCurrencyReal } from '@tabler/icons-react-native';

interface TripCardProps {
  startCity: string;
  endCity: string;
  date: string;
  price: string;
  spots: number;
  onPress?: () => void;
}

export function TripCard({ startCity, endCity, date, price, spots, onPress }: TripCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.route}>
            <Text style={[typography.subtitle1, styles.city]}>{startCity}</Text>
            <IconArrowRight size={20} color={colors.neutral.gray2} style={{ marginHorizontal: 8 }} />
            <Text style={[typography.subtitle1, styles.city]}>{endCity}</Text>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <IconClock size={20} color={colors.primary.normal.default} />
            <Text style={[typography.body2, styles.detailText]}>{date}</Text>
          </View>

          <View style={styles.detailItem}>
            <IconUsers size={20} color={colors.primary.normal.default} />
            <Text style={[typography.body2, styles.detailText]}>{spots} lugares</Text>
          </View>

          <View style={styles.detailItem}>
            <IconCurrencyReal size={20} color={colors.primary.normal.default} />
            <Text style={[typography.body2, styles.detailText]}>
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(parseFloat(price))}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
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
    gap: 12,
  },
  header: {
    gap: 8,
  },
  route: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  city: {
    color: colors.neutral.black,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.gray4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    color: colors.neutral.gray1,
  },
}); 