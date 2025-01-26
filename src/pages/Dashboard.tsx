import React, { useEffect, useState } from 'react';
import { Car, FileText, AlertTriangle, Users, Download, Upload, AlertCircle } from 'lucide-react';
import { loadData } from '../data/database';
import { exportToExcel, importFromExcel, getBackupInfo } from '../utils/excelUtils';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalVehicles: 0,
    activePolicies: 0,
    openClaims: 0,
  });

  const [backupInfo, setBackupInfo] = useState({
    lastBackupDate: null,
    daysSinceLastBackup: -1
  });

  const [importError, setImportError] = useState('');

  useEffect(() => {
    const data = loadData();
    setStats({
      totalClients: data.clients.length,
      totalVehicles: data.vehicles.length,
      activePolicies: data.policies.length,
      openClaims: data.claims.filter(claim => claim.status !== 'Concluído').length,
    });
    setBackupInfo(getBackupInfo());
  }, []);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await importFromExcel(file);
      window.location.reload();
    } catch (error) {
      setImportError('Erro ao importar o arquivo. Verifique se é um arquivo Excel válido.');
      setTimeout(() => setImportError(''), 5000);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex gap-4">
          <div>
            <input
              type="file"
              id="importFile"
              accept=".xlsx"
              className="hidden"
              onChange={handleImport}
            />
            <label
              htmlFor="importFile"
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 cursor-pointer"
            >
              <Upload size={20} />
              Importar Dados
            </label>
          </div>
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
          >
            <Download size={20} />
            Backup dos Dados
          </button>
        </div>
      </div>

      {importError && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{importError}</span>
        </div>
      )}

      {backupInfo.daysSinceLastBackup >= 7 && (
        <div className="mb-6 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative flex items-center">
          <AlertCircle className="mr-2" size={20} />
          <span>
            Atenção: Último backup realizado há {backupInfo.daysSinceLastBackup} dias
            {backupInfo.lastBackupDate && ` (${new Date(backupInfo.lastBackupDate).toLocaleDateString()})`}.
            Recomendamos fazer um novo backup.
          </span>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Total de Clientes</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalClients}</p>
            </div>
            <Users className="h-8 w-8 text-primary-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Veículos Cadastrados</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalVehicles}</p>
            </div>
            <Car className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Apólices Ativas</p>
              <p className="text-2xl font-bold text-gray-800">{stats.activePolicies}</p>
            </div>
            <FileText className="h-8 w-8 text-primary-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Sinistros em Aberto</p>
              <p className="text-2xl font-bold text-gray-800">{stats.openClaims}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Últimas Atividades</h2>
          <div className="space-y-4">
            {stats.openClaims > 0 && (
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-yellow-600"></div>
                <p className="text-gray-600">{stats.openClaims} sinistro(s) aguardando análise</p>
              </div>
            )}
            {stats.activePolicies > 0 && (
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-primary-600"></div>
                <p className="text-gray-600">{stats.activePolicies} apólice(s) ativa(s)</p>
              </div>
            )}
            {stats.totalVehicles > 0 && (
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-600"></div>
                <p className="text-gray-600">{stats.totalVehicles} veículo(s) cadastrado(s)</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Status do Sistema</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Banco de Dados Local</span>
              <span className="text-green-600">Conectado</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Último Backup</span>
              <span className="text-gray-600">
                {backupInfo.lastBackupDate 
                  ? new Date(backupInfo.lastBackupDate).toLocaleDateString()
                  : 'Nunca realizado'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Dias Sem Backup</span>
              <span className={`${backupInfo.daysSinceLastBackup >= 7 ? 'text-yellow-600' : 'text-gray-600'}`}>
                {backupInfo.daysSinceLastBackup >= 0 
                  ? `${backupInfo.daysSinceLastBackup} dias`
                  : 'Nunca realizado'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;