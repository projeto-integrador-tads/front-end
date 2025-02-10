import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/button/Button";
import { typography } from "@/styles/shared/typography/typography";
import { useRouter } from "expo-router";
import { TopBar } from "@/components/top-bar/TopBar";
import { VerificationCode } from "@/components/verification-code/VerificationCode";
import { useTimeout } from "@/hooks/useTimeout";
import { styles } from "@/styles/auth/recover/styles";

export default function RecoverPasscodeScreen() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const { seconds, isActive, start } = useTimeout();

  React.useEffect(() => {
    start();
  }, []);

  const handleResendCode = () => {
    if (!isActive) {
      console.log("Resending code...");
      start();
    }
  };

  const onSubmit = () => {
    if (code.length === 6) {
      router.push("/recover/new-password");
    }
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
                Entre com o código recebido no E-mail
              </Text>
            </View>

            <View style={styles.codeSection}>
              <VerificationCode value={code} onChange={setCode} />

              {isActive ? (
                <Text style={styles.resendCode}>
                  Reenviar email ({seconds}s)
                </Text>
              ) : (
                <Pressable onPress={handleResendCode}>
                  <Text style={styles.resendCode}>Reenviar email</Text>
                </Pressable>
              )}
            </View>
          </View>

          <Button
            onPress={onSubmit}
            disabled={code.length !== 6}
            style={styles.button}
          >
            Alterar senha
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
