import React, { useState } from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { typography } from "@/styles/shared/typography/typography";
import { colors } from "@/styles/shared/colors/colors";
import { IconArrowLeft, IconChevronRight } from "@tabler/icons-react-native";
import { router } from "expo-router";
import { StyleSheet } from "react-native";

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState({
    barNotifications: true,
    emailReminders: true,
    emailPromotions: false,
  });

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconArrowLeft size={24} color={colors.neutral.black} />
        </TouchableOpacity>
        <Text style={[typography.h3, styles.headerTitle]}>
          Configurações
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={[typography.subtitle1, styles.sectionTitle]}>
            Notificações
          </Text>
          
          <View style={styles.menuItem}>
            <View>
              <Text style={[typography.body1, { color: colors.neutral.black }]}>
                Barra de notificações
              </Text>
              <Text style={[typography.caption, { color: colors.neutral.gray2 }]}>
                Receber notificações no dispositivo
              </Text>
            </View>
            <Switch 
              value={notifications.barNotifications}
              onValueChange={(value) => 
                setNotifications(prev => ({ ...prev, barNotifications: value }))
              }
              trackColor={{
                false: colors.neutral.gray4,
                true: colors.primary.normal.default,
              }}
            />
          </View>

          <View style={styles.menuItem}>
            <View>
              <Text style={[typography.body1, { color: colors.neutral.black }]}>
                E-mail
              </Text>
              <Text style={[typography.caption, { color: colors.neutral.gray2 }]}>
                Receber notificações por e-mail
              </Text>
            </View>
            <Switch 
              value={notifications.emailReminders}
              onValueChange={(value) => 
                setNotifications(prev => ({ ...prev, emailReminders: value }))
              }
              trackColor={{
                false: colors.neutral.gray4,
                true: colors.primary.normal.default,
              }}
            />
          </View>

          <View style={styles.menuItem}>
            <View>
              <Text style={[typography.body1, { color: colors.neutral.black }]}>
                Promoções por e-mail
              </Text>
              <Text style={[typography.caption, { color: colors.neutral.gray2 }]}>
                Receber novidades e promoções por e-mail
              </Text>
            </View>
            <Switch 
              value={notifications.emailPromotions}
              onValueChange={(value) => 
                setNotifications(prev => ({ ...prev, emailPromotions: value }))
              }
              trackColor={{
                false: colors.neutral.gray4,
                true: colors.primary.normal.default,
              }}
            />
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[typography.subtitle1, styles.sectionTitle]}>
            Conta
          </Text>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push("(app)/profile/export-data" as any)}
          >
            <Text style={[typography.body1, { color: colors.neutral.black }]}>
              Exportar meus dados
            </Text>
            <IconChevronRight size={24} color={colors.neutral.gray2} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push("(app)/profile/delete-account" as any)}
          >
            <Text style={[typography.body1, { color: colors.status.error }]}>
              Deletar conta
            </Text>
            <IconChevronRight size={24} color={colors.neutral.gray2} />
          </TouchableOpacity>
        </View>

        {/* Others Section */}
        <View style={styles.section}>
          <Text style={[typography.subtitle1, styles.sectionTitle]}>
            Outros
          </Text>

          <View style={styles.menuItem}>
            <Text style={[typography.body1, { color: colors.neutral.black }]}>
              Versão do App
            </Text>
            <Text style={[typography.body2, { color: colors.neutral.gray2 }]}>
              v1.0.0
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray4,
  },
  headerTitle: {
    flex: 1,
    color: colors.neutral.black,
    marginLeft: 16,
  },
  backButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    marginBottom: 16,
    color: colors.neutral.black,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray4,
  },
}); 