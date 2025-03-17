import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { IconArrowLeft } from "@tabler/icons-react-native";
import { colors } from "@/styles/shared/colors/colors";
import { typography } from "@/styles/shared/typography/typography";
import { Button } from "@/components/button/Button";
import { Input } from "@/components/input/Input";
import { vehicleService } from "@/services/api/vehicles";
import { styles } from "./styles";
import CarSvg from "@/assets/svgs/car";
import { Dialog } from "@/components/dialog/Dialog";

const TAB_BAR_HEIGHT = 64 + (Platform.OS === 'ios' ? 34 : 24); // Tab bar height + safe area

export default function RegisterVehicleScreen() {
  const router = useRouter();
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [color, setColor] = useState("");
  const [seats, setSeats] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorDialog, setErrorDialog] = useState({ visible: false, message: "" });
  const [successDialog, setSuccessDialog] = useState({ visible: false });

  const handleRegister = async () => {
    try {
      setIsLoading(true);
      await vehicleService.create({
        brand,
        model,
        year: parseInt(year),
        license_plate: licensePlate,
        color,
        seats: parseInt(seats)
      });
      setSuccessDialog({ visible: true });
    } catch (error: any) {
      console.error("Error registering vehicle:", error);
      const errorMessage = error?.error || "Não foi possível cadastrar o veículo";
      setErrorDialog({ visible: true, message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSuccessDialog({ visible: false });
    router.push({
      pathname: "/profile/vehicles",
      params: { refresh: "true" }
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconArrowLeft size={24} color={colors.neutral.white} />
        </TouchableOpacity>
        <Text style={[typography.h3, styles.headerTitle]}>
          Cadastrar{"\n"}Veículo
        </Text>
        <CarSvg style={styles.headerSvg} />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <Input
            label="Marca"
            value={brand}
            onChangeText={setBrand}
            placeholder="Ex: Fiat"
          />
          <Input
            label="Modelo"
            value={model}
            onChangeText={setModel}
            placeholder="Ex: Uno"
          />
          <Input
            label="Ano"
            value={year}
            onChangeText={setYear}
            placeholder="Ex: 2020"
            keyboardType="numeric"
          />
          <Input
            label="Placa"
            value={licensePlate}
            onChangeText={setLicensePlate}
            placeholder="Ex: ABC1D23"
            autoCapitalize="characters"
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
            onPress={handleRegister}
            disabled={isLoading || !brand || !model || !year || !licensePlate || !color || !seats}
            style={styles.submitButton}
          >
            {isLoading ? "Registrando..." : "Registrar veículo"}
          </Button>
        </View>
      </ScrollView>

      <Dialog
        visible={errorDialog.visible}
        title="Erro ao cadastrar"
        message={errorDialog.message}
        type="error"
        onClose={() => setErrorDialog({ visible: false, message: "" })}
      />

      <Dialog
        visible={successDialog.visible}
        title="Veículo cadastrado"
        message="Seu veículo foi cadastrado com sucesso!"
        type="success"
        onClose={handleClose}
      />
    </SafeAreaView>
  );
} 