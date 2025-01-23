import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { Vehicle, Client, loadData, saveData } from '../data/database';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [newVehicle, setNewVehicle] = useState<Omit<Vehicle, 'id'>>({
    plate: '',
    model: '',
    year: '',
    color: '',
    clientId: '',
  });

  useEffect(() => {
    const data = loadData();
    setVehicles(data.vehicles);
    setClients(data.clients);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVehicle) {
      const updatedVehicles = vehicles.map(vehicle => 
        vehicle.id === editingVehicle.id ? { ...vehicle, ...newVehicle } : vehicle
      );
      setVehicles(updatedVehicles);
      const data = loadData();
      saveData({ ...data, vehicles: updatedVehicles });
    } else {
      const newVehicleWithId = { ...newVehicle, id: Date.now().toString() };
      const updatedVehicles = [...vehicles, newVehicleWithId];
      setVehicles(updatedVehicles);
      const data = loadData();
      saveData({ ...data, vehicles: updatedVehicles });
    }
    setNewVehicle({ plate: '', model: '', year: '', color: '', clientId: '' });
    setShowForm(false);
    setEditingVehicle(null);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setNewVehicle({
      plate: vehicle.plate,
      model: vehicle.model,
      year: vehicle.year,
      color: vehicle.color,
      clientId: vehicle.clientId,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    const updatedVehicles = vehicles.filter(vehicle => vehicle.id !== id);
    setVehicles(updatedVehicles);
    const data = loadData();
    saveData({ ...data, vehicles: updatedVehicles });
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Cliente não encontrado';
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Veículos</h1>
        <button
          onClick={() => {
            setEditingVehicle(null);
            setNewVehicle({ plate: '', model: '', year: '', color: '', clientId: '' });
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          <Plus size={20} />
          Novo Veículo
        </button>
      </div>

      {showForm && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">
            {editingVehicle ? 'Editar Veículo' : 'Adicionar Novo Veículo'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cliente
              </label>
              <select
                value={newVehicle.clientId}
                onChange={(e) => setNewVehicle({ ...newVehicle, clientId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Selecione um cliente</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name} - CPF: {client.cpf}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Placa
              </label>
              <input
                type="text"
                value={newVehicle.plate}
                onChange={(e) => setNewVehicle({ ...newVehicle, plate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modelo
              </label>
              <input
                type="text"
                value={newVehicle.model}
                onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ano
              </label>
              <input
                type="text"
                value={newVehicle.year}
                onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cor
              </label>
              <input
                type="text"
                value={newVehicle.color}
                onChange={(e) => setNewVehicle({ ...newVehicle, color: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
              >
                Salvar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingVehicle(null);
                }}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{vehicle.plate}</h3>
                <p className="text-sm text-gray-600">
                  Cliente: {getClientName(vehicle.clientId)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(vehicle)}
                  className="text-gray-600 hover:text-primary-600"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDelete(vehicle.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <div className="space-y-2 text-gray-600">
              <p>Modelo: {vehicle.model}</p>
              <p>Ano: {vehicle.year}</p>
              <p>Cor: {vehicle.color}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vehicles;