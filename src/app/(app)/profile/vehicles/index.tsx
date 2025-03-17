import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { IconArrowLeft, IconEdit, IconTrash } from "@tabler/icons-react-native";
import { colors } from "@/styles/shared/colors/colors";
import { typography } from "@/styles/shared/typography/typography";
import { vehicleService, Vehicle } from "@/services/api/vehicles";
import { styles } from "./styles";
import CarSvg from "@/assets/svgs/car";
import { Skeleton } from "@/components/skeleton/Skeleton";

const VehicleCardSkeleton = () => (
  <View style={styles.vehicleCard}>
    <View style={styles.vehicleInfo}>
      <Skeleton width={200} height={24} style={{ marginBottom: 8 }} />
      <View style={styles.vehicleDetails}>
        <Skeleton width={30} height={16} style={{ marginRight: 8 }} />
        <Skeleton width={80} height={16} />
      </View>
      <View style={styles.vehicleDetails}>
        <Skeleton width={40} height={16} style={{ marginRight: 8 }} />
        <Skeleton width={70} height={16} />
      </View>
    </View>
    <View style={styles.vehicleActions}>
      <Skeleton width={36} height={36} borderRadius={18} style={{ marginRight: 8 }} />
      <Skeleton width={36} height={36} borderRadius={18} />
    </View>
  </View>
);

export default function VehiclesScreen() {
  const router = useRouter();
  const { refresh } = useLocalSearchParams();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    if (refresh === "true") {
      loadVehicles();
    }
  }, [refresh]);

  const loadVehicles = async () => {
    try {
      setIsLoading(true);
      const response = await vehicleService.getActive();
      setVehicles(response?.data || []);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    try {
      await vehicleService.delete(vehicleId);
      await loadVehicles();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadVehicles();
  };

  const renderContent = () => {
    if (isLoading && !refreshing) {
      return (
        <>
          <VehicleCardSkeleton />
          <VehicleCardSkeleton />
          <VehicleCardSkeleton />
        </>
      );
    }

    if (!vehicles.length) {
      return (
        <View style={styles.emptyState}>
          <Text style={[typography.body1, styles.emptyStateText]}>
            Você ainda não possui veículos cadastrados.
          </Text>
        </View>
      );
    }

    return vehicles.map((vehicle) => (
      <View key={vehicle.vehicle_id} style={styles.vehicleCard}>
        <View style={styles.vehicleInfo}>
          <Text style={[typography.h3, styles.vehicleModel]}>
            {vehicle.model}
          </Text>
          <View style={styles.vehicleDetails}>
            <Text style={styles.vehicleDetailLabel}>Cor:</Text>
            <Text style={styles.vehicleDetailValue}>{vehicle.color}</Text>
          </View>
          <View style={styles.vehicleDetails}>
            <Text style={styles.vehicleDetailLabel}>Placa:</Text>
            <Text style={styles.vehicleDetailValue}>{"ABC1234"}</Text>
          </View>
        </View>
        <View style={styles.vehicleActions}>
          <TouchableOpacity
            onPress={() => router.push({
              pathname: "/profile/vehicles/edit",
              params: { id: vehicle.vehicle_id }
            })}
            style={styles.actionButton}
          >
            <IconEdit size={20} color={colors.neutral.gray2} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteVehicle(vehicle.vehicle_id)}
            style={styles.actionButton}
          >
            <IconTrash size={20} color={colors.status.error} />
          </TouchableOpacity>
        </View>
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconArrowLeft size={24} color={colors.neutral.white} />
        </TouchableOpacity>
        <Text style={[typography.h3, styles.headerTitle]}>
          Veículos{"\n"}Cadastrados
        </Text>
        <CarSvg style={styles.headerSvg} />
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary.normal.default]}
            tintColor={colors.primary.normal.default}
          />
        }
      >
        {renderContent()}

        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push("/profile/vehicles/register")}
        >
          <Text style={styles.addButtonText}>Adicionar veículos</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
} 