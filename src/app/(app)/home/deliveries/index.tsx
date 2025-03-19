import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { typography } from "@/styles/shared/typography/typography";
import { colors } from "@/styles/shared/colors/colors";
import { IconArrowLeft } from "@tabler/icons-react-native";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import DeliverySvg from "@/assets/svgs/delivery";
import { StyleSheet } from "react-native";

export default function DeliveriesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconArrowLeft size={24} color={colors.neutral.black} />
        </TouchableOpacity>
        <Text style={[typography.h3, { color: colors.neutral.black }]}>
          Entregas
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <DeliverySvg width={289} height={289} />
        <Text style={[typography.body1, { color: colors.neutral.gray1, textAlign: 'center', marginTop: 24 }]}>
          Essa Funcionalidade ainda está em desenvolvimento.
        </Text>
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
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray4,
  },
  backButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  message: {
    color: colors.primary.normal.default,
    textAlign: "center",
    marginTop: 24,
  },
}); 