import { ArrowRight, ClipboardPlus, Layers, MapPin, Waves, PackagePlus, ArrowDownLeft, ArrowUpRight, SlidersHorizontal } from 'lucide-react';
import { useWorkshop } from '../../context/WorkshopContext';
import { OrderStatusBadge } from '../checkin/OrderStatusBadge';

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function DashboardView() {
  const { parts, orders, movements, setActiveTab, setSelectedPartForMovement, setIsMovementModalOpen, setSelectedOrderForDetail,
    setSelectedShelfFilter, setSearchTerm } = useWorkshop();
  const lowStock = parts.filter(p => p.currentStock <= p.minStock).sort((a,b) => a.currentStock - b.currentStock);
  const activeOrders = orders.filter(o => o.status !== 'FINALIZADO');
  const weatherParts = parts.filter(p => p.criticalMaceioWeather);
  const categories = new Map<string, number>();
  for (const part of parts) categories.set(part.category, (categories.get(part.category) ?? 0) + 1);
  const rankedCategories = [...categories].sort((a,b) => b[1] - a[1]);
  const totalValue = parts.reduce((sum,p) => sum + p.currentStock * p.sellingPrice, 0);
  const totalCost = parts.reduce((sum,p) => sum + p.currentStock * p.costPrice, 0);

  function openCatalog() {
    setSelectedShelfFilter(null);
    setSearchTerm('');
    setActiveTab('parts');
  }

  return (
    <div className="overview">
      <div className="page-heading">
        <div><h1>Visão geral da oficina</h1><p>Estoque, reposição e veículos em atendimento.</p></div>
        <button className="action-primary" onClick={() => setActiveTab('checkin-new')}><ClipboardPlus size={18} />Novo check-in</button>
      </div>

      <dl className="metrics">
        <div><dt>Peças no catálogo</dt><dd>{parts.length}</dd><small>{parts.reduce((n,p) => n + p.currentStock, 0)} unidades em estoque</small></div>
        <div><dt>Reposição necessária</dt><dd className={lowStock.length ? 'attention' : ''}>{lowStock.length}</dd><small>No mínimo ou abaixo</small></div>
        <div><dt>Valor de venda</dt><dd className="amount">{currency.format(totalValue)}</dd><small>Custo de {currency.format(totalCost)}</small></div>
        <div><dt>Ordens em aberto</dt><dd>{activeOrders.length}</dd><small>{orders.length} registradas no total</small></div>
      </dl>

      <div className="board-grid">
        <section className="board-panel">
          <div className="panel-heading"><h2>Fila de reposição</h2><button className="text-action" onClick={openCatalog}>Ver catálogo <ArrowRight size={15} /></button></div>
          {lowStock.length === 0 ? <p className="empty-note">Todas as peças estão acima do estoque mínimo.</p> :
          <ul className="stock-list">{lowStock.map(part => <li key={part.id}>
            <div className="stock-identity"><span className="part-code">{part.code}</span><h3>{part.name}</h3>
              <p><MapPin size={13} />{part.location.aisle} · {part.location.shelf} · {part.location.bin}</p>
            </div>
            <div className="stock-level"><strong>{part.currentStock} {part.unit}</strong><small>Mínimo {part.minStock}</small></div>
            <button className="restock" aria-label={'Repor ' + part.name} onClick={() => {setSelectedPartForMovement(part); setIsMovementModalOpen(true);}}><PackagePlus size={16} />Repor</button>
          </li>)}</ul>}
        </section>

        <section className="board-panel">
          <div className="panel-heading"><h2>Em atendimento</h2><button className="text-action" onClick={() => setActiveTab('orders')} aria-label="Ver todas as ordens de serviço"><ArrowRight size={18} /></button></div>
          {activeOrders.length === 0 ? <p className="empty-note">Nenhum veículo em atendimento.</p> :
          <ul className="service-list">{activeOrders.slice(0, 4).map(order => <li key={order.id}>
            <button onClick={() => {setSelectedOrderForDetail(order); setActiveTab('orders');}}>
              <span className="order-top"><span className="part-code">{order.orderNumber}</span><OrderStatusBadge status={order.status} /></span>
              <strong>{order.vehicle.make} {order.vehicle.model}</strong>
              <span className="vehicle-details">{order.vehicle.licensePlate} · {order.customer.name}</span>
            </button>
          </li>)}</ul>}
        </section>

        <section className="board-panel">
          <div className="panel-heading"><h2>Movimentações recentes</h2></div>
          {movements.length === 0 && <p className="empty-note">O histórico aparece após a primeira movimentação.</p>}
          <ul className="movement-list">{movements.slice(0,4).map((m,i) => {
            const Icon = m.type === 'ENTRADA' ? ArrowDownLeft : m.type === 'SAIDA' ? ArrowUpRight : SlidersHorizontal;
            const label = m.type === 'ENTRADA' ? 'Entrada' : m.type === 'SAIDA' ? 'Saída' : 'Ajuste';
            return <li key={m.id + '-' + i}><Icon size={19} /><div><strong>{m.partName}</strong><small>{m.reason} · {m.technician} · {m.date}</small></div>
              <span>{label}<b>{m.type === 'ENTRADA' ? '+' : m.type === 'SAIDA' ? '−' : ''}{m.quantity}</b></span></li>;
          })}</ul>
        </section>

        <section className="board-panel"><div className="panel-heading"><h2>Peças por categoria</h2><Layers size={17}/></div>
          {rankedCategories.length === 0 && <p className="empty-note">Cadastre uma peça para ver a distribuição.</p>}
          <ul className="category-list">{rankedCategories.map(([category,count]) =>
            <li key={category}><span>{category}</span><b>{count}</b><div><i style={{ width: (count / parts.length * 100) + '%' }} /></div></li>)}</ul>
        </section>
      </div>

      <section className="coastal">
        <Waves size={24} /><div><h2>Peças sensíveis à maresia</h2><p>Itens sinalizados para revisão preventiva na oficina de Maceió.</p>
        <ul>{weatherParts.map(p => <li key={p.id}>{p.name} · {p.currentStock} {p.unit}</li>)}</ul>
        {!weatherParts.length && <p>Nenhuma peça sinalizada.</p>}</div>
      </section>
    </div>
  );
}
