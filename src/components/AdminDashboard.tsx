import React, { useState, useEffect } from 'react';
import { clienteService } from '../services/clienteService';
import { Cliente } from '../types';

interface Estadisticas {
  totalClientes: number;
  visitasHoy: number;
  recompensasDisponibles: number;
  clientesNuevosMes: number;
}

const AdminDashboard: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [estadisticas, setEstadisticas] = useState<Estadisticas>({
    totalClientes: 0,
    visitasHoy: 0,
    recompensasDisponibles: 0,
    clientesNuevosMes: 0
  });
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const clientesData = await clienteService.obtenerClientes();
      setClientes(clientesData);
      
      // Calcular estadísticas
      const hoy = new Date();
      const visitasHoy = clientesData.filter(cliente => 
        cliente.ultimaVisita.toDateString() === hoy.toDateString()
      ).length;

      const recompensasDisponibles = clientesData.filter(cliente => {
        const visitas = cliente.visitas;
        return visitas === 4 || visitas === 9 || visitas === 14 || visitas === 19 || visitas === 24;
      }).length;

      const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
      const clientesNuevosMes = clientesData.filter(cliente => 
        cliente.fechaRegistro >= inicioMes
      ).length;

      setEstadisticas({
        totalClientes: clientesData.length,
        visitasHoy,
        recompensasDisponibles,
        clientesNuevosMes
      });

      
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    cliente.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-leu-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-leu-green text-center mb-8">
          Panel de Administración Leu Beauty
        </h1>

        {/* Tarjetas de Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-600">Total Clientes</h3>
            <p className="text-3xl font-bold text-leu-green">{estadisticas.totalClientes}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-600">Visitas Hoy</h3>
            <p className="text-3xl font-bold text-leu-green">{estadisticas.visitasHoy}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-600">Próximas Recompensas</h3>
            <p className="text-3xl font-bold text-leu-green">{estadisticas.recompensasDisponibles}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-600">Nuevos este Mes</h3>
            <p className="text-3xl font-bold text-leu-green">{estadisticas.clientesNuevosMes}</p>
          </div>
        </div>

        {/* Buscador */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <input
            type="text"
            placeholder="Buscar cliente por nombre o email..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-leu-green"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* Lista de Clientes */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visitas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Próxima Recompensa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última Visita
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clientesFiltrados.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{cliente.nombre}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{cliente.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{cliente.visitas}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{cliente.proximaRecompensa}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {cliente.ultimaVisita.toLocaleDateString('es-MX', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <footer className="text-center py-4">
        <p className="text-xs text-gray-600 italic">
          Desarrollado por Julio T. para el amor de su vida ❤️
        </p>
      </footer>
    </div>
  );
};

export default AdminDashboard;