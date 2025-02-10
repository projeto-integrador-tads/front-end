import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input } from "@/components/input/Input";
import { Button } from "@/components/button/Button";
import {
  IconLock,
  IconEye,
  IconEyeOff,
  IconMail,
  IconUser,
  IconPhone,
  IconArrowLeft,
} from "@tabler/icons-react-native";
import { colors } from "@/styles/shared/colors/colors";
import { typography } from "@/styles/shared/typography/typography";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "expo-router";
import LogoSvg from "@/assets/svgs/logo";
import { styles } from "@/styles/auth/signup/styles";

const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "Nome é obrigatório")
      .max(50, "Nome muito longo"),
    lastName: z
      .string()
      .min(1, "Sobrenome é obrigatório")
      .max(50, "Sobrenome muito longo"),
    email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
    phoneNumber: z.string().optional(),
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

type SignUpFormData = z.infer<typeof signupSchema>;

export default function SignUpScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const onSubmit = (data: SignUpFormData) => {
    console.log(data);
  };

  const RequiredMark = () => <Text style={styles.requiredMark}>*</Text>;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <IconArrowLeft size={24} color={colors.neutral.black} />
          </Pressable>
          <View style={styles.logoContainer}>
            <LogoSvg width={48} height={48} />
          </View>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerContent}>
            <Text style={[typography.h2]}>Criar conta</Text>
            <Text style={[typography.body1, styles.subtitle]}>
              Crie uma conta para poder deslocar com agilidade
            </Text>
          </View>

          <View style={styles.form}>
            <Controller
              control={control}
              name="firstName"
              render={({ field: { onChange, value } }) => (
                <Input
                  label={
                    <View style={styles.labelContainer}>
                      <Text style={styles.label}>Nome</Text>
                      <RequiredMark />
                    </View>
                  }
                  placeholder="Ex: João"
                  autoCapitalize="words"
                  value={value}
                  onChangeText={onChange}
                  error={errors.firstName?.message}
                >
                  <Input.Icon
                    icon={IconUser}
                    color={colors.neutral.gray2}
                    size={24}
                  />
                </Input>
              )}
            />

            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, value } }) => (
                <Input
                  label={
                    <View style={styles.labelContainer}>
                      <Text style={styles.label}>Sobrenome</Text>
                      <RequiredMark />
                    </View>
                  }
                  placeholder="Ex: Silva"
                  autoCapitalize="words"
                  value={value}
                  onChangeText={onChange}
                  error={errors.lastName?.message}
                >
                  <Input.Icon
                    icon={IconUser}
                    color={colors.neutral.gray2}
                    size={24}
                  />
                </Input>
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  label={
                    <View style={styles.labelContainer}>
                      <Text style={styles.label}>Email</Text>
                      <RequiredMark />
                    </View>
                  }
                  placeholder="Ex: joao.silva@email.com"
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
              name="phoneNumber"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Telefone (opcional)"
                  placeholder="Ex: (11) 98765-4321"
                  keyboardType="phone-pad"
                  value={value}
                  onChangeText={onChange}
                  error={errors.phoneNumber?.message}
                >
                  <Input.Icon
                    icon={IconPhone}
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
                  label={
                    <View style={styles.labelContainer}>
                      <Text style={styles.label}>Senha</Text>
                      <RequiredMark />
                    </View>
                  }
                  placeholder="Mínimo 6 caracteres"
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

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value } }) => (
                <Input
                  label={
                    <View style={styles.labelContainer}>
                      <Text style={styles.label}>Confirmar Senha</Text>
                      <RequiredMark />
                    </View>
                  }
                  placeholder="Digite a mesma senha"
                  secureTextEntry={!showConfirmPassword}
                  value={value}
                  onChangeText={onChange}
                  error={errors.confirmPassword?.message}
                >
                  <Input.Icon
                    icon={IconLock}
                    color={colors.neutral.gray2}
                    size={24}
                  />
                  <Input.Icon
                    icon={showConfirmPassword ? IconEyeOff : IconEye}
                    position="right"
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    color={colors.neutral.gray2}
                    size={24}
                  />
                </Input>
              )}
            />

            <Button onPress={handleSubmit(onSubmit)}>Continuar</Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} 