import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Part, PreServiceCheckIn, StockMovement, Supplier, MovementType, ServiceOrderStatus } from '../types';
import { INITIAL_PARTS, INITIAL_ORDERS, INITIAL_MOVEMENTS, INITIAL_SUPPLIERS } from '../data/mockData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface WorkshopContextType {
  parts: Part[];
  orders: PreServiceCheckIn[];
  movements: StockMovement[];
  suppliers: Supplier[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  
  // Modais de Peça e Movimentação
  isPartModalOpen: boolean;
  setIsPartModalOpen: (open: boolean) => void;
  selectedPartForEdit: Part | null;
  setSelectedPartForEdit: (part: Part | null) => void;

  isMovementModalOpen: boolean;
  setIsMovementModalOpen: (open: boolean) => void;
  selectedPartForMovement: Part | null;
  setSelectedPartForMovement: (part: Part | null) => void;

  // Selected Order for View/Print
  selectedOrderForDetail: PreServiceCheckIn | null;
  setSelectedOrderForDetail: (order: PreServiceCheckIn | null) => void;

  // Shelf selected filter
  selectedShelfFilter: string | null;
  setSelectedShelfFilter: (shelf: string | null) => void;

  // Ações CRUD
  addPart: (partData: Omit<Part, 'id' | 'lastUpdated'>) => void;
  updatePart: (part: Part) => void;
  deletePart: (partId: string) => void;
  registerMovement: (
    partId: string,
    type: MovementType,
    quantity: number,
    reason: string,
    technician: string,
    orderId?: string
  ) => boolean;
  
  createCheckInOrder: (orderData: Omit<PreServiceCheckIn, 'id' | 'orderNumber' | 'date'>) => PreServiceCheckIn | null;
  updateOrderStatus: (orderId: string, status: ServiceOrderStatus) => void;

  addSupplier: (supplierData: Omit<Supplier, 'id'>) => void;
  deleteSupplier: (supplierId: string) => void;

  resetToDefaults: () => void;
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
}

const WorkshopContext = createContext<WorkshopContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PARTS: 'oficina_gestao_parts_v1',
  ORDERS: 'oficina_gestao_orders_v1',
  MOVEMENTS: 'oficina_gestao_movements_v1',
  SUPPLIERS: 'oficina_gestao_suppliers_v1'
};

export const WorkshopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [parts, setParts] = useState<Part[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PARTS);
    return saved ? JSON.parse(saved) : INITIAL_PARTS;
  });

  const [orders, setOrders] = useState<PreServiceCheckIn[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [movements, setMovements] = useState<StockMovement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MOVEMENTS);
    return saved ? JSON.parse(saved) : INITIAL_MOVEMENTS;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUPPLIERS);
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const [isPartModalOpen, setIsPartModalOpen] = useState(false);
  const [selectedPartForEdit, setSelectedPartForEdit] = useState<Part | null>(null);

  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [selectedPartForMovement, setSelectedPartForMovement] = useState<Part | null>(null);

  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<PreServiceCheckIn | null>(null);
  const [selectedShelfFilter, setSelectedShelfFilter] = useState<string | null>(null);

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Persistência no LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PARTS, JSON.stringify(parts));
  }, [parts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify(movements));
  }, [movements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(suppliers));
  }, [suppliers]);

  const showToast = (message: string, type: Toast['type'] = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addPart = (partData: Omit<Part, 'id' | 'lastUpdated'>) => {
    const newPart: Part = {
      ...partData,
      id: `part-${Date.now()}`,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setParts((prev) => [newPart, ...prev]);
    showToast(`Peça "${newPart.name}" cadastrada com sucesso!`, 'success');
  };

  const updatePart = (updatedPart: Part) => {
    setParts((prev) =>
      prev.map((p) =>
        p.id === updatedPart.id
          ? { ...updatedPart, lastUpdated: new Date().toISOString().split('T')[0] }
          : p
      )
    );
    showToast(`Peça "${updatedPart.name}" atualizada com sucesso!`, 'info');
  };

  const deletePart = (partId: string) => {
    const part = parts.find((p) => p.id === partId);
    setParts((prev) => prev.filter((p) => p.id !== partId));
    showToast(`Peça "${part?.name || partId}" removida do estoque.`, 'warning');
  };

  const registerMovement = (
    partId: string,
    type: MovementType,
    quantity: number,
    reason: string,
    technician: string,
    orderId?: string
  ): boolean => {
    const partIndex = parts.findIndex((p) => p.id === partId);
    if (partIndex === -1) {
      showToast('Peça não encontrada!', 'error');
      return false;
    }

    const currentPart = parts[partIndex];
    let newStock = currentPart.currentStock;

    if (type === 'ENTRADA') {
      newStock += quantity;
    } else if (type === 'SAIDA') {
      if (currentPart.currentStock < quantity) {
        showToast(
          `Estoque insuficiente! Disponível: ${currentPart.currentStock} ${currentPart.unit}`,
          'error'
        );
        return false;
      }
      newStock -= quantity;
    } else if (type === 'AJUSTE') {
      newStock = quantity;
    }

    // Criar registro da movimentação
    const newMovement: StockMovement = {
      id: 'mov-' + Date.now() + '-' + currentPart.id + '-' + Math.random().toString(36).slice(2),
      partId: currentPart.id,
      partCode: currentPart.code,
      partName: currentPart.name,
      type,
      quantity,
      previousStock: currentPart.currentStock,
      newStock,
      reason,
      technician: technician || 'Equipe Oficina',
      date: new Date().toLocaleString('pt-BR'),
      serviceOrderId: orderId
    };

    setParts(previous => previous.map(part => part.id === partId
      ? { ...part, currentStock: newStock, lastUpdated: new Date().toISOString().split('T')[0] }
      : part));
    setMovements((prev) => [newMovement, ...prev]);

    showToast(
      `Movimentação de ${type.toLowerCase()} registrada com sucesso (${quantity} ${currentPart.unit}).`,
      'success'
    );
    return true;
  };

  const createCheckInOrder = (
    orderData: Omit<PreServiceCheckIn, 'id' | 'orderNumber' | 'date'>
  ): PreServiceCheckIn | null => {
    for (const item of orderData.allocatedParts) {
      const part = parts.find(p => p.id === item.partId);
      if (!part || !Number.isInteger(item.quantity) || item.quantity < 1 || part.currentStock < item.quantity) {
        showToast('Revise a quantidade disponível de ' + item.name + ' antes de salvar.', 'error');
        return null;
      }
    }
    const nextNum = (orders.length + 43).toString().padStart(4, '0');
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newOrder: PreServiceCheckIn = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `OS-2026-${nextNum}`,
      date: formattedDate
    };

    // Baixa automática ou reserva de peças no estoque
    if (orderData.allocatedParts && orderData.allocatedParts.length > 0) {
      orderData.allocatedParts.forEach((item) => {
        registerMovement(
          item.partId,
          'SAIDA',
          item.quantity,
          `Alocado para nova O.S: ${newOrder.orderNumber} (${orderData.vehicle.make} ${orderData.vehicle.model})`,
          orderData.technicianName || 'Atendimento / Check-in',
          newOrder.orderNumber
        );
      });
    }

    setOrders((prev) => [newOrder, ...prev]);
    showToast(`Ficha de Check-In ${newOrder.orderNumber} cadastrada com sucesso!`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: ServiceOrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(`Status da O.S atualizado para "${status}".`, 'info');
  };

  const addSupplier = (supplierData: Omit<Supplier, 'id'>) => {
    const newSupplier: Supplier = {
      ...supplierData,
      id: `sup-${Date.now()}`
    };
    setSuppliers((prev) => [newSupplier, ...prev]);
    showToast(`Fornecedor "${newSupplier.name}" cadastrado!`, 'success');
  };

  const deleteSupplier = (supplierId: string) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== supplierId));
    showToast('Fornecedor removido.', 'warning');
  };

  const resetToDefaults = () => {
    setParts(INITIAL_PARTS);
    setOrders(INITIAL_ORDERS);
    setMovements(INITIAL_MOVEMENTS);
    setSuppliers(INITIAL_SUPPLIERS);
    localStorage.removeItem(STORAGE_KEYS.PARTS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.MOVEMENTS);
    localStorage.removeItem(STORAGE_KEYS.SUPPLIERS);
    showToast('Banco de dados local restaurado para os dados iniciais.', 'info');
  };

  return (
    <WorkshopContext.Provider
      value={{
        parts,
        orders,
        movements,
        suppliers,
        activeTab,
        setActiveTab,
        searchTerm,
        setSearchTerm,
        isPartModalOpen,
        setIsPartModalOpen,
        selectedPartForEdit,
        setSelectedPartForEdit,
        isMovementModalOpen,
        setIsMovementModalOpen,
        selectedPartForMovement,
        setSelectedPartForMovement,
        selectedOrderForDetail,
        setSelectedOrderForDetail,
        selectedShelfFilter,
        setSelectedShelfFilter,
        addPart,
        updatePart,
        deletePart,
        registerMovement,
        createCheckInOrder,
        updateOrderStatus,
        addSupplier,
        deleteSupplier,
        resetToDefaults,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </WorkshopContext.Provider>
  );
};

export const useWorkshop = () => {
  const context = useContext(WorkshopContext);
  if (!context) {
    throw new Error('useWorkshop must be used within a WorkshopProvider');
  }
  return context;
};
