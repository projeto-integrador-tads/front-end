import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { typography } from "@/styles/shared/typography/typography";
import { colors } from "@/styles/shared/colors/colors";
import { IconArrowRight, IconClock, IconPlus } from "@tabler/icons-react-native";
import { router } from "expo-router";
import EmailActorSvg from "@/assets/svgs/email-actor";
import { messageService, Conversation } from "@/services/api/messages";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: colors.neutral.white,
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray4,
    gap: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    color: colors.neutral.black,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary.normal.default,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    backgroundColor: colors.neutral.background,
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 8,
    ...typography.body2,
    color: colors.neutral.gray2,
  },
  conversationCard: {
    backgroundColor: colors.neutral.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray4,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: {
    color: colors.neutral.black,
  },
  timestamp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timestampText: {
    color: colors.neutral.gray2,
  },
  lastMessage: {
    color: colors.neutral.gray1,
  },
  rideInfo: {
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.neutral.background,
    borderRadius: 8,
    gap: 4,
  },
  rideRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rideCity: {
    flex: 1,
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
  skeletonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skeletonName: {
    width: 120,
    height: 20,
    backgroundColor: colors.neutral.gray4,
    borderRadius: 4,
  },
  skeletonTime: {
    width: 80,
    height: 16,
    backgroundColor: colors.neutral.gray4,
    borderRadius: 4,
  },
  skeletonMessage: {
    width: '80%',
    height: 16,
    backgroundColor: colors.neutral.gray4,
    borderRadius: 4,
  },
  skeletonRide: {
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.neutral.background,
    borderRadius: 8,
    gap: 8,
  },
  skeletonRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  skeletonCity: {
    flex: 1,
    height: 16,
    backgroundColor: colors.neutral.gray4,
    borderRadius: 4,
  },
  skeletonIcon: {
    width: 20,
    height: 20,
    backgroundColor: colors.neutral.gray4,
    borderRadius: 4,
  },
});

export default function ChatsScreen() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const response = await messageService.getConversations();
      if (response?.data) {
        setConversations(response.data);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadConversations();
    setRefreshing(false);
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderSkeletonCard = () => (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonHeader}>
        <View style={styles.skeletonName} />
        <View style={styles.skeletonTime} />
      </View>
      <View style={styles.skeletonMessage} />
      <View style={styles.skeletonRide}>
        <View style={styles.skeletonRoute}>
          <View style={styles.skeletonCity} />
          <View style={styles.skeletonIcon} />
          <View style={styles.skeletonCity} />
        </View>
      </View>
    </View>
  );

  const renderConversationCard = (conversation: Conversation) => (
    <TouchableOpacity 
      key={`${conversation.ride_id}-${conversation.driver_id}-${conversation.passenger_id}`}
      style={styles.conversationCard}
      onPress={() => router.push(`/chats/${conversation.ride_id}` as any)}
    >
      <View style={styles.conversationHeader}>
        <Text style={[typography.subtitle1, styles.userName]}>
          {conversation.driver_id === conversation.passenger_id 
            ? `${conversation.passenger_name} ${conversation.passenger_last_name}`
            : `${conversation.driver_name} ${conversation.driver_last_name}`}
        </Text>
        <View style={styles.timestamp}>
          <IconClock size={16} color={colors.neutral.gray2} />
          <Text style={[typography.caption, styles.timestampText]}>
            {formatDate(conversation.last_message.createdAt)}
          </Text>
        </View>
      </View>

      <Text style={[typography.body2, styles.lastMessage]} numberOfLines={2}>
        {conversation.last_message.content}
      </Text>

      {conversation.ride_details && (
        <View style={styles.rideInfo}>
          <View style={styles.rideRoute}>
            <Text style={[typography.caption, styles.rideCity]} numberOfLines={1}>
              {conversation.ride_details.start_address}
            </Text>
            <IconArrowRight size={16} color={colors.neutral.gray2} />
            <Text style={[typography.caption, styles.rideCity]} numberOfLines={1}>
              {conversation.ride_details.end_address}
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={[typography.h3, styles.title]}>Conversas</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/chats/new' as any)}
          >
            <IconPlus size={20} color={colors.neutral.white} />
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Busque uma conversa"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.neutral.gray2}
        />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={!isLoading && conversations.length === 0 ? {} : { paddingBottom: 120 }}
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
        ) : conversations.length > 0 ? (
          conversations
            .filter(conv => 
              searchQuery ? 
                (conv.driver_name + " " + conv.driver_last_name).toLowerCase().includes(searchQuery.toLowerCase()) ||
                (conv.passenger_name + " " + conv.passenger_last_name).toLowerCase().includes(searchQuery.toLowerCase()) ||
                conv.last_message.content.toLowerCase().includes(searchQuery.toLowerCase())
              : true
            )
            .map(renderConversationCard)
        ) : (
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyState}>
              <EmailActorSvg width={200} height={200} />
              <Text style={[typography.body1, styles.emptyStateText]}>
                Não há mensagens no momento.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
} 