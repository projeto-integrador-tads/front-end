import React from "react";
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
import { IconMail } from "@tabler/icons-react-native";
import { colors } from "@/styles/shared/colors/colors";
import { typography } from "@/styles/shared/typography/typography";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "expo-router";
import { TopBar } from "@/components/top-bar/TopBar";
import { styles } from "@/styles/auth/recover/styles";

const emailSchema = z.object({
  email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
});

type EmailFormData = z.infer<typeof emailSchema>;

export default function RecoverEmailScreen() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: EmailFormData) => {
    router.push("/(auth)/recover/passcode");
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
              <Text style={[typography.h2]}>Recuperar Senha</Text>
              <Text style={[typography.body1, styles.subtitle]}>
                Digite seu email para receber o código de recuperação
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
            </View>
          </View>

          <Button onPress={handleSubmit(onSubmit)} style={styles.button}>
            Enviar código
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} 