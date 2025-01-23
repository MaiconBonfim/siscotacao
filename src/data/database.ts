// Simulated database
export interface Client {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  year: string;
  color: string;
  clientId: string;
}

export interface Policy {
  id: string;
  vehiclePlate: string;
  clientId: string;
  startDate: string;
  endDate: string;
  value: string;
}

export interface Claim {
  id: string;
  vehiclePlate: string;
  clientId: string;
  date: string;
  description: string;
  status: 'Pendente' | 'Em análise' | 'Concluído';
}

// Initial data
export const initialData = {
  clients: [
    {
      id: '1',
      name: 'João Silva',
      cpf: '123.456.789-00',
      email: 'joao@email.com',
      phone: '(11) 99999-9999',
    },
  ],
  vehicles: [
    {
      id: '1',
      plate: 'ABC-1234',
      model: 'Toyota Corolla',
      year: '2022',
      color: 'Prata',
      clientId: '1',
    },
  ],
  policies: [
    {
      id: '1',
      vehiclePlate: 'ABC-1234',
      clientId: '1',
      startDate: '2024-01-01',
      endDate: '2025-01-01',
      value: 'R$ 2.500,00',
    },
  ],
  claims: [
    {
      id: '1',
      vehiclePlate: 'ABC-1234',
      clientId: '1',
      date: '2024-02-15',
      description: 'Colisão traseira na Av. Principal',
      status: 'Em análise',
    },
  ],
};

// Load data from localStorage or use initial data
export const loadData = () => {
  const savedData = localStorage.getItem('insuranceData');
  return savedData ? JSON.parse(savedData) : initialData;
};

// Save data to localStorage
export const saveData = (data: typeof initialData) => {
  localStorage.setItem('insuranceData', JSON.stringify(data));
};