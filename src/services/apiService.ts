import axios from 'axios';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3001/api'
  : 'https://api.leubeautylab.com/api';

console.log('API URL:', API_URL);

export interface Cliente {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  visitas: number;
  ultimaVisita: Date;
  proximaRecompensa: string;
  recompensasCanjeadas: string[];
}

// Crear una instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000
});

export const apiService = {
  async crearCliente(cliente: Omit<Cliente, 'id'>): Promise<Cliente> {
    try {
      console.log('Creando cliente en Firestore:', cliente);
      const docRef = await addDoc(collection(db, 'clientes'), {
        ...cliente,
        fechaRegistro: new Date(),
        lastPassUpdate: new Date() // Agregar este campo
      });

      return {
        ...cliente,
        id: docRef.id
      };
    } catch (error) {
      console.error('Error creando cliente:', error);
      throw error;
    }
  },

  async generarPase(cliente: Cliente): Promise<string> {
    try {
      console.log('Generando pase para:', cliente);
      
      const response = await apiClient.post('/passes/generate', {
        ...cliente,
        lastPassUpdate: new Date(), // Añadir timestamp de actualización
        passTypeIdentifier: 'pass.com.salondenails.loyalty' // Agregar el identificador del pase
      });

      console.log('Respuesta del servidor:', response.data);

      if (!response.data.passUrl) {
        throw new Error('No se recibió URL del pase');
      }

      return response.data.passUrl;
    } catch (error) {
      console.error('Error generando pase:', error);
      if (axios.isAxiosError(error)) {
        console.error('Detalles del error:', {
          status: error.response?.status,
          data: error.response?.data,
          config: error.config
        });
      }
      throw new Error('Error al generar el pase');
    }
  },

  async actualizarPase(clienteId: string): Promise<void> {
    try {
      console.log('Solicitando actualización de pase para cliente:', clienteId);
      
      const response = await apiClient.post('/push/update-pass', {
        clienteId,
        timestamp: new Date().toISOString()
      });

      console.log('Respuesta de actualización:', response.data);

      if (response.status !== 200) {
        throw new Error(`Error actualizando pase: ${response.status}`);
      }
    } catch (error) {
      console.error('Error actualizando pase:', error);
      if (axios.isAxiosError(error)) {
        console.error('Detalles del error:', {
          status: error.response?.status,
          data: error.response?.data,
          config: error.config
        });
      }
      throw new Error('Error al actualizar el pase');
    }
  }
};