import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import axios from 'axios';
import { Spot } from '../types';

const API_URL = 'http://10.0.2.2:6000/api/spots';

type Props = NativeStackScreenProps<RootStackParamList, 'VehicleInfo'>;

export default function VehicleInfoScreen({ route }: Props) {
  const { plate } = route.params; // Recibimos la matrícula
  const [loading, setLoading] = useState(true);
  const [spot, setSpot] = useState<Spot | null>(null);

  useEffect(() => {
    // Al montar, cargar todas las plazas y filtrar por plate
    fetchSpotInfo();
  }, []);

  const fetchSpotInfo = async () => {
    try {
      const response = await axios.get(API_URL);
      const spots: Spot[] = response.data;

      // Buscamos la plaza con la matrícula
      const found = spots.find((s) => s.plate.toUpperCase() === plate.toUpperCase());
      if (!found) {
        Alert.alert('No se encontró', 'No hay plaza con esa matrícula');
      } else {
        setSpot(found);
      }
    } catch (error) {
      console.error('Error al buscar la plaza', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!spot) {
    return (
      <View style={styles.container}>
        <Text style={styles.infoText}>No hay datos para la matrícula {plate}</Text>
      </View>
    );
  }

  // Si encontramos el spot
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Información del Vehículo</Text>
      <Text style={styles.infoText}>ID: {spot.id}</Text>
      <Text style={styles.infoText}>Matrícula: {spot.plate}</Text>
      <Text style={styles.infoText}>Estado: {spot.status}</Text>
      {/* Podrías mostrar más info aquí si tu backend la provee */}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f3f4f6',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
  },
});
