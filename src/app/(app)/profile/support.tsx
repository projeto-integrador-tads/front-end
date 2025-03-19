import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { typography } from '@/styles/shared/typography/typography';
import { colors } from '@/styles/shared/colors/colors';
import { 
  IconArrowRight, 
  IconHelp, 
  IconMessage, 
  IconPhone, 
  IconMail,
  IconChevronRight,
  IconAlertCircle,
  IconCar,
  IconCreditCard,
  IconUser,
  IconArrowLeft
} from '@tabler/icons-react-native';
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
  contentContainer: {
    paddingBottom: 80,
  },
  section: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray4,
  },
  sectionTitle: {
    color: colors.neutral.black,
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.neutral.background,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    color: colors.neutral.black,
  },
  cardSubtitle: {
    color: colors.neutral.gray2,
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  faqText: {
    flex: 1,
    color: colors.neutral.black,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.primary.light.default,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    color: colors.primary.normal.default,
  },
  contactSubtitle: {
    color: colors.primary.dark.default,
  },
  headerTitle: {
    flex: 1,
  },
});

const helpCategories = [
  {
    id: '1',
    title: 'Problemas com viagens',
    subtitle: 'Cancelamentos, atrasos, alterações',
    icon: IconCar,
  },
  {
    id: '2',
    title: 'Pagamentos',
    subtitle: 'Cobranças, reembolsos, métodos de pagamento',
    icon: IconCreditCard,
  },
  {
    id: '3',
    title: 'Conta e perfil',
    subtitle: 'Acesso, dados pessoais, verificação',
    icon: IconUser,
  },
];

const faqItems = [
  'Como funciona o sistema de avaliações?',
  'Como solicitar reembolso?',
  'Como alterar minha senha?',
  'Como reportar um problema?',
];

export default function SupportScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconArrowLeft size={24} color={colors.neutral.black} />
        </TouchableOpacity>
        <Text style={[typography.h3, styles.headerTitle]}>
          Suporte
        </Text>
      </View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={[typography.subtitle1, styles.sectionTitle]}>Como podemos ajudar?</Text>
          
          {helpCategories.map((category) => (
            <TouchableOpacity key={category.id} style={styles.card}>
              <category.icon size={24} color={colors.neutral.gray1} />
              <View style={styles.cardInfo}>
                <Text style={[typography.subtitle1, styles.cardTitle]}>{category.title}</Text>
                <Text style={[typography.caption, styles.cardSubtitle]}>{category.subtitle}</Text>
              </View>
              <IconChevronRight size={20} color={colors.neutral.gray2} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[typography.subtitle1, styles.sectionTitle]}>Perguntas Frequentes</Text>
          
          {faqItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.faqItem}>
              <IconHelp size={20} color={colors.neutral.gray2} />
              <Text style={[typography.body1, styles.faqText]}>{item}</Text>
              <IconChevronRight size={20} color={colors.neutral.gray2} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[typography.subtitle1, styles.sectionTitle]}>Contato</Text>
          
          <TouchableOpacity style={styles.contactCard}>
            <IconMessage size={24} color={colors.primary.normal.default} />
            <View style={styles.contactInfo}>
              <Text style={[typography.subtitle1, styles.contactTitle]}>Chat ao vivo</Text>
              <Text style={[typography.caption, styles.contactSubtitle]}>Disponível 24/7</Text>
            </View>
            <IconChevronRight size={20} color={colors.primary.normal.default} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <IconPhone size={24} color={colors.neutral.gray1} />
            <View style={styles.cardInfo}>
              <Text style={[typography.subtitle1, styles.cardTitle]}>Central de Atendimento</Text>
              <Text style={[typography.caption, styles.cardSubtitle]}>0800 123 4567</Text>
            </View>
            <IconChevronRight size={20} color={colors.neutral.gray2} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <IconMail size={24} color={colors.neutral.gray1} />
            <View style={styles.cardInfo}>
              <Text style={[typography.subtitle1, styles.cardTitle]}>E-mail</Text>
              <Text style={[typography.caption, styles.cardSubtitle]}>suporte@vemcomigo.com</Text>
            </View>
            <IconChevronRight size={20} color={colors.neutral.gray2} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 