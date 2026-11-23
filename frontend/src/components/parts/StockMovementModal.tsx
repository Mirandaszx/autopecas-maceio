import { WorkshopDialog } from '../common/WorkshopDialog';
import React, { useState } from 'react';
import { useWorkshop } from '../../context/WorkshopContext';
import type { MovementType } from '../../types';
import { X, ArrowUpRight, ArrowDownRight, RefreshCw, MapPin } from 'lucide-react';

export const StockMovementModal: React.FC = () => {
  const {
    isMovementModalOpen,
    setIsMovementModalOpen,
    selectedPartForMovement,
    registerMovement
  } = useWorkshop();

  const [type, setType] = useState<MovementType>('ENTRADA');
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState('');
  const [technician, setTechnician] = useState('Mecânico Patrick');

  if (!isMovementModalOpen || !selectedPartForMovement) return null;

  const part = selectedPartForMovement;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (quantity <= 0) {
      alert('A quantidade deve ser maior que zero.');
      return;
    }

    const defaultReason =
      type === 'ENTRADA'
        ? 'Reposição de estoque / Compra'
        : type === 'SAIDA'
        ? 'Saída avulsa para serviço na oficina'
        : 'Ajuste de inventário';

    const success = registerMovement(
      part.id,
      type,
      Number(quantity),
      reason.trim() || defaultReason,
      technician.trim() || 'Equipe'
    );

    if (success) {
      setIsMovementModalOpen(false);
      setQuantity(1);
      setReason('');
    }
  };

  return (
    <WorkshopDialog title="Movimentação de estoque" onDismiss={() => setIsMovementModalOpen(false)}>
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90">
          <div>
            <h2 className="text-base font-bold text-white">Movimentação Rápida de Estoque</h2>
            <p className="text-xs text-slate-400">Entrada, saída ou ajuste físico</p>
          </div>
          <button
            aria-label="Fechar janela"
                onClick={() => setIsMovementModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informações da Peça Selecionada */}
        <div className="p-4 bg-slate-800/40 border-b border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-orange-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
              {part.code}
            </span>
            <span className="text-xs font-semibold text-slate-300">
              Estoque atual: <strong className="text-white">{part.currentStock} {part.unit}</strong>
            </span>
          </div>
          <p className="text-sm font-semibold text-white truncate">{part.name}</p>
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-orange-400" />
            {part.location.aisle} • {part.location.shelf} ({part.location.bin})
          </p>
        </div>

        {/* Formulário de Movimentação */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Tipo de Movimentação */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Tipo de Operação
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setType('ENTRADA')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  type === 'ENTRADA'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                <ArrowUpRight className="w-4 h-4 mb-1 text-emerald-400" />
                <span>Entrada</span>
              </button>

              <button
                type="button"
                onClick={() => setType('SAIDA')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  type === 'SAIDA'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-sm'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                <ArrowDownRight className="w-4 h-4 mb-1 text-rose-400" />
                <span>Saída</span>
              </button>

              <button
                type="button"
                onClick={() => setType('AJUSTE')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  type === 'AJUSTE'
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/50 shadow-sm'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                <RefreshCw className="w-4 h-4 mb-1 text-blue-400" />
                <span>Ajuste</span>
              </button>
            </div>
          </div>

          {/* Quantidade */}
          <div>
            <label htmlFor="StockMovementModal-quantity" className="block text-xs font-semibold text-slate-300 mb-1.5">
              {type === 'AJUSTE' ? 'Novo Saldo Total em Estoque' : 'Quantidade da Movimentação'}
            </label>
            <input id="StockMovementModal-quantity"
              type="number"
              min="1"
              required
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            />
          </div>

          {/* Justificativa / Motivo */}
          <div>
            <label htmlFor="StockMovementModal-reason" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Motivo / Destino / Nota
            </label>
            <input id="StockMovementModal-reason"
              type="text"
              placeholder={
                type === 'ENTRADA'
                  ? 'Ex: NF 1042 - Distribuidora Alagoas'
                  : type === 'SAIDA'
                  ? 'Ex: Aplicação em Gol G5 placa NMN-1020'
                  : 'Ex: Balanço físico semanal'
              }
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            />
          </div>

          {/* Técnico / Responsável */}
          <div>
            <label htmlFor="StockMovementModal-technician" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Mecânico / Responsável
            </label>
            <input id="StockMovementModal-technician"
              type="text"
              value={technician}
              onChange={(e) => setTechnician(e.target.value)}
              placeholder="Nome do mecânico ou operador"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            />
          </div>

          {/* Ações */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsMovementModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-5 py-2 rounded-xl text-slate-950 font-bold text-xs shadow-md transition-all ${
                type === 'ENTRADA'
                  ? 'bg-emerald-400 hover:bg-emerald-300 shadow-emerald-500/20'
                  : type === 'SAIDA'
                  ? 'bg-rose-400 hover:bg-rose-300 shadow-rose-500/20'
                  : 'bg-blue-400 hover:bg-blue-300 shadow-blue-500/20'
              }`}
            >
              Confirmar {type === 'ENTRADA' ? 'Entrada' : type === 'SAIDA' ? 'Saída' : 'Ajuste'}
            </button>
          </div>
        </form>
      </div>
    </WorkshopDialog>
  );
};
