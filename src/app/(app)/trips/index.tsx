import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { typography } from '@/styles/shared/typography/typography';
import { colors } from '@/styles/shared/colors/colors';
import { Dialog } from '@/components/dialog/Dialog';
import BusinessSvg from '@/assets/svgs/business-actor';
import { styles } from './styles';
import { reservationService, Reservation } from '@/services/api/reservations';
import { rideService, Ride } from '@/services/api/rides';
import { useUser } from '@/contexts/UserContext';
import { IconArrowRight, IconUsers, IconCurrencyReal, IconClock, IconCheck, IconX, IconCar } from '@tabler/icons-react-native';
import { router } from 'expo-router';

const localStyles = StyleSheet.create({
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  emptyStateText: {
    color: colors.neutral.gray1,
    textAlign: 'center',
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
});

export default function TripsScreen() {
  const { user } = useUser();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoadingReservations, setIsLoadingReservations] = useState(true);
  const [isLoadingRides, setIsLoadingRides] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadReservations = async () => {
    try {
      setIsLoadingReservations(true);
      const response = await reservationService.getByUser(1, 3);
      if (response?.data) {
          setReservations(response.data);
      }
    } catch (error) {
      console.error('Error loading reservations:', error);
    } finally {
      setIsLoadingReservations(false);
    }
  };

  const loadRides = async () => {
    try {
      setIsLoadingRides(true);
      const response = await rideService.getByDriver(1, 3);
      if (response?.data) {
        setRides(response.data);
      }
    } catch (error) {
      console.error('Error loading rides:', error);
    } finally {
      setIsLoadingRides(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadReservations(), loadRides()]);
    setRefreshing(false);
  };

  useEffect(() => {
    loadReservations();
    if (user?.is_driver) {
      loadRides();
    }
  }, [user?.is_driver]);

  const handleCancelReservation = async (reservationId: string) => {
    try {
      await reservationService.cancel(reservationId);
      await loadReservations(); // Make sure to wait for the reload
    } catch (error) {
      console.error('Error canceling reservation:', error);
    }
  };

  const handleCancelConfirmation = (reservationId: string) => {
    Dialog({
      visible: true,
      title: "Cancelar reserva",
      message: "Tem certeza que deseja cancelar esta reserva?",
      type: "warning",
      onClose: () => {},
      actions: [
        {
          label: "Sim, cancelar",
          variant: "primary",
          onPress: () => handleCancelReservation(reservationId)
        },
        {
          label: "Não",
          variant: "secondary",
          onPress: () => {}
        }
      ]
    });
  };

  const handleConfirmReservation = async (reservationId: string) => {
    try {
      await reservationService.confirm(reservationId);
      await loadReservations();
      Dialog({
        visible: true,
        title: "Reserva confirmada",
        message: "A reserva foi confirmada com sucesso.",
        type: "success",
        onClose: () => {},
        actions: [
          {
            label: "OK",
            variant: "primary",
            onPress: () => {}
          }
        ]
      });
    } catch (error) {
      Dialog({
        visible: true,
        title: "Erro",
        message: "Não foi possível confirmar a reserva. Tente novamente.",
        type: "error",
        onClose: () => {},
        actions: [
          {
            label: "OK",
            variant: "primary",
            onPress: () => {}
          }
        ]
      });
    }
  };

  const handleSeeMoreReservations = () => {
    router.push('/trips/reservations' as any);
  };

  const handleSeeMoreRides = () => {
    router.push('/trips/rides' as any);
  };

  const handleViewRideDetails = (rideId: string) => {
    router.push(`/trips/details/${rideId}` as any);
  };

  const renderReservationCard = (reservation: Reservation) => (
    <TouchableOpacity 
      key={reservation.reservation_id} 
      style={styles.card}
      onPress={() => handleViewRideDetails(reservation.Ride?.ride_id || '')}
    >
      <View style={styles.cardHeader}>
        <View style={styles.routeContainer}>
          <Text style={[typography.body1, styles.city]} numberOfLines={1}>
            {reservation.Ride?.StartAddress.city}
          </Text>
          <IconArrowRight size={20} color={colors.neutral.gray2} />
          <Text style={[typography.body1, styles.city]} numberOfLines={1}>
            {reservation.Ride?.EndAddress.city}
          </Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={[typography.caption, { 
            color: 
              reservation.status === 'CONFIRMED' ? colors.status.success :
              reservation.status === 'CANCELLED' ? colors.status.error :
              colors.status.warning,
            fontWeight: '500'
          }]}>
            {reservation.status === 'CONFIRMED' ? 'Confirmada' :
             reservation.status === 'CANCELLED' ? 'Cancelada' :
             'Pendente'}
          </Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        {reservation.Ride?.Driver && (
          <View style={localStyles.driverInfo}>
            <IconCar size={16} color={colors.neutral.gray2} />
            <Text style={[typography.caption, styles.infoText]}>
              {`${reservation.Ride.Driver.name} ${reservation.Ride.Driver.last_name}`}
            </Text>
          </View>
        )}

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <IconClock size={16} color={colors.neutral.gray2} />
            <Text style={[typography.caption, styles.infoText]}>
              {reservation.Ride?.start_time ? new Date(reservation.Ride.start_time).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              }) : '-'}
      </Text>
          </View>
          <View style={styles.infoItem}>
            <IconCurrencyReal size={16} color={colors.neutral.gray2} />
            <Text style={[typography.caption, styles.infoText]}>
              {reservation.Ride?.price ? new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(parseFloat(reservation.Ride.price)) : '-'}
      </Text>
    </View>
        </View>

        {reservation.status === 'PENDING' && reservation.passenger_id === user?.id && (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]}
              onPress={(e) => {
                e.stopPropagation();
                handleCancelReservation(reservation.reservation_id);
              }}
            >
              <IconX size={20} color={colors.status.error} />
              <Text style={[typography.button, styles.cancelButtonText]}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.confirmButton]}
              onPress={(e) => {
                e.stopPropagation();
                handleConfirmReservation(reservation.reservation_id);
              }}
            >
              <IconCheck size={20} color={colors.status.success} />
              <Text style={[typography.button, styles.confirmButtonText]}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderRideCard = (ride: Ride) => (
    <TouchableOpacity 
      key={ride.ride_id} 
      style={styles.card}
      onPress={() => handleViewRideDetails(ride.ride_id)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.routeContainer}>
          <Text style={[typography.body1, styles.city]} numberOfLines={1}>
            {ride.StartAddress.city}
          </Text>
          <IconArrowRight size={20} color={colors.neutral.gray2} />
          <Text style={[typography.body1, styles.city]} numberOfLines={1}>
            {ride.EndAddress.city}
          </Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={[typography.caption, { 
            color: 
              ride.status === 'IN_PROGRESS' ? colors.status.success :
              ride.status === 'CANCELLED' ? colors.status.error :
              ride.status === 'COMPLETED' ? colors.neutral.gray2 :
              colors.status.warning,
            fontWeight: '500'
          }]}>
            {ride.status === 'IN_PROGRESS' ? 'Em andamento' :
             ride.status === 'CANCELLED' ? 'Cancelada' :
             ride.status === 'COMPLETED' ? 'Finalizada' :
             ride.status === 'SCHEDULED' ? 'Agendada' :
             'Pendente'}
          </Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <IconClock size={16} color={colors.neutral.gray2} />
            <Text style={[typography.caption, styles.infoText]}>
              {new Date(ride.start_time).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <IconUsers size={16} color={colors.neutral.gray2} />
            <Text style={[typography.caption, styles.infoText]}>
              {ride.available_seats} lugares
            </Text>
          </View>
          <View style={styles.infoItem}>
            <IconCurrencyReal size={16} color={colors.neutral.gray2} />
            <Text style={[typography.caption, styles.infoText]}>
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(parseFloat(ride.price))}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
    );

  const hasNoData = !isLoadingReservations && !isLoadingRides && reservations.length === 0 && rides.length === 0;

  const renderSkeletonCard = () => (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonHeader}>
        <View style={styles.skeletonRoute}>
          <View style={styles.skeletonCity} />
          <View style={styles.skeletonIcon} />
          <View style={styles.skeletonCity} />
        </View>
        <View style={styles.skeletonStatus} />
      </View>
      <View style={styles.skeletonInfo}>
        <View style={styles.skeletonInfoItem}>
          <View style={styles.skeletonIcon} />
          <View style={styles.skeletonText} />
        </View>
        <View style={styles.skeletonInfoItem}>
          <View style={styles.skeletonIcon} />
          <View style={styles.skeletonText} />
        </View>
        <View style={styles.skeletonInfoItem}>
          <View style={styles.skeletonIcon} />
          <View style={styles.skeletonText} />
        </View>
      </View>
    </View>
  );

  const renderSkeletonSection = () => (
    <View style={styles.section}>
      <View style={styles.skeletonSectionHeader}>
        <View style={styles.skeletonTitle} />
        <View style={styles.skeletonButton} />
      </View>
      {[1, 2, 3].map((_, index) => (
        <View key={index}>{renderSkeletonCard()}</View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={[typography.h3, { color: colors.neutral.black }]}>Viagens e reservas</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={hasNoData ? localStyles.emptyStateContainer : { paddingBottom: 120 }}
      >
        {hasNoData ? (
          <View style={localStyles.emptyState}>
            <BusinessSvg width={200} height={200} />
            <Text style={[typography.body1, localStyles.emptyStateText]}>
              Suas viagens futuras serão exibidas aqui.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[typography.h3, styles.sectionTitle]}>Minhas Reservas de Carona</Text>
                <TouchableOpacity 
                  style={styles.seeMoreButton}
                  onPress={handleSeeMoreReservations}
                >
                  <Text style={[typography.button, styles.seeMoreText]}>Ver mais</Text>
                  <IconArrowRight size={20} color={colors.primary.normal.default} />
                </TouchableOpacity>
              </View>

              {isLoadingReservations ? (
                renderSkeletonSection()
              ) : reservations.length > 0 ? (
                reservations.map(renderReservationCard)
              ) : null}
            </View>

            {user?.is_driver && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={[typography.h3, styles.sectionTitle]}>Caronas que Estou Oferecendo</Text>
                  <TouchableOpacity 
                    style={styles.seeMoreButton}
                    onPress={handleSeeMoreRides}
                  >
                    <Text style={[typography.button, styles.seeMoreText]}>Ver mais</Text>
                    <IconArrowRight size={20} color={colors.primary.normal.default} />
                  </TouchableOpacity>
                </View>

                {isLoadingRides ? (
                  renderSkeletonSection()
                ) : rides.length > 0 ? (
                  rides.map(renderRideCard)
                ) : null}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
} 