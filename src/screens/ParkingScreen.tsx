import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Button,
  TextInput,
  ScrollView
} from 'react-native';
import axios from 'axios';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { ParkingGrid } from '../components/ParkingGrid';
import { Spot } from '../types';

// Ajusta la IP para tu servidor de plazas
const API_URL = 'http://10.0.2.2:6000/api/spots';

type Props = NativeStackScreenProps<RootStackParamList, 'Parking'>;

export default function ParkingScreen({ navigation }: Props) {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [searchPlate, setSearchPlate] = useState('');

  // Cargar plazas al montar
  useEffect(() => {
    fetchSpots();
  }, []);

  const fetchSpots = async () => {
    try {
      const response = await axios.get(API_URL);
      setSpots(response.data);
    } catch (error) {
      console.error('Error al obtener plazas:', error);
      Alert.alert('Error', 'No se pudieron obtener las plazas del servidor');
    }
  };

  // Al pulsar en una plaza (si quisieras ir a su detalle directamente)
  const handleSpotClick = (spot: Spot) => {
    // Podrías navegar a VehicleInfoScreen con la matrícula
    navigation.navigate('VehicleInfo', { plate: spot.plate });
  };

  // Buscar la matrícula introducida en el TextInput
  const handleSearch = () => {
    // Normalizamos la búsqueda (mayúsculas, sin espacios) si es necesario
    const plateToFind = searchPlate.trim().toUpperCase();
    if (!plateToFind) {
      Alert.alert('Aviso', 'Introduce una matrícula');
      return;
    }

    // Buscamos si existe en spots y está "occupied"
    const foundSpot = spots.find(
      (s) => s.plate.toUpperCase() === plateToFind && s.status === 'occupied'
    );

    if (foundSpot) {
      // Navegamos a VehicleInfoScreen
      navigation.navigate('VehicleInfo', { plate: foundSpot.plate });
    } else {
      Alert.alert('No encontrado', 'Esta matrícula no está en el parking');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Plazas del Parking</Text>

      {/* Grid con las plazas */}
      <ParkingGrid spots={spots} onSpotClick={handleSpotClick} />

      {/* Botón para recargar */}
      <Button title="Actualizar plazas" onPress={fetchSpots} />

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <Text style={styles.label}>Buscar Matrícula</Text>
        <TextInput
          style={styles.input}
          value={searchPlate}
          onChangeText={setSearchPlate}
          placeholder="Ej: ABC1234"
        />
        <Button title="Buscar" onPress={handleSearch} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  searchContainer: {
    marginTop: 16,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    marginBottom: 30,
  },
  label: {
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
