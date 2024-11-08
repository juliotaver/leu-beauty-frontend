import React, { useState } from 'react';
import LoyaltyScanner from './components/LoyaltyScanner';
import AdminDashboard from './components/AdminDashboard';
import NuevoCliente from './components/NuevoCliente';

type View = 'scanner' | 'admin' | 'registro';

function App() {
  const [currentView, setCurrentView] = useState<View>('scanner');

  return (
    <div className="min-h-screen bg-leu-cream">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center space-x-4 py-3">
            <button
              onClick={() => setCurrentView('scanner')}
              className={`px-4 py-2 rounded-lg ${
                currentView === 'scanner' 
                  ? 'bg-leu-green text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Scanner
            </button>
            <button
              onClick={() => setCurrentView('admin')}
              className={`px-4 py-2 rounded-lg ${
                currentView === 'admin' 
                  ? 'bg-leu-green text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Administración
            </button>
            <button
              onClick={() => setCurrentView('registro')}
              className={`px-4 py-2 rounded-lg ${
                currentView === 'registro' 
                  ? 'bg-leu-green text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Nueva Cliente
            </button>
          </div>
        </div>
      </nav>

      {currentView === 'scanner' && <LoyaltyScanner />}
      {currentView === 'admin' && <AdminDashboard />}
      {currentView === 'registro' && <NuevoCliente />}
    </div>
  );
}

export default App;