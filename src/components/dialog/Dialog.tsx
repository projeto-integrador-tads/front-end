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

interface DialogProps {
  visible: boolean;
  title?: string;
  message: string;
  type?: 'error' | 'success' | 'info' | 'warning';
  onClose: () => void;
  actions?: {
    label: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary';
  }[];
}

export function Dialog({
  visible,
  title,
  message,
  type = 'info',
  onClose,
  actions = [{ label: 'OK', onPress: onClose, variant: 'primary' }],
}: DialogProps) {
  const getTypeColor = () => {
    switch (type) {
      case 'error':
        return colors.status.error;
      case 'success':
        return colors.status.success;
      case 'warning':
        return colors.status.warning;
      default:
        return colors.primary.normal.default;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.container} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            {title && (
              <Text style={[typography.subtitle1, styles.title]}>{title}</Text>
            )}
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <IconX size={20} color={colors.neutral.gray2} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={[styles.indicator, { backgroundColor: getTypeColor() }]} />
            <Text style={[typography.body2, styles.message]}>{message}</Text>
          </View>

          <View style={styles.actions}>
            {actions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  action.variant === 'primary' && {
                    backgroundColor: getTypeColor(),
                  },
                ]}
                onPress={action.onPress}
              >
                <Text
                  style={[
                    typography.button,
                    styles.buttonText,
                    action.variant === 'primary'
                      ? styles.primaryButtonText
                      : styles.secondaryButtonText,
                  ]}
                >
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Pressable>
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
    flexDirection: 'row',
    gap: 12,
  },
  indicator: {
    width: 4,
    borderRadius: 2,
  },
  message: {
    flex: 1,
    color: colors.neutral.gray1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: colors.neutral.white,
  },
  secondaryButtonText: {
    color: colors.neutral.gray1,
  },
}); 