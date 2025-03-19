import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, Alert, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { typography } from '@/styles/shared/typography/typography';
import { colors } from '@/styles/shared/colors/colors';
import { styles } from './styles';
import { rideService, Ride } from '@/services/api/rides';
import { IconArrowLeft, IconClock, IconCurrencyReal, IconMapPin, IconCar, IconUsers, IconMessage, IconPlayerPlay, IconPlayerStop, IconX, IconStar, IconStarFilled } from '@tabler/icons-react-native';
import MapView, { Marker } from 'react-native-maps';
import { userService } from '@/services/api/user';
import { useUser } from '@/contexts/UserContext';
import { reservationService, Reservation } from '@/services/api/reservations';
import { Button } from '@/components/button/Button';
import { reviewService } from '@/services/api/reviews';

export default function RideDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useUser();
  const [ride, setRide] = useState<Ride | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [driverPhoto, setDriverPhoto] = useState<string | null>(null);
  const [isLoadingDriverPhoto, setIsLoadingDriverPhoto] = useState(false);
  const [confirmedReservations, setConfirmedReservations] = useState<Reservation[]>([]);
  const [isLoadingReservations, setIsLoadingReservations] = useState(false);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [revieweeId, setRevieweeId] = useState<string | null>(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

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

      // Load confirmed reservations if user is the driver
      if (response?.driver_id === user?.id) {
        loadConfirmedReservations();
      }
    } catch (error) {
      console.error('Error loading ride details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadConfirmedReservations = async () => {
    try {
      setIsLoadingReservations(true);
      const response = await reservationService.getConfirmedByRide(id as string);
      if (response?.data) {
        setConfirmedReservations(response.data);
      }
    } catch (error) {
      console.error('Error loading confirmed reservations:', error);
    } finally {
      setIsLoadingReservations(false);
    }
  };

  const handleStartRide = async () => {
    Alert.alert(
      "Iniciar carona",
      "Tem certeza que deseja iniciar esta carona?",
      [
        {
          text: "Não",
          style: "cancel"
        },
        {
          text: "Sim, iniciar",
          onPress: async () => {
            try {
              await rideService.startRide(id as string);
              await loadRideDetails();
            } catch (error) {
              Alert.alert(
                "Erro",
                "Não foi possível iniciar a carona. Tente novamente.",
                [{ text: "OK" }]
              );
            }
          }
        }
      ]
    );
  };

  const handleEndRide = async () => {
    Alert.alert(
      "Finalizar carona",
      "Tem certeza que deseja finalizar esta carona?",
      [
        {
          text: "Não",
          style: "cancel"
        },
        {
          text: "Sim, finalizar",
          onPress: async () => {
            try {
              await rideService.endRide(id as string);
              await loadRideDetails();
            } catch (error) {
              Alert.alert(
                "Erro",
                "Não foi possível finalizar a carona. Tente novamente.",
                [{ text: "OK" }]
              );
            }
          }
        }
      ]
    );
  };

  const handleCancelRide = async () => {
    Alert.alert(
      "Cancelar carona",
      "Tem certeza que deseja cancelar esta carona?",
      [
        {
          text: "Não",
          style: "cancel"
        },
        {
          text: "Sim, cancelar",
          onPress: async () => {
            try {
              await rideService.delete(id as string);
              router.back();
            } catch (error) {
              Alert.alert(
                "Erro",
                "Não foi possível cancelar a carona. Tente novamente.",
                [{ text: "OK" }]
              );
            }
          }
        }
      ]
    );
  };

  const handleReview = async () => {
    if (!ride || !revieweeId) return;

    try {
      setIsSubmittingReview(true);
      await reviewService.create({
        ride_id: ride.ride_id,
        rating: Math.round(rating),
        ...(comment.trim() ? { comment: comment.trim() } : {}),
        ...(ride.driver_id === user?.id ? { passenger_id: revieweeId } : {})
      });
      
      Alert.alert(
        "Sucesso",
        "Avaliação enviada com sucesso!",
        [{ text: "OK", onPress: () => {
          setIsReviewModalVisible(false);
          setRating(5);
          setComment('');
        }}]
      );
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.response?.data?.error || "Não foi possível enviar a avaliação.",
        [{ text: "OK" }]
      );
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const calculateAvailableSeats = (ride: Ride) => {
    const pendingReservations = ride.Reservations?.filter(r => r.status === "PENDING").length || 0;
    return Math.max(0, ride.available_seats - pendingReservations);
  };

  const renderActionButtons = () => {
    if (!ride || ride.driver_id !== user?.id) return null;

    return (
      <View style={styles.actionBar}>
        {(ride.status === 'PENDING' || ride.status === 'SCHEDULED') && (
          <View style={styles.actionButtons}>
            <Button
              onPress={handleStartRide}
              style={[styles.actionButton, styles.startButton]}
              variant="default"
              disabled={!confirmedReservations.length}
            >
              <Text style={[typography.button, { color: colors.neutral.white }]}>
                {confirmedReservations.length > 0 ? 'Iniciar Carona' : 'Aguardando Confirmações'}
              </Text>
            </Button>
            <Button
              onPress={handleCancelRide}
              style={[styles.actionButton, styles.cancelButton]}
              variant="outline"
            >
              <Text style={[typography.button, { color: colors.neutral.gray1 }]}>Cancelar</Text>
            </Button>
          </View>
        )}
        {ride.status === 'IN_PROGRESS' && (
          <View style={styles.actionButtons}>
            <Button
              onPress={handleEndRide}
              style={[styles.actionButton, styles.endButton]}
              variant="default"
            >
              <Text style={[typography.button, { color: colors.neutral.white }]}>Finalizar Carona</Text>
            </Button>
          </View>
        )}
        {ride.status === 'COMPLETED' && (
          <View style={styles.actionButtons}>
            {ride.Reservations?.filter(r => r.status === "CONFIRMED").map((reservation: any) => (
              <Button
                key={reservation.passenger_id}
                onPress={() => {
                  setRevieweeId(reservation.passenger_id);
                  setIsReviewModalVisible(true);
                }}
                style={[styles.actionButton, {
                  backgroundColor: colors.primary.normal.default,
                  marginBottom: 8,
                }]}
                variant="default"
              >
                <Text style={[typography.button, { color: colors.neutral.white }]}>
                  Avaliar {reservation.Passenger?.name}
                </Text>
              </Button>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderSkeletonContent = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.skeletonMap} />

      <View style={styles.detailsContainer}>
        {/* Driver Information Skeleton */}
        <View style={styles.driverSection}>
          <View style={styles.skeletonPhoto} />
          <View style={{ flex: 1, gap: 8 }}>
            <View style={styles.skeletonTextLarge} />
            <View style={styles.skeletonTextSmall} />
          </View>
        </View>

        {/* Status Message Skeleton */}
        <View style={styles.statusSection}>
          <View style={styles.skeletonStatus} />
        </View>

        {/* Trip Information Skeleton */}
        <View style={styles.tripInfo}>
          {[1, 2, 3, 4, 5].map((_, index) => (
            <View key={index} style={styles.locationItem}>
              <View style={[styles.skeletonBase, { width: 24, height: 24 }]} />
              <View style={{ flex: 1, gap: 8 }}>
                <View style={styles.skeletonTextSmall} />
                <View style={styles.skeletonText} />
              </View>
            </View>
          ))}

          {/* Passengers Skeleton */}
          <View style={styles.locationItem}>
            <View style={[styles.skeletonBase, { width: 24, height: 24 }]} />
            <View style={{ flex: 1, gap: 8 }}>
              <View style={styles.skeletonTextSmall} />
              {[1, 2].map((_, index) => (
                <View key={index} style={styles.skeletonPassenger}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={[styles.skeletonPhoto, { width: 32, height: 32, borderRadius: 16 }]} />
                    <View style={styles.skeletonText} />
                  </View>
                  <View style={[styles.skeletonBase, { width: 24, height: 24 }]} />
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderReviewModal = () => (
    <Modal
      visible={isReviewModalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setIsReviewModalVisible(false)}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
      }}>
        <View style={{
          backgroundColor: colors.neutral.white,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: 24,
          gap: 16,
        }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={[typography.h3, { color: colors.neutral.black }]}>
              Avaliar {ride?.driver_id === user?.id ? 'Passageiro' : 'Motorista'}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                style={{
                  padding: 4,
                  transform: [{ scale: rating === star ? 1.2 : 1 }],
                }}
                activeOpacity={0.7}
              >
                {star <= rating ? (
                  <IconStarFilled 
                    size={36} 
                    color={colors.primary.normal.default}
                    style={{ 
                      shadowColor: colors.primary.normal.default,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 3,
                      elevation: 3,
                    }}
                  />
                ) : (
                  <IconStar 
                    size={36} 
                    color={colors.neutral.gray3}
                    style={{
                      opacity: 0.8
                    }}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={{
              backgroundColor: colors.neutral.background,
              borderRadius: 8,
              padding: 12,
              height: 100,
              textAlignVertical: 'top',
              ...typography.body1,
            }}
            placeholder="Deixe um comentário (opcional)..."
            value={comment}
            onChangeText={setComment}
            multiline
            maxLength={500}
          />

          <View style={{ gap: 8 }}>
            <Button
              onPress={handleReview}
              style={{
                backgroundColor: colors.primary.normal.default,
                height: 48,
                borderRadius: 8,
              }}
              variant="default"
              disabled={isSubmittingReview}
            >
              <Text style={[typography.button, { color: colors.neutral.white }]}>
                {isSubmittingReview ? 'Enviando...' : 'Enviar Avaliação'}
              </Text>
            </Button>
            <Button
              onPress={() => setIsReviewModalVisible(false)}
              style={{
                backgroundColor: colors.neutral.white,
                height: 48,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.neutral.gray4,
              }}
              variant="outline"
              disabled={isSubmittingReview}
            >
              <Text style={[typography.button, { color: colors.neutral.gray1 }]}>
                Cancelar
              </Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconArrowLeft size={24} color={colors.neutral.black} />
        </TouchableOpacity>
        <Text style={[typography.h3, styles.headerTitle]}>Detalhes da Carona</Text>
        <View style={{ width: 24 }} />
      </View>

      {isLoading ? (
        renderSkeletonContent()
      ) : ride ? (
        <>
          <ScrollView 
            style={styles.content} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
          >
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
                  <View style={styles.skeletonPhoto} />
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
                {ride.driver_id !== user?.id && (
                  <TouchableOpacity 
                    style={styles.messageButton}
                    onPress={() => router.push(`/chats/${ride.ride_id}` as any)}
                  >
                    <IconMessage size={24} color={colors.primary.normal.default} />
                  </TouchableOpacity>
                )}
              </View>

              {/* Status Message */}
              {ride.driver_id === user?.id && (
                <View style={styles.statusSection}>
                  {ride.status === 'PENDING' && (
                    <View style={[styles.statusMessage, { backgroundColor: colors.neutral.white, borderWidth: 1, borderColor: colors.status.warning }]}>
                      <Text style={[typography.subtitle1, { color: colors.status.warning }]}>
                        Carona aguardando início
                      </Text>
                      <Text style={[typography.caption, { color: colors.neutral.gray1, marginTop: 4 }]}>
                        {confirmedReservations.length > 0 
                          ? "Você pode iniciar a carona quando estiver pronto"
                          : "Você precisa de pelo menos uma reserva confirmada para iniciar a carona"}
                      </Text>
                    </View>
                  )}
                  {ride.status === 'IN_PROGRESS' && (
                    <View style={[styles.statusMessage, { backgroundColor: colors.neutral.white, borderWidth: 1, borderColor: colors.status.success }]}>
                      <Text style={[typography.subtitle1, { color: colors.status.success }]}>
                        Carona em andamento
                      </Text>
                      <Text style={[typography.caption, { color: colors.neutral.gray1, marginTop: 4 }]}>
                        Sua carona está em andamento
                      </Text>
                    </View>
                  )}
                  {ride.status === 'COMPLETED' && (
                    <View style={[styles.statusMessage, { backgroundColor: colors.neutral.white, borderWidth: 1, borderColor: colors.status.success }]}>
                      <Text style={[typography.subtitle1, { color: colors.status.success }]}>
                        Carona finalizada
                      </Text>
                      <Text style={[typography.caption, { color: colors.neutral.gray1, marginTop: 4 }]}>
                        Esta carona foi concluída com sucesso
                      </Text>
                    </View>
                  )}
                  {ride.status === 'CANCELLED' && (
                    <View style={[styles.statusMessage, { backgroundColor: colors.neutral.white, borderWidth: 1, borderColor: colors.status.error }]}>
                      <Text style={[typography.subtitle1, { color: colors.status.error }]}>
                        Carona cancelada
                      </Text>
                      <Text style={[typography.caption, { color: colors.neutral.gray1, marginTop: 4 }]}>
                        Esta carona foi cancelada
                      </Text>
                    </View>
                  )}
                </View>
              )}

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

                {/* Confirmed Reservations Section */}
                {ride.driver_id === user?.id && (
                  <View style={styles.locationItem}>
                    <IconUsers size={24} color={colors.primary.normal.default} />
                    <View style={styles.locationText}>
                      <Text style={[typography.caption, { color: colors.neutral.gray2 }]}>
                        Passageiros Confirmados
                      </Text>
                      {ride.Reservations?.filter(r => r.status === "CONFIRMED").map((reservation: any) => (
                        <View key={reservation.passenger_id} style={styles.passengerItem}>
                          <View style={styles.passengerInfo}>
                            <Image
                              source={{
                                uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(reservation.Passenger?.name || 'User')}`
                              }}
                              style={styles.passengerPhoto}
                            />
                            <Text style={[typography.body1, { color: colors.neutral.black }]}>
                              {reservation.Passenger?.name} {reservation.Passenger?.last_name}
                            </Text>
                          </View>
                          <TouchableOpacity 
                            style={styles.messageButton}
                            onPress={() => router.push(`/chats/${ride.ride_id}` as any)}
                          >
                            <IconMessage size={20} color={colors.primary.normal.default} />
                          </TouchableOpacity>
                        </View>
                      ))}
                      {!ride.Reservations?.some(r => r.status === "CONFIRMED") && (
                        <Text style={[typography.body1, { color: colors.neutral.gray1 }]}>
                          Nenhum passageiro confirmado ainda
                        </Text>
                      )}
                    </View>
                  </View>
                )}

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

              {/* Move action buttons here, at the end of details container */}
              {renderActionButtons()}
            </View>
          </ScrollView>
        </>
      ) : (
        <View style={styles.errorContainer}>
          <Text style={[typography.body1, { color: colors.neutral.gray2 }]}>
            Não foi possível carregar os detalhes da carona.
          </Text>
        </View>
      )}
      {ride?.status === 'COMPLETED' && ride.driver_id !== user?.id && (
        <View style={[styles.actionBar, { position: 'absolute', bottom: 0, left: 0, right: 0 }]}>
          <Button
            onPress={() => {
              setRevieweeId(ride.driver_id);
              setIsReviewModalVisible(true);
            }}
            style={[styles.actionButton, {
              backgroundColor: colors.primary.normal.default,
            }]}
            variant="default"
          >
            <Text style={[typography.button, { color: colors.neutral.white }]}>
              Avaliar Motorista
            </Text>
          </Button>
        </View>
      )}
      {renderReviewModal()}
    </SafeAreaView>
  );
} 