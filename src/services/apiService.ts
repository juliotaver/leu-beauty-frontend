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

export const apiService = {
  async crearCliente(cliente: Omit<Cliente, 'id'>): Promise<Cliente> {
    try {
      console.log('Creando cliente en Firestore:', cliente);
      const docRef = await addDoc(collection(db, 'clientes'), {
        ...cliente,
        fechaRegistro: new Date()
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
      const response = await axios.post(`${API_URL}/passes/generate`, cliente);
      console.log('Respuesta del servidor:', response.data);
      return response.data.passUrl;
    } catch (error) {
      console.error('Error generando pase:', error);
      throw new Error('Error al generar el pase');
    }
  }
};