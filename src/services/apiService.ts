// apiService.ts
import axios from 'axios';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Exportar las constantes de URL
export const BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3001'
  : 'https://api.leubeautylab.com';

export const API_URL = `${BASE_URL}/api`;
export const WEB_SERVICE_URL = `${BASE_URL}/v1`;

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
  pushToken?: string;
  deviceLibraryIdentifier?: string;
  passTypeIdentifier?: string;
  lastPassUpdate?: Date;
}

export const apiService = {
  API_URL,  // Exponer API_URL como parte del objeto apiService
  WEB_SERVICE_URL,  // Exponer WEB_SERVICE_URL como parte del objeto apiService

  async crearCliente(cliente: Omit<Cliente, 'id'>): Promise<Cliente> {
    try {
      console.log('Creando cliente en Firestore:', cliente);
      const docRef = await addDoc(collection(db, 'clientes'), {
        ...cliente,
        fechaRegistro: new Date(),
        lastPassUpdate: new Date()
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
      
      const response = await axios({
        method: 'POST',
        url: `${API_URL}/passes/generate`,
        data: {
          ...cliente,
          lastPassUpdate: new Date(),
          passTypeIdentifier: 'pass.com.salondenails.loyalty'
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
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
        throw new Error(error.response?.data?.error || 'Error al generar el pase');
      }
      throw new Error('Error al generar el pase');
    }
  },

  async actualizarPase(clienteId: string): Promise<void> {
    try {
      console.log('Solicitando actualización de pase para cliente:', clienteId);
      
      const response = await axios({
        method: 'POST',
        url: `${API_URL}/push/update-pass`,
        data: {
          clienteId,
          timestamp: new Date().toISOString()
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.status !== 200) {
        throw new Error(`Error actualizando pase: ${response.status}`);
      }

      console.log('Respuesta de actualización:', response.data);
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