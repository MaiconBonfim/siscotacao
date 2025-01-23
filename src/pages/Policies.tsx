import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { Policy, Vehicle, Client, loadData, saveData } from '../data/database';

const Policies = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  const [newPolicy, setNewPolicy] = useState<Omit<Policy, 'id'>>({
    vehiclePlate: '',
    clientId: '',
    startDate: '',
    endDate: '',
    value: '',
  });

  useEffect(() => {
    const data = loadData();
    setPolicies(data.policies);
    setVehicles(data.vehicles);
    setClients(data.clients);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPolicy) {
      const updatedPolicies = policies.map(policy => 
        policy.id === editingPolicy.id ? { ...policy, ...newPolicy } : policy
      );
      setPolicies(updatedPolicies);
      const data = loadData();
      saveData({ ...data, policies: updatedPolicies });
    } else {
      const newPolicyWithId = { ...newPolicy, id: Date.now().toString() };
      const updatedPolicies = [...policies, newPolicyWithId];
      setPolicies(updatedPolicies);
      const data = loadData();
      saveData({ ...data, policies: updatedPolicies });
    }
    setNewPolicy({ vehiclePlate: '', clientId: '', startDate: '', endDate: '', value: '' });
    setShowForm(false);
    setEditingPolicy(null);
  };

  const handleEdit = (policy: Policy) => {
    setEditingPolicy(policy);
    setNewPolicy({
      vehiclePlate: policy.vehiclePlate,
      clientId: policy.clientId,
      startDate: policy.startDate,
      endDate: policy.endDate,
      value: policy.value,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    const updatedPolicies = policies.filter(policy => policy.id !== id);
    setPolicies(updatedPolicies);
    const data = loadData();
    saveData({ ...data, policies: updatedPolicies });
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Cliente não encontrado';
  };

  const getClientVehicles = (clientId: string) => {
    return vehicles.filter(v => v.clientId === clientId);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Apólices</h1>
        <button
          onClick={() => {
            setEditingPolicy(null);
            setNewPolicy({ vehiclePlate: '', clientId: '', startDate: '', endDate: '', value: '' });
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          <Plus size={20} />
          Nova Apólice
        </button>
      </div>

      {showForm && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">
            {editingPolicy ? 'Editar Apólice' : 'Adicionar Nova Apólice'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cliente
              </label>
              <select
                value={newPolicy.clientId}
                onChange={(e) => {
                  setNewPolicy({
                    ...newPolicy,
                    clientId: e.target.value,
                    vehiclePlate: '',
                  });
                }}
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
                Veículo
              </label>
              <select
                value={newPolicy.vehiclePlate}
                onChange={(e) => setNewPolicy({ ...newPolicy, vehiclePlate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
                disabled={!newPolicy.clientId}
              >
                <option value="">Selecione um veículo</option>
                {getClientVehicles(newPolicy.clientId).map(vehicle => (
                  <option key={vehicle.id} value={vehicle.plate}>
                    {vehicle.plate} - {vehicle.model}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Início
              </label>
              <input
                type="date"
                value={newPolicy.startDate}
                onChange={(e) => setNewPolicy({ ...newPolicy, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Término
              </label>
              <input
                type="date"
                value={newPolicy.endDate}
                onChange={(e) => setNewPolicy({ ...newPolicy, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor
              </label>
              <input
                type="text"
                value={newPolicy.value}
                onChange={(e) => setNewPolicy({ ...newPolicy, value: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
                placeholder="R$ 0,00"
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
                  setEditingPolicy(null);
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
        {policies.map((policy) => (
          <div key={policy.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Veículo: {policy.vehiclePlate}
                </h3>
                <p className="text-sm text-gray-600">
                  Cliente: {getClientName(policy.clientId)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(policy)}
                  className="text-gray-600 hover:text-primary-600"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDelete(policy.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <div className="space-y-2 text-gray-600">
              <p>Início: {new Date(policy.startDate).toLocaleDateString()}</p>
              <p>Término: {new Date(policy.endDate).toLocaleDateString()}</p>
              <p>Valor: {policy.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Policies;