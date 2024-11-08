import axios from 'axios';
import { db } from '../firebase';  // Asegúrate de que tienes configurado Firebase
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';

const API_URL = 'http://localhost:3001/api';

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
      // Primero crear en Firestore
      const docRef = await addDoc(collection(db, 'clientes'), {
        ...cliente,
        fechaRegistro: new Date(),
        ultimaVisita: new Date(),
      });

      const clienteCompleto: Cliente = {
        ...cliente,
        id: docRef.id
      };

      return clienteCompleto;
    } catch (error) {
      console.error('Error creando cliente:', error);
      throw new Error('Error al crear cliente');
    }
  },

  async generarPase(cliente: Cliente): Promise<string> {
    try {
      const response = await axios.post(`${API_URL}/passes/generate`, cliente);
      if (!response.data.success) {
        throw new Error(response.data.error || 'Error generando pase');
      }
      return response.data.passUrl;
    } catch (error) {
      console.error('Error generando pase:', error);
      throw new Error('Error al generar el pase');
    }
  },

  async obtenerCliente(id: string): Promise<Cliente> {
    try {
      const response = await axios.get(`${API_URL}/passes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo cliente:', error);
      throw new Error('Error al obtener información del cliente');
    }
  }
};