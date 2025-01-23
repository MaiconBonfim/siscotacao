import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { Client, loadData, saveData } from '../data/database';

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [newClient, setNewClient] = useState<Omit<Client, 'id'>>({
    name: '',
    cpf: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const data = loadData();
    setClients(data.clients);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      const updatedClients = clients.map(client => 
        client.id === editingClient.id ? { ...client, ...newClient } : client
      );
      setClients(updatedClients);
      const data = loadData();
      saveData({ ...data, clients: updatedClients });
    } else {
      const newClientWithId = { ...newClient, id: Date.now().toString() };
      const updatedClients = [...clients, newClientWithId];
      setClients(updatedClients);
      const data = loadData();
      saveData({ ...data, clients: updatedClients });
    }
    setNewClient({ name: '', cpf: '', email: '', phone: '' });
    setShowForm(false);
    setEditingClient(null);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setNewClient({
      name: client.name,
      cpf: client.cpf,
      email: client.email,
      phone: client.phone,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    const updatedClients = clients.filter(client => client.id !== id);
    setClients(updatedClients);
    const data = loadData();
    saveData({ ...data, clients: updatedClients });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
        <button
          onClick={() => {
            setEditingClient(null);
            setNewClient({ name: '', cpf: '', email: '', phone: '' });
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          <Plus size={20} />
          Novo Cliente
        </button>
      </div>

      {showForm && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">
            {editingClient ? 'Editar Cliente' : 'Adicionar Novo Cliente'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CPF
              </label>
              <input
                type="text"
                value={newClient.cpf}
                onChange={(e) => setNewClient({ ...newClient, cpf: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
                placeholder="000.000.000-00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <input
                type="tel"
                value={newClient.phone}
                onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
                placeholder="(00) 00000-0000"
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
                  setEditingClient(null);
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
        {clients.map((client) => (
          <div key={client.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{client.name}</h3>
                <p className="text-sm text-gray-600">CPF: {client.cpf}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(client)}
                  className="text-gray-600 hover:text-primary-600"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDelete(client.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <div className="space-y-2 text-gray-600">
              <p>Email: {client.email}</p>
              <p>Telefone: {client.phone}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clients;