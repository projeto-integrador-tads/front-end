import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Modal, Image, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import { IconArrowLeft, IconUsers, IconCurrencyReal, IconClock, IconMessage, IconFilter, IconCalendar, IconX, IconSearch } from '@tabler/icons-react-native';
import { colors } from '@/styles/shared/colors/colors';
import { typography } from '@/styles/shared/typography/typography';
import { rideService, Ride } from '@/services/api/rides';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import { Dialog } from '@/components/dialog/Dialog';
import { reservationService } from '@/services/api/reservations';
import { useUser } from '@/contexts/UserContext';
import { userService } from '@/services/api/user';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function MoreRidesScreen() {
  const { user } = useUser();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [isReserving, setIsReserving] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [driverInfo, setDriverInfo] = useState<{ photo: string | null; name: string; last_name: string } | null>(null);
  
  // Filter states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number | null>(null);
  const [hasPreferences, setHasPreferences] = useState<boolean | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [originalRides, setOriginalRides] = useState<Ride[]>([]);

  useEffect(() => {
    requestLocationAndLoadRides();
  }, []);

  const requestLocationAndLoadRides = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location);
        await loadRides(location);
      } else {
        await loadRides(null);
      }
    } catch (error) {
      console.error("Error getting location:", error);
      await loadRides(null);
    }
  };

  const loadRides = async (location: Location.LocationObject | null) => {
    try {
      let response;
      if (location) {
        const geocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (geocode[0]?.city) {
          response = await rideService.getByStartCity(geocode[0].city, 1, 50);
        } else {
          response = await rideService.getByStartCity('', 1, 50);
        }
      } else {
        response = await rideService.getByStartCity('', 1, 50);
      }

      if (response?.data) {
        let filteredRides = response.data;
        setOriginalRides(response.data);

        // Apply search filter
        if (searchQuery) {
          filteredRides = filteredRides.filter(ride => 
            ride.StartAddress.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ride.EndAddress.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ride.StartAddress.formattedAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ride.EndAddress.formattedAddress.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        // Apply other filters
        if (selectedDate) {
          const selectedDateStr = selectedDate.toDateString();
          filteredRides = filteredRides.filter(ride => 
            new Date(ride.start_time).toDateString() === selectedDateStr
          );
        }

        if (selectedSeats) {
          filteredRides = filteredRides.filter(ride => 
            ride.available_seats >= selectedSeats
          );
        }

        if (hasPreferences !== null) {
          filteredRides = filteredRides.filter(ride => 
            hasPreferences ? !!ride.preferences : !ride.preferences
          );
        }

        setRides(filteredRides);
      }
    } catch (error) {
      console.error('Error loading rides:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const loadDriverInfo = async (driverId: string) => {
    try {
      const [photoResponse, userResponse] = await Promise.all([
        userService.getProfilePictureById(driverId),
        userService.getById(driverId),
      ]);
      setDriverInfo({
        photo: photoResponse.url,
        name: userResponse.name,
        last_name: userResponse.last_name,
      });
    } catch (error) {
      console.error('Error loading driver info:', error);
      setDriverInfo(null);
    }
  };

  const hasUserReservation = (ride: Ride) => {
    return ride.Reservations?.some(
      (reservation) =>
        (reservation as any).passenger_id === user?.id &&
        (reservation.status === "PENDING" || reservation.status === "CONFIRMED")
    );
  };

  const handleReserveRide = async (ride: Ride) => {
    if (isReserving) return;

    if (hasUserReservation(ride)) {
      Dialog({
        visible: true,
        title: "Reserva existente",
        message: "Você já possui uma reserva ativa ou pendente para esta corrida.",
        onClose: () => {},
        type: "error",
        actions: [
          {
            label: "OK",
            variant: "primary",
            onPress: () => {},
          },
        ],
      });
      return;
    }

    try {
      setIsReserving(true);
      await reservationService.create(ride.ride_id);
      setSelectedRide(null);
      setShowSuccessDialog(true);
      loadRides(currentLocation);
    } catch (error) {
      console.error("Error creating reservation:", error);
      Dialog({
        visible: true,
        title: "Erro",
        message: "Não foi possível realizar a reserva. Tente novamente mais tarde.",
        onClose: () => {},
        type: "error",
        actions: [
          {
            label: "OK",
            variant: "primary",
            onPress: () => {},
          },
        ],
      });
    } finally {
      setIsReserving(false);
    }
  };

  const RideDetailsModal = () => (
    <Modal
      visible={!!selectedRide}
      transparent
      animationType="fade"
      onRequestClose={() => setSelectedRide(null)}
    >
      <View style={{ 
        flex: 1, 
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end'
      }}>
        <View style={{ 
          backgroundColor: colors.neutral.white,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: 24,
          transform: [{ translateY: 0 }]
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 24,
            gap: 12,
          }}>
            <Text style={[typography.h3, { flex: 1 }]}>Detalhes da carona</Text>
            <TouchableOpacity onPress={() => setSelectedRide(null)}>
              <IconX size={24} color={colors.neutral.black} />
            </TouchableOpacity>
          </View>

          {selectedRide && (
            <>
              <View style={{ marginBottom: 16 }}>
                <Text style={[typography.subtitle1, { marginBottom: 8 }]}>Motorista</Text>
                <View style={{ 
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: colors.neutral.white,
                  borderRadius: 12,
                  padding: 16,
                  gap: 12,
                  borderWidth: 1,
                  borderColor: colors.neutral.gray4,
                }}>
                  {driverInfo?.photo ? (
                    <View style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: colors.neutral.gray4,
                      overflow: 'hidden',
                    }}>
                      <Image
                        source={{ uri: driverInfo.photo }}
                        style={{ width: '100%', height: '100%' }}
                      />
                    </View>
                  ) : (
                    <View style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: colors.neutral.gray4,
                    }} />
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={[typography.body1, { color: colors.neutral.black }]}>
                      {driverInfo ? `${driverInfo.name} ${driverInfo.last_name}` : 'Motorista'}
                    </Text>
                    <Text style={[typography.caption, { color: colors.neutral.gray2 }]}>
                      Motorista
                    </Text>
                  </View>
                  {selectedRide.driver_id !== user?.id && (
                    <TouchableOpacity style={{
                      padding: 8,
                      borderRadius: 8,
                      backgroundColor: colors.primary.light.default,
                    }}>
                      <IconMessage size={24} color={colors.primary.normal.default} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text style={[typography.subtitle1, { marginBottom: 8 }]}>Trajeto</Text>
                <Text style={[typography.body1, { color: colors.neutral.gray1 }]}>
                  De: {selectedRide.StartAddress.formattedAddress}
                </Text>
                <Text style={[typography.body1, { color: colors.neutral.gray1, marginTop: 4 }]}>
                  Para: {selectedRide.EndAddress.formattedAddress}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', gap: 16, marginBottom: 24 }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <IconClock size={20} color={colors.primary.normal.default} />
                  <Text style={[typography.body2, { color: colors.neutral.gray1 }]}>
                    {formatDate(selectedRide.start_time)}
                  </Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <IconUsers size={20} color={colors.primary.normal.default} />
                  <Text style={[typography.body2, { color: colors.neutral.gray1 }]}>
                    {selectedRide.available_seats} lugares
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                <IconCurrencyReal size={20} color={colors.primary.normal.default} />
                <Text style={[typography.h3]}>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(parseFloat(selectedRide.price))}
                </Text>
              </View>

              {selectedRide.driver_id !== user?.id && (
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.primary.normal.default,
                    padding: 16,
                    borderRadius: 12,
                    alignItems: 'center',
                    opacity: hasUserReservation(selectedRide) ? 0.5 : 1,
                  }}
                  onPress={() => handleReserveRide(selectedRide)}
                  disabled={hasUserReservation(selectedRide)}
                >
                  <Text style={[typography.button, { color: colors.neutral.white }]}>
                    {hasUserReservation(selectedRide)
                      ? "Você já tem uma reserva para esta carona"
                      : `Reservar por ${new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(parseFloat(selectedRide.price))}`}
                  </Text>
                </TouchableOpacity>
              )}

              {selectedRide.driver_id === user?.id && (
                <View style={{
                  backgroundColor: colors.neutral.gray3,
                  padding: 16,
                  borderRadius: 12,
                  alignItems: 'center',
                }}>
                  <Text style={[typography.button, { color: colors.neutral.white }]}>
                    Esta é sua carona
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
      loadRides(currentLocation);
    }
  };

  const clearFilters = () => {
    setSelectedDate(null);
    setSelectedSeats(null);
    setHasPreferences(null);
    loadRides(currentLocation);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    let filteredRides = originalRides;

    if (text) {
      filteredRides = filteredRides.filter(ride => 
        ride.StartAddress.city.toLowerCase().includes(text.toLowerCase()) ||
        ride.EndAddress.city.toLowerCase().includes(text.toLowerCase()) ||
        ride.StartAddress.formattedAddress.toLowerCase().includes(text.toLowerCase()) ||
        ride.EndAddress.formattedAddress.toLowerCase().includes(text.toLowerCase())
      );
    }

    // Reapply other filters
    if (selectedDate) {
      const selectedDateStr = selectedDate.toDateString();
      filteredRides = filteredRides.filter(ride => 
        new Date(ride.start_time).toDateString() === selectedDateStr
      );
    }

    if (selectedSeats) {
      filteredRides = filteredRides.filter(ride => 
        ride.available_seats >= selectedSeats
      );
    }

    if (hasPreferences !== null) {
      filteredRides = filteredRides.filter(ride => 
        hasPreferences ? !!ride.preferences : !ride.preferences
      );
    }

    setRides(filteredRides);
  };

  const FilterPill = ({ 
    label, 
    isSelected, 
    onPress 
  }: { 
    label: string; 
    isSelected: boolean; 
    onPress: () => void 
  }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: isSelected ? colors.primary.normal.default : colors.neutral.white,
        borderWidth: 1,
        borderColor: isSelected ? colors.primary.normal.default : colors.neutral.gray4,
      }}
    >
      <Text
        style={[
          typography.button,
          { color: isSelected ? colors.neutral.white : colors.neutral.gray1 },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral.white }}>
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.gray4,
        backgroundColor: colors.neutral.white,
      }}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={{ padding: 8, marginLeft: -8 }}
        >
          <IconArrowLeft size={24} color={colors.neutral.gray1} />
        </TouchableOpacity>
        <Text style={{ 
          ...typography.subtitle1,
          color: colors.neutral.gray1,
          marginLeft: 8,
          flex: 1,
        }}>
          Explorar corridas
        </Text>
        <TouchableOpacity 
          onPress={() => setShowFilters(!showFilters)}
          style={{ 
            padding: 8,
            backgroundColor: showFilters ? colors.primary.light.default : 'transparent',
            borderRadius: 8,
          }}
        >
          <IconFilter size={24} color={showFilters ? colors.primary.normal.default : colors.neutral.gray1} />
        </TouchableOpacity>
      </View>

      <View style={{
        backgroundColor: colors.neutral.white,
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral.gray4,
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.neutral.white,
          borderRadius: 8,
          paddingHorizontal: 12,
          borderWidth: 1,
          borderColor: colors.neutral.gray4,
          gap: 8,
        }}>
          <IconSearch size={20} color={colors.neutral.gray2} />
          <TextInput
            placeholder="Buscar por cidade ou endereço..."
            placeholderTextColor={colors.neutral.gray2}
            style={[
              typography.body2,
              {
                flex: 1,
                height: 40,
                color: colors.neutral.black,
              }
            ]}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <IconX size={20} color={colors.neutral.gray2} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {showFilters && (
        <View style={{
          backgroundColor: colors.neutral.white,
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.neutral.gray4,
        }}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: selectedDate ? colors.primary.normal.default : colors.neutral.white,
                borderWidth: 1,
                borderColor: selectedDate ? colors.primary.normal.default : colors.neutral.gray4,
              }}
            >
              <IconCalendar 
                size={20} 
                color={selectedDate ? colors.neutral.white : colors.neutral.gray1} 
              />
              <Text
                style={[
                  typography.button,
                  { color: selectedDate ? colors.neutral.white : colors.neutral.gray1 },
                ]}
              >
                {selectedDate ? selectedDate.toLocaleDateString('pt-BR') : 'Data'}
              </Text>
              {selectedDate && (
                <TouchableOpacity 
                  onPress={(e) => {
                    e.stopPropagation();
                    setSelectedDate(null);
                    loadRides(currentLocation);
                  }}
                  style={{ marginLeft: 4 }}
                >
                  <IconX 
                    size={16} 
                    color={colors.neutral.white} 
                  />
                </TouchableOpacity>
              )}
            </TouchableOpacity>

            <FilterPill
              label="2+ lugares"
              isSelected={selectedSeats === 2}
              onPress={() => {
                setSelectedSeats(selectedSeats === 2 ? null : 2);
                loadRides(currentLocation);
              }}
            />

            <FilterPill
              label="4+ lugares"
              isSelected={selectedSeats === 4}
              onPress={() => {
                setSelectedSeats(selectedSeats === 4 ? null : 4);
                loadRides(currentLocation);
              }}
            />

            <FilterPill
              label="Com preferências"
              isSelected={hasPreferences === true}
              onPress={() => {
                setHasPreferences(hasPreferences === true ? null : true);
                loadRides(currentLocation);
              }}
            />

            {(selectedDate || selectedSeats || hasPreferences !== null) && (
              <TouchableOpacity
                onPress={clearFilters}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: colors.status.error,
                }}
              >
                <Text style={[typography.button, { color: colors.neutral.white }]}>
                  Limpar filtros
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      )}

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (event.type === 'set' && date) {
              setSelectedDate(date);
              loadRides(currentLocation);
            }
          }}
          minimumDate={new Date()}
        />
      )}

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary.normal.default} />
        </View>
      ) : (
        <MapView
          style={{ flex: 1 }}
          initialRegion={currentLocation ? {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          } : {
            latitude: -23.5505,
            longitude: -46.6333,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation
          followsUserLocation
        >
          {rides.map((ride) => (
            <React.Fragment key={ride.ride_id}>
              <Marker
                coordinate={{
                  latitude: ride.StartAddress.latitude,
                  longitude: ride.StartAddress.longitude,
                }}
                title="Ponto de partida"
                description={ride.StartAddress.formattedAddress}
                pinColor={colors.primary.normal.default}
                onPress={() => {
                  loadDriverInfo(ride.driver_id);
                  setSelectedRide(ride);
                }}
              />
              <Marker
                coordinate={{
                  latitude: ride.EndAddress.latitude,
                  longitude: ride.EndAddress.longitude,
                }}
                title="Destino"
                description={ride.EndAddress.formattedAddress}
                pinColor={colors.status.error}
                onPress={() => {
                  loadDriverInfo(ride.driver_id);
                  setSelectedRide(ride);
                }}
              />
            </React.Fragment>
          ))}
        </MapView>
      )}

      <RideDetailsModal />

      <Dialog
        visible={showSuccessDialog}
        title="Reserva realizada!"
        message="Sua reserva foi realizada com sucesso e está com status pendente. Você pode acompanhar o status da sua reserva na seção de reservas."
        onClose={() => setShowSuccessDialog(false)}
        type="success"
        actions={[
          {
            label: "Ver minhas reservas",
            variant: "primary",
            onPress: () => {
              setShowSuccessDialog(false);
              router.push("/reservations" as any);
            },
          },
          {
            label: "OK",
            variant: "secondary",
            onPress: () => {
              setShowSuccessDialog(false);
            },
          },
        ]}
      />
    </SafeAreaView>
  );
} 