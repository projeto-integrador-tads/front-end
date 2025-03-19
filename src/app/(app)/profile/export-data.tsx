import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { typography } from '@/styles/shared/typography/typography';
import { colors } from '@/styles/shared/colors/colors';
import { IconArrowLeft, IconDownload } from '@tabler/icons-react-native';
import { router } from 'expo-router';
import { userService, PersonalUserReport } from '@/services/api/user';
import { Button } from '@/components/button/Button';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

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
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    color: colors.neutral.black,
    marginLeft: 16,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
    color: colors.neutral.black,
  },
  card: {
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.neutral.gray4,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    color: colors.neutral.gray1,
  },
  statValue: {
    color: colors.neutral.black,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    color: colors.status.error,
    textAlign: 'center',
    marginBottom: 16,
  },
  downloadButton: {
    marginTop: 24,
  },
});

export default function ExportDataScreen() {
  const [data, setData] = useState<PersonalUserReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await userService.getPersonalReport();
      setData(response);
    } catch (error: any) {
      setError(error.message || 'Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!data) return;

    try {
      setIsDownloading(true);
      
      // Convert data to JSON string
      const jsonString = JSON.stringify(data, null, 2);
      
      // Create a temporary file
      const fileUri = `${FileSystem.documentDirectory}personal_data_export.json`;
      await FileSystem.writeAsStringAsync(fileUri, jsonString);
      
      // Share the file
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: 'Exportar Dados Pessoais',
      });
    } catch (error) {
      console.error('Error downloading data:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const renderStats = () => {
    if (!data) return null;

    const totalRides = data.ridesAsDriver.length + data.ridesAsPassenger.length;
    const totalSpent = data.ridesAsPassenger.reduce((acc, ride) => acc + ride.price, 0);
    const totalEarned = data.ridesAsDriver.reduce((acc, ride) => acc + ride.price, 0);
    const averageRating = data.personalData.average_rating || 0;

    return (
      <View style={styles.section}>
        <Text style={[typography.subtitle1, styles.sectionTitle]}>Resumo</Text>
        <View style={styles.card}>
          <View style={styles.statRow}>
            <Text style={[typography.body2, styles.statLabel]}>Total de Caronas</Text>
            <Text style={[typography.subtitle1, styles.statValue]}>{totalRides}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={[typography.body2, styles.statLabel]}>Como Motorista</Text>
            <Text style={[typography.subtitle1, styles.statValue]}>{data.ridesAsDriver.length}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={[typography.body2, styles.statLabel]}>Como Passageiro</Text>
            <Text style={[typography.subtitle1, styles.statValue]}>{data.ridesAsPassenger.length}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={[typography.body2, styles.statLabel]}>Total Ganho</Text>
            <Text style={[typography.subtitle1, styles.statValue]}>
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(totalEarned)}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={[typography.body2, styles.statLabel]}>Total Gasto</Text>
            <Text style={[typography.subtitle1, styles.statValue]}>
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(totalSpent)}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={[typography.body2, styles.statLabel]}>Avaliação Média</Text>
            <Text style={[typography.subtitle1, styles.statValue]}>
              {averageRating.toFixed(1)} ⭐
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <IconArrowLeft size={24} color={colors.neutral.black} />
          </TouchableOpacity>
          <Text style={[typography.h3, styles.headerTitle]}>Exportar Dados</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.normal.default} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <IconArrowLeft size={24} color={colors.neutral.black} />
          </TouchableOpacity>
          <Text style={[typography.h3, styles.headerTitle]}>Exportar Dados</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={[typography.body1, styles.errorText]}>{error}</Text>
          <Button onPress={loadData}>Tentar Novamente</Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconArrowLeft size={24} color={colors.neutral.black} />
        </TouchableOpacity>
        <Text style={[typography.h3, styles.headerTitle]}>Exportar Dados</Text>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {renderStats()}

        <Button
          onPress={handleDownload}
          style={styles.downloadButton}
          disabled={isDownloading}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <IconDownload size={20} color={colors.neutral.white} />
            <Text style={[typography.button, { color: colors.neutral.white }]}>
              {isDownloading ? 'Exportando...' : 'Exportar JSON'}
            </Text>
          </View>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
} 