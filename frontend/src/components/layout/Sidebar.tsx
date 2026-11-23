import { LayoutDashboard, Boxes, ClipboardPlus, ClipboardList, Warehouse, Truck, GraduationCap, MapPin, Menu } from 'lucide-react';
import { useWorkshop } from '../../context/WorkshopContext';

const groups = [
  { label: 'Oficina', items: [
    { id: 'dashboard', label: 'Visão geral', icon: LayoutDashboard },
    { id: 'checkin-new', label: 'Check-in de veículo', icon: ClipboardPlus },
    { id: 'orders', label: 'Ordens de serviço', icon: ClipboardList },
  ] },
  { label: 'Estoque', items: [
    { id: 'parts', label: 'Catálogo de peças', icon: Boxes },
    { id: 'shelves', label: 'Mapa de prateleiras', icon: Warehouse },
    { id: 'suppliers', label: 'Fornecedores', icon: Truck },
  ] },
  { label: 'Extensão', items: [
    { id: 'extension-info', label: 'Projeto de extensão', icon: GraduationCap },
  ] },
];

export function Sidebar() {
  const { activeTab, setActiveTab, orders } = useWorkshop();
  const activeOrders = orders.filter(order => order.status !== 'FINALIZADO').length;

  return (
    <aside className="worknav">
      <div className="compact-nav"><Menu size={18} /><select aria-label="Navegar pelos módulos" value={activeTab} onChange={event => setActiveTab(event.target.value)}>
        {groups.map(group => <optgroup key={group.label} label={group.label}>
          {group.items.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
        </optgroup>)}
      </select></div>
      <nav aria-label="Menu principal" className="desktop-nav">
        {groups.map(group => <div className="nav-group" key={group.label}>
          <p>{group.label}</p>
          {group.items.map(({ id, label, icon: Icon }) => <button key={id} aria-current={activeTab === id ? 'page' : undefined} onClick={() => setActiveTab(id)}>
            <Icon size={18} /><span>{label}</span>
            {id === 'orders' && activeOrders > 0 && <small aria-label={activeOrders + ' ordens ativas'}>{activeOrders}</small>}
          </button>)}
        </div>)}
      </nav>
      <div className="nav-footer"><MapPin size={17} /><div><strong>Oficina piloto</strong><span>Maceió, Alagoas</span></div></div>
    </aside>
  );
}
