import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TextInput, Image, TouchableOpacity, Modal, ActivityIndicator, StyleSheet, RefreshControl, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { typography } from "@/styles/shared/typography/typography";
import { colors } from "@/styles/shared/colors/colors";
import { styles } from "./styles";
import { useUser } from "@/contexts/UserContext";
import { IconSearch, IconCar, IconHome, IconPlane, IconMapPin, IconX, IconArrowRight, IconUsers, IconCurrencyReal, IconClock, IconCreditCard, IconMessage } from "@tabler/icons-react-native";
import { Link, router } from "expo-router";
import BgBlueSvg from "@/assets/svgs/bg-blue";
import { PromoCard } from "@/components/promo-card/PromoCard";
import { TripCard } from "@/components/trip-card/TripCard";
import { TripCardSkeleton } from "@/components/trip-card/TripCardSkeleton";
import { PromoCardSkeleton } from "@/components/promo-card/PromoCardSkeleton";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { userService, User } from "@/services/api/user";
import { rideService, Ride } from "@/services/api/rides";
import { useDebounce } from "@/hooks/useDebounce";
import MapView, { Marker } from "react-native-maps";
import * as Location from 'expo-location';
import { RideCard } from "@/components/ride-card/RideCard";
import { reservationService } from "@/services/api/reservations";
import { Button } from "@/components/button/Button";
import { Dialog } from "@/components/dialog/Dialog";

const serviceOptions = [
  { icon: IconCar, label: "Carros", route: "profile/vehicles" },
  { icon: IconHome, label: "Hotéis", route: "(app)/services/hotels" },
  { icon: IconPlane, label: "Voos", route: "(app)/services/flights" },
  { icon: IconMapPin, label: "Destinos", route: "(app)/services/destinations" },
];

const featuredTrips = [
  {
    id: "1",
    city: "Rio de Janeiro",
    date: "24-30 Março",
    spots: "12 lugares disponíveis",
    image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "2",
    city: "São Paulo",
    date: "15-20 Abril",
    spots: "8 lugares disponíveis",
    image: "https://images.unsplash.com/photo-1578002573559-689b0abc4148?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "3",
    city: "Salvador",
    date: "1-7 Maio",
    spots: "15 lugares disponíveis",
    image: "https://images.unsplash.com/photo-1564659907532-6b5f98c8e70f?w=800&auto=format&fit=crop&q=80"
  },
];

// Helper function to calculate available seats
const calculateAvailableSeats = (ride: Ride) => {
  const pendingReservations = ride.Reservations?.filter(r => r.status === "PENDING").length || 0;
  return Math.max(0, ride.available_seats - pendingReservations);
};

const SearchModal = ({ 
  visible, 
  onClose, 
  searchQuery, 
  setSearchQuery, 
  isSearching, 
  searchResults,
  onCardPress 
}: { 
  visible: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearching: boolean;
  searchResults: Ride[];
  onCardPress: (ride: Ride) => void;
}) => (
  <Modal
    visible={visible}
    animationType="slide"
    onRequestClose={onClose}
  >
    <SafeAreaView style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <View style={styles.searchInputContainer}>
          <IconSearch size={24} color={colors.neutral.gray2} />
          <TextInput
            style={styles.modalSearchInput}
            placeholder="Digite a cidade de destino..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <IconX size={20} color={colors.neutral.gray2} />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity 
          onPress={onClose}
          style={styles.closeButton}
        >
          <Text style={[typography.body2, { color: colors.primary.normal.default }]}>
            Cancelar
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.searchResults}>
        {isSearching ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.primary.normal.default} />
          </View>
        ) : searchResults.length > 0 ? (
          searchResults.map((ride, index) => (
            <TouchableOpacity
              key={`${ride.ride_id}-${index}`}
              style={styles.searchResultCard}
              onPress={() => onCardPress(ride)}
            >
              <View style={styles.searchResultRoute}>
                <Text style={[typography.body1, styles.searchResultCity]} numberOfLines={1}>
                  {ride.StartAddress.city}
                </Text>
                <IconArrowRight size={20} color={colors.neutral.gray2} />
                <Text style={[typography.body1, styles.searchResultCity]} numberOfLines={1}>
                  {ride.EndAddress.city}
                </Text>
              </View>

              <View style={styles.searchResultInfo}>
                <View style={styles.searchResultDetail}>
                  <IconClock size={16} color={colors.neutral.gray2} />
                  <Text style={[typography.caption, styles.searchResultText]}>
                    {new Date(ride.start_time).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </View>

                <View style={styles.searchResultDetail}>
                  <IconUsers size={16} color={colors.neutral.gray2} />
                  <Text style={[typography.caption, styles.searchResultText]}>
                    {calculateAvailableSeats(ride)} lugares
                  </Text>
                </View>

                <View style={styles.searchResultDetail}>
                  <IconCurrencyReal size={16} color={colors.neutral.gray2} />
                  <Text style={[typography.caption, styles.searchResultText]}>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(parseFloat(ride.price))}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : searchQuery ? (
          <Text style={[typography.body1, styles.noResults]}>
            Nenhuma carona encontrada para esta cidade.
          </Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  </Modal>
);

export default function HomeScreen() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Ride[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [driverPicture, setDriverPicture] = useState<string | null>(null);
  const [isLoadingRideDetails, setIsLoadingRideDetails] = useState(false);
  const [driverInfo, setDriverInfo] = useState<{ name: string; last_name: string } | null>(null);
  const [showRideDetails, setShowRideDetails] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [nearbyRides, setNearbyRides] = useState<Ride[]>([]);
  const [isLoadingRides, setIsLoadingRides] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreRides, setHasMoreRides] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [driversInfo, setDriversInfo] = useState<Record<string, { photo: string | null; name: string }>>({});
  const [isReserving, setIsReserving] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const capitalizedName = user?.name
    ? user.name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
    : "Usuário";

  useEffect(() => {
    const loadData = async () => {
      try {
        const pictureResponse = await userService.getProfilePicture();
        setProfilePicture(pictureResponse.url);
      } catch (error) {
        console.error('Error loading profile picture:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    handleSearch(debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  const handleSearch = async (query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await rideService.getByDestinationCity(trimmedQuery);
      setSearchResults(response?.data || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const renderServiceOption = (option: typeof serviceOptions[0]) => (
    <View key={option.label} style={styles.serviceOption}>
      <Link href={option.route as any}>
        <View style={styles.serviceIconContainer}>
          <option.icon size={32} color={colors.primary.normal.default} />
        </View>
      </Link>
      <Text style={styles.serviceLabel}>{option.label}</Text>
    </View>
  );

  const handleCloseSearch = () => {
    setShowSearchModal(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleRidePress = async (ride: Ride) => {
    setSelectedRide(ride);
    setShowRideDetails(true);
    setIsLoadingRideDetails(true);
    handleCloseSearch();
    
    try {
      const [rideDetails, driverPic, driverData] = await Promise.all([
        rideService.getById(ride.ride_id),
        userService.getProfilePictureById(ride.driver_id),
        userService.getById(ride.driver_id)
      ]);
      
      setSelectedRide(rideDetails);
      setDriverPicture(driverPic.url);
      setDriverInfo(driverData);
    } catch (error) {
      console.error('Error loading ride details:', error);
    } finally {
      setIsLoadingRideDetails(false);
    }
  };

  const handleCloseRideDetails = () => {
    setShowRideDetails(false);
    // Clear data after animation completes
    setTimeout(() => {
      setSelectedRide(null);
      setDriverPicture(null);
      setDriverInfo(null);
    }, 300);
  };

  const RideDetailsModal = () => (
    <Modal
      visible={showRideDetails}
      animationType="fade"
      transparent
      onRequestClose={handleCloseRideDetails}
    >
      <SafeAreaView style={styles.modalOverlay}>
        <View style={styles.rideDetailsContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={handleCloseRideDetails} style={styles.backButton}>
              <IconArrowRight size={24} color={colors.neutral.black} style={{ transform: [{ rotate: '180deg' }] }} />
              <Text style={[typography.body2, { color: colors.neutral.black, marginLeft: 4 }]}>Voltar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView bounces={false}>
            {selectedRide && (
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: selectedRide.StartAddress.latitude,
                  longitude: selectedRide.StartAddress.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: selectedRide.StartAddress.latitude,
                    longitude: selectedRide.StartAddress.longitude,
                  }}
                />
                <Marker
                  coordinate={{
                    latitude: selectedRide.EndAddress.latitude,
                    longitude: selectedRide.EndAddress.longitude,
                  }}
                />
              </MapView>
            )}

            <View style={styles.rideContent}>
              <Text style={[typography.h3, { marginBottom: 16 }]}>Informações do Motorista</Text>
              
              <View style={styles.driverSection}>
                {isLoadingRideDetails ? (
                  <>
                    <Skeleton width={48} height={48} borderRadius={24} />
                    <View style={styles.driverInfo}>
                      <Skeleton width={120} height={20} style={{ marginBottom: 4 }} />
                      <Skeleton width={80} height={16} />
                    </View>
                  </>
                ) : (
                  <>
                    {driverPicture ? (
                      <Image source={{ uri: driverPicture }} style={styles.driverPicture} />
                    ) : (
                      <View style={[styles.driverPicture, { backgroundColor: colors.neutral.gray4 }]} />
                    )}
                    <View style={styles.driverInfo}>
                      <Text style={[typography.body1, { color: colors.neutral.black }]}>
                        {driverInfo ? `${driverInfo.name} ${driverInfo.last_name}` : 'Motorista'}
                      </Text>
                      <Text style={[typography.caption, { color: colors.neutral.gray2 }]}>Motorista</Text>
                    </View>
                    {selectedRide?.driver_id !== user?.id && (
                      <TouchableOpacity style={styles.messageButton}>
                        <IconMessage size={24} color={colors.primary.normal.default} />
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </View>

              <Text style={[typography.h3, { marginTop: 24, marginBottom: 16 }]}>Informações sobre a viagem</Text>

              {isLoadingRideDetails ? (
                <>
                  <View style={styles.locationItem}>
                    <IconCurrencyReal size={24} color={colors.primary.normal.default} />
                    <View style={styles.locationText}>
                      <Skeleton width={80} height={16} style={{ marginBottom: 4 }} />
                      <Skeleton width={120} height={20} />
                    </View>
                  </View>

                  <View style={styles.locationItem}>
                    <IconMapPin size={24} color={colors.primary.normal.default} />
                    <View style={styles.locationText}>
                      <Skeleton width={80} height={16} style={{ marginBottom: 4 }} />
                      <Skeleton width={200} height={20} />
                    </View>
                  </View>

                  <View style={styles.locationItem}>
                    <IconMapPin size={24} color={colors.primary.normal.default} />
                    <View style={styles.locationText}>
                      <Skeleton width={80} height={16} style={{ marginBottom: 4 }} />
                      <Skeleton width={200} height={20} />
                    </View>
                  </View>

                  <View style={styles.locationItem}>
                    <IconClock size={24} color={colors.primary.normal.default} />
                    <View style={styles.locationText}>
                      <Skeleton width={80} height={16} style={{ marginBottom: 4 }} />
                      <Skeleton width={160} height={20} />
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.locationItem}>
                    <IconCurrencyReal size={24} color={colors.primary.normal.default} />
                    <View style={styles.locationText}>
                      <Text style={[typography.caption, { color: colors.neutral.gray2 }]}>Valor da viagem</Text>
                      <Text style={[typography.body1, { color: colors.neutral.black }]}>
                        {selectedRide && new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(parseFloat(selectedRide.price))}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.locationItem}>
                    <IconMapPin size={24} color={colors.primary.normal.default} />
                    <View style={styles.locationText}>
                      <Text style={[typography.caption, { color: colors.neutral.gray2 }]}>Local de partida</Text>
                      <Text style={[typography.body1, { color: colors.neutral.black }]}>
                        {selectedRide?.StartAddress.formattedAddress}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.locationItem}>
                    <IconMapPin size={24} color={colors.primary.normal.default} />
                    <View style={styles.locationText}>
                      <Text style={[typography.caption, { color: colors.neutral.gray2 }]}>Destino</Text>
                      <Text style={[typography.body1, { color: colors.neutral.black }]}>
                        {selectedRide?.EndAddress.formattedAddress}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.locationItem}>
                    <IconClock size={24} color={colors.primary.normal.default} />
                    <View style={styles.locationText}>
                      <Text style={[typography.caption, { color: colors.neutral.gray2 }]}>Data e hora</Text>
                      <Text style={[typography.body1, { color: colors.neutral.black }]}>
                        {selectedRide && new Date(selectedRide.start_time).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          </ScrollView>

          {selectedRide && !isLoadingRideDetails && selectedRide.driver_id !== user?.id && (
            <View style={styles.bottomActions}>
              <TouchableOpacity 
                style={[
                  styles.payButton,
                  { opacity: calculateAvailableSeats(selectedRide) > 0 && !hasUserReservation(selectedRide) ? 1 : 0.5 }
                ]}
                onPress={() => handleReserveRide(selectedRide)}
                disabled={calculateAvailableSeats(selectedRide) === 0 || hasUserReservation(selectedRide)}
              >
                <Text style={[typography.button, { color: colors.neutral.white }]}>
                  {hasUserReservation(selectedRide)
                    ? "Você já tem uma reserva para esta carona"
                    : selectedRide.available_seats === 0 
                    ? "Sem vagas disponíveis"
                    : `Reservar por ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(selectedRide.price))}`}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          
          {selectedRide && selectedRide.driver_id === user?.id && (
            <View style={styles.bottomActions}>
              <View style={[styles.payButton, { backgroundColor: colors.neutral.gray3 }]}>
                <Text style={[typography.button, { color: colors.neutral.white }]}>
                  Esta é sua carona
                </Text>
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location);
        loadNearbyRides(1);
      } else {
        setLocationError('Permissão de localização negada');
        loadNearbyRides(1);
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setLocationError('Erro ao obter localização');
      loadNearbyRides(1);
    }
  };

  const loadNearbyRides = async (page: number, shouldRefresh: boolean = false) => {
    try {
      setIsLoadingRides(true);
      let response;
      
      if (currentLocation) {
        const geocode = await Location.reverseGeocodeAsync({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude
        });
        
        if (geocode[0]?.city) {
          response = await rideService.getByStartCity(geocode[0].city, page);
        } else {
          response = await rideService.getByStartCity("Coronel Murta", page);
        }
      } else {
        response = await rideService.getByStartCity("Coronel Murta", page);
      }

      if (response?.data) {
        if (shouldRefresh) {
          setNearbyRides(response.data);
          // Load drivers info for new rides
          loadDriversInfo(response.data);
        } else {
          setNearbyRides(prev => [...prev, ...response.data]);
          // Load drivers info for new rides
          loadDriversInfo(response.data);
        }
        setHasMoreRides(page < (response.meta?.lastPage || 1));
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error loading nearby rides:', error);
    } finally {
      setIsLoadingRides(false);
    }
  };

  const loadDriversInfo = async (rides: Ride[]) => {
    try {
      const driversToLoad = rides.filter(ride => !driversInfo[ride.driver_id]);
      
      const driversData = await Promise.all(
        driversToLoad.map(async (ride) => {
          try {
            const [photoResponse, userResponse] = await Promise.all([
              userService.getProfilePictureById(ride.driver_id),
              userService.getById(ride.driver_id)
            ]);
            return {
              id: ride.driver_id,
              photo: photoResponse.url,
              name: `${userResponse.name.split(' ')[0]}`
            };
          } catch (error) {
            console.error(`Error loading driver info for ${ride.driver_id}:`, error);
            return {
              id: ride.driver_id,
              photo: null,
              name: "Motorista"
            };
          }
        })
      );

      setDriversInfo(prev => ({
        ...prev,
        ...Object.fromEntries(driversData.map(driver => [driver.id, { photo: driver.photo, name: driver.name }]))
      }));
    } catch (error) {
      console.error('Error loading drivers info:', error);
    }
  };

  const handleLoadMore = () => {
    if (!isLoadingRides && hasMoreRides) {
      loadNearbyRides(currentPage + 1);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await loadNearbyRides(1, true);
      const pictureResponse = await userService.getProfilePicture();
      setProfilePicture(pictureResponse.url);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const hasUserReservation = (ride: Ride) => {
    return ride.Reservations?.some(
      r => r.passenger_id === user?.id && (r.status === "PENDING" || r.status === "CONFIRMED")
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
            onPress: () => {}
          }
        ]
      });
      return;
    }

    try {
      setIsReserving(true);
      await reservationService.create(ride.ride_id);
      
      // Close the ride details modal first
      handleCloseRideDetails();
      
      // Show success dialog with updated message
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('Error creating reservation:', error);
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
            onPress: () => {}
          }
        ]
      });
    } finally {
      setIsReserving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary.normal.default}
            colors={[colors.primary.normal.default]}
          />
        }
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          if (!layoutMeasurement || !contentSize) return;
          
          const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
          
          if (isCloseToBottom) {
            handleLoadMore();
          }
        }}
        scrollEventThrottle={400}
      >
        <View style={styles.headerSection}>
          <View style={styles.background}>
            <BgBlueSvg style={styles.backgroundSvg} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[typography.body1, styles.greeting]}>
                Olá,
              </Text>
              {isLoading ? (
                <Skeleton width={150} height={32} style={{ marginTop: 4 }} />
              ) : (
                <Text style={[typography.h2, styles.userName]}>
                  {capitalizedName}
                </Text>
              )}
            </View>
            {isLoading ? (
              <Skeleton width={48} height={48} borderRadius={24} />
            ) : (
              <Link href="/(app)/profile" asChild>
                <TouchableOpacity>
                  <Image
                    source={{ 
                      uri: profilePicture || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.name || 'User')
                    }}
                    style={styles.profilePicture}
                  />
                </TouchableOpacity>
              </Link>
            )}
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TouchableOpacity
              style={styles.searchBar}
              onPress={() => setShowSearchModal(true)}
            >
              <IconSearch size={24} color={colors.neutral.gray2} />
              <Text style={[typography.body2, styles.searchPlaceholder]}>
                Para qual cidade você quer ir?
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.content, { paddingBottom: 100 }]}>
          {/* Service Options */}
          <Text style={[typography.h3, styles.sectionTitle]}>
            Como posso te servir hoje ?
          </Text>
          <View style={styles.serviceOptions}>
            {serviceOptions.map(renderServiceOption)}
          </View>

          {/* Replace Featured Trips section with Nearby Rides */}
          <Text style={[typography.h3, styles.sectionTitle]}>
            {locationError ? "Caronas disponíveis" : "Caronas na sua região"}
          </Text>
          
          <View style={styles.ridesContainer}>
            {isLoadingRides && nearbyRides.length === 0 ? (
              <>
                <TripCardSkeleton />
                <TripCardSkeleton />
                <TripCardSkeleton />
              </>
            ) : nearbyRides.length > 0 ? (
              nearbyRides.map((ride, index) => (
                <TouchableOpacity
                  key={`${ride.ride_id}-${index}`}
                  style={styles.rideCard}
                  onPress={() => handleRidePress(ride)}
                >
                  <View style={styles.rideHeader}>
                    <View style={styles.rideRoute}>
                      <Text style={[typography.body1, styles.searchResultCity]} numberOfLines={1}>
                        {ride.StartAddress.city}
                      </Text>
                      <IconArrowRight size={20} color={colors.neutral.gray2} />
                      <Text style={[typography.body1, styles.searchResultCity]} numberOfLines={1}>
                        {ride.EndAddress.city}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.rideContent}>
                    <View style={styles.rideDriver}>
                      <Image
                        source={{
                          uri: driversInfo[ride.driver_id]?.photo ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(driversInfo[ride.driver_id]?.name || 'User')}`
                        }}
                        style={styles.driverPhoto}
                      />
                      <Text style={[typography.body2, styles.driverName]}>
                        {driversInfo[ride.driver_id]?.name || "Motorista"}
                      </Text>
                    </View>

                    <Text style={[typography.body2, { color: colors.neutral.gray2, marginBottom: 12 }]}>
                      {formatDate(ride.start_time)}
                    </Text>

                    <View style={styles.rideDetails}>
                      <View style={styles.detailItem}>
                        <View style={styles.detailIcon}>
                          <IconUsers size={20} color={colors.primary.normal.default} />
                        </View>
                        <Text style={[typography.body2, styles.detailText]}>
                          {calculateAvailableSeats(ride)} lugares
                        </Text>
                      </View>
                      <View style={styles.detailItem}>
                        <View style={styles.detailIcon}>
                          <IconCurrencyReal size={20} color={colors.primary.normal.default} />
                        </View>
                        <Text style={[typography.body2, styles.detailText]}>
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(parseFloat(ride.price))}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={[typography.body1, styles.noRidesText]}>
                Nenhuma carona disponível no momento.
              </Text>
            )}
            
            {isLoadingRides && nearbyRides.length > 0 && (
              <View style={styles.loadingMore}>
                <ActivityIndicator color={colors.primary.normal.default} />
              </View>
            )}
          </View>

          {/* Promotional Banner */}
          <View style={{ marginTop: 24, marginBottom: 32 }}>
            {isLoading ? (
              <PromoCardSkeleton />
            ) : (
              <PromoCard
                title="Alugue máquinas para sua obra"
                highlight="MaqExpress"
                description="Encontre as melhores máquinas para sua construção"
                onPress={() => router.push("https://maqexpress.com.br")}
              />
            )}
          </View>
        </View>
      </ScrollView>
      <SearchModal 
        visible={showSearchModal}
        onClose={handleCloseSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSearching={isSearching}
        searchResults={searchResults}
        onCardPress={handleRidePress}
      />
      <RideDetailsModal />
      
      {showSuccessDialog && (
        <Dialog
          visible={true}
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
              }
            },
            {
              label: "OK",
              variant: "secondary",
              onPress: () => {
                setShowSuccessDialog(false);
                loadNearbyRides(1, true);
              }
            }
          ]}
        />
      )}
    </SafeAreaView>
  );
} 