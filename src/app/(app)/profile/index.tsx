import React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { typography } from "@/styles/shared/typography/typography";
import { styles } from "@/styles/app/styles";
import { useRouter } from "expo-router";
import { Button } from "@/components/button/Button";

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = () => {
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[typography.h2]}>Perfil</Text>
          <Text style={[typography.body1, styles.subtitle]}>
            Gerencie suas informações
          </Text>
        </View>

        <Button variant="outline" onPress={handleLogout}>
          Sair
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
} 