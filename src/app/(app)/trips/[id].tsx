import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { typography } from '@/styles/shared/typography/typography';
import { colors } from '@/styles/shared/colors/colors';
import { styles } from './styles';
import { rideService, Ride } from '@/services/api/rides';
import { IconArrowLeft, IconClock, IconCurrencyReal, IconMapPin } from '@tabler/icons-react-native';
import MapView, { Marker } from 'react-native-maps';

export default function RideDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [ride, setRide] = useState<Ride | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRideDetails();
  }, [id]);

  const loadRideDetails = async () => {
    try {
      setIsLoading(true);
      const response = await rideService.getById(id as string);
      setRide(response);
    } catch (error) {
      console.error('Error loading ride details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconArrowLeft size={24} color={colors.neutral.black} />
          <Text style={[typography.body2, { color: colors.neutral.black }]}>Voltar</Text>
        </TouchableOpacity>
        <Text style={[typography.h3, { color: colors.neutral.black }]}>Detalhes da Carona</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.normal.default} />
        </View>
      ) : ride ? (
        <ScrollView style={styles.content}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: ride.StartAddress.latitude,
              longitude: ride.StartAddress.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: ride.StartAddress.latitude,
                longitude: ride.StartAddress.longitude,
              }}
            />
            <Marker
              coordinate={{
                latitude: ride.EndAddress.latitude,
                longitude: ride.EndAddress.longitude,
              }}
            />
          </MapView>

          <View style={styles.detailsContainer}>
            <View style={styles.locationItem}>
              <IconMapPin size={24} color={colors.primary.normal.default} />
              <View style={styles.locationText}>
                <Text style={[typography.caption, { color: colors.neutral.gray2 }]}>Local de partida</Text>
                <Text style={[typography.body1, { color: colors.neutral.black }]}>
                  {ride.StartAddress.formattedAddress}
                </Text>
              </View>
            </View>

            <View style={styles.locationItem}>
              <IconMapPin size={24} color={colors.primary.normal.default} />
              <View style={styles.locationText}>
                <Text style={[typography.caption, { color: colors.neutral.gray2 }]}>Destino</Text>
                <Text style={[typography.body1, { color: colors.neutral.black }]}>
                  {ride.EndAddress.formattedAddress}
                </Text>
              </View>
            </View>

            <View style={styles.locationItem}>
              <IconClock size={24} color={colors.primary.normal.default} />
              <View style={styles.locationText}>
                <Text style={[typography.caption, { color: colors.neutral.gray2 }]}>Data e hora</Text>
                <Text style={[typography.body1, { color: colors.neutral.black }]}>
                  {new Date(ride.start_time).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </View>
            </View>

            <View style={styles.locationItem}>
              <IconCurrencyReal size={24} color={colors.primary.normal.default} />
              <View style={styles.locationText}>
                <Text style={[typography.caption, { color: colors.neutral.gray2 }]}>Valor da viagem</Text>
                <Text style={[typography.body1, { color: colors.neutral.black }]}>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(parseFloat(ride.price))}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.errorContainer}>
          <Text style={[typography.body1, { color: colors.neutral.gray2 }]}>
            Não foi possível carregar os detalhes da carona.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
} 