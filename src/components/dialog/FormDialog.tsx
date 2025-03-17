import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { colors } from '@/styles/shared/colors/colors';
import { typography } from '@/styles/shared/typography/typography';
import { IconX } from '@tabler/icons-react-native';
import { Button } from '../button/Button';

interface FormDialogProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  confirmText: string;
  loading?: boolean;
  error?: string;
  content: React.ReactNode;
}

export function FormDialog({
  visible,
  title,
  onClose,
  onConfirm,
  confirmText,
  loading,
  error,
  content
}: FormDialogProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error('Error in form dialog confirm:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={[typography.subtitle1, styles.title]}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <IconX size={20} color={colors.neutral.gray2} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {content}
          </View>

          {error && (
            <Text style={[typography.body2, styles.error]}>
              {error}
            </Text>
          )}

          <View style={styles.actions}>
            <Button
              onPress={handleConfirm}
              disabled={loading}
              style={styles.confirmButton}
            >
              {confirmText}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    width: Dimensions.get('window').width * 0.85,
    maxWidth: 400,
    padding: 24,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: colors.neutral.black,
    flex: 1,
  },
  closeButton: {
    padding: 4,
    marginRight: -8,
  },
  content: {
    flex: 1,
  },
  error: {
    color: colors.status.error,
    marginTop: 8,
  },
  actions: {
    marginTop: 16,
  },
  confirmButton: {
    width: '100%',
  }
}); 