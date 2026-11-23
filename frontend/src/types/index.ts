export type PartCategory =
  | 'Lubrificantes e Fluidos'
  | 'Freios'
  | 'Suspensão e Direção'
  | 'Motor e Transmissão'
  | 'Filtros'
  | 'Arrefecimento'
  | 'Elétrica e Ignição'
  | 'Pneus e Rodas'
  | 'Acessórios e Fixação';

export interface VehicleCompatibility {
  make: string;      // ex: Fiat, Chevrolet, Volkswagen
  model: string;     // ex: Palio, Onix, Gol
  yearRange: string; // ex: 2014 - 2022
  engine?: string;   // ex: 1.0 Fire, 1.4 Econoflex
}

export interface StorageLocation {
  aisle: string;     // Corredor (ex: Corredor A)
  shelf: string;     // Prateleira (ex: Prateleira 2)
  bin: string;       // Gaveta/Caixa (ex: Gaveta B4)
}

export interface Part {
  id: string;
  code: string;           // Código de Fábrica / SKU (ex: OC-90, PF-523)
  name: string;           // Nome da peça
  category: PartCategory;
  manufacturer: string;   // Fabricante (ex: Bosch, Mahle, Fras-le, Cofap)
  compatibility: VehicleCompatibility[];
  location: StorageLocation;
  currentStock: number;
  minStock: number;
  costPrice: number;      // Preço de custo (R$)
  sellingPrice: number;   // Preço de venda (R$)
  unit: string;           // UN, LT, KIT, JOGO
  notes?: string;
  criticalMaceioWeather?: boolean; // Peça com alto desgaste por maresia/calor em Maceió
  lastUpdated: string;
}

export type MovementType = 'ENTRADA' | 'SAIDA' | 'AJUSTE';

export interface StockMovement {
  id: string;
  partId: string;
  partCode: string;
  partName: string;
  type: MovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  technician: string;
  date: string;
  serviceOrderId?: string;
}

export type ServiceOrderStatus =
  | 'CHECK_IN'
  | 'EM_DIAGNOSTICO'
  | 'AGUARDANDO_PECAS'
  | 'EM_EXECUCAO'
  | 'FINALIZADO';

export interface AllocatedPart {
  partId: string;
  code: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PreServiceCheckIn {
  id: string;
  orderNumber: string;
  date: string;
  status: ServiceOrderStatus;
  
  // Cliente
  customer: {
    name: string;
    phone: string;
    address: string;
    city: string;
  };

  // Veículo
  vehicle: {
    year: string;
    make: string;
    model: string;
    licensePlate: string;
    vin: string;        // Chassi / VIN
    color: string;
    mileage: string;    // KM atual
  };

  // Serviços Requisitados (Conforme Anexo)
  requestedServices: {
    changeOilFilter: boolean;
    lubrication: boolean;
    frontAlignment: boolean;
    transmissionOil: boolean;
    wheelBearings: boolean;
    tireRotation: boolean;
    wheelBalance: boolean;
    checkBrakes: boolean;
    checkAC: boolean;
    checkHeater: boolean;
    checkExhaust: boolean;
    engineTuneUp: boolean;
    checkCooling: boolean;
    serviceTransmission: boolean;
    safetyInspection: boolean;
    engineOilLeak: boolean;
    checkShocksSteering: boolean;
  };

  // Sintomas / Drivability (Conforme Anexo)
  drivabilityIssues: {
    engineRunsErratic: boolean;
    engineWillNotStart: boolean;
    engineNoise: boolean;
    stallsBraking: boolean;
    roadTestRequested: boolean;
    hardStartCold: boolean;
    hardStartHot: boolean;
    roughIdle: boolean;
    noStarterAction: boolean;
    stallsTurning: boolean;
    engineStalls: boolean;
    cranksNoStart: boolean;
    engineRunsTurnedOff: boolean;
    exhaustSmokes: boolean;
    brakesPullToOneSide: boolean;
  };

  otherConcerns: string;
  
  // Peças Alocadas diretamente do estoque
  allocatedParts: AllocatedPart[];

  // Financeiro
  estimatedLaborCost: number;
  totalCost: number;
  technicianName: string;
}

export interface Supplier {
  id: string;
  name: string;
  cnpj: string;
  phone: string;
  email: string;
  contactPerson: string;
  categoriesSupplied: string[];
  averageDeliveryDays: number;
  city: string;
}
