export interface Cliente {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  visitas: number;
  ultimaVisita: Date;
  proximaRecompensa: string;
  recompensasCanjeadas: string[];
  fechaRegistro: Date; // Añade esta línea
  pushToken?: string;
  deviceLibraryIdentifier?: string;
  passTypeIdentifier?: string;
  lastPassUpdate?: Date;
}
  
  export interface Recompensa {
    visitas: number;
    descripcion: string;
    canjeada: boolean;
  }
  
  export interface EstadisticasMensuales {
    mes: string;
    totalVisitas: number;
    nuevosClientes: number;
    recompensasCanjeadas: number;
  }