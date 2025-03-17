import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { typography } from '@/styles/shared/typography/typography';
import { colors } from '@/styles/shared/colors/colors';
import { styles } from '../styles';
import { reservationService, Reservation } from '@/services/api/reservations';
import { useUser } from '@/contexts/UserContext';
import { IconArrowRight, IconUsers, IconCurrencyReal, IconClock, IconCheck, IconX, IconCar, IconFilter } from '@tabler/icons-react-native';
import { router } from 'expo-router';
import BusinessSvg from '@/assets/svgs/business-actor';

const localStyles = StyleSheet.create({
  filtersContainer: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray4,
    backgroundColor: colors.neutral.white,
  },
  filtersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  filtersTitle: {
    color: colors.neutral.gray1,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.neutral.gray4,
    backgroundColor: colors.neutral.white,
  },
  chipSelected: {
    backgroundColor: colors.primary.light.default,
    borderColor: colors.primary.normal.default,
  },
  chipText: {
    ...typography.caption,
    color: colors.neutral.gray1,
  },
  chipTextSelected: {
    color: colors.primary.normal.default,
  },
  header: {
    backgroundColor: colors.neutral.white,
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray4,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  headerTitle: {
    color: colors.neutral.black,
  },
  emptyStateContainer: {
    flex: 1,
    minHeight: '100%',
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
});

type StatusFilter = 'ALL' | 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export default function ReservationsScreen() {
  const { user } = useUser();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const statusFilters: { value: StatusFilter; label: string }[] = [
    { value: 'ALL', label: 'Todas' },
    { value: 'PENDING', label: 'Pendentes' },
    { value: 'CONFIRMED', label: 'Confirmadas' },
    { value: 'CANCELLED', label: 'Canceladas' },
  ];

  const loadReservations = async () => {
    try {
      setIsLoading(true);
      const response = await reservationService.getByUser();
      if (response?.data) {
        setReservations(response.data);
        filterReservations(response.data, selectedStatus);
      }
    } catch (error) {
      console.error('Error loading reservations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterReservations = (data: Reservation[], status: StatusFilter) => {
    if (status === 'ALL') {
      setFilteredReservations(data);
    } else {
      setFilteredReservations(data.filter(reservation => reservation.status === status));
    }
  };

  const handleStatusFilter = (status: StatusFilter) => {
    setSelectedStatus(status);
    filterReservations(reservations, status);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReservations();
    setRefreshing(false);
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleCancelReservation = async (reservationId: string) => {
    try {
      await reservationService.cancel(reservationId);
      await loadReservations();
    } catch (error) {
      console.error('Error canceling reservation:', error);
    }
  };

  const handleConfirmReservation = async (reservationId: string) => {
    try {
      await reservationService.confirm(reservationId);
      await loadReservations();
    } catch (error) {
      console.error('Error confirming reservation:', error);
    }
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
          <View style={styles.driverInfoCard}>
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

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={localStyles.header}>
        <TouchableOpacity style={localStyles.backButton} onPress={() => router.back()}>
          <IconArrowRight size={20} color={colors.neutral.black} style={{ transform: [{ rotate: '180deg' }] }} />
          <Text style={[typography.button, { color: colors.neutral.black }]}>Voltar</Text>
        </TouchableOpacity>
        <Text style={[typography.h3, localStyles.headerTitle]}>Minhas Reservas</Text>
      </View>

      <View style={localStyles.filtersContainer}>
        <View style={localStyles.filtersHeader}>
          <IconFilter size={20} color={colors.neutral.gray1} />
          <Text style={[typography.subtitle1, localStyles.filtersTitle]}>Filtrar por status</Text>
        </View>
        <View style={localStyles.chipsContainer}>
          {statusFilters.map((filter) => (
            <TouchableOpacity
              key={filter.value}
              style={[
                localStyles.chip,
                selectedStatus === filter.value && localStyles.chipSelected,
              ]}
              onPress={() => handleStatusFilter(filter.value)}
            >
              <Text
                style={[
                  localStyles.chipText,
                  selectedStatus === filter.value && localStyles.chipTextSelected,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={!isLoading && filteredReservations.length === 0 ? {} : { paddingBottom: 120 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading ? (
          <View>
            {[1, 2, 3, 4].map((_, index) => (
              <View key={index}>{renderSkeletonCard()}</View>
            ))}
          </View>
        ) : (
          filteredReservations.map(renderReservationCard)
        )}
        {!isLoading && filteredReservations.length === 0 && (
          <View style={localStyles.emptyStateContainer}>
            <View style={localStyles.emptyState}>
              <BusinessSvg width={200} height={200} />
              <Text style={[typography.body1, localStyles.emptyStateText]}>
                {selectedStatus === 'ALL' 
                  ? 'Você não possui nenhuma reserva de carona.'
                  : `Você não possui reservas ${
                      selectedStatus === 'PENDING' ? 'pendentes' :
                      selectedStatus === 'CONFIRMED' ? 'confirmadas' :
                      'canceladas'
                    }.`}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
} 