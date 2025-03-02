import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { typography } from '@/styles/shared/typography/typography';
import { styles } from './styles';
import { reservationService, Reservation } from '@/services/api/reservations';
import { useUser } from '@/contexts/UserContext';
import { TripCard } from '@/components/trip-card/TripCard';
import { TripCardSkeleton } from '@/components/trip-card/TripCardSkeleton';
import BusinessSvg from '@/assets/svgs/business-actor';

export default function TripsScreen() {
  const { user } = useUser();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadReservations = async (pageToLoad: number = 1, shouldRefresh: boolean = false) => {
    try {
      setIsLoading(true);
      const response = await reservationService.getByUser(pageToLoad);
      
      if (shouldRefresh) {
        setReservations(response.items);
      } else {
        setReservations(prev => [...prev, ...response.items]);
      }
      
      setHasMore(pageToLoad < response.totalPages);
      setPage(pageToLoad);
    } catch (error) {
      console.error('Error loading reservations:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadReservations(1, true);
  };

  const loadMore = () => {
    if (!isLoading && hasMore) {
      loadReservations(page + 1);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <BusinessSvg width={240} height={240} />
      <Text style={[typography.h3, styles.emptyStateTitle]}>
        Suas reservas serão exibidas aqui.
      </Text>
      <Text style={[typography.body2, styles.emptyStateSubtitle]}>
        {user?.is_driver 
          ? "Gerencie suas reservas e acompanhe seus passageiros!"
          : "Encontre uma viagem e faça sua primeira reserva!"}
      </Text>
    </View>
  );

  const renderContent = () => {
    if (isLoading && page === 1) {
      return (
        <View style={styles.loadingContainer}>
          <TripCardSkeleton />
          <TripCardSkeleton />
          <TripCardSkeleton />
        </View>
      );
    }

    if (!isLoading && reservations.length === 0) {
      return renderEmptyState();
    }

    return (
      <View style={styles.ridesContainer}>
        {reservations.map((reservation) => (
          <TripCard
            key={reservation.id}
            id={reservation.ride_id}
            city="Cidade" // You'll need to get this from the ride data
            date={new Date(reservation.created_at).toLocaleDateString('pt-BR')}
            spots="Reserva" // We might want to show the reservation status instead
            image="https://source.unsplash.com/random/400x200/?city"
          />
        ))}
        {isLoading && <TripCardSkeleton />}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
          
          if (isCloseToBottom) {
            loadMore();
          }
        }}
        scrollEventThrottle={400}
      >
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
} 