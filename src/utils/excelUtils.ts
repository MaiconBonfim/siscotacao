import { utils, write, read, WorkBook } from 'xlsx';
import { loadData, saveData } from '../data/database';
import { differenceInDays } from 'date-fns';

interface BackupInfo {
  lastBackupDate: string | null;
  daysSinceLastBackup: number;
}

export const exportToExcel = () => {
  try {
    const data = loadData();
    const workbook = utils.book_new();

    // Create worksheets for each data type
    const clientsWS = utils.json_to_sheet(data.clients);
    const vehiclesWS = utils.json_to_sheet(data.vehicles);
    const policiesWS = utils.json_to_sheet(data.policies);
    const claimsWS = utils.json_to_sheet(data.claims);

    // Add worksheets to workbook with correct names
    utils.book_append_sheet(workbook, clientsWS, 'clients');
    utils.book_append_sheet(workbook, vehiclesWS, 'vehicles');
    utils.book_append_sheet(workbook, policiesWS, 'policies');
    utils.book_append_sheet(workbook, claimsWS, 'claims');

    // Save backup date
    localStorage.setItem('lastBackupDate', new Date().toISOString());

    // Generate Excel file
    const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `autoseguro_backup_${new Date().toISOString().split('T')[0]}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao exportar para Excel:', error);
    throw new Error('Não foi possível exportar os dados para Excel.');
  }
};

export const importFromExcel = async (file: File): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = read(data, { type: 'array' }) as WorkBook;

        // Check for required sheets with correct names
        if (!workbook.Sheets['clients'] || !workbook.Sheets['vehicles'] || 
            !workbook.Sheets['policies'] || !workbook.Sheets['claims']) {
          throw new Error('Arquivo Excel inválido: algumas planilhas estão faltando');
        }

        const importedData = {
          clients: utils.sheet_to_json(workbook.Sheets['clients']),
          vehicles: utils.sheet_to_json(workbook.Sheets['vehicles']),
          policies: utils.sheet_to_json(workbook.Sheets['policies']),
          claims: utils.sheet_to_json(workbook.Sheets['claims']),
        };

        // Validate imported data structure
        if (!Array.isArray(importedData.clients) || !Array.isArray(importedData.vehicles) ||
            !Array.isArray(importedData.policies) || !Array.isArray(importedData.claims)) {
          throw new Error('Estrutura de dados inválida no arquivo Excel');
        }

        saveData(importedData);
        localStorage.setItem('lastBackupDate', new Date().toISOString());
        resolve(true);
      } catch (error) {
        console.error('Erro ao importar Excel:', error);
        reject(new Error('Erro ao importar o arquivo. Verifique se é um arquivo Excel válido.'));
      }
    };

    reader.onerror = (error) => {
      console.error('Erro ao ler arquivo:', error);
      reject(new Error('Erro ao ler o arquivo.'));
    };

    reader.readAsArrayBuffer(file);
  });
};

export const getBackupInfo = (): BackupInfo => {
  const lastBackupDate = localStorage.getItem('lastBackupDate');
  
  if (!lastBackupDate) {
    return {
      lastBackupDate: null,
      daysSinceLastBackup: -1
    };
  }

  const daysSinceLastBackup = differenceInDays(new Date(), new Date(lastBackupDate));
  
  return {
    lastBackupDate,
    daysSinceLastBackup
  };
};