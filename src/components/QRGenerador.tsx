import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { clienteService } from '../services/clienteService';

const QRGenerador: React.FC = () => {
  const [clienteId, setClienteId] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  const crearClientePrueba = async () => {
    try {
      setLoading(true);
      const nuevoCliente = {
        nombre: "Cliente de Prueba",
        email: "prueba@test.com",
        telefono: "1234567890",
        visitas: 0,
        ultimaVisita: new Date(),
        serialNumber: Date.now().toString(),
        fechaRegistro: new Date(),
        proximaRecompensa: "Postre Gratis (5 visitas)",
        recompensasCanjeadas: []
      };

      const id = await clienteService.crearCliente(nuevoCliente);
      setClienteId(id);
      setMensaje('Cliente creado exitosamente');
    } catch (error) {
      setMensaje('Error al crear cliente');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-leu-green mb-4">Generador de QR</h2>
      
      <button
        onClick={crearClientePrueba}
        disabled={loading}
        className="w-full py-2 px-4 bg-leu-green text-white rounded-lg mb-4"
      >
        {loading ? 'Creando...' : 'Crear Cliente de Prueba'}
      </button>

      {clienteId && (
        <div className="text-center">
          <div className="bg-white p-4 rounded-lg shadow-inner mb-4">
            <QRCodeSVG 
              value={clienteId}
              size={256}
              level="H"
              includeMargin={true}
            />
          </div>
          <p className="text-sm text-gray-600">ID: {clienteId}</p>
        </div>
      )}

      {mensaje && (
        <div className={`mt-4 p-3 rounded-lg ${
          mensaje.includes('Error') 
            ? 'bg-red-50 text-red-700' 
            : 'bg-green-50 text-green-700'
        }`}>
          {mensaje}
        </div>
      )}
    </div>
  );
};

export default QRGenerador;