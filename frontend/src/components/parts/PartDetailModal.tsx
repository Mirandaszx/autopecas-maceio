import { WorkshopDialog } from '../common/WorkshopDialog';
import React from 'react';
import type { Part } from '../../types';
import { X, MapPin, Car, Edit3, ArrowRightLeft } from 'lucide-react';

interface PartDetailModalProps {
  part: Part | null;
  onClose: () => void;
  onEdit: (part: Part) => void;
  onMoveStock: (part: Part) => void;
}

export const PartDetailModal: React.FC<PartDetailModalProps> = ({
  part,
  onClose,
  onEdit,
  onMoveStock
}) => {
  if (!part) return null;

  const profit = part.sellingPrice - part.costPrice;
  const marginPercent = part.costPrice > 0 ? Math.round((profit / part.costPrice) * 100) : 0;
  const isLowStock = part.currentStock <= part.minStock;

  return (
    <WorkshopDialog title="Detalhes da peça" onDismiss={onClose}>
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/90">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-slate-800 text-orange-400 border border-slate-700">
                {part.code}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {part.category}
              </span>
              {part.criticalMaceioWeather && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-900/40 text-blue-300 border border-blue-700/50">
                  🌊 Alerta Clima Maceió
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-white">{part.name}</h2>
          </div>
          <button
            aria-label="Fechar janela"
                onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Card de Localização na Oficina */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-950/30 via-slate-800/80 to-slate-900 border border-orange-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/40">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Onde encontrar na oficina:
                </p>
                <p className="text-base font-bold text-white">
                  {part.location.aisle} • {part.location.shelf}
                </p>
                <p className="text-xs text-orange-300">Gaveta / Caixa: <strong>{part.location.bin}</strong></p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block">Estoque Disponível</span>
              <span className={`text-xl font-black ${isLowStock ? 'text-amber-400' : 'text-emerald-400'}`}>
                {part.currentStock} {part.unit}
              </span>
              <span className="text-[11px] text-slate-400 block">Mínimo: {part.minStock} {part.unit}</span>
            </div>
          </div>

          {/* Grid Financeiro e Dados */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
              <span className="text-[11px] text-slate-400 block">Fabricante</span>
              <span className="text-sm font-bold text-white">{part.manufacturer}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
              <span className="text-[11px] text-slate-400 block">Preço de Custo</span>
              <span className="text-sm font-bold text-slate-300">
                {part.costPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
              <span className="text-[11px] text-slate-400 block">Preço de Venda</span>
              <span className="text-sm font-bold text-emerald-400">
                {part.sellingPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
              <span className="text-[11px] text-slate-400 block">Margem Bruta</span>
              <span className="text-sm font-bold text-orange-400">
                +{marginPercent}% ({profit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})
              </span>
            </div>
          </div>

          {/* Veículos Compatíveis */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Car className="w-4 h-4 text-orange-400" />
              <span>Compatibilidade com Veículos ({part.compatibility.length})</span>
            </h3>

            {part.compatibility.length === 0 ? (
              <p className="text-xs text-slate-500 italic">Aplicação universal ou não especificada.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {part.compatibility.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-start gap-2.5"
                  >
                    <Car className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-bold text-white">
                        {item.make} {item.model}
                      </p>
                      <p className="text-slate-400">
                        Anos: {item.yearRange} {item.engine ? `• Motor ${item.engine}` : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Observações */}
          {part.notes && (
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Observações Técnicas:</span>
              <p className="text-xs text-slate-300 leading-relaxed">{part.notes}</p>
            </div>
          )}
        </div>

        {/* Rodapé com Ações */}
        <div className="p-5 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <span className="text-xs text-slate-500">Última atualização: {part.lastUpdated}</span>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                onClose();
                onMoveStock(part);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-orange-400" />
              <span>Movimentar Estoque</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onEdit(part);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-bold shadow-md transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editar Peça</span>
            </button>
          </div>
        </div>
      </div>
    </WorkshopDialog>
  );
};
