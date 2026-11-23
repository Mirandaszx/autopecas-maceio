import type { Part, PreServiceCheckIn, StockMovement, Supplier } from '../types';

export const INITIAL_PARTS: Part[] = [
  {
    id: 'part-1',
    code: 'FLT-OC90',
    name: 'Filtro de Óleo Blindado',
    category: 'Filtros',
    manufacturer: 'Mahle / Metal Leve',
    compatibility: [
      { make: 'Volkswagen', model: 'Gol G5/G6', yearRange: '2008 - 2018', engine: '1.0 / 1.6 EA111' },
      { make: 'Volkswagen', model: 'Fox', yearRange: '2004 - 2020', engine: '1.0 / 1.6' },
      { make: 'Volkswagen', model: 'Voyage', yearRange: '2009 - 2021', engine: '1.0 / 1.6' }
    ],
    location: { aisle: 'Corredor A', shelf: 'Prateleira 1', bin: 'Gaveta A1-04' },
    currentStock: 18,
    minStock: 8,
    costPrice: 22.50,
    sellingPrice: 45.00,
    unit: 'UN',
    notes: 'Item de alto giro semanal em Maceió para revisão de frotas.',
    criticalMaceioWeather: false,
    lastUpdated: '2026-10-04'
  },
  {
    id: 'part-2',
    code: 'LUB-5W30S',
    name: 'Óleo Motor 5W30 100% Sintético API SP (1L)',
    category: 'Lubrificantes e Fluidos',
    manufacturer: 'Petronas Syntium',
    compatibility: [
      { make: 'Chevrolet', model: 'Onix', yearRange: '2013 - 2024', engine: '1.0 / 1.4 SPE4 e Turbo' },
      { make: 'Hyundai', model: 'HB20', yearRange: '2012 - 2024', engine: '1.0 12V Kappa' },
      { make: 'Fiat', model: 'Argo / Cronos', yearRange: '2017 - 2024', engine: '1.0 / 1.3 Firefly' }
    ],
    location: { aisle: 'Corredor A', shelf: 'Prateleira 2', bin: 'Caixa Tambor 02' },
    currentStock: 42,
    minStock: 20,
    costPrice: 38.00,
    sellingPrice: 65.00,
    unit: 'LT',
    notes: 'Exigido em 70% das manutenções preventivas.',
    criticalMaceioWeather: false,
    lastUpdated: '2026-10-05'
  },
  {
    id: 'part-3',
    code: 'FRK-PD58',
    name: 'Jogo de Pastilhas de Freio Dianteiras Cerâmica',
    category: 'Freios',
    manufacturer: 'Fras-le',
    compatibility: [
      { make: 'Fiat', model: 'Strada', yearRange: '2015 - 2023', engine: '1.4 Fire / 1.3 Firefly' },
      { make: 'Fiat', model: 'Palio', yearRange: '2012 - 2018', engine: '1.0 / 1.4' },
      { make: 'Fiat', model: 'Uno Vivace', yearRange: '2010 - 2021', engine: '1.0 Fire' }
    ],
    location: { aisle: 'Corredor B', shelf: 'Prateleira 1', bin: 'Gaveta B1-12' },
    currentStock: 3,
    minStock: 6,
    costPrice: 75.00,
    sellingPrice: 140.00,
    unit: 'JOGO',
    notes: 'ESTOQUE BAIXO! Necessário pedido urgente.',
    criticalMaceioWeather: true,
    lastUpdated: '2026-10-03'
  },
  {
    id: 'part-4',
    code: 'ARF-RAD11',
    name: 'Aditivo para Radiador Concentrado Orgânico Rosa (1L)',
    category: 'Arrefecimento',
    manufacturer: 'Paraflu',
    compatibility: [
      { make: 'Universal', model: 'Linha Leve Flex', yearRange: 'Todos os Anos', engine: 'Universal' }
    ],
    location: { aisle: 'Corredor A', shelf: 'Prateleira 3', bin: 'Gaveta A3-01' },
    currentStock: 14,
    minStock: 10,
    costPrice: 28.00,
    sellingPrice: 48.00,
    unit: 'LT',
    notes: 'Crucial em Maceió devido ao calor tropical e prevenção de oxidação/corrosão por maresia.',
    criticalMaceioWeather: true,
    lastUpdated: '2026-10-06'
  },
  {
    id: 'part-5',
    code: 'AMR-GP32',
    name: 'Par de Amortecedores Dianteiros Turbogás',
    category: 'Suspensão e Direção',
    manufacturer: 'Cofap',
    compatibility: [
      { make: 'Chevrolet', model: 'Onix / Prisma', yearRange: '2013 - 2019', engine: '1.0 / 1.4' }
    ],
    location: { aisle: 'Corredor C', shelf: 'Prateleira 4', bin: 'Palete C4-01' },
    currentStock: 2,
    minStock: 4,
    costPrice: 410.00,
    sellingPrice: 680.00,
    unit: 'KIT',
    notes: 'Desgaste acentuado devido à pavimentação acidentada e lombadas urbanas.',
    criticalMaceioWeather: false,
    lastUpdated: '2026-10-01'
  },
  {
    id: 'part-6',
    code: 'VLG-FR7DC',
    name: 'Jogo de Velas de Ignição Green Plug (4 un)',
    category: 'Elétrica e Ignição',
    manufacturer: 'NGK',
    compatibility: [
      { make: 'Renault', model: 'Sandero / Logan', yearRange: '2014 - 2022', engine: '1.0 16V / 1.6 8V Hi-Flex' },
      { make: 'Renault', model: 'Kwid', yearRange: '2017 - 2023', engine: '1.0 12V 3 Cilindros' }
    ],
    location: { aisle: 'Corredor B', shelf: 'Prateleira 2', bin: 'Gaveta B2-05' },
    currentStock: 11,
    minStock: 5,
    costPrice: 65.00,
    sellingPrice: 125.00,
    unit: 'JOGO',
    notes: 'Revisão periódica a cada 20.000 km.',
    criticalMaceioWeather: false,
    lastUpdated: '2026-10-02'
  },
  {
    id: 'part-7',
    code: 'COR-CT1049',
    name: 'Kit Correia Dentada e Tensor',
    category: 'Motor e Transmissão',
    manufacturer: 'Continental / Contitech',
    compatibility: [
      { make: 'Volkswagen', model: 'Gol / Voyage / Saveiro', yearRange: '2009 - 2020', engine: '1.6 8V EA111' },
      { make: 'Volkswagen', model: 'Fox / CrossFox', yearRange: '2008 - 2019', engine: '1.6 8V' }
    ],
    location: { aisle: 'Corredor B', shelf: 'Prateleira 3', bin: 'Gaveta B3-08' },
    currentStock: 1,
    minStock: 3,
    costPrice: 135.00,
    sellingPrice: 245.00,
    unit: 'KIT',
    notes: 'ALERTA: Apenas 1 unidade! Recomenda-se repor imediatamente.',
    criticalMaceioWeather: true,
    lastUpdated: '2026-10-06'
  },
  {
    id: 'part-8',
    code: 'DIS-DF1455',
    name: 'Disco de Freio Dianteiro Ventilado (Par)',
    category: 'Freios',
    manufacturer: 'Fremax',
    compatibility: [
      { make: 'Toyota', model: 'Corolla', yearRange: '2015 - 2021', engine: '1.8 / 2.0 Dual VVT-i' }
    ],
    location: { aisle: 'Corredor B', shelf: 'Prateleira 1', bin: 'Gaveta B1-20' },
    currentStock: 4,
    minStock: 2,
    costPrice: 210.00,
    sellingPrice: 360.00,
    unit: 'KIT',
    notes: 'Acabamento protetor anti-ferrugem reforçado para áreas litorâneas.',
    criticalMaceioWeather: true,
    lastUpdated: '2026-09-29'
  },
  {
    id: 'part-9',
    code: 'FLT-C29012',
    name: 'Filtro de Ar do Motor',
    category: 'Filtros',
    manufacturer: 'Mann Filter',
    compatibility: [
      { make: 'Jeep', model: 'Renegade / Compass', yearRange: '2016 - 2023', engine: '1.8 Flex / 2.0 Diesel' },
      { make: 'Fiat', model: 'Toro', yearRange: '2016 - 2023', engine: '1.8 Flex' }
    ],
    location: { aisle: 'Corredor A', shelf: 'Prateleira 1', bin: 'Gaveta A1-19' },
    currentStock: 9,
    minStock: 4,
    costPrice: 34.00,
    sellingPrice: 65.00,
    unit: 'UN',
    notes: 'Inspeção recomendada em períodos de pouca chuva e poeira.',
    criticalMaceioWeather: false,
    lastUpdated: '2026-10-05'
  },
  {
    id: 'part-10',
    code: 'PLH-AER24',
    name: 'Palheta do Limpador de Parabrisa Silicone (Par)',
    category: 'Acessórios e Fixação',
    manufacturer: 'Dyna',
    compatibility: [
      { make: 'Universal', model: 'Encaixe Gancho 24"/16"', yearRange: 'Universal', engine: 'Universal' }
    ],
    location: { aisle: 'Corredor D', shelf: 'Prateleira 1', bin: 'Gaveta D1-02' },
    currentStock: 16,
    minStock: 8,
    costPrice: 26.00,
    sellingPrice: 55.00,
    unit: 'PAR',
    notes: 'Resistente à maresia e sol intenso de Alagoas.',
    criticalMaceioWeather: true,
    lastUpdated: '2026-10-03'
  }
];

export const INITIAL_ORDERS: PreServiceCheckIn[] = [
  {
    id: 'ord-101',
    orderNumber: 'OS-2026-0041',
    date: '2026-10-06 08:30',
    status: 'EM_EXECUCAO',
    customer: {
      name: 'Carlos Alberto Ferreira',
      phone: '(82) 99341-8820',
      address: 'Rua Deputado José Lages, Ponta Verde',
      city: 'Maceió - AL'
    },
    vehicle: {
      year: '2021',
      make: 'Chevrolet',
      model: 'Onix Plus Premier',
      licensePlate: 'QTT-4H12',
      vin: '9BGKL69T0M1209384',
      color: 'Prata',
      mileage: '48.250 km'
    },
    requestedServices: {
      changeOilFilter: true,
      lubrication: true,
      frontAlignment: true,
      transmissionOil: false,
      wheelBearings: false,
      tireRotation: true,
      wheelBalance: true,
      checkBrakes: true,
      checkAC: true,
      checkHeater: false,
      checkExhaust: false,
      engineTuneUp: false,
      checkCooling: false,
      serviceTransmission: false,
      safetyInspection: true,
      engineOilLeak: false,
      checkShocksSteering: false
    },
    drivabilityIssues: {
      engineRunsErratic: false,
      engineWillNotStart: false,
      engineNoise: false,
      stallsBraking: false,
      roadTestRequested: false,
      hardStartCold: false,
      hardStartHot: false,
      roughIdle: false,
      noStarterAction: false,
      stallsTurning: false,
      engineStalls: false,
      cranksNoStart: false,
      engineRunsTurnedOff: false,
      exhaustSmokes: false,
      brakesPullToOneSide: true
    },
    otherConcerns: 'Cliente relata leve vibração no volante ao frear acima de 70 km/h na Av. Fernandes Lima.',
    allocatedParts: [
      {
        partId: 'part-2',
        code: 'LUB-5W30S',
        name: 'Óleo Motor 5W30 100% Sintético API SP (1L)',
        quantity: 4,
        unitPrice: 65.00,
        totalPrice: 260.00
      },
      {
        partId: 'part-1',
        code: 'FLT-OC90',
        name: 'Filtro de Óleo Blindado',
        quantity: 1,
        unitPrice: 45.00,
        totalPrice: 45.00
      }
    ],
    estimatedLaborCost: 180.00,
    totalCost: 485.00,
    technicianName: 'Mecânico Patrick (Oficina Parceira)'
  },
  {
    id: 'ord-102',
    orderNumber: 'OS-2026-0042',
    date: '2026-10-06 10:15',
    status: 'AGUARDANDO_PECAS',
    customer: {
      name: 'Mariana Duarte Silva',
      phone: '(82) 98822-1409',
      address: 'Av. Dr. Antônio Gouveia, Pajuçara',
      city: 'Maceió - AL'
    },
    vehicle: {
      year: '2019',
      make: 'Fiat',
      model: 'Strada Working 1.4',
      licensePlate: 'QLS-9281',
      vin: '9BD278297K8192031',
      color: 'Branca',
      mileage: '94.600 km'
    },
    requestedServices: {
      changeOilFilter: false,
      lubrication: false,
      frontAlignment: false,
      transmissionOil: false,
      wheelBearings: true,
      tireRotation: false,
      wheelBalance: false,
      checkBrakes: true,
      checkAC: false,
      checkHeater: false,
      checkExhaust: false,
      engineTuneUp: false,
      checkCooling: true,
      serviceTransmission: false,
      safetyInspection: true,
      engineOilLeak: false,
      checkShocksSteering: true
    },
    drivabilityIssues: {
      engineRunsErratic: false,
      engineWillNotStart: false,
      engineNoise: true,
      stallsBraking: true,
      roadTestRequested: true,
      hardStartCold: false,
      hardStartHot: false,
      roughIdle: false,
      noStarterAction: false,
      stallsTurning: false,
      engineStalls: false,
      cranksNoStart: false,
      engineRunsTurnedOff: false,
      exhaustSmokes: false,
      brakesPullToOneSide: false
    },
    otherConcerns: 'Chiado metálico constante na roda dianteira esquerda ao passar por poças ou maresia.',
    allocatedParts: [
      {
        partId: 'part-3',
        code: 'FRK-PD58',
        name: 'Jogo de Pastilhas de Freio Dianteiras Cerâmica',
        quantity: 1,
        unitPrice: 140.00,
        totalPrice: 140.00
      }
    ],
    estimatedLaborCost: 120.00,
    totalCost: 260.00,
    technicianName: 'Mecânico Erick'
  }
];

export const INITIAL_MOVEMENTS: StockMovement[] = [
  {
    id: 'mov-1',
    partId: 'part-2',
    partCode: 'LUB-5W30S',
    partName: 'Óleo Motor 5W30 100% Sintético API SP (1L)',
    type: 'SAIDA',
    quantity: 4,
    previousStock: 46,
    newStock: 42,
    reason: 'Alocado para OS-2026-0041 (Onix Plus Premier)',
    technician: 'Patrick',
    date: '2026-10-06 09:10',
    serviceOrderId: 'OS-2026-0041'
  },
  {
    id: 'mov-2',
    partId: 'part-1',
    partCode: 'FLT-OC90',
    partName: 'Filtro de Óleo Blindado',
    type: 'SAIDA',
    quantity: 1,
    previousStock: 19,
    newStock: 18,
    reason: 'Alocado para OS-2026-0041',
    technician: 'Patrick',
    date: '2026-10-06 09:12',
    serviceOrderId: 'OS-2026-0041'
  },
  {
    id: 'mov-3',
    partId: 'part-4',
    partCode: 'ARF-RAD11',
    partName: 'Aditivo para Radiador Concentrado Orgânico Rosa (1L)',
    type: 'ENTRADA',
    quantity: 10,
    previousStock: 4,
    newStock: 14,
    reason: 'Recebimento de Nota Fiscal Fornecedor #4829',
    technician: 'Gabriel (Estoque)',
    date: '2026-10-05 15:40'
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Alagoas Autopeças Distribuidora',
    cnpj: '12.456.789/0001-30',
    phone: '(82) 3321-4400',
    email: 'comercial@alagoasautopecas.com.br',
    contactPerson: 'Eduardo Medeiros',
    categoriesSupplied: ['Filtros', 'Freios', 'Lubrificantes e Fluidos'],
    averageDeliveryDays: 1,
    city: 'Maceió - Tabuleiro do Martins'
  },
  {
    id: 'sup-2',
    name: 'Nordeste Componentes & Suspensão',
    cnpj: '08.987.654/0001-92',
    phone: '(82) 3223-9988',
    email: 'pedidos@nordestecomponentes.com.br',
    contactPerson: 'Cláudia Vasconcelos',
    categoriesSupplied: ['Suspensão e Direção', 'Pneus e Rodas'],
    averageDeliveryDays: 2,
    city: 'Maceió - Poço'
  },
  {
    id: 'sup-3',
    name: 'Brasil Peças Automotivas Brasil',
    cnpj: '03.112.334/0001-55',
    phone: '(81) 3450-1000',
    email: 'atendimento@brasilpecas.com.br',
    contactPerson: 'Roberto Cavalcanti',
    categoriesSupplied: ['Motor e Transmissão', 'Elétrica e Ignição', 'Arrefecimento'],
    averageDeliveryDays: 3,
    city: 'Recife / Distribuição Maceió'
  }
];
