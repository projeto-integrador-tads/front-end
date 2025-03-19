import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { typography } from '@/styles/shared/typography/typography';
import { colors } from '@/styles/shared/colors/colors';
import { IconArrowRight, IconCreditCard, IconCash, IconQrcode, IconPlus, IconArrowLeft } from '@tabler/icons-react-native';
import { router } from 'expo-router';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  header: {
    backgroundColor: colors.neutral.white,
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.neutral.black,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addButtonText: {
    color: colors.primary.normal.default,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.neutral.background,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodTitle: {
    color: colors.neutral.black,
  },
  paymentMethodSubtitle: {
    color: colors.neutral.gray2,
  },
  headerTitle: {
    flex: 1,
    color: colors.neutral.black,
  },
});

export default function PaymentsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconArrowLeft size={24} color={colors.neutral.black} />
        </TouchableOpacity>
        <Text style={[typography.h3, styles.headerTitle]}>
          Pagamentos
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[typography.subtitle1, styles.sectionTitle]}>Formas de Pagamento</Text>
            <TouchableOpacity style={styles.addButton}>
              <IconPlus size={20} color={colors.primary.normal.default} />
              <Text style={[typography.button, styles.addButtonText]}>Adicionar</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.paymentMethod}>
            <IconCreditCard size={24} color={colors.neutral.gray1} />
            <View style={styles.paymentMethodInfo}>
              <Text style={[typography.subtitle1, styles.paymentMethodTitle]}>•••• •••• •••• 1234</Text>
              <Text style={[typography.caption, styles.paymentMethodSubtitle]}>Mastercard | Expira em 12/25</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.paymentMethod}>
            <IconQrcode size={24} color={colors.neutral.gray1} />
            <View style={styles.paymentMethodInfo}>
              <Text style={[typography.subtitle1, styles.paymentMethodTitle]}>Pix</Text>
              <Text style={[typography.caption, styles.paymentMethodSubtitle]}>Chave: email@exemplo.com</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.paymentMethod}>
            <IconCash size={24} color={colors.neutral.gray1} />
            <View style={styles.paymentMethodInfo}>
              <Text style={[typography.subtitle1, styles.paymentMethodTitle]}>Dinheiro</Text>
              <Text style={[typography.caption, styles.paymentMethodSubtitle]}>Pagamento em espécie</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 