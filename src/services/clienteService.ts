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

export const clienteService = {
  async crearCliente(cliente: Omit<Cliente, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'clientes'), {
      ...cliente,
      fechaRegistro: Timestamp.fromDate(new Date()),
      ultimaVisita: Timestamp.fromDate(new Date()),
      visitas: 0,
      recompensasCanjeadas: []
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
        ...data,
        ultimaVisita: data.ultimaVisita.toDate(),
        fechaRegistro: data.fechaRegistro.toDate()
      } as Cliente;
    } catch (error) {
      console.error('Error al obtener cliente:', error);
      return null;
    }
  },

  async registrarVisita(id: string): Promise<void> {
    const docRef = doc(db, 'clientes', id);
    
    // Obtener los datos actuales con una nueva consulta
    const snapshot = await getDoc(docRef);
    
    if (!snapshot.exists()) {
      throw new Error('Cliente no encontrado');
    }

    const data = snapshot.data();
    const visitasActuales = data.visitas || 0;
    const nuevasVisitas = visitasActuales + 1;
    
    // Determinar la próxima recompensa
    let proximaRecompensa = '';
    
    if (nuevasVisitas >= 25) {
      // Resetear el contador
      await updateDoc(docRef, {
        visitas: 0,
        ultimaVisita: Timestamp.fromDate(new Date()),
        proximaRecompensa: 'Postre Gratis'
      });
    } else {
      // Actualizar normalmente
      if (nuevasVisitas < 5) {
        proximaRecompensa = `Postre Gratis`;
      } else if (nuevasVisitas < 10) {
        proximaRecompensa = `Bebida Gratis`;
      } else if (nuevasVisitas < 15) {
        proximaRecompensa = `Gel Liso en Manos`;
      } else if (nuevasVisitas < 20) {
        proximaRecompensa = `Gel Liso en Pies`;
      } else {
        proximaRecompensa = `10% Off en Uñas`;
      }

      await updateDoc(docRef, {
        visitas: nuevasVisitas,
        ultimaVisita: Timestamp.fromDate(new Date()),
        proximaRecompensa
      });
    }

    // Enviar solicitud al backend para enviar notificación push
    await axios.post(`https://api.leubeautylab.com/api/push/update-pass`, { clienteId: id });
  },

  async obtenerClientes(): Promise<Cliente[]> {
    const querySnapshot = await getDocs(collection(db, 'clientes'));
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        ultimaVisita: data.ultimaVisita.toDate(),
        fechaRegistro: data.fechaRegistro.toDate()
      } as Cliente;
    });
  }
};