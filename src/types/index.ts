export interface Cliente {
    id: string;
    nombre: string;
    email: string;
    telefono?: string;
    visitas: number;
    ultimaVisita: Date;
    serialNumber: string;
    fechaRegistro: Date;
    proximaRecompensa: string;
    recompensasCanjeadas: string[];
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