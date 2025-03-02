import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TextInput, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { typography } from "@/styles/shared/typography/typography";
import { colors } from "@/styles/shared/colors/colors";
import { styles } from "./styles";
import { useUser } from "@/contexts/UserContext";
import { IconSearch, IconCar, IconHome, IconPlane, IconMapPin } from "@tabler/icons-react-native";
import { Link } from "expo-router";
import BgBlueSvg from "@/assets/svgs/bg-blue";
import { PromoCard } from "@/components/promo-card/PromoCard";
import { TripCard } from "@/components/trip-card/TripCard";
import { TripCardSkeleton } from "@/components/trip-card/TripCardSkeleton";
import { PromoCardSkeleton } from "@/components/promo-card/PromoCardSkeleton";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { userService } from "@/services/api/user";

const serviceOptions = [
  { icon: IconCar, label: "Carros", route: "(app)/services/cars" },
  { icon: IconHome, label: "Hotéis", route: "(app)/services/hotels" },
  { icon: IconPlane, label: "Voos", route: "(app)/services/flights" },
  { icon: IconMapPin, label: "Destinos", route: "(app)/services/destinations" },
];

const featuredTrips = [
  {
    id: 1,
    city: "Rio de Janeiro",
    date: "24-30 Março",
    spots: "12 lugares disponíveis",
    image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    city: "São Paulo",
    date: "15-20 Abril",
    spots: "8 lugares disponíveis",
    image: "https://images.unsplash.com/photo-1578002573559-689b0abc4148?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    city: "Salvador",
    date: "1-7 Maio",
    spots: "15 lugares disponíveis",
    image: "https://images.unsplash.com/photo-1564659907532-6b5f98c8e70f?w=800&auto=format&fit=crop&q=80"
  },
];

export default function HomeScreen() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

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

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={true}
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
              <Image
                source={{ 
                  uri: profilePicture || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.name || 'User')
                }}
                style={styles.profilePicture}
              />
            )}
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <IconSearch size={24} style={styles.searchIcon} color={colors.neutral.gray2} />
            <TextInput
              placeholder="Para onde você quer ir?"
              style={styles.searchInput}
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.content}>
          {/* Service Options */}
          <Text style={[typography.h3, styles.sectionTitle]}>
            Como posso te servir hoje ?
          </Text>
          <View style={styles.serviceOptions}>
            {serviceOptions.map(renderServiceOption)}
          </View>

          {/* Featured Trips */}
          <Text style={[typography.h3, styles.sectionTitle]}>
            Planejando viajar ? Veja algumas caronas em destaque
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
          >
            {isLoading ? (
              <>
                <TripCardSkeleton />
                <TripCardSkeleton />
                <TripCardSkeleton />
              </>
            ) : (
              featuredTrips.map((trip) => (
                <TripCard key={trip.id} {...trip} />
              ))
            )}
          </ScrollView>

          {/* Promotional Banner */}
          <View style={{ marginTop: 24, marginBottom: 32 }}>
            {isLoading ? (
              <PromoCardSkeleton />
            ) : (
              <PromoCard
                title="Conheça os nosso planos!"
                highlight="Descontos de 50%!"
                date="2 - 10 Agosto 2023"
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 