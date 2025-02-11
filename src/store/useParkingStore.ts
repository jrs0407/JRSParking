import { create } from 'zustand';
import axios from 'axios';
import { Spot } from '../types'; 

const API_URL = 'http://10.0.2.2:6000/api/spots';

interface ParkingState {
  spots: Spot[];
  fetchSpots: () => Promise<void>;
  getSpotByPlate: (plate: string) => Spot | undefined;
}

export const useParkingStore = create<ParkingState>((set, get) => ({
  spots: [],
  
  // Funcion para obtener todas las plazas del servidor y guardarlas en la store
  fetchSpots: async () => {
    try {
      const response = await axios.get(API_URL);
      set({ spots: response.data });
    } catch (error) {
      console.error('Error al obtener plazas:', error);
      throw error; 
    }
  },

  // Funcion para obtener una plaza por matrícula
  getSpotByPlate: (plate: string) => {
    const { spots } = get();
    return spots.find(
      (s) => s.plate.toUpperCase() === plate.toUpperCase()
    );
  },
}));
