import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { typography } from '@/styles/shared/typography/typography';
import { colors } from '@/styles/shared/colors/colors';
import { styles } from './styles';
import { rideService, Ride } from '@/services/api/rides';
import { IconArrowLeft, IconClock, IconCurrencyReal, IconMapPin, IconCar, IconUsers, IconMessage } from '@tabler/icons-react-native';
import MapView, { Marker } from 'react-native-maps';
import { userService } from '@/services/api/user';

export default function RideDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [ride, setRide] = useState<Ride | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [driverPhoto, setDriverPhoto] = useState<string | null>(null);
  const [isLoadingDriverPhoto, setIsLoadingDriverPhoto] = useState(false);

  useEffect(() => {
    loadRideDetails();
  }, [id]);

  const loadRideDetails = async () => {
    try {
      setIsLoading(true);
      const response = await rideService.getById(id as string);
      setRide(response);
      
      if (response?.driver_id) {
        setIsLoadingDriverPhoto(true);
        try {
          const photoResponse = await userService.getProfilePictureById(response.driver_id);
          setDriverPhoto(photoResponse.url);
        } catch (error) {
          console.error('Error loading driver photo:', error);
        } finally {
          setIsLoadingDriverPhoto(false);
        }
      }
    } catch (error) {
      console.error('Error loading ride details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAvailableSeats = (ride: Ride) => {
    const pendingReservations = ride.Reservations?.filter(r => r.status === "PENDING").length || 0;
    return Math.max(0, ride.available_seats - pendingReservations);
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
        <Text style={[typography.h3, styles.headerTitle]}>Detalhes da Carona</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.normal.default} />
        </View>
      ) : ride ? (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
              title="Ponto de Partida"
            />
            <Marker
              coordinate={{
                latitude: ride.EndAddress.latitude,
                longitude: ride.EndAddress.longitude,
              }}
              title="Destino"
            />
          </MapView>

          <View style={styles.detailsContainer}>
            {/* Driver Information */}
            <View style={styles.driverSection}>
              {isLoadingDriverPhoto ? (
                <View style={[styles.driverPhoto, { justifyContent: 'center', alignItems: 'center' }]}>
                  <ActivityIndicator color={colors.primary.normal.default} />
                </View>
              ) : (
                <Image
                  source={{
                    uri: driverPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(ride.Driver?.name || 'User')}`
                  }}
                  style={styles.driverPhoto}
                />
              )}
              <View style={styles.driverInfo}>
                <Text style={[typography.subtitle1, { color: colors.neutral.black }]}>
                  {ride.Driver?.name} {ride.Driver?.last_name}
                </Text>
                <Text style={[typography.caption, { color: colors.neutral.gray2 }]}>Motorista</Text>
              </View>
              <TouchableOpacity style={styles.messageButton}>
                <IconMessage size={24} color={colors.primary.normal.default} />
              </TouchableOpacity>
            </View>

            {/* Trip Information */}
            <View style={styles.tripInfo}>
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
                  <Text style={[typography.caption, { color: colors.neutral.gray2 }]}>Valor por pessoa</Text>
                  <Text style={[typography.body1, { color: colors.neutral.black }]}>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(parseFloat(ride.price))}
                  </Text>
                </View>
              </View>

              <View style={styles.locationItem}>
                <IconUsers size={24} color={colors.primary.normal.default} />
                <View style={styles.locationText}>
                  <Text style={[typography.caption, { color: colors.neutral.gray2 }]}>Lugares disponíveis</Text>
                  <Text style={[typography.body1, { color: colors.neutral.black }]}>
                    {calculateAvailableSeats(ride)} de {ride.Vehicle?.seats} lugares
                  </Text>
                </View>
              </View>

              {ride.preferences && (
                <View style={styles.locationItem}>
                  <IconCar size={24} color={colors.primary.normal.default} />
                  <View style={styles.locationText}>
                    <Text style={[typography.caption, { color: colors.neutral.gray2 }]}>Preferências</Text>
                    <Text style={[typography.body1, { color: colors.neutral.black }]}>
                      {ride.preferences}
                    </Text>
                  </View>
                </View>
              )}
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