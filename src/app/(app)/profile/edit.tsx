import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, Text, StyleSheet, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Input } from "@/components/input/Input";
import { useUser } from "@/contexts/UserContext";
import { userService } from "@/services/api/user";
import { Dialog } from "@/components/dialog/Dialog";
import { IconArrowLeft } from "@tabler/icons-react-native";
import { Button } from "@/components/button/Button";
import { colors } from "@/styles/shared/colors/colors";
import { typography } from "@/styles/shared/typography/typography";
import { z } from "zod";

const phoneRegex = /^\(\d{2}\)\s\d{5}-\d{4}$/;

const schema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  last_name: z.string().min(3, "Sobrenome deve ter no mínimo 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  phone_number: z.string().regex(phoneRegex, "Telefone inválido")
});

const formatPhoneNumber = (text: string) => {
  const cleaned = text.replace(/\D/g, '');
  if (cleaned.length <= 11) {
    let formatted = cleaned;
    if (cleaned.length > 2) {
      formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    }
    if (cleaned.length > 7) {
      formatted = formatted.slice(0, 10) + '-' + formatted.slice(10);
    }
    return formatted;
  }
  return text;
};

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 84 : 64;

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

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorDialog, setErrorDialog] = useState({ visible: false, message: "" });
  const [successDialog, setSuccessDialog] = useState({ visible: false });
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    phone_number: user?.phone_number ? formatPhoneNumber(user.phone_number) : ""
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'phone_number' ? formatPhoneNumber(value) : value
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    try {
      schema.parse(formData);
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
      
      const updateData: any = {};
      if (formData.name.trim() && formData.name !== user?.name) {
        updateData.name = formData.name.trim();
      }
      if (formData.last_name.trim() && formData.last_name !== user?.last_name) {
        updateData.last_name = formData.last_name.trim();
      }
      if (formData.email.trim() && formData.email !== user?.email) {
        updateData.email = formData.email.trim();
      }
      if (formData.phone_number.trim() && formData.phone_number !== user?.phone_number) {
        updateData.phone_number = formData.phone_number.trim().replace(/\D/g, '');
      }

      if (Object.keys(updateData).length > 0) {
        const updatedUser = await userService.updateProfile(user?.id || "", updateData);
        updateUser(updatedUser);
        setSuccessDialog({ visible: true });
      } else {
        router.back();
      }
    } catch (error: any) {
      const errorMessage = error?.error || "Não foi possível atualizar o perfil";
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
          Editar Perfil
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
              label="Nome"
              value={formData.name}
              onChangeText={(value) => handleChange('name', value)}
              placeholder="Digite seu nome"
              error={errors.name}
            />
            <Input
              label="Sobrenome"
              value={formData.last_name}
              onChangeText={(value) => handleChange('last_name', value)}
              placeholder="Digite seu sobrenome"
              error={errors.last_name}
            />
          </View>

          <View style={styles.inputGroup}>
            <Input
              label="E-mail"
              value={formData.email}
              onChangeText={(value) => handleChange('email', value)}
              placeholder="Digite seu e-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />
            <Input
              label="Telefone"
              value={formData.phone_number}
              onChangeText={(value) => handleChange('phone_number', value)}
              placeholder="(XX) XXXXX-XXXX"
              keyboardType="numeric"
              error={errors.phone_number}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Button 
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? "Salvando..." : "Salvar"}
        </Button>
      </View>

      <Dialog
        visible={errorDialog.visible}
        title="Erro ao salvar"
        message={errorDialog.message}
        type="error"
        onClose={() => setErrorDialog({ visible: false, message: "" })}
      />

      <Dialog
        visible={successDialog.visible}
        title="Perfil atualizado"
        message="Suas informações foram atualizadas com sucesso!"
        type="success"
        onClose={() => {
          setSuccessDialog({ visible: false });
          router.back();
        }}
      />
    </SafeAreaView>
  );
} 