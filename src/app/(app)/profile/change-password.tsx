import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, Text, StyleSheet, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Input } from "@/components/input/Input";
import { Dialog } from "@/components/dialog/Dialog";
import { IconArrowLeft } from "@tabler/icons-react-native";
import { Button } from "@/components/button/Button";
import { colors } from "@/styles/shared/colors/colors";
import { typography } from "@/styles/shared/typography/typography";
import { z } from "zod";
import api from "@/services/api";
import { AUTH_ENDPOINTS } from "@/services/api/endpoints";
import { passwordRegex } from "@/utils/regex";

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 84 : 64;

const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(8, "A senha atual precisa conter pelo menos 8 caracteres."),
  newPassword: z
    .string()
    .regex(passwordRegex, {
      message:
        "A nova senha deve conter pelo menos 1 letra maiúscula, 1 letra minúscula, 1 número e pode conter caracteres especiais.",
    })
    .min(8, "A nova senha precisa conter pelo menos 8 caracteres."),
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.white
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray4
  },
  backButton: {
    padding: 8
  },
  title: {
    ...typography.h3,
    marginLeft: 16,
    color: colors.neutral.black
  },
  content: {
    padding: 24,
    paddingBottom: TAB_BAR_HEIGHT + 100
  },
  formSection: {
    gap: 24
  },
  inputGroup: {
    gap: 16
  },
  bottomBar: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.gray4,
    backgroundColor: colors.neutral.white,
    position: 'absolute',
    bottom: TAB_BAR_HEIGHT,
    left: 0,
    right: 0
  }
});

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorDialog, setErrorDialog] = useState({ visible: false, message: "" });
  const [successDialog, setSuccessDialog] = useState({ visible: false });
  
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    try {
      changePasswordSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setIsLoading(true);
      
      await api.post(AUTH_ENDPOINTS.CHANGE_PASSWORD, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setSuccessDialog({ visible: true });
      
      // Clear form
      setFormData({
        currentPassword: "",
        newPassword: "",
      });
    } catch (error: any) {
      const errorMessage = error?.error || "Não foi possível alterar a senha";
      setErrorDialog({ visible: true, message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconArrowLeft size={24} color={colors.neutral.black} />
        </TouchableOpacity>
        <Text style={styles.title}>
          Alterar Senha
        </Text>
      </View>

      <ScrollView 
        bounces={false} 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.content}
      >
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Input
              label="Senha atual"
              value={formData.currentPassword}
              onChangeText={(value) => handleChange('currentPassword', value)}
              placeholder="Digite sua senha atual"
              error={errors.currentPassword}
              secureTextEntry
            />
            <Input
              label="Nova senha"
              value={formData.newPassword}
              onChangeText={(value) => handleChange('newPassword', value)}
              placeholder="Digite sua nova senha"
              error={errors.newPassword}
              secureTextEntry
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Button 
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? "Alterando..." : "Alterar senha"}
        </Button>
      </View>

      <Dialog
        visible={errorDialog.visible}
        title="Erro ao alterar senha"
        message={errorDialog.message}
        type="error"
        onClose={() => setErrorDialog({ visible: false, message: "" })}
      />

      <Dialog
        visible={successDialog.visible}
        title="Senha alterada"
        message="Sua senha foi alterada com sucesso!"
        type="success"
        onClose={() => {
          setSuccessDialog({ visible: false });
          router.back();
        }}
      />
    </SafeAreaView>
  );
} 