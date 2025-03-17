import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Platform,
  Modal,
  Image,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { typography } from "@/styles/shared/typography/typography";
import { styles } from "@/styles/app/styles";
import { useUser } from "@/contexts/UserContext";
import { vehicleService, Vehicle } from "@/services/api/vehicles";
import { rideService } from "@/services/api/rides";
import { userService } from "@/services/api/user";
import { Input } from "@/components/input/Input";
import { colors } from "@/styles/shared/colors/colors";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { router, Link } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import House from "@/assets/svgs/house";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button } from "@/components/button/Button";
import { IconCar, IconArrowRight, IconCurrencyDollar, IconUsers, IconLeaf } from "@tabler/icons-react-native";

export default function OfferScreen() {
  const { user, updateUser } = useUser();
  const [refreshing, setRefreshing] = useState(false);

  const checkUserStatus = async () => {
    try {
      if (user?.id) {
        const userData = await userService.getById(user.id);
        if (userData) {
          updateUser(userData);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await checkUserStatus();
    setRefreshing(false);
  };

  useEffect(() => {
    checkUserStatus();
  }, []);

  if (!user?.is_driver) {
    return (
      <SafeAreaView style={welcomeStyles.container} edges={["top"]}>
        <View style={welcomeStyles.header}>
          <Text style={[typography.h3, welcomeStyles.headerTitle]}>Oferecer Carona</Text>
        </View>

        <ScrollView 
          style={welcomeStyles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary.normal.default]}
              tintColor={colors.primary.normal.default}
            />
          }
        >
          <View style={welcomeStyles.mainCard}>
            <View style={welcomeStyles.cardHeader}>
              <View style={welcomeStyles.iconContainer}>
                <IconCar size={24} color={colors.primary.normal.default} />
              </View>
              <Text style={[typography.h3, welcomeStyles.cardTitle]}>
                Comece a oferecer caronas
              </Text>
            </View>
            
            <Text style={[typography.body1, welcomeStyles.description]}>
              Você precisa ter um veículo registrado para oferecer caronas. Registre seu veículo agora para começar.
            </Text>

            <Link href="/(app)/profile/vehicles" asChild>
              <TouchableOpacity style={welcomeStyles.button}>
                <Text style={[typography.button, welcomeStyles.buttonText]}>
                  Registrar Veículo
                </Text>
                <IconArrowRight size={20} color={colors.neutral.white} />
              </TouchableOpacity>
            </Link>

            <View style={welcomeStyles.benefitsSection}>
              <Text style={[typography.subtitle1, welcomeStyles.benefitsTitle]}>
                Por que oferecer caronas?
              </Text>

              <View style={welcomeStyles.benefitsList}>
                <View style={welcomeStyles.benefitItem}>
                  <View style={welcomeStyles.benefitIcon}>
                    <IconCurrencyDollar size={20} color={colors.primary.normal.default} />
                  </View>
                  <View style={welcomeStyles.benefitContent}>
                    <Text style={[typography.body2, welcomeStyles.benefitTitle]}>
                      Renda Extra
                    </Text>
                    <Text style={[typography.caption, welcomeStyles.benefitText]}>
                      Divida os custos da viagem e ganhe uma renda adicional
                    </Text>
                  </View>
                </View>

                <View style={welcomeStyles.benefitItem}>
                  <View style={welcomeStyles.benefitIcon}>
                    <IconUsers size={20} color={colors.primary.normal.default} />
                  </View>
                  <View style={welcomeStyles.benefitContent}>
                    <Text style={[typography.body2, welcomeStyles.benefitTitle]}>
                      Novas Conexões
                    </Text>
                    <Text style={[typography.caption, welcomeStyles.benefitText]}>
                      Conheça pessoas interessantes e faça novas amizades
                    </Text>
                  </View>
                </View>

                <View style={welcomeStyles.benefitItem}>
                  <View style={welcomeStyles.benefitIcon}>
                    <IconLeaf size={20} color={colors.primary.normal.default} />
                  </View>
                  <View style={welcomeStyles.benefitContent}>
                    <Text style={[typography.body2, welcomeStyles.benefitTitle]}>
                      Impacto Ambiental
                    </Text>
                    <Text style={[typography.caption, welcomeStyles.benefitText]}>
                      Contribua para reduzir emissões e congestionamentos
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isFreeRide, setIsFreeRide] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationMode, setLocationMode] = useState<"start" | "end">("start");
  const [datePickerMode, setDatePickerMode] = useState<"date" | "time">("date");
  const [showVehicleModal, setShowVehicleModal] = useState(false);

  const [rideForm, setRideForm] = useState({
    start_location: "",
    end_location: "",
    start_latitude: "",
    start_longitude: "",
    end_latitude: "",
    end_longitude: "",
    start_time: new Date(),
    price: "",
    available_seats: "",
    preferences: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.is_driver) {
      loadVehicles();
      getCurrentLocation();
    }
  }, [user?.is_driver]);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        setRideForm((prev) => ({
          ...prev,
          start_latitude: location.coords.latitude.toString(),
          start_longitude: location.coords.longitude.toString(),
        }));
      }
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  const loadVehicles = async () => {
    try {
      const response = await vehicleService.getActive();
      if (response?.data) {
        setVehicles(response.data);
        if (response.data.length > 0) {
          setSelectedVehicle(response.data[0]);
        }
      }
    } catch (error: any) {
      setError(error?.error || error?.message || "Erro ao carregar veículos");
    }
  };

  const handleLocationSelect = (latitude: number, longitude: number) => {
    const geocodeLocation = async (lat: number, lng: number) => {
      try {
        const result = await Location.reverseGeocodeAsync({
          latitude: lat,
          longitude: lng,
        });
        if (result && result[0]) {
          return `${result[0].street || ""} ${result[0].name || ""}, ${
            result[0].district || ""
          }, ${result[0].city || ""}`.trim();
        }
        return "Endereço não encontrado";
      } catch (error) {
        console.error("Error geocoding:", error);
        return "Endereço não encontrado";
      }
    };

    if (locationMode === "start") {
      setRideForm((prev) => ({
        ...prev,
        start_latitude: latitude.toString(),
        start_longitude: longitude.toString(),
      }));
      geocodeLocation(latitude, longitude).then((address) => {
        setRideForm((prev) => ({ ...prev, start_location: address }));
      });
    } else {
      setRideForm((prev) => ({
        ...prev,
        end_latitude: latitude.toString(),
        end_longitude: longitude.toString(),
      }));
      geocodeLocation(latitude, longitude).then((address) => {
        setRideForm((prev) => ({ ...prev, end_location: address }));
      });
    }
    setShowLocationModal(false);
  };

  const clearLocation = (type: "start" | "end") => {
    if (type === "start") {
      setRideForm((prev) => ({
        ...prev,
        start_location: "",
        start_latitude: "",
        start_longitude: "",
      }));
    } else {
      setRideForm((prev) => ({
        ...prev,
        end_location: "",
        end_latitude: "",
        end_longitude: "",
      }));
    }
  };

  const showDatePickerModal = () => {
    setDatePickerMode("date");
    setShowDatePicker(true);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (datePickerMode === "date" && selectedDate) {
      const currentTime = rideForm.start_time;
      selectedDate.setHours(currentTime.getHours(), currentTime.getMinutes());
      setRideForm((prev) => ({ ...prev, start_time: selectedDate }));
      setDatePickerMode("time");
    } else {
      setShowDatePicker(false);
      if (selectedDate) {
        setRideForm((prev) => ({ ...prev, start_time: selectedDate }));
      }
      setDatePickerMode("date");
    }
  };

  const handleRideOffer = async () => {
    try {
      if (!selectedVehicle) {
        setError("Selecione um veículo para oferecer a carona");
        return;
      }

      if (!rideForm.start_location || !rideForm.end_location) {
        setError("Informe os locais de partida e destino");
        return;
      }

      if (!rideForm.available_seats) {
        setError("Informe o número de lugares disponíveis");
        return;
      }

      if (!isFreeRide && !rideForm.price) {
        setError("Informe o preço da carona");
        return;
      }

      setLoading(true);
      setError("");

      const price = isFreeRide
        ? 0
        : parseFloat(rideForm.price.replace(/[^0-9,]/g, "").replace(",", "."));

      const response = await rideService.create({
        vehicle_id: selectedVehicle.vehicle_id,
        start_latitude: parseFloat(rideForm.start_latitude),
        start_longitude: parseFloat(rideForm.start_longitude),
        end_latitude: parseFloat(rideForm.end_latitude),
        end_longitude: parseFloat(rideForm.end_longitude),
        start_time: rideForm.start_time,
        price,
        available_seats: parseInt(rideForm.available_seats),
        preferences: rideForm.preferences,
      });

      if (response?.data) {
        router.back();
      } else {
        setError("Erro ao criar carona. Tente novamente.");
      }
    } catch (error: any) {
      console.error("API Error:", error);
      setError(error?.error || error?.message || "Erro ao criar carona");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (text: string) => {
    // Remove non-numeric characters
    const numericValue = text.replace(/[^0-9]/g, "");

    if (!numericValue) {
      return "";
    }

    // Convert to decimal (divide by 100 to handle cents)
    const decimal = (parseInt(numericValue) / 100).toFixed(2);

    // Format as Brazilian currency
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(parseFloat(decimal));
  };

  const renderVehicleSelector = () => (
    <View style={localStyles.inputContainer}>
      <Ionicons name="car" size={24} color={colors.primary.normal.default} />
      <View style={{ flex: 1 }}>
        {vehicles.length > 0 ? (
          <TouchableOpacity
            onPress={() => setShowVehicleModal(true)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={localStyles.inputText}>
              {selectedVehicle
                ? `${selectedVehicle.model} - ${selectedVehicle.color}`
                : "Selecione um veículo"}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={colors.neutral.gray2}
            />
          </TouchableOpacity>
        ) : (
          <Text style={[localStyles.inputText, localStyles.placeholder]}>
            Nenhum veículo cadastrado
          </Text>
        )}
      </View>
    </View>
  );

  const renderDateTimePicker = () => (
    <View style={localStyles.inputContainer}>
      <Ionicons
        name="calendar"
        size={24}
        color={colors.primary.normal.default}
      />
      <TouchableOpacity style={{ flex: 1 }} onPress={showDatePickerModal}>
        <Text style={localStyles.inputText}>
          {rideForm.start_time.toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={rideForm.start_time}
          mode={datePickerMode}
          onChange={handleDateChange}
          display={Platform.OS === "ios" ? "spinner" : "default"}
        />
      )}
    </View>
  );

  const renderRideForm = () => (
    <View style={localStyles.formContainer}>
      <TouchableOpacity
        style={localStyles.inputContainer}
        onPress={() => {
          setLocationMode("start");
          setShowLocationModal(true);
        }}
      >
        <Ionicons
          name="location"
          size={24}
          color={colors.primary.normal.default}
        />
        <Text
          style={[
            localStyles.inputText,
            !rideForm.start_location && localStyles.placeholder,
          ]}
        >
          {rideForm.start_location || "Local de partida"}
        </Text>
        {rideForm.start_location ? (
          <TouchableOpacity onPress={() => clearLocation("start")}>
            <Ionicons
              name="close-circle"
              size={24}
              color={colors.neutral.gray2}
            />
          </TouchableOpacity>
        ) : (
          <Ionicons
            name="chevron-forward"
            size={24}
            color={colors.neutral.gray2}
          />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={localStyles.inputContainer}
        onPress={() => {
          setLocationMode("end");
          setShowLocationModal(true);
        }}
      >
        <Ionicons
          name="location"
          size={24}
          color={colors.primary.normal.default}
        />
        <Text
          style={[
            localStyles.inputText,
            !rideForm.end_location && localStyles.placeholder,
          ]}
        >
          {rideForm.end_location || "Local de destino"}
        </Text>
        {rideForm.end_location ? (
          <TouchableOpacity onPress={() => clearLocation("end")}>
            <Ionicons
              name="close-circle"
              size={24}
              color={colors.neutral.gray2}
            />
          </TouchableOpacity>
        ) : (
          <Ionicons
            name="chevron-forward"
            size={24}
            color={colors.neutral.gray2}
          />
        )}
      </TouchableOpacity>

      {renderDateTimePicker()}

      {renderVehicleSelector()}

      <Input
        label="Lugares"
        value={rideForm.available_seats}
        onChangeText={(text: string) =>
          setRideForm((prev) => ({ ...prev, available_seats: text }))
        }
        placeholder="Ex: 3"
        keyboardType="numeric"
      />

      <View style={localStyles.switchContainer}>
        <Text style={[typography.body1]}>É uma carona grátis?</Text>
        <Switch
          value={isFreeRide}
          onValueChange={(value) => {
            setIsFreeRide(value);
            if (value) {
              setRideForm((prev) => ({ ...prev, price: "0" }));
            }
          }}
          trackColor={{
            false: colors.neutral.gray4,
            true: colors.primary.normal.default,
          }}
        />
      </View>

      {!isFreeRide && (
        <Input
          label="Preço"
          value={rideForm.price}
          onChangeText={(text: string) => {
            const formattedPrice = formatPrice(text);
            setRideForm((prev) => ({ ...prev, price: formattedPrice }));
          }}
          placeholder="R$ 0,00"
          keyboardType="numeric"
        />
      )}

      <Input
        label="Preferências"
        value={rideForm.preferences}
        onChangeText={(text: string) =>
          setRideForm((prev) => ({ ...prev, preferences: text }))
        }
        placeholder="Ex: Não aceito animais de estimação, Não aceito fumantes..."
        multiline
      />

      {error ? (
        <Text
          style={[
            typography.body2,
            { color: colors.status.error, marginTop: 8 },
          ]}
        >
          {error}
        </Text>
      ) : null}

      <Button
        onPress={handleRideOffer}
        disabled={loading}
        style={{ marginTop: 16, marginBottom: 100 }}
      >
        {loading ? "Criando..." : "Oferecer"}
      </Button>
    </View>
  );

  const renderVehicleModal = () => (
    <Modal
      visible={showVehicleModal}
      animationType="slide"
      onRequestClose={() => setShowVehicleModal(false)}
    >
      <SafeAreaView style={localStyles.modalContainer}>
        <View style={localStyles.mapHeader}>
          <TouchableOpacity
            onPress={() => setShowVehicleModal(false)}
            style={localStyles.backButton}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={colors.neutral.black}
            />
          </TouchableOpacity>
          <Text style={[typography.h3, { flex: 1, textAlign: "center" }]}>
            Selecione um veículo
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={{ flex: 1 }}>
          {vehicles.map((vehicle) => (
            <TouchableOpacity
              key={vehicle.vehicle_id}
              style={[
                localStyles.vehicleItem,
                selectedVehicle?.vehicle_id === vehicle.vehicle_id &&
                  localStyles.selectedVehicle,
              ]}
              onPress={() => {
                setSelectedVehicle(vehicle);
                setShowVehicleModal(false);
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name="car"
                  size={24}
                  color={
                    selectedVehicle?.vehicle_id === vehicle.vehicle_id
                      ? colors.primary.normal.default
                      : colors.neutral.gray2
                  }
                />
                <View style={{ marginLeft: 12 }}>
                  <Text
                    style={[typography.body1, { color: colors.neutral.black }]}
                  >
                    {vehicle.model}
                  </Text>
                  <Text
                    style={[typography.body2, { color: colors.neutral.gray2 }]}
                  >
                    {vehicle.color} - {vehicle.seats} lugares
                  </Text>
                </View>
              </View>
              {selectedVehicle?.vehicle_id === vehicle.vehicle_id && (
                <Ionicons
                  name="checkmark"
                  size={24}
                  color={colors.primary.normal.default}
                />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={localStyles.headerSection}>
        <View style={localStyles.background}>
          <View style={localStyles.headerContent}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={localStyles.backButton}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={colors.neutral.white}
              />
            </TouchableOpacity>
            <View style={localStyles.titleContainer}>
              <Text style={[typography.h3, { color: colors.neutral.white }]}>
                Crie uma oferta{"\n"}de carona
              </Text>
              <House style={localStyles.houseSvg} />
            </View>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={true}
          style={localStyles.formScroll}
          contentContainerStyle={localStyles.formScrollContent}
        >
          {!user?.is_driver ? (
            <TouchableOpacity
              onPress={() => router.back()}
              style={localStyles.registerVehicleContainer}
            >
              <Text style={[typography.body1, { textAlign: "center" }]}>
                Para oferecer caronas, você precisa primeiro registrar um
                veículo.
              </Text>
              <Text
                style={[
                  typography.body1,
                  { color: colors.primary.normal.default, marginTop: 8 },
                ]}
              >
                Clique aqui para registrar
              </Text>
            </TouchableOpacity>
          ) : (
            renderRideForm()
          )}
        </ScrollView>
      </View>

      <Modal
        visible={showLocationModal}
        animationType="slide"
        onRequestClose={() => setShowLocationModal(false)}
      >
        <SafeAreaView style={localStyles.modalContainer}>
          <View style={localStyles.mapHeader}>
            <TouchableOpacity
              onPress={() => setShowLocationModal(false)}
              style={localStyles.backButton}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={colors.neutral.black}
              />
            </TouchableOpacity>
            <Text style={[typography.h3, { flex: 1, textAlign: "center" }]}>
              {locationMode === "start"
                ? "Local de partida"
                : "Local de destino"}
            </Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={localStyles.mapContainer}>
            <MapView
              style={localStyles.map}
              showsUserLocation={true}
              followsUserLocation={true}
              initialRegion={{
                latitude: parseFloat(rideForm.start_latitude) || -23.5505,
                longitude: parseFloat(rideForm.start_longitude) || -46.6333,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              onPress={(e) => {
                const { latitude, longitude } = e.nativeEvent.coordinate;
                if (locationMode === "start") {
                  setRideForm((prev) => ({
                    ...prev,
                    start_latitude: latitude.toString(),
                    start_longitude: longitude.toString(),
                  }));
                } else {
                  setRideForm((prev) => ({
                    ...prev,
                    end_latitude: latitude.toString(),
                    end_longitude: longitude.toString(),
                  }));
                }
              }}
            >
              {locationMode === "start" && rideForm.start_latitude && (
                <Marker
                  draggable
                  coordinate={{
                    latitude: parseFloat(rideForm.start_latitude),
                    longitude: parseFloat(rideForm.start_longitude),
                  }}
                  onDragEnd={(e) => {
                    const { latitude, longitude } = e.nativeEvent.coordinate;
                    setRideForm((prev) => ({
                      ...prev,
                      start_latitude: latitude.toString(),
                      start_longitude: longitude.toString(),
                    }));
                  }}
                  pinColor={colors.primary.normal.default}
                />
              )}
              {locationMode === "end" && rideForm.end_latitude && (
                <Marker
                  draggable
                  coordinate={{
                    latitude: parseFloat(rideForm.end_latitude),
                    longitude: parseFloat(rideForm.end_longitude),
                  }}
                  onDragEnd={(e) => {
                    const { latitude, longitude } = e.nativeEvent.coordinate;
                    setRideForm((prev) => ({
                      ...prev,
                      end_latitude: latitude.toString(),
                      end_longitude: longitude.toString(),
                    }));
                  }}
                  pinColor={colors.primary.normal.default}
                />
              )}
            </MapView>
          </View>

          <View style={localStyles.modalButtons}>
            <Button
              onPress={() => {
                if (locationMode === "start" && rideForm.start_latitude) {
                  handleLocationSelect(
                    parseFloat(rideForm.start_latitude),
                    parseFloat(rideForm.start_longitude)
                  );
                } else if (locationMode === "end" && rideForm.end_latitude) {
                  handleLocationSelect(
                    parseFloat(rideForm.end_latitude),
                    parseFloat(rideForm.end_longitude)
                  );
                }
              }}
              style={[localStyles.confirmButton, { height: 48 }]}
            >
              Confirmar
            </Button>
            <Button
              onPress={() => setShowLocationModal(false)}
              variant="outline"
              style={[localStyles.closeButton, { height: 48 }]}
            >
              Cancelar
            </Button>
          </View>
        </SafeAreaView>
      </Modal>
      {renderVehicleModal()}
    </View>
  );
}

const localStyles = StyleSheet.create({
  headerSection: {
    flex: 1,
    backgroundColor: colors.primary.normal.default,
  },
  background: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 48 : 24,
    height: 140,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginLeft: 16,
  },
  houseSvg: {
    marginTop: -12,
    marginRight: -8,
  },
  formScroll: {
    flex: 1,
    backgroundColor: colors.neutral.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  formScrollContent: {
    paddingBottom: 32,
  },
  formContainer: {
    gap: 16,
    width: "100%",
    padding: 16,
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.neutral.white,
    borderRadius: 8,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.neutral.gray4,
  },
  inputText: {
    ...typography.body1,
    flex: 1,
  },
  placeholder: {
    color: colors.neutral.gray2,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  registerVehicleContainer: {
    margin: 24,
    padding: 16,
    backgroundColor: colors.neutral.white,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: colors.neutral.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  map: {
    flex: 1,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 16,
    padding: 16,
    backgroundColor: colors.neutral.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.gray4,
  },
  closeButton: {
    flex: 1,
    minHeight: 48,
  },
  confirmButton: {
    flex: 1,
    minHeight: 48,
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  mapHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray4,
  },
  vehicleItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray4,
    backgroundColor: colors.neutral.white,
  },
  selectedVehicle: {
    backgroundColor: colors.primary.light.default,
  },
});

const welcomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.gray4,
  },
  header: {
    backgroundColor: colors.neutral.white,
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray4,
  },
  headerTitle: {
    color: colors.neutral.black,
  },
  content: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.neutral.gray4,
  },
  mainCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    padding: 24,
    shadowColor: colors.neutral.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.primary.light.default,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTitle: {
    color: colors.neutral.black,
    flex: 1,
  },
  description: {
    color: colors.neutral.gray1,
    marginBottom: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary.normal.default,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    color: colors.neutral.white,
  },
  benefitsSection: {
    marginTop: 32,
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.gray4,
  },
  benefitsTitle: {
    color: colors.neutral.black,
    marginBottom: 24,
  },
  benefitsList: {
    gap: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  benefitIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.primary.light.default,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    color: colors.neutral.black,
    marginBottom: 4,
    fontWeight: '600',
  },
  benefitText: {
    color: colors.neutral.gray1,
  },
});
