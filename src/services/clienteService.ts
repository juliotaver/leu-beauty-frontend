import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc, 
  getDocs,
  Timestamp 
} from 'firebase/firestore';
import { Cliente } from '../types';
import axios from 'axios';
import { BASE_URL } from '../services/apiService';  // Importar BASE_URL en su lugar

export const clienteService = {
  async crearCliente(cliente: Omit<Cliente, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'clientes'), {
      ...cliente,
      fechaRegistro: Timestamp.fromDate(new Date()),
      ultimaVisita: Timestamp.fromDate(new Date()),
      visitas: 0,
      recompensasCanjeadas: [],
      pushToken: null,
      deviceLibraryIdentifier: null,
      passTypeIdentifier: null,
      lastPassUpdate: null
    });
    return docRef.id;
  },

  async obtenerCliente(id: string): Promise<Cliente | null> {
    try {
      const docRef = doc(db, 'clientes', id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) return null;

      const data = docSnap.data();
      return {
        id: docSnap.id,
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono || '',
        visitas: data.visitas || 0,
        ultimaVisita: data.ultimaVisita.toDate(),
        fechaRegistro: data.fechaRegistro.toDate(),
        proximaRecompensa: data.proximaRecompensa || 'Postre Gratis',
        recompensasCanjeadas: data.recompensasCanjeadas || [],
        pushToken: data.pushToken || null,
        deviceLibraryIdentifier: data.deviceLibraryIdentifier || null,
        passTypeIdentifier: data.passTypeIdentifier || null,
        lastPassUpdate: data.lastPassUpdate ? data.lastPassUpdate.toDate() : null
      } as Cliente;
    } catch (error) {
      console.error('Error al obtener cliente:', error);
      return null;
    }
  },

  async registrarVisita(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'clientes', id);
      const snapshot = await getDoc(docRef);
      
      if (!snapshot.exists()) {
        throw new Error('Cliente no encontrado');
      }

      const data = snapshot.data();
      const visitasActuales = data.visitas || 0;
      const nuevasVisitas = visitasActuales + 1;
      
      let proximaRecompensa = '';
      
      if (nuevasVisitas >= 25) {
        await updateDoc(docRef, {
          visitas: 0,
          ultimaVisita: Timestamp.fromDate(new Date()),
          proximaRecompensa: 'Postre Gratis',
          lastPassUpdate: Timestamp.fromDate(new Date())
        });
      } else {
        if (nuevasVisitas < 5) {
          proximaRecompensa = 'Postre Gratis';
        } else if (nuevasVisitas < 10) {
          proximaRecompensa = 'Bebida Gratis';
        } else if (nuevasVisitas < 15) {
          proximaRecompensa = 'Gel Liso en Manos';
        } else if (nuevasVisitas < 20) {
          proximaRecompensa = 'Gel Liso en Pies';
        } else {
          proximaRecompensa = '10% Off en Uñas';
        }

        await updateDoc(docRef, {
          visitas: nuevasVisitas,
          ultimaVisita: Timestamp.fromDate(new Date()),
          proximaRecompensa,
          lastPassUpdate: Timestamp.fromDate(new Date())
        });
      }

      console.log('Enviando solicitud de actualización de pase para cliente:', id);
      
      const response = await axios.post(`${BASE_URL}/api/push/update-pass`, 
        { clienteId: id },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 10000
        }
      );

      console.log('Respuesta de actualización:', response.data);

    } catch (error) {
      console.error('Error en registrarVisita:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error de red:', error.response?.data || error.message);
      }
      throw new Error('Error al procesar la visita. Por favor, intenta de nuevo.');
    }
  },

  async obtenerClientes(): Promise<Cliente[]> {
    const querySnapshot = await getDocs(collection(db, 'clientes'));
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono || '',
        visitas: data.visitas || 0,
        ultimaVisita: data.ultimaVisita.toDate(),
        fechaRegistro: data.fechaRegistro.toDate(),
        proximaRecompensa: data.proximaRecompensa || 'Postre Gratis',
        recompensasCanjeadas: data.recompensasCanjeadas || [],
        pushToken: data.pushToken || null,
        deviceLibraryIdentifier: data.deviceLibraryIdentifier || null,
        passTypeIdentifier: data.passTypeIdentifier || null,
        lastPassUpdate: data.lastPassUpdate ? data.lastPassUpdate.toDate() : null
      } as Cliente;
    });
  }
};