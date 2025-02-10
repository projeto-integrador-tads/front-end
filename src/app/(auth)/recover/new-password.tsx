import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input } from "@/components/input/Input";
import { Button } from "@/components/button/Button";
import { IconEye, IconEyeOff } from "@tabler/icons-react-native";
import { typography } from "@/styles/shared/typography/typography";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "expo-router";
import { TopBar } from "@/components/top-bar/TopBar";
import { styles } from "@/styles/auth/recover/styles";
import { colors } from "@/styles/shared/colors/colors";

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Senha deve ter no mínimo 6 caracteres")
      .max(50, "Senha muito longa"),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function RecoverNewPasswordScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const onSubmit = (data: PasswordFormData) => {
    router.push("/login");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <TopBar />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          <View>
            <View style={styles.headerContent}>
              <Text style={[typography.h2]}>Recuperar Conta</Text>
              <Text style={[typography.body1, styles.subtitle]}>
                Crie uma nova senha para poder deslocar com agilidade
              </Text>
            </View>

            <View style={styles.form}>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Nova Senha"
                    placeholder="Mínimo 6 caracteres"
                    secureTextEntry={!showPassword}
                    value={value}
                    onChangeText={onChange}
                    error={errors.password?.message}
                  >
                    <Input.Icon
                      icon={showPassword ? IconEyeOff : IconEye}
                      position="right"
                      onPress={() => setShowPassword(!showPassword)}
                      color={colors.neutral.gray2}
                      size={24}
                    />
                  </Input>
                )}
              />

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Confirmar Senha"
                    placeholder="Digite a mesma senha"
                    secureTextEntry={!showConfirmPassword}
                    value={value}
                    onChangeText={onChange}
                    error={errors.confirmPassword?.message}
                  >
                    <Input.Icon
                      icon={showConfirmPassword ? IconEyeOff : IconEye}
                      position="right"
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      color={colors.neutral.gray2}
                      size={24}
                    />
                  </Input>
                )}
              />
            </View>
          </View>

          <Button onPress={handleSubmit(onSubmit)} style={styles.button}>
            Continuar
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
