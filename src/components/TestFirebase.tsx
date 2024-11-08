import React, { useState, useEffect } from 'react';
import { clienteService } from '../services/clienteService';
import { Cliente } from '../types';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const TestFirebase: React.FC = () => {
  const [mensaje, setMensaje] = useState<string>('');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Función para probar la conexión
  const probarConexion = async () => {
    try {
      console.log('Probando conexión a Firestore...');
      const coleccionRef = collection(db, 'test');
      const docRef = await addDoc(coleccionRef, {
        test: true,
        timestamp: new Date()
      });
      console.log('Conexión exitosa, documento creado:', docRef.id);
      setMensaje('Conexión a Firebase exitosa');
    } catch (error) {
      console.error('Error de conexión:', error);
      setError(`Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  // Función para probar la creación de un cliente
  const probarCrearCliente = async () => {
    try {
      console.log('1. Iniciando creación de cliente...');
      setLoading(true);
      setError('');
      setMensaje('');
      
      console.log('2. Preparando datos del cliente...');
      const nuevoCliente = {
        nombre: "Cliente Prueba",
        email: "prueba@test.com",
        telefono: "1234567890",
        visitas: 0,
        ultimaVisita: new Date(),
        serialNumber: "TEST123",
        fechaRegistro: new Date(),
        proximaRecompensa: "Postre Gratis (5 visitas)",
        recompensasCanjeadas: []
      };

      console.log('3. Datos del cliente preparados:', nuevoCliente);
      console.log('4. Intentando crear cliente en Firestore...');
      
      const id = await clienteService.crearCliente(nuevoCliente);
      console.log('5. Cliente creado exitosamente con ID:', id);
      
      setMensaje(`Cliente creado exitosamente con ID: ${id}`);
      await cargarClientes();
    } catch (error) {
      console.error('Error completo:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Mensaje de error:', errorMessage);
      setError(`Error al crear cliente: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar todos los clientes
  const cargarClientes = async () => {
    try {
      console.log('Iniciando carga de clientes...');
      const clientesData = await clienteService.obtenerClientes();
      console.log('Clientes obtenidos:', clientesData);
      setClientes(clientesData);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      setError(`Error al cargar clientes: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  // Cargar clientes al montar el componente
  useEffect(() => {
    cargarClientes();
  }, []);

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-leu-green mb-6">
          Prueba de Firebase
        </h1>

        <button
          onClick={probarConexion}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg mb-4"
        >
          Probar Conexión
        </button>

        <button
          onClick={probarCrearCliente}
          disabled={loading}
          className="w-full py-2 px-4 bg-leu-green text-white rounded-lg mb-4"
        >
          {loading ? 'Procesando...' : 'Crear Cliente de Prueba'}
        </button>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700">
            {error}
          </div>
        )}

        {mensaje && (
          <div className="mb-4 p-3 rounded-lg bg-blue-50 text-blue-700">
            {mensaje}
          </div>
        )}

        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Clientes en Base de Datos:</h2>
          {clientes.length === 0 ? (
            <p className="text-gray-500">No hay clientes registrados</p>
          ) : (
            <ul className="space-y-2">
              {clientes.map((cliente) => (
                <li key={cliente.id} className="p-3 bg-gray-50 rounded">
                  <p className="font-bold">{cliente.nombre}</p>
                  <p className="text-sm text-gray-600">{cliente.email}</p>
                  <p className="text-sm text-gray-600">Visitas: {cliente.visitas}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestFirebase;