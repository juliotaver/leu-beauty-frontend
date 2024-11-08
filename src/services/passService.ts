// src/services/passService.ts
import { Cliente } from '../types';

export const passService = {
  async generarPass(cliente: Cliente): Promise<string> {
    try {
      // Por ahora, solo simularemos la generación retornando la URL del pase existente
      const passUrl = `/LeuBeautyPass.pkpass`;
      
      return passUrl;
    } catch (error) {
      console.error('Error generando el pase:', error);
      throw error;
    }
  }
};