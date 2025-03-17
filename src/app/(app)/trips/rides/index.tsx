import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { typography } from '@/styles/shared/typography/typography';
import { colors } from '@/styles/shared/colors/colors';
import { styles } from '../styles';
import { rideService, Ride } from '@/services/api/rides';
import { IconArrowRight, IconUsers, IconCurrencyReal, IconClock, IconFilter } from '@tabler/icons-react-native';
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

type StatusFilter = 'ALL' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export default function RidesScreen() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [filteredRides, setFilteredRides] = useState<Ride[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const statusFilters: { value: StatusFilter; label: string }[] = [
    { value: 'ALL', label: 'Todas' },
    { value: 'SCHEDULED', label: 'Agendadas' },
    { value: 'IN_PROGRESS', label: 'Em andamento' },
    { value: 'COMPLETED', label: 'Finalizadas' },
    { value: 'CANCELLED', label: 'Canceladas' },
  ];

  const loadRides = async () => {
    try {
      setIsLoading(true);
      const response = await rideService.getByDriver();
      if (response?.data) {
        setRides(response.data);
        filterRides(response.data, selectedStatus);
      }
    } catch (error) {
      console.error('Error loading rides:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterRides = (data: Ride[], status: StatusFilter) => {
    if (status === 'ALL') {
      setFilteredRides(data);
    } else {
      setFilteredRides(data.filter(ride => ride.status === status));
    }
  };

  const handleStatusFilter = (status: StatusFilter) => {
    setSelectedStatus(status);
    filterRides(rides, status);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRides();
    setRefreshing(false);
  };

  useEffect(() => {
    loadRides();
  }, []);

  const handleViewRideDetails = (rideId: string) => {
    router.push(`/trips/details/${rideId}` as any);
  };

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
        <Text style={[typography.h3, localStyles.headerTitle]}>Minhas Caronas</Text>
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
        contentContainerStyle={!isLoading && filteredRides.length === 0 ? {} : { paddingBottom: 120 }}
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
          filteredRides.map(renderRideCard)
        )}
        {!isLoading && filteredRides.length === 0 && (
          <View style={localStyles.emptyStateContainer}>
            <View style={localStyles.emptyState}>
              <BusinessSvg width={200} height={200} />
              <Text style={[typography.body1, localStyles.emptyStateText]}>
                {selectedStatus === 'ALL' 
                  ? 'Você não possui nenhuma carona.'
                  : `Você não possui caronas ${
                      selectedStatus === 'SCHEDULED' ? 'agendadas' :
                      selectedStatus === 'IN_PROGRESS' ? 'em andamento' :
                      selectedStatus === 'COMPLETED' ? 'finalizadas' :
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