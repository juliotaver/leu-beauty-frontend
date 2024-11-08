import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { apiService, Cliente } from '../services/apiService';

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
}

const NuevoCliente: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    telefono: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [passUrl, setPassUrl] = useState<string>('');
  const [showQR, setShowQR] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setPassUrl('');
    setShowQR(false);
  
    try {
      if (!formData.nombre.trim() || !formData.email.trim()) {
        throw new Error('Por favor completa los campos obligatorios');
      }
  
      // Crear el cliente en Firestore primero
      const nuevoCliente = await apiService.crearCliente({
        nombre: formData.nombre.trim(),
        email: formData.email.toLowerCase().trim(),
        telefono: formData.telefono.trim(),
        visitas: 0,
        ultimaVisita: new Date(),
        proximaRecompensa: "Postre Gratis (faltan 5 visitas)",
        recompensasCanjeadas: []
      });
  
      // Generar el pase con el ID real de Firestore
      const passUrl = await apiService.generarPase(nuevoCliente);
      
      setPassUrl(passUrl);
      setShowQR(true);
      setMessage('¡Cliente registrado exitosamente!');
      
      // Limpiar formulario
      setFormData({
        nombre: '',
        email: '',
        telefono: ''
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Error al registrar cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getFullPassUrl = () => {
    if (!passUrl) return '';
    return `${window.location.protocol}//${window.location.hostname}:3001${passUrl}`;
  };

  return (
    <div className="min-h-screen bg-leu-cream flex flex-col">
      <div className="max-w-md mx-auto w-full px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-leu-green text-center mb-6">
            Registrar Nueva Cliente
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-leu-green"
                placeholder="Nombre completo"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-leu-green"
                placeholder="email@ejemplo.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-leu-green"
                placeholder="(Opcional)"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-leu-green hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-leu-green ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Registrando...' : 'Registrar Cliente'}
            </button>
          </form>

          {message && (
            <div className={`mt-4 p-3 rounded-lg ${
              message.includes('Error') 
                ? 'bg-red-50 text-red-700' 
                : 'bg-green-50 text-green-700'
            }`}>
              {message}
            </div>
          )}

          {showQR && passUrl && (
            <div className="mt-6">
              <div className="text-center bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  ¡Cliente registrado exitosamente!
                </h3>
                <div className="space-y-6">
                  <div className="bg-white p-4 rounded-lg shadow-inner inline-block">
                    <QRCodeSVG 
                      value={getFullPassUrl()}
                      size={200}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    Escanea el código QR para añadir el pase a Apple Wallet
                  </p>
                  <div className="flex flex-col space-y-3">
                    <button
                      onClick={() => {
                        const message = encodeURIComponent(
                          `¡Hola! Aquí está tu pase de fidelidad de Leu Beauty. Click aquí para añadirlo a tu Apple Wallet: ${getFullPassUrl()}`
                        );
                        window.open(`https://wa.me/?text=${message}`, '_blank');
                      }}
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                    >
                      Compartir por WhatsApp
                    </button>
                    <button
                      onClick={() => window.open(getFullPassUrl(), '_blank')}
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Abrir Link Directo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <footer className="text-center py-4 mt-auto">
        <p className="text-xs text-gray-600 italic">
          Desarrollado por Julio T. para el amor de su vida ❤️
        </p>
      </footer>
    </div>
  );
};

export default NuevoCliente;