import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { Claim, loadData, saveData } from '../data/database';

const Claims = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingClaim, setEditingClaim] = useState<Claim | null>(null);
  const [newClaim, setNewClaim] = useState<Omit<Claim, 'id'>>({
    vehiclePlate: '',
    clientId: '',
    date: '',
    description: '',
    status: 'Pendente',
  });

  useEffect(() => {
    const data = loadData();
    setClaims(data.claims);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClaim) {
      const updatedClaims = claims.map(claim => 
        claim.id === editingClaim.id ? { ...claim, ...newClaim } : claim
      );
      setClaims(updatedClaims);
      const data = loadData();
      saveData({ ...data, claims: updatedClaims });
    } else {
      const newClaimWithId = { ...newClaim, id: Date.now().toString() };
      const updatedClaims = [...claims, newClaimWithId];
      setClaims(updatedClaims);
      const data = loadData();
      saveData({ ...data, claims: updatedClaims });
    }
    setNewClaim({ vehiclePlate: '', clientId: '', date: '', description: '', status: 'Pendente' });
    setShowForm(false);
    setEditingClaim(null);
  };

  const handleEdit = (claim: Claim) => {
    setEditingClaim(claim);
    setNewClaim({
      vehiclePlate: claim.vehiclePlate,
      clientId: claim.clientId,
      date: claim.date,
      description: claim.description,
      status: claim.status,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    const updatedClaims = claims.filter(claim => claim.id !== id);
    setClaims(updatedClaims);
    const data = loadData();
    saveData({ ...data, claims: updatedClaims });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sinistros</h1>
        <button
          onClick={() => {
            setEditingClaim(null);
            setNewClaim({ vehiclePlate: '', clientId: '', date: '', description: '', status: 'Pendente' });
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          <Plus size={20} />
          Novo Sinistro
        </button>
      </div>

      {showForm && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">
            {editingClaim ? 'Editar Sinistro' : 'Registrar Novo Sinistro'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Placa do Veículo
              </label>
              <input
                type="text"
                value={newClaim.vehiclePlate}
                onChange={(e) => setNewClaim({ ...newClaim, vehiclePlate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data do Sinistro
              </label>
              <input
                type="date"
                value={newClaim.date}
                onChange={(e) => setNewClaim({ ...newClaim, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                value={newClaim.description}
                onChange={(e) => setNewClaim({ ...newClaim, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={newClaim.status}
                onChange={(e) => setNewClaim({ ...newClaim, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="Pendente">Pendente</option>
                <option value="Em análise">Em análise</option>
                <option value="Concluído">Concluído</option>
              </select>
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
                  setEditingClaim(null);
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
        {claims.map((claim) => (
          <div key={claim.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Veículo: {claim.vehiclePlate}
                </h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(claim)}
                  className="text-gray-600 hover:text-primary-600"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDelete(claim.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <div className="space-y-2 text-gray-600">
              <p>Data: {new Date(claim.date).toLocaleDateString()}</p>
              <p>Descrição: {claim.description}</p>
              <p>Status: {claim.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Claims;