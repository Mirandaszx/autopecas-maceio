import { OrderStatusBadge } from './OrderStatusBadge';
import { serviceOptions, symptomOptions } from './checkInOptions';
import { WorkshopDialog } from '../common/WorkshopDialog';
import React, { useState } from 'react';
import { useWorkshop } from '../../context/WorkshopContext';
import type { ServiceOrderStatus } from '../../types';
import {
  ClipboardList,
  Search,
  Car,
  User,
  Printer,
  X,
  FileText,
  Plus
} from 'lucide-react';

export const OrdersListView: React.FC = () => {
  const { orders, updateOrderStatus, setActiveTab, selectedOrderForDetail: viewingOrder, setSelectedOrderForDetail: setViewingOrder } = useWorkshop();

  const [statusFilter, setStatusFilter] = useState<string>('TODOS');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== 'TODOS' && order.status !== statusFilter) {
      return false;
    }
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      const matchesNum = order.orderNumber.toLowerCase().includes(term);
      const matchesCustomer = order.customer.name.toLowerCase().includes(term);
      const matchesPlate = order.vehicle.licensePlate.toLowerCase().includes(term);
      const matchesModel = `${order.vehicle.make} ${order.vehicle.model}`.toLowerCase().includes(term);

      return matchesNum || matchesCustomer || matchesPlate || matchesModel;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold text-white tracking-tight">Ordens de serviço</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {filteredOrders.length} atendimentos
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Acompanhe cada veículo da entrada à conclusão do serviço.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('checkin-new')}
          className="action-primary"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Novo check-in</span>
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex flex-col xl:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por O.S, nome do cliente, placa ou veículo..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {['TODOS', 'CHECK_IN', 'EM_DIAGNOSTICO', 'AGUARDANDO_PECAS', 'EM_EXECUCAO', 'FINALIZADO'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-orange-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 border border-slate-700 hover:text-white'
              }`}
            >
              {st === 'TODOS'
                ? 'Todos'
                : st === 'CHECK_IN'
                ? 'Check-In'
                : st === 'EM_DIAGNOSTICO'
                ? 'Diagnóstico'
                : st === 'AGUARDANDO_PECAS'
                ? 'Aguardando Peças'
                : st === 'EM_EXECUCAO'
                ? 'Em Execução'
                : 'Finalizados'}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Ordens */}
      {filteredOrders.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-800/40 border border-slate-700/60 space-y-3">
          <ClipboardList className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">Nenhum atendimento encontrado</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Não existem fichas de entrada registradas com os filtros aplicados.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-lg hover:border-slate-600 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-orange-400 border border-slate-700">
                    {order.orderNumber}
                  </span>
                  <OrderStatusBadge status={order.status} />
                </div>

                {/* Veículo & Cliente */}
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <Car className="w-4 h-4 text-orange-400" />
                    <span>
                      {order.vehicle.make} {order.vehicle.model} ({order.vehicle.year})
                    </span>
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="font-mono font-semibold text-slate-200">
                      Placa: {order.vehicle.licensePlate}
                    </span>
                    <span>KM: {order.vehicle.mileage}</span>
                    <span>Cor: {order.vehicle.color}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-800 text-xs space-y-1">
                  <p className="text-slate-300 flex items-center gap-1.5 font-medium">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    <span>{order.customer.name} • {order.customer.phone}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">{order.customer.address}, {order.customer.city}</p>
                </div>

                {/* Resumo de Peças Alocadas */}
                <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
                  <span>
                    Peças: <strong className="text-white">{order.allocatedParts.length} itens</strong>
                  </span>
                  <span className="text-emerald-400 font-bold text-sm">
                    {order.totalCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </div>

              {/* Ações */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-500">{order.date}</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewingOrder(order)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-400" />
                    <span>Ver Ficha Completa</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Ficha Impressa do Cliente / Pre-Service Sheet */}
      {viewingOrder && (
        <WorkshopDialog title="Ficha de atendimento" onDismiss={() => setViewingOrder(null)}>
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/95">
              <div>
                <span className="font-mono text-xs font-bold text-orange-400 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                  {viewingOrder.orderNumber}
                </span>
                <h2 className="text-lg font-bold text-white mt-1">
                  Ficha de atendimento
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 border border-slate-700 transition-colors"
                  title="Imprimir ficha de entrada"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  aria-label="Fechar janela"
                onClick={() => setViewingOrder(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Conteúdo Fiel ao Anexo */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Status Atual e Alterar */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-slate-400 block">Status Operacional:</span>
                  <div className="mt-1"><OrderStatusBadge status={viewingOrder.status} /></div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Alterar para:</span>
                  <select
                    value={viewingOrder.status}
                    onChange={(e) => {
                      updateOrderStatus(viewingOrder.id, e.target.value as ServiceOrderStatus);
                      setViewingOrder({ ...viewingOrder, status: e.target.value as ServiceOrderStatus });
                    }}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
                  >
                    <option value="CHECK_IN">Check-in</option>
                    <option value="EM_DIAGNOSTICO">Em Diagnóstico</option>
                    <option value="AGUARDANDO_PECAS">Aguardando Peças</option>
                    <option value="EM_EXECUCAO">Em Execução</option>
                    <option value="FINALIZADO">Finalizado</option>
                  </select>
                </div>
              </div>

              {/* Informações do Cliente & Veículo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1.5 text-xs">
                  <h3 className="font-bold text-orange-400 uppercase tracking-wider text-[11px]">
                    Dados do Proprietário
                  </h3>
                  <p className="text-white font-semibold text-sm">{viewingOrder.customer.name}</p>
                  <p className="text-slate-300">Telefone: {viewingOrder.customer.phone}</p>
                  <p className="text-slate-400">{viewingOrder.customer.address}, {viewingOrder.customer.city}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1.5 text-xs">
                  <h3 className="font-bold text-orange-400 uppercase tracking-wider text-[11px]">
                    Dados do Veículo
                  </h3>
                  <p className="text-white font-semibold text-sm">
                    {viewingOrder.vehicle.year} {viewingOrder.vehicle.make} {viewingOrder.vehicle.model}
                  </p>
                  <p className="text-slate-300 font-mono">
                    Placa: {viewingOrder.vehicle.licensePlate} • Cor: {viewingOrder.vehicle.color}
                  </p>
                  <p className="text-slate-400 font-mono text-[11px]">
                    VIN/Chassi: {viewingOrder.vehicle.vin || 'Não informado'}
                  </p>
                  <p className="text-slate-300">Quilometragem: {viewingOrder.vehicle.mileage}</p>
                </div>
              </div>

              <section className="order-checklist">
                <h3>Serviços solicitados</h3>
                <p>{serviceOptions.filter(s => viewingOrder.requestedServices[s.id]).map(s => s.label).join(' · ') || 'Nenhum serviço selecionado.'}</p>
                <h3>Sintomas relatados</h3>
                <p>{symptomOptions.filter(s => viewingOrder.drivabilityIssues[s.id]).map(s => s.label).join(' · ') || 'Nenhum sintoma selecionado.'}</p>
                {viewingOrder.otherConcerns && <p>{viewingOrder.otherConcerns}</p>}
              </section>

              {/* Peças Alocadas */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Peças & Suprimentos Alocados do Estoque
                </h3>
                {viewingOrder.allocatedParts.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">Nenhuma peça alocada nesta ordem.</p>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-800 text-slate-400 font-semibold border-b border-slate-700">
                          <th className="py-2.5 px-3">Código</th>
                          <th className="py-2.5 px-3">Descrição da Peça</th>
                          <th className="py-2.5 px-3 text-center">Qtd</th>
                          <th className="py-2.5 px-3 text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {viewingOrder.allocatedParts.map((item) => (
                          <tr key={item.partId}>
                            <td className="py-2 px-3 font-mono text-orange-400 font-bold">{item.code}</td>
                            <td className="py-2 px-3 text-white">{item.name}</td>
                            <td className="py-2 px-3 text-center">{item.quantity}</td>
                            <td className="py-2 px-3 text-right text-emerald-400 font-bold">
                              {item.totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Totais */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-400 block">Responsável: {viewingOrder.technicianName}</span>
                  <span className="text-slate-400 block">Mão de obra: {viewingOrder.estimatedLaborCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[11px]">Valor Total Estimado:</span>
                  <span className="text-xl font-black text-emerald-400">
                    {viewingOrder.totalCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </div>

              {/* Termo de Autorização (Reproduzindo o rodapé da folha do anexo) */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-2">
                <p className="font-semibold text-slate-300 uppercase text-[10px]">
                  Termo de Autorização de Reparo & Peças (Conforme Formulário RC-100):
                </p>
                <p className="italic text-[10px] leading-relaxed text-slate-500">
                  "Autorizo a realização dos serviços listados acima, bem como a aplicação dos materiais e peças de reposição descritos. 
                  Os veículos deixados para revisão e reparo estão sujeitos a testes de rodagem para aferição operacional."
                </p>
                <div className="pt-4 flex justify-between items-end border-t border-slate-800 text-[10px]">
                  <span>Data: {viewingOrder.date}</span>
                  <span className="border-t border-slate-600 px-8 pt-1 text-slate-300">
                    Assinatura do Cliente
                  </span>
                </div>
              </div>
            </div>
          </div>
        </WorkshopDialog>
      )}
    </div>
  );
};
