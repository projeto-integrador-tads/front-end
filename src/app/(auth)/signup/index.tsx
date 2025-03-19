import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Pressable,
  Modal,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input } from "@/components/input/Input";
import { Button } from "@/components/button/Button";
import { Dialog } from "@/components/dialog/Dialog";
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
import { userService } from "@/services/api/user";
import { useUser } from "@/contexts/UserContext";

const password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]*$/;
const phone = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;

const formatPhoneNumber = (value: string) => {
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, "");
  
  // Format the number as (XX) XXXXX-XXXX
  if (numbers.length <= 11) {
    return numbers.replace(/(\d{2})?(\d{5})?(\d{4})?/, (_, ddd, prefix, suffix) => {
      let formatted = "";
      if (ddd) formatted += `(${ddd}`;
      if (ddd) formatted += ") ";
      if (prefix) formatted += `${prefix}`;
      if (suffix) formatted += `-${suffix}`;
      return formatted;
    });
  }
  return value;
};

const signupSchema = z.object({
  firstName: z.string().min(3, "Nome inválido."),
  lastName: z.string().min(3, "Sobrenome inválido."),
  email: z.string().email("Email em formato inválido."),
  phoneNumber: z.string()
    .transform(str => str.replace(/\D/g, ""))
    .refine(val => val === "" || /^\d{10,11}$/.test(val), {
      message: "Número inválido"
    })
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .regex(password, {
      message:
        "A senha deve conter pelo menos 1 letra maiúscula, 1 letra minúscula, 1 número e pode conter caracteres especiais.",
    })
    .min(8, "A senha precisa conter pelo menos 8 caracteres."),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type SignUpFormData = z.infer<typeof signupSchema>;

export default function SignUpScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorDialog, setErrorDialog] = useState({ visible: false, message: "" });
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const router = useRouter();
  const { signIn } = useUser();

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

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setIsLoading(true);
      await userService.register({
        email: data.email,
        password: data.password,
        name: data.firstName,
        last_name: data.lastName,
        phone_number: data.phoneNumber || undefined,
      });

      await signIn(data.email, data.password);
    } catch (error: any) {
      console.error('Registration error:', error);
      setErrorDialog({
        visible: true,
        message: error.error || "Ocorreu um erro ao criar sua conta"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const RequiredMark = () => <Text style={styles.requiredMark}>*</Text>;

  const renderPrivacyPolicyModal = () => (
    <Modal
      visible={showPrivacyPolicy}
      transparent
      animationType="slide"
      onRequestClose={() => setShowPrivacyPolicy(false)}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
      }}>
        <View style={{
          backgroundColor: colors.neutral.white,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: 24,
          maxHeight: '80%',
        }}>
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: 24,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.neutral.gray4,
          }}>
            <View style={{ width: 24 }} />
            <Text style={[typography.h3, { color: colors.neutral.black }]}>
              Política de Privacidade
            </Text>
            <TouchableOpacity
              onPress={() => setShowPrivacyPolicy(false)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <IconArrowLeft size={24} color={colors.neutral.black} style={{ transform: [{ rotate: '90deg' }] }} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            <Text style={[typography.body1, { color: colors.neutral.gray1, marginBottom: 24 }]}>
              É importante que você leia atentamente este documento, pois ele contém informações sobre os seus direitos, responsabilidades e as diretrizes para o uso do aplicativo. Caso não concorde com algum dos termos, recomendamos que não utilize o aplicativo.
            </Text>

            <View style={{ marginBottom: 24 }}>
              <Text style={[typography.h3, { color: colors.neutral.black, marginBottom: 16 }]}>
                1. Sobre o VemComigo
              </Text>
              <Text style={[typography.body1, { color: colors.neutral.gray1 }]}>
                O VemComigo é um aplicativo que conecta motoristas e passageiros para o compartilhamento de viagens, promovendo economia, praticidade e sustentabilidade. Nossa plataforma conta com uma estrutura robusta de armazenamento de dados que possibilita a gestão eficiente e segura das informações necessárias para o funcionamento do serviço.
              </Text>
            </View>

            <View style={{ marginBottom: 24 }}>
              <Text style={[typography.h3, { color: colors.neutral.black, marginBottom: 16 }]}>
                2. Dados Coletados
              </Text>
              
              <View style={{ marginBottom: 16 }}>
                <Text style={[typography.subtitle1, { color: colors.neutral.black, marginBottom: 8 }]}>
                  2.1. Dados de Cadastro e Identificação
                </Text>
                <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                  <Text style={[typography.body1, { color: colors.neutral.gray1, width: 16 }]}>•</Text>
                  <Text style={[typography.body1, { color: colors.neutral.gray1, flex: 1 }]}>
                    Informações Pessoais: Nome, sobrenome, e-mail (único), senha, telefone (opcional) e foto de perfil.
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                  <Text style={[typography.body1, { color: colors.neutral.gray1, width: 16 }]}>•</Text>
                  <Text style={[typography.body1, { color: colors.neutral.gray1, flex: 1 }]}>
                    Identificadores: Cada usuário é registrado por meio de um identificador único, garantindo a individualização dos cadastros.
                  </Text>
                </View>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text style={[typography.subtitle1, { color: colors.neutral.black, marginBottom: 8 }]}>
                  2.2. Dados de Localização e Endereço
                </Text>
                <Text style={[typography.body1, { color: colors.neutral.gray1 }]}>
                  Endereço: Coletamos informações como latitude, longitude, cidade e o endereço formatado, que auxiliam na definição dos pontos de partida e chegada das viagens.
                </Text>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text style={[typography.subtitle1, { color: colors.neutral.black, marginBottom: 8 }]}>
                  2.3. Dados Relacionados a Viagens e Reservas
                </Text>
                <Text style={[typography.body1, { color: colors.neutral.gray1, marginBottom: 8 }]}>
                  Viagens: São armazenadas informações sobre cada viagem, incluindo horário de início, término, preço, número de vagas, preferências e status da viagem, além de dados vinculados ao motorista, veículo e aos endereços de início e fim.
                </Text>
                <Text style={[typography.body1, { color: colors.neutral.gray1 }]}>
                  Reservas: Registramos dados relativos às reservas feitas pelos passageiros, como status da reserva e do pagamento.
                </Text>
              </View>
            </View>

            <View style={{ marginBottom: 24 }}>
              <Text style={[typography.h3, { color: colors.neutral.black, marginBottom: 16 }]}>
                3. Finalidades do Tratamento dos Dados
              </Text>
              <Text style={[typography.body1, { color: colors.neutral.gray1, marginBottom: 12 }]}>
                Os dados pessoais coletados pelo VemComigo são utilizados para as seguintes finalidades:
              </Text>
              <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                <Text style={[typography.body1, { color: colors.neutral.gray1, width: 16 }]}>•</Text>
                <Text style={[typography.body1, { color: colors.neutral.gray1, flex: 1 }]}>
                  Cadastro e Autenticação: Permitir o acesso seguro e personalizado ao aplicativo.
                </Text>
              </View>
              <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                <Text style={[typography.body1, { color: colors.neutral.gray1, width: 16 }]}>•</Text>
                <Text style={[typography.body1, { color: colors.neutral.gray1, flex: 1 }]}>
                  Gerenciamento de Viagens: Facilitar a criação, acompanhamento e administração de viagens e reservas.
                </Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={[typography.body1, { color: colors.neutral.gray1, width: 16 }]}>•</Text>
                <Text style={[typography.body1, { color: colors.neutral.gray1, flex: 1 }]}>
                  Comunicação: Viabilizar a troca de mensagens entre os usuários, promovendo uma comunicação eficaz.
                </Text>
              </View>
            </View>

            <View style={{ marginBottom: 24 }}>
              <Text style={[typography.h3, { color: colors.neutral.black, marginBottom: 16 }]}>
                4. Alterações nesta Política
              </Text>
              <Text style={[typography.body1, { color: colors.neutral.gray1 }]}>
                Esta política pode ser atualizada periodicamente para refletir mudanças nas práticas de tratamento ou na legislação. Recomendamos que os usuários revisem esta política regularmente para se manterem informados.
              </Text>
            </View>
          </ScrollView>

          <Button
            onPress={() => setShowPrivacyPolicy(false)}
            style={{ marginTop: 16 }}
          >
            Entendi
          </Button>
        </View>
      </View>
    </Modal>
  );

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
              render={({ field: { onChange, value } }) => {
                const displayValue = value ? formatPhoneNumber(value) : "";
                
                return (
                  <Input
                    label="Telefone (opcional)"
                    placeholder="Ex: (11) 98765-4321"
                    keyboardType="phone-pad"
                    value={displayValue}
                    onChangeText={(text) => {
                      // Store only numbers in the form state
                      const numbersOnly = text.replace(/\D/g, "");
                      onChange(numbersOnly);
                    }}
                    error={errors.phoneNumber?.message}
                  >
                    <Input.Icon
                      icon={IconPhone}
                      color={colors.neutral.gray2}
                      size={24}
                    />
                  </Input>
                );
              }}
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
                  placeholder="Mínimo 8 caracteres"
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

            <Button onPress={handleSubmit(onSubmit)} disabled={isLoading}>
              {isLoading ? "Criando conta..." : "Criar conta"}
            </Button>

            <TouchableOpacity 
              onPress={() => setShowPrivacyPolicy(true)}
              style={{ marginTop: 16, alignItems: 'center' }}
            >
              <Text style={[typography.body2, { color: colors.neutral.gray1, textAlign: 'center' }]}>
                Ao criar a conta você concorda com nossa{' '}
                <Text style={{ color: colors.primary.normal.default }}>
                  política de privacidade
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Dialog
        visible={errorDialog.visible}
        title="Erro ao criar conta"
        message={errorDialog.message}
        type="error"
        onClose={() => setErrorDialog({ visible: false, message: "" })}
      />

      {renderPrivacyPolicyModal()}
    </SafeAreaView>
  );
}
