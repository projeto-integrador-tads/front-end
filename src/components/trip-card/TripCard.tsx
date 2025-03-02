import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { typography } from '@/styles/shared/typography/typography';
import { styles } from './styles';

interface TripCardProps {
  id: string;
  city: string;
  date: string;
  spots: string;
  image: string;
}

export function TripCard({ id, city, date, spots, image }: TripCardProps) {
  return (
    <Link href={`/(app)/trips/${id}`} asChild>
      <TouchableOpacity activeOpacity={0.7} style={styles.container}>
        <Image source={{ uri: image }} style={styles.image} />
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[typography.h3]}>{city}</Text>
            <Text style={[typography.body2, styles.date]}>{date}</Text>
          </View>
          <Text style={[typography.body2, styles.spots]}>{spots}</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
} 