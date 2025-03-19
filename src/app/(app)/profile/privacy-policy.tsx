import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { typography } from '@/styles/shared/typography/typography';
import { colors } from '@/styles/shared/colors/colors';
import { IconArrowRight, IconArrowLeft } from '@tabler/icons-react-native';
import { router } from 'expo-router';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  header: {
    backgroundColor: colors.neutral.white,
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    padding: 4,
  },
  content: {
    padding: 24,
  },
  contentContainer: {
    paddingBottom: 80,
  },
  title: {
    marginBottom: 24,
    color: colors.neutral.black,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
    color: colors.neutral.black,
  },
  subsection: {
    marginBottom: 16,
  },
  subsectionTitle: {
    marginBottom: 8,
    color: colors.neutral.black,
  },
  paragraph: {
    marginBottom: 12,
    color: colors.neutral.gray1,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 16,
  },
  bullet: {
    width: 16,
    color: colors.neutral.gray1,
  },
  bulletText: {
    flex: 1,
    color: colors.neutral.gray1,
  },
  headerTitle: {
    flex: 1,
    color: colors.neutral.black,
  },
});

export default function PrivacyPolicyScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconArrowLeft size={24} color={colors.neutral.black} />
        </TouchableOpacity>
        <Text style={[typography.h3, styles.headerTitle]}>
          Política de Privacidade
        </Text>
      </View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[typography.body1, styles.paragraph]}>
          Esta Política de Privacidade tem como objetivo esclarecer de forma transparente como o VemComigo, aplicativo de caronas, coleta, utiliza, armazena e protege os dados pessoais dos seus usuários, em conformidade com a Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018). Ao utilizar nosso aplicativo, você concorda com as práticas descritas a seguir.
        </Text>

        <View style={styles.section}>
          <Text style={[typography.h3, styles.sectionTitle]}>1. Sobre o VemComigo</Text>
          <Text style={[typography.body1, styles.paragraph]}>
            O VemComigo é um aplicativo que conecta motoristas e passageiros para o compartilhamento de viagens, promovendo economia, praticidade e sustentabilidade. Nossa plataforma conta com uma estrutura robusta de armazenamento de dados que possibilita a gestão eficiente e segura das informações necessárias para o funcionamento do serviço.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[typography.h3, styles.sectionTitle]}>2. Dados Coletados</Text>
          
          <View style={styles.subsection}>
            <Text style={[typography.subtitle1, styles.subsectionTitle]}>2.1. Dados de Cadastro e Identificação</Text>
            <View style={styles.bulletPoint}>
              <Text style={[typography.body1, styles.bullet]}>•</Text>
              <Text style={[typography.body1, styles.bulletText]}>
                Informações Pessoais: Nome, sobrenome, e-mail (único), senha, telefone (opcional) e foto de perfil.
              </Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={[typography.body1, styles.bullet]}>•</Text>
              <Text style={[typography.body1, styles.bulletText]}>
                Identificadores: Cada usuário é registrado por meio de um identificador único, garantindo a individualização dos cadastros.
              </Text>
            </View>
          </View>

          <View style={styles.subsection}>
            <Text style={[typography.subtitle1, styles.subsectionTitle]}>2.2. Dados de Localização e Endereço</Text>
            <Text style={[typography.body1, styles.paragraph]}>
              Endereço: Coletamos informações como latitude, longitude, cidade e o endereço formatado, que auxiliam na definição dos pontos de partida e chegada das viagens.
            </Text>
          </View>

          <View style={styles.subsection}>
            <Text style={[typography.subtitle1, styles.subsectionTitle]}>2.3. Dados Relacionados a Viagens e Reservas</Text>
            <Text style={[typography.body1, styles.paragraph]}>
              Viagens: São armazenadas informações sobre cada viagem, incluindo horário de início, término, preço, número de vagas, preferências e status da viagem, além de dados vinculados ao motorista, veículo e aos endereços de início e fim.
            </Text>
            <Text style={[typography.body1, styles.paragraph]}>
              Reservas: Registramos dados relativos às reservas feitas pelos passageiros, como status da reserva e do pagamento.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[typography.h3, styles.sectionTitle]}>3. Finalidades do Tratamento dos Dados</Text>
          <Text style={[typography.body1, styles.paragraph]}>
            Os dados pessoais coletados pelo VemComigo são utilizados para as seguintes finalidades:
          </Text>
          <View style={styles.bulletPoint}>
            <Text style={[typography.body1, styles.bullet]}>•</Text>
            <Text style={[typography.body1, styles.bulletText]}>
              Cadastro e Autenticação: Permitir o acesso seguro e personalizado ao aplicativo.
            </Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={[typography.body1, styles.bullet]}>•</Text>
            <Text style={[typography.body1, styles.bulletText]}>
              Gerenciamento de Viagens: Facilitar a criação, acompanhamento e administração de viagens e reservas.
            </Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={[typography.body1, styles.bullet]}>•</Text>
            <Text style={[typography.body1, styles.bulletText]}>
              Comunicação: Viabilizar a troca de mensagens entre os usuários, promovendo uma comunicação eficaz.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[typography.h3, styles.sectionTitle]}>4. Direitos dos Usuários</Text>
          <Text style={[typography.body1, styles.paragraph]}>
            Em conformidade com a LGPD, os usuários possuem os seguintes direitos:
          </Text>
          <View style={styles.bulletPoint}>
            <Text style={[typography.body1, styles.bullet]}>•</Text>
            <Text style={[typography.body1, styles.bulletText]}>
              Acesso: Solicitar informações sobre o tratamento dos seus dados.
            </Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={[typography.body1, styles.bullet]}>•</Text>
            <Text style={[typography.body1, styles.bulletText]}>
              Correção: Atualizar ou corrigir dados incorretos ou desatualizados.
            </Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={[typography.body1, styles.bullet]}>•</Text>
            <Text style={[typography.body1, styles.bulletText]}>
              Eliminação: Requerer a exclusão dos dados, quando aplicável.
            </Text>
          </View>
        </View>

        <View style={[styles.section, { marginBottom: 40 }]}>
          <Text style={[typography.h3, styles.sectionTitle]}>5. Alterações nesta Política</Text>
          <Text style={[typography.body1, styles.paragraph]}>
            Esta política pode ser atualizada periodicamente para refletir mudanças nas práticas de tratamento ou na legislação. Recomendamos que os usuários revisem esta política regularmente para se manterem informados.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 