import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { IconArrowLeft } from "@tabler/icons-react-native";
import { colors } from "@/styles/shared/colors/colors";
import { typography } from "@/styles/shared/typography/typography";
import { Button } from "@/components/button/Button";
import { Input } from "@/components/input/Input";
import { vehicleService, Vehicle } from "@/services/api/vehicles";
import { styles } from "./styles";
import CarSvg from "@/assets/svgs/car";

const TAB_BAR_HEIGHT = 64 + (Platform.OS === 'ios' ? 34 : 24); // Tab bar height + safe area

export default function EditVehicleScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [color, setColor] = useState("");
  const [seats, setSeats] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadVehicle = async () => {
      try {
        // Try to find the vehicle in active vehicles first
        const activeResponse = await vehicleService.getActive();
        let vehicle = activeResponse?.data?.find((v: Vehicle) => v.vehicle_id === id);

        // If not found in active vehicles, try inactive vehicles
        if (!vehicle) {
          const inactiveResponse = await vehicleService.getInactive();
          vehicle = inactiveResponse?.data?.find((v: Vehicle) => v.vehicle_id === id);
        }

        if (vehicle) {
          setModel(vehicle.model);
          setYear(vehicle.year.toString());
          setColor(vehicle.color);
          setSeats(vehicle.seats.toString());
        } else {
          console.error("Vehicle not found");
          router.back();
        }
      } catch (error) {
        console.error("Error loading vehicle:", error);
        router.back();
      }
    };

    loadVehicle();
  }, [id]);

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      await vehicleService.update({
        vehicle_id: id as string,
        color,
        seats: parseInt(seats)
      });
      router.back();
    } catch (error) {
      console.error("Error updating vehicle:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconArrowLeft size={24} color={colors.neutral.white} />
        </TouchableOpacity>
        <Text style={[typography.h3, styles.headerTitle]}>
          Editar{"\n"}Veículo
        </Text>
        <CarSvg style={styles.headerSvg} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formContainer}>
          <Input
            label="Modelo"
            value={model}
            onChangeText={setModel}
            placeholder="Ex: Fiat Uno"
            editable={false}
          />
          <Input
            label="Ano"
            value={year}
            onChangeText={setYear}
            placeholder="Ex: 2020"
            keyboardType="numeric"
            editable={false}
          />
          <Input
            label="Cor"
            value={color}
            onChangeText={setColor}
            placeholder="Ex: Preto"
          />
          <Input
            label="Número de lugares"
            value={seats}
            onChangeText={setSeats}
            placeholder="Ex: 4"
            keyboardType="numeric"
          />

          <Button 
            onPress={handleUpdate}
            disabled={isLoading || !model || !year || !color || !seats}
            style={styles.submitButton}
          >
            {isLoading ? "Atualizando..." : "Atualizar veículo"}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 