import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, RefreshControl, Image, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { typography } from '@/styles/shared/typography/typography';
import { colors } from '@/styles/shared/colors/colors';
import { IconArrowRight, IconSend } from '@tabler/icons-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { messageService } from '@/services/api/messages';
import { userService } from '@/services/api/user';
import { useUser } from '@/contexts/UserContext';
import { BASE_URL } from '@/services/api/endpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Message {
  message_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  createdAt: Date;
}

interface ChatParticipant {
  id: string;
  name: string;
  last_name: string;
  photo_url?: string;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  header: {
    backgroundColor: colors.neutral.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerTitle: {
    color: colors.neutral.black,
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: colors.neutral.background,
  },
  messageList: {
    padding: 16,
    gap: 8,
    paddingBottom: 60,
  },
  messageContainer: {
    maxWidth: '80%',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  messageSent: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  messageContent: {
    backgroundColor: colors.neutral.gray4,
    padding: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
  },
  messageContentSent: {
    backgroundColor: colors.primary.normal.default,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 4,
  },
  messageText: {
    color: colors.neutral.black,
  },
  messageTextSent: {
    color: colors.neutral.white,
  },
  messageTime: {
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  messageTimeText: {
    color: colors.neutral.gray2,
    fontSize: 11,
  },
  dateDivider: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateDividerText: {
    ...typography.caption,
    color: colors.neutral.gray2,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.neutral.white,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.gray4,
    elevation: 4,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingBottom: Platform.OS === 'ios' ? 34 : 80,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: colors.neutral.background,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingRight: 48,
    minHeight: 40,
    maxHeight: 120,
    ...typography.body2,
    color: colors.neutral.black,
  },
  sendButton: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary.normal.default,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.neutral.gray4,
  },
  skeletonMessage: {
    maxWidth: '80%',
    height: 40,
    backgroundColor: colors.neutral.gray4,
    borderRadius: 12,
    marginBottom: 16,
  },
  skeletonMessageSent: {
    alignSelf: 'flex-end',
  },
});

export default function ChatDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatParticipant, setChatParticipant] = useState<ChatParticipant | null>(null);
  const [userPhotoUrl, setUserPhotoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingParticipant, setIsLoadingParticipant] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const loadChatParticipant = async () => {
    try {
      setIsLoadingParticipant(true);
      const response = await messageService.getPossibleRecipients();
      const recipient = response.recipients.find(r => r.ride_id === id);
      
      if (recipient) {
        const photoResponse = await userService.getProfilePictureById(recipient.user_id).catch(() => null);
        
        setChatParticipant({
          id: recipient.user_id,
          name: recipient.name,
          last_name: recipient.last_name,
          photo_url: photoResponse?.url
        });
      }
    } catch (error) {
      console.error('Error loading chat participant:', error);
    } finally {
      setIsLoadingParticipant(false);
    }
  };

  useEffect(() => {
    const loadUserPhoto = async () => {
      if (user?.id) {
        try {
          const photoResponse = await userService.getProfilePictureById(user.id).catch(() => null);
          setUserPhotoUrl(photoResponse?.url || null);
        } catch (error) {
          console.error('Error loading user photo:', error);
        }
      }
    };

    loadUserPhoto();
    loadChatParticipant();
    loadMessages();
  }, [id, user?.id]);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const response = await messageService.getMessages(id as string);
      if (response?.data) {
        setMessages(response.data.reverse());
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMessages();
    setRefreshing(false);
  };

  useEffect(() => {
    const keyboardDidShow = () => setIsKeyboardVisible(true);
    const keyboardDidHide = () => setIsKeyboardVisible(false);

    const showSubscription = Keyboard.addListener('keyboardDidShow', keyboardDidShow);
    const hideSubscription = Keyboard.addListener('keyboardDidHide', keyboardDidHide);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !id || !chatParticipant || !user) return;

    const tempId = Date.now().toString();
    const optimisticMessage: Message = {
      message_id: tempId,
      sender_id: user.id,
      receiver_id: chatParticipant.id,
      content: newMessage.trim(),
      createdAt: new Date()
    };

    // Add optimistic message
    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage('');
    scrollViewRef.current?.scrollToEnd({ animated: true });

    try {
      const messageData = {
        ride_id: id,
        content: optimisticMessage.content,
        receiver_id: chatParticipant.id
      };

      // Send message through REST API
      const response = await messageService.sendMessage(messageData);
      
      // Replace optimistic message with real one
      setMessages(prev => prev.map(msg => 
        msg.message_id === tempId ? response : msg
      ));
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove failed optimistic message
      setMessages(prev => prev.filter(msg => msg.message_id !== tempId));
      // TODO: Show error toast
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderSkeletonMessages = () => (
    <View style={styles.messageList}>
      {[1, 2, 3, 4, 5].map((_, index) => (
        <View
          key={index}
          style={[
            styles.skeletonMessage,
            index % 2 === 0 && styles.skeletonMessageSent,
          ]}
        />
      ))}
    </View>
  );

  const renderMessage = (message: Message) => {
    const isSentByMe = message.sender_id === user?.id;
    const messageParticipant = isSentByMe ? user : chatParticipant;
    const photoUrl = isSentByMe ? userPhotoUrl : chatParticipant?.photo_url;

    return (
      <View
        key={message.message_id}
        style={[
          styles.messageContainer,
          isSentByMe && styles.messageSent,
        ]}
      >
        <Image
          source={{
            uri: photoUrl || 
              `https://ui-avatars.com/api/?name=${encodeURIComponent(messageParticipant?.name || 'User')}`
          }}
          style={styles.messageAvatar}
        />
        <View>
          <View style={[
            styles.messageContent,
            isSentByMe && styles.messageContentSent,
          ]}>
            <Text style={[
              typography.body2,
              styles.messageText,
              isSentByMe && styles.messageTextSent
            ]}>
              {message.content}
            </Text>
          </View>
          <Text style={[typography.caption, styles.messageTimeText]}>
            {formatDate(message.createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <IconArrowRight size={24} color={colors.neutral.black} style={{ transform: [{ rotate: '180deg' }] }} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          {isLoadingParticipant ? (
            <View style={[styles.avatar, { backgroundColor: colors.neutral.gray4 }]} />
          ) : (
            <Image
              source={{
                uri: chatParticipant?.photo_url || 
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(chatParticipant?.name || 'User')}`
              }}
              style={styles.avatar}
            />
          )}
          <Text style={[typography.subtitle1, styles.headerTitle]}>
            {isLoadingParticipant ? 'Carregando...' : `${chatParticipant?.name} ${chatParticipant?.last_name}`}
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
       <ScrollView
  ref={scrollViewRef}
  style={styles.content}
  contentContainerStyle={[
    styles.messageList,
    { paddingBottom: styles.messageList.paddingBottom + (isKeyboardVisible ? 120 : 90) }
  ]}
  showsVerticalScrollIndicator={false}
  refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  }
  onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
>
  {isLoading ? renderSkeletonMessages() : messages.map(renderMessage)}
</ScrollView>


        <View style={[
          styles.inputContainer,
          { paddingBottom: Platform.OS === 'ios' ? 
              (isKeyboardVisible ? 120 : 34) : 
              (isKeyboardVisible ? 120 : 80) 
          }
        ]}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Digite sua mensagem..."
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
              maxLength={500}
              placeholderTextColor={colors.neutral.gray2}
            />
            <TouchableOpacity
              style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
              onPress={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <IconSend size={16} color={colors.neutral.white} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} 