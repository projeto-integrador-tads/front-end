import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, Modal, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { typography } from "@/styles/shared/typography/typography";
import { colors } from "@/styles/shared/colors/colors";
import { styles } from "./styles";
import { useRouter } from "expo-router";
import { Button } from "@/components/button/Button";
import { useUser } from "@/contexts/UserContext";
import { userService } from "@/services/api/user";
import { IconCamera, IconArrowLeft, IconCreditCard, IconUser, IconHeadset, IconSettings, IconLock, IconCar, IconLogout } from "@tabler/icons-react-native";
import * as ImagePicker from 'expo-image-picker';

const menuItems = [
  {
    icon: IconCreditCard,
    label: "Pagamentos",
    route: "payments"
  },
  {
    icon: IconUser,
    label: "Informações do Usuário",
    route: "profile/edit"
  },
  {
    icon: IconLock,
    label: "Alterar Senha",
    route: "profile/change-password"
  },
  {
    icon: IconHeadset,
    label: "Suporte",
    route: "support"
  },
  {
    icon: IconSettings,
    label: "Configurações",
    route: "settings"
  },
  {
    icon: IconLock,
    label: "Políticas e Privacidade",
    route: "privacy"
  },
  {
    icon: IconCar,
    label: "Veículos",
    route: "profile/vehicles"
  }
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useUser();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  useEffect(() => {
    loadProfilePicture();
  }, []);

  const loadProfilePicture = async () => {
    try {
      const pictureResponse = await userService.getProfilePicture();
      setProfilePicture(pictureResponse.url);
    } catch (error) {
      console.error('Error loading profile picture:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handlePhotoPress = () => {
    setShowPhotoOptions(true);
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos da sua permissão para acessar a câmera.');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 1,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (!result.canceled) {
        setIsUploadingPhoto(true);
        const formData = new FormData();
        formData.append('file', {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          name: 'profile-picture.jpg'
        } as any);
        await userService.uploadProfilePicture(formData);
        await loadProfilePicture();
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível tirar a foto. Tente novamente.');
    } finally {
      setIsUploadingPhoto(false);
      setShowPhotoOptions(false);
    }
  };

  const handleChoosePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos da sua permissão para acessar sua galeria.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        quality: 1,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (!result.canceled) {
        setIsUploadingPhoto(true);
        const formData = new FormData();
        formData.append('file', {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          name: 'profile-picture.jpg'
        } as any);
        await userService.uploadProfilePicture(formData);
        await loadProfilePicture();
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar a foto. Tente novamente.');
    } finally {
      setIsUploadingPhoto(false);
      setShowPhotoOptions(false);
    }
  };

  const handleRemovePhoto = async () => {
    Alert.alert(
      'Remover foto',
      'Tem certeza que deseja remover sua foto de perfil?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              await userService.deleteProfilePicture();
              setProfilePicture(null);
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível remover a foto. Tente novamente.');
            } finally {
              setIsLoading(false);
              setShowPhotoOptions(false);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={[typography.h3, { color: colors.neutral.white }]}>Perfil</Text>
      </View>

      <View style={styles.photoSection}>
        <TouchableOpacity 
          style={styles.photoContainer} 
          onPress={handlePhotoPress}
          disabled={isUploadingPhoto}
        >
          {isUploadingPhoto ? (
            <View style={[styles.profilePhoto, { backgroundColor: colors.neutral.gray4, justifyContent: 'center', alignItems: 'center' }]}>
              <ActivityIndicator color={colors.primary.normal.default} />
            </View>
          ) : profilePicture ? (
            <Image
              source={{ uri: profilePicture }}
              style={styles.profilePhoto}
            />
          ) : (
            <View style={[styles.profilePhoto, styles.placeholderPhoto]}>
              <Text style={[typography.h2, { color: colors.neutral.white }]}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
          )}
          <View style={styles.cameraIconContainer}>
            <IconCamera size={20} color={colors.neutral.white} />
          </View>
        </TouchableOpacity>
        <Text style={styles.userName}>
          {user?.name?.split(' ')[0] || 'Usuário'}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.route}
              style={styles.menuItem}
              onPress={() => router.push({
                pathname: item.route as any
              })}
            >
              <View style={styles.menuIcon}>
                <item.icon size={24} color={colors.primary.normal.default} />
              </View>
              <Text style={styles.menuText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.menuItem, styles.logoutButton]}
          onPress={handleLogout}
        >
          <View style={styles.menuIcon}>
            <IconLogout size={24} color={colors.primary.normal.default} />
          </View>
          <Text style={styles.menuText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showPhotoOptions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPhotoOptions(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPhotoOptions(false)}
        >
          <View style={styles.modalContent}>
            <Button variant="default" onPress={handleTakePhoto}>
              Tirar foto
            </Button>
            <Button variant="default" onPress={handleChoosePhoto} style={{ marginTop: 12 }}>
              Escolher da galeria
            </Button>
            {profilePicture && (
              <Button 
                variant="error" 
                onPress={handleRemovePhoto} 
                style={{ marginTop: 12 }}
              >
                Remover foto atual
              </Button>
            )}
            <Button 
              variant="outline" 
              onPress={() => setShowPhotoOptions(false)}
              style={{ marginTop: 12 }}
            >
              Cancelar
            </Button>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
