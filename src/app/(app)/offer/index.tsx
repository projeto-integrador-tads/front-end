import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { typography } from "@/styles/shared/typography/typography";
import { colors } from "@/styles/shared/colors/colors";
import { Link } from "expo-router";
import { IconCar, IconArrowRight, IconCurrencyDollar, IconUsers, IconLeaf } from "@tabler/icons-react-native";
import { StyleSheet } from "react-native";

export default function OfferScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={[typography.h3, styles.headerTitle]}>Oferecer Carona</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.mainCard}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <IconCar size={24} color={colors.primary.normal.default} />
            </View>
            <Text style={[typography.h3, styles.cardTitle]}>
              Comece a oferecer caronas
            </Text>
          </View>
          
          <Text style={[typography.body1, styles.description]}>
            Você precisa ter um veículo registrado para oferecer caronas. Registre seu veículo agora para começar.
          </Text>

          <Link href="/(app)/profile/vehicles" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={[typography.button, styles.buttonText]}>
                Registrar Veículo
              </Text>
              <IconArrowRight size={20} color={colors.neutral.white} />
            </TouchableOpacity>
          </Link>

          <View style={styles.benefitsSection}>
            <Text style={[typography.subtitle1, styles.benefitsTitle]}>
              Por que oferecer caronas?
            </Text>

            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <IconCurrencyDollar size={20} color={colors.primary.normal.default} />
                </View>
                <View style={styles.benefitContent}>
                  <Text style={[typography.body2, styles.benefitTitle]}>
                    Renda Extra
                  </Text>
                  <Text style={[typography.caption, styles.benefitText]}>
                    Divida os custos da viagem e ganhe uma renda adicional
                  </Text>
                </View>
              </View>

              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <IconUsers size={20} color={colors.primary.normal.default} />
                </View>
                <View style={styles.benefitContent}>
                  <Text style={[typography.body2, styles.benefitTitle]}>
                    Novas Conexões
                  </Text>
                  <Text style={[typography.caption, styles.benefitText]}>
                    Conheça pessoas interessantes e faça novas amizades
                  </Text>
                </View>
              </View>

              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <IconLeaf size={20} color={colors.primary.normal.default} />
                </View>
                <View style={styles.benefitContent}>
                  <Text style={[typography.body2, styles.benefitTitle]}>
                    Impacto Ambiental
                  </Text>
                  <Text style={[typography.caption, styles.benefitText]}>
                    Contribua para reduzir emissões e congestionamentos
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
