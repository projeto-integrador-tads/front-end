import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { typography } from '@/styles/shared/typography/typography';
import { colors } from '@/styles/shared/colors/colors';
import { IconArrowRight } from '@tabler/icons-react-native';
import { router } from 'expo-router';
import EmailActorSvg from '@/assets/svgs/email-actor';
import { messageService, PossibleRecipient } from '@/services/api/messages';

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
    gap: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  title: {
    color: colors.neutral.black,
  },
  searchInput: {
    backgroundColor: colors.neutral.background,
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 8,
    ...typography.body2,
    color: colors.neutral.gray2,
  },
  content: {
    flex: 1,
  },
  recipientCard: {
    backgroundColor: colors.neutral.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray4,
  },
  recipientInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: {
    color: colors.neutral.black,
  },
  userRole: {
    color: colors.neutral.gray2,
    marginTop: 4,
  },
  rideStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: colors.neutral.background,
  },
  rideStatusText: {
    color: colors.neutral.gray1,
  },
  emptyStateContainer: {
    flex: 1,
    minHeight: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  emptyStateText: {
    color: colors.neutral.gray1,
    textAlign: 'center',
  },
  skeletonCard: {
    backgroundColor: colors.neutral.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray4,
    gap: 12,
  },
  skeletonName: {
    width: 120,
    height: 20,
    backgroundColor: colors.neutral.gray4,
    borderRadius: 4,
  },
  skeletonRole: {
    width: 80,
    height: 16,
    backgroundColor: colors.neutral.gray4,
    borderRadius: 4,
    marginTop: 4,
  },
});

export default function NewChatScreen() {
  const [recipients, setRecipients] = useState<PossibleRecipient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadRecipients = async () => {
    try {
      setIsLoading(true);
      const response = await messageService.getPossibleRecipients();
      if (response?.recipients) {
        setRecipients(response.recipients);
      }
    } catch (error) {
      console.error('Error loading recipients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRecipients();
    setRefreshing(false);
  };

  useEffect(() => {
    loadRecipients();
  }, []);

  const renderSkeletonCard = () => (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonName} />
      <View style={styles.skeletonRole} />
    </View>
  );

  const renderRecipientCard = (recipient: PossibleRecipient) => (
    <TouchableOpacity 
      key={`${recipient.ride_id}-${recipient.user_id}`}
      style={styles.recipientCard}
      onPress={() => router.push(`/chats/${recipient.ride_id}` as any)}
    >
      <View style={styles.recipientInfo}>
        <View>
          <Text style={[typography.subtitle1, styles.userName]}>
            {recipient.name} {recipient.last_name}
          </Text>
          <Text style={[typography.caption, styles.userRole]}>
            {recipient.is_driver ? 'Motorista' : 'Passageiro'}
          </Text>
        </View>
        <View style={styles.rideStatus}>
          <Text style={[typography.caption, styles.rideStatusText]}>
            {recipient.ride_status === 'SCHEDULED' ? 'Agendada' :
             recipient.ride_status === 'IN_PROGRESS' ? 'Em andamento' :
             recipient.ride_status === 'COMPLETED' ? 'Finalizada' :
             recipient.ride_status === 'CANCELLED' ? 'Cancelada' :
             'Pendente'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const filteredRecipients = recipients.filter(recipient => 
    searchQuery ? 
      (recipient.name + " " + recipient.last_name)
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    : true
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <IconArrowRight size={20} color={colors.neutral.black} style={{ transform: [{ rotate: '180deg' }] }} />
          <Text style={[typography.button, { color: colors.neutral.black }]}>Voltar</Text>
        </TouchableOpacity>
        <Text style={[typography.h3, styles.title]}>Nova Conversa</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Busque uma pessoa"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.neutral.gray2}
        />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={!isLoading && filteredRecipients.length === 0 ? {} : { paddingBottom: 120 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading ? (
          <View>
            {[1, 2, 3, 4].map((_, index) => (
              <View key={index}>{renderSkeletonCard()}</View>
            ))}
          </View>
        ) : filteredRecipients.length > 0 ? (
          filteredRecipients.map(renderRecipientCard)
        ) : (
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyState}>
              <EmailActorSvg width={200} height={200} />
              <Text style={[typography.body1, styles.emptyStateText]}>
                {searchQuery 
                  ? 'Nenhuma pessoa encontrada com este nome.'
                  : 'Não há pessoas disponíveis para conversar no momento.'}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
} 