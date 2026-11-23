import React, { useEffect } from 'react';
import { WorkshopProvider, useWorkshop } from './context/WorkshopContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { PartsView } from './components/parts/PartsView';
import { PartModal } from './components/parts/PartModal';
import { StockMovementModal } from './components/parts/StockMovementModal';
import { CheckInFormView } from './components/checkin/CheckInFormView';
import { OrdersListView } from './components/checkin/OrdersListView';
import { ShelfLocatorView } from './components/shelves/ShelfLocatorView';
import { SuppliersView } from './components/suppliers/SuppliersView';
import { ExtensionProjectView } from './components/extension/ExtensionProjectView';
import { ToastContainer } from './components/common/ToastContainer';

const MainContent: React.FC = () => {
  const { activeTab } = useWorkshop();
  useEffect(() => { window.scrollTo(0, 0); }, [activeTab]);

  return (
    <main className="workmain">
      {activeTab === 'dashboard' && <DashboardView />}
      {activeTab === 'parts' && <PartsView />}
      {activeTab === 'checkin-new' && <CheckInFormView />}
      {activeTab === 'orders' && <OrdersListView />}
      {activeTab === 'shelves' && <ShelfLocatorView />}
      {activeTab === 'suppliers' && <SuppliersView />}
      {activeTab === 'extension-info' && <ExtensionProjectView />}
    </main>
  );
};

function MovementDialog() {
  const { isMovementModalOpen } = useWorkshop();
  return isMovementModalOpen ? <StockMovementModal /> : null;
}

export function App() {
  return (
    <WorkshopProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-slate-950">
        {/* Barra Superior */}
        <Navbar />

        {/* Layout Principal com Sidebar e Área de Trabalho */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
          <Sidebar />
          <MainContent />
        </div>

        {/* Modais Globais de Peças e Movimentações */}
        <PartModal />
        <MovementDialog />

        {/* Notificações Toasts */}
        <ToastContainer />
      </div>
    </WorkshopProvider>
  );
}

export default App;
