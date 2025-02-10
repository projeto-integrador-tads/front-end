import React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { typography } from "@/styles/shared/typography/typography";
import { styles } from "@/styles/app/styles";

export default function ChatsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[typography.h2]}>Conversas</Text>
          <Text style={[typography.body1, styles.subtitle]}>
            Suas mensagens com outros usuários
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 