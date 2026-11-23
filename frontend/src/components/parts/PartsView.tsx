import React, { useState, useMemo } from 'react';
import { useWorkshop } from '../../context/WorkshopContext';
import type { Part } from '../../types';
import {
  Boxes,
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  AlertTriangle,
  MapPin,
  LayoutGrid,
  List,
  Edit2,
  Trash2,
  ArrowRightLeft,
  Eye,
  Sparkles
} from 'lucide-react';
import { PartDetailModal } from './PartDetailModal';

export const PartsView: React.FC = () => {
  const {
    parts,
    searchTerm,
    setSearchTerm,
    setIsPartModalOpen,
    setSelectedPartForEdit,
    setIsMovementModalOpen,
    setSelectedPartForMovement,
    deletePart,
    selectedShelfFilter,
    setSelectedShelfFilter
  } = useWorkshop();

  const [selectedCategory, setSelectedCategory] = useState<string>('TODAS');
  const [onlyLowStock, setOnlyLowStock] = useState<boolean>(false);
  const [onlyMaceioWeather, setOnlyMaceioWeather] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>(() => window.matchMedia('(max-width: 900px)').matches ? 'cards' : 'table');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'price' | 'code'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modal de Detalhes
  const [detailedPart, setDetailedPart] = useState<Part | null>(null);

  // Categorias disponíveis
  const categories: string[] = [
    'TODAS',
    'Lubrificantes e Fluidos',
    'Freios',
    'Suspensão e Direção',
    'Motor e Transmissão',
    'Filtros',
    'Arrefecimento',
    'Elétrica e Ignição',
    'Pneus e Rodas',
    'Acessórios e Fixação'
  ];

  // Filtro inteligente
  const filteredParts = useMemo(() => {
    return parts
      .filter((part) => {
        // Filtro de Prateleira (quando veio do mapa de prateleiras)
        if (selectedShelfFilter && !part.location.aisle.includes(selectedShelfFilter)) {
          return false;
        }

        // Categoria
        if (selectedCategory !== 'TODAS' && part.category !== selectedCategory) {
          return false;
        }

        // Apenas estoque baixo
        if (onlyLowStock && part.currentStock > part.minStock) {
          return false;
        }

        // Apenas desgaste clima Maceió
        if (onlyMaceioWeather && !part.criticalMaceioWeather) {
          return false;
        }

        // Busca textual ampla
        if (searchTerm.trim() !== '') {
          const term = searchTerm.trim().toLowerCase();
          const matchesCode = part.code.toLowerCase().includes(term);
          const matchesName = part.name.toLowerCase().includes(term);
          const matchesManufacturer = part.manufacturer.toLowerCase().includes(term);
          const matchesLocation = `${part.location.aisle} ${part.location.shelf} ${part.location.bin}`
            .toLowerCase()
            .includes(term);
          const matchesVehicle = part.compatibility.some((c) =>
            `${c.make} ${c.model} ${c.engine || ''}`.toLowerCase().includes(term)
          );

          return matchesCode || matchesName || matchesManufacturer || matchesLocation || matchesVehicle;
        }

        return true;
      })
      .sort((a, b) => {
        let valA: string | number = a.name;
        let valB: string | number = b.name;

        if (sortBy === 'code') {
          valA = a.code;
          valB = b.code;
        } else if (sortBy === 'stock') {
          valA = a.currentStock;
          valB = b.currentStock;
        } else if (sortBy === 'price') {
          valA = a.sellingPrice;
          valB = b.sellingPrice;
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [
    parts,
    searchTerm,
    selectedCategory,
    onlyLowStock,
    onlyMaceioWeather,
    selectedShelfFilter,
    sortBy,
    sortOrder
  ]);

  const handleOpenAddPart = () => {
    setSelectedPartForEdit(null);
    setIsPartModalOpen(true);
  };

  const handleEdit = (part: Part) => {
    setSelectedPartForEdit(part);
    setIsPartModalOpen(true);
  };

  const handleMoveStock = (part: Part) => {
    setSelectedPartForMovement(part);
    setIsMovementModalOpen(true);
  };

  const handleDelete = (part: Part) => {
    if (window.confirm(`Tem certeza que deseja remover a peça "${part.name}" (${part.code}) do estoque?`)) {
      deletePart(part.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header da Tela */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold text-white tracking-tight">Catálogo de peças</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
              {filteredParts.length} {filteredParts.length === 1 ? 'item' : 'itens'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Consulte a compatibilidade, o saldo e a localização de cada peça.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleOpenAddPart}
            className="action-primary"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Cadastrar Peça</span>
          </button>
        </div>
      </div>

      {/* Alerta de filtro ativo por prateleira se houver */}
      {selectedShelfFilter && (
        <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/40 flex items-center justify-between text-xs text-purple-200">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-purple-400" />
            <span>Filtrando peças localizadas no: <strong>{selectedShelfFilter}</strong></span>
          </div>
          <button
            onClick={() => setSelectedShelfFilter(null)}
            className="underline hover:text-white font-semibold"
          >
            Remover filtro de prateleira
          </button>
        </div>
      )}

      {/* Barra de Filtros e Busca Rápida */}
      <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Busca por Texto */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Filtrar peças" placeholder="Nome, código, prateleira ou veículo"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            />
          </div>

          {/* Seletores de Ordenação e View Mode */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Ordenar:</span>
              <select
                aria-label="Ordenar peças por"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent border-none text-white focus:outline-none text-xs cursor-pointer"
              >
                <option value="name" className="bg-slate-900">Nome</option>
                <option value="code" className="bg-slate-900">Código SKU</option>
                <option value="stock" className="bg-slate-900">Estoque</option>
                <option value="price" className="bg-slate-900">Preço</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-0.5 text-slate-400 hover:text-white"
                title="Inverter ordem"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>

            {/* Alternar Tabela vs Cards */}
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'table' ? 'bg-orange-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                aria-pressed={viewMode === 'table'} title="Visualização em tabela"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'cards' ? 'bg-orange-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                aria-pressed={viewMode === 'cards'} title="Visualização em cartões"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filtros Rápidos (Pills) */}
        <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-700/60 text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <Filter className="w-3 h-3 text-orange-400" />
            <span>Filtros:</span>
          </span>

          {/* Categorias Dropdown ou Scroll */}
          <select
            aria-label="Categoria de peças"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 text-xs focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Botão Estoque Baixo */}
          <button
            onClick={() => setOnlyLowStock(!onlyLowStock)}
            className={`px-3 py-1 rounded-lg border font-medium transition-colors flex items-center gap-1.5 ${
              onlyLowStock
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-900/60 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>No mínimo ou abaixo</span>
          </button>

          {/* Botão Sensíveis à maresia */}
          <button
            onClick={() => setOnlyMaceioWeather(!onlyMaceioWeather)}
            className={`px-3 py-1 rounded-lg border font-medium transition-colors flex items-center gap-1.5 ${
              onlyMaceioWeather
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                : 'bg-slate-900/60 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span>Sensíveis à maresia</span>
          </button>
        </div>
      </div>

      {/* Conteúdo: Tabela ou Cards */}
      {filteredParts.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-800/40 border border-slate-700/60 space-y-3">
          <Boxes className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">Nenhuma peça encontrada</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Não foram encontradas peças com os filtros ou termo de busca informado.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('TODAS');
              setOnlyLowStock(false);
              setOnlyMaceioWeather(false);
              setSelectedShelfFilter(null);
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-orange-400 font-semibold"
          >
            Limpar todos os filtros
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* VISUALIZAÇÃO EM TABELA */
        <div className="overflow-x-auto rounded-2xl border border-slate-700/80 bg-slate-900 shadow-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-800/90 text-slate-400 font-bold border-b border-slate-700 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Código / Peça</th>
                <th className="py-3 px-4">Categoria & Fabricante</th>
                <th className="py-3 px-4">Localização Oficina</th>
                <th className="py-3 px-4">Compatibilidade</th>
                <th className="py-3 px-4 text-center">Estoque / Mínimo</th>
                <th className="py-3 px-4 text-right">Preço Venda</th>
                <th className="py-3 px-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredParts.map((part) => {
                const isLow = part.currentStock <= part.minStock;
                return (
                  <tr
                    key={part.id}
                    className="hover:bg-slate-800/50 transition-colors group"
                  >
                    {/* Código e Nome */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-orange-400 border border-slate-700">
                          {part.code}
                        </span>
                        {part.criticalMaceioWeather && (
                          <span
                            title="Peça com alto desgaste pelo clima litorâneo de Maceió"
                            className="cursor-help text-xs"
                          >
                            🌊
                          </span>
                        )}
                      </div>
                      <p className="font-semibold text-white mt-1 group-hover:text-orange-300 transition-colors">
                        {part.name}
                      </p>
                    </td>

                    {/* Categoria & Fabricante */}
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {part.category}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-1 font-medium">{part.manufacturer}</p>
                    </td>

                    {/* Localização Física */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-1.5 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-white">{part.location.aisle}</p>
                          <p className="text-[11px] text-slate-400">
                            {part.location.shelf} ({part.location.bin})
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Veículos Compatíveis */}
                    <td className="py-3.5 px-4 max-w-[200px]">
                      {part.compatibility.length > 0 ? (
                        <div className="space-y-0.5">
                          <p className="text-[11px] font-medium text-slate-200 truncate">
                            {part.compatibility[0].make} {part.compatibility[0].model}
                          </p>
                          {part.compatibility.length > 1 && (
                            <span className="text-[10px] text-slate-400">
                              +{part.compatibility.length - 1} outros modelos
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500">Universal</span>
                      )}
                    </td>

                    {/* Estoque Atual */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span
                          className={`text-sm font-black px-2 py-0.5 rounded-lg ${
                            isLow
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'text-emerald-400 font-bold'
                          }`}
                        >
                          {part.currentStock} {part.unit}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">
                          Mínimo: {part.minStock}
                        </span>
                      </div>
                    </td>

                    {/* Preço de Venda */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-bold text-white text-sm">
                        {part.sellingPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Custo: {part.costPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </div>
                    </td>

                    {/* Ações */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setDetailedPart(part)}
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                          title="Ver ficha completa da peça"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMoveStock(part)}
                          className="p-1.5 text-orange-400 hover:text-orange-300 rounded-lg hover:bg-orange-500/10 transition-colors"
                          title="Movimentar estoque (Entrada/Saída)"
                        >
                          <ArrowRightLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(part)}
                          className="p-1.5 text-blue-400 hover:text-blue-300 rounded-lg hover:bg-blue-500/10 transition-colors"
                          title="Editar cadastro"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(part)}
                          className="p-1.5 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-500/10 transition-colors"
                          title="Excluir peça"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* VISUALIZAÇÃO EM CARDS (IDEAL PARA TABLET NA OFICINA) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredParts.map((part) => {
            const isLow = part.currentStock <= part.minStock;
            return (
              <div
                key={part.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-md hover:border-orange-500/50 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-orange-400 border border-slate-700">
                      {part.code}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        isLow
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {part.currentStock} {part.unit} em estoque
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-white leading-snug">{part.name}</h3>

                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-orange-300 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-orange-400" />
                      <span>{part.location.aisle} • {part.location.shelf}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 pl-5">Gaveta/Caixa: {part.location.bin}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span>Marca: <strong className="text-slate-200">{part.manufacturer}</strong></span>
                    <span className="text-emerald-400 font-bold text-sm">
                      {part.sellingPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setDetailedPart(part)}
                    className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Detalhes</span>
                  </button>

                  <button
                    onClick={() => handleMoveStock(part)}
                    className="flex-1 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1 transition-all"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>Movimentar</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Detalhes da Peça */}
      <PartDetailModal
        part={detailedPart}
        onClose={() => setDetailedPart(null)}
        onEdit={handleEdit}
        onMoveStock={handleMoveStock}
      />
    </div>
  );
};
