import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Pressable,
} from "react-native";
import { Input } from "@/components/input/Input";
import { Button } from "@/components/button/Button";
import { Dialog } from "@/components/dialog/Dialog";
import {
  IconLock,
  IconEye,
  IconEyeOff,
  IconMail,
} from "@tabler/icons-react-native";
import { colors } from "@/styles/shared/colors/colors";
import { typography } from "@/styles/shared/typography/typography";
import DriverSvg from "@/assets/svgs/driver";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useRouter } from "expo-router";
import { styles } from "@/styles/auth/login/styles";
import { useUser } from "@/contexts/UserContext";

const loginSchema = z.object({
  email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
  password: z
    .string()
    .min(6, "Senha deve ter no mínimo 8 caracteres")
    .max(50, "Senha muito longa"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorDialog, setErrorDialog] = useState({
    visible: false,
    message: "",
  });
  const { signIn } = useUser();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      await signIn(data.email, data.password);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Ocorreu um erro ao fazer login";
      console.error("Login error:", error);
      setErrorDialog({
        visible: true,
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <DriverSvg style={styles.illustration} />
      </View>

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
          <View style={styles.headerContent}>
            <Text style={[typography.h2]}>VemComigo!</Text>
            <Text style={[typography.body1, styles.subtitle]}>
              Desloque-se com agilidade e segurança
            </Text>
          </View>

          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Email"
                  placeholder="Digite seu email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  error={errors.email?.message}
                >
                  <Input.Icon
                    icon={IconMail}
                    color={colors.neutral.gray2}
                    size={24}
                  />
                </Input>
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Senha"
                  placeholder="Digite sua senha"
                  secureTextEntry={!showPassword}
                  value={value}
                  onChangeText={onChange}
                  error={errors.password?.message}
                >
                  <Input.Icon
                    icon={IconLock}
                    color={colors.neutral.gray2}
                    size={24}
                  />
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

            <Link href="/recover" asChild>
              <Pressable>
                <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
              </Pressable>
            </Link>

            <Button onPress={handleSubmit(onSubmit)} disabled={isLoading}>
              {isLoading ? "Carregando..." : "Login"}
            </Button>

            <View style={styles.signupContainer}>
              <Text style={[typography.body2, styles.signupText]}>
                Não tem uma conta?
              </Text>
              <Link href="/signup" asChild>
                <Pressable>
                  <Text style={[typography.body2, styles.signupLink]}>
                    Criar conta
                  </Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Dialog
        visible={errorDialog.visible}
        title="Erro ao fazer login"
        message={errorDialog.message}
        type="error"
        onClose={() => setErrorDialog({ visible: false, message: "" })}
      />
    </View>
  );
}
