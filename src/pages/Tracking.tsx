import React, { useState } from 'react';
import { Car } from 'lucide-react';

interface TrackedVehicle {
  id: string;
  plate: string;
  lastUpdate: string;
  status: 'Em movimento' | 'Parado';
  location: string;
}

const Tracking = () => {
  const [vehicles] = useState<TrackedVehicle[]>([
    {
      id: '1',
      plate: 'ABC-1234',
      lastUpdate: '2024-02-20 14:30',
      status: 'Em movimento',
      location: 'Av. Paulista, São Paulo - SP',
    },
    {
      id: '2',
      plate: 'XYZ-5678',
      lastUpdate: '2024-02-20 14:25',
      status: 'Parado',
      location: 'Rua Augusta, São Paulo - SP',
    },
  ]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Rastreamento</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{vehicle.plate}</h3>
              <Car className={`h-6 w-6 ${vehicle.status === 'Em movimento' ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
            <div className="space-y-2 text-gray-600">
              <p>Status: {vehicle.status}</p>
              <p>Localização: {vehicle.location}</p>
              <p>Última atualização: {vehicle.lastUpdate}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Mapa de Rastreamento</h2>
        <div className="bg-gray-100 h-96 rounded-lg flex items-center justify-center text-gray-500">
          Área do mapa - Integrável com Google Maps ou similar
        </div>
      </div>
    </div>
  );
};

export default Tracking;