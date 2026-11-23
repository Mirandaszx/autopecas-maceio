import React, { useState } from 'react';
import { useWorkshop } from '../../context/WorkshopContext';
import { MapPin, Search, ArrowRight } from 'lucide-react';

export const ShelfLocatorView: React.FC = () => {
  const { parts, setActiveTab, setSelectedShelfFilter } = useWorkshop();

  const [selectedAisle, setSelectedAisle] = useState<string>('Corredor A');
  const [shelfSearch, setShelfSearch] = useState('');

  const aisles = [
    {
      id: 'Corredor A',
      title: 'Corredor A: Filtros, Óleos & Fluidos',
      shelves: ['Prateleira 1', 'Prateleira 2', 'Prateleira 3', 'Prateleira 4'],
      description: 'Armazenamento de lubrificantes, filtros de óleo, ar e aditivos de radiador.'
    },
    {
      id: 'Corredor B',
      title: 'Corredor B: Freios, Correias & Ignição',
      shelves: ['Prateleira 1', 'Prateleira 2', 'Prateleira 3', 'Prateleira 4'],
      description: 'Pastilhas, discos de freio, velas de ignição e kits de distribuição.'
    },
    {
      id: 'Corredor C',
      title: 'Corredor C: Suspensão & Componentes Pesados',
      shelves: ['Prateleira 1', 'Prateleira 2', 'Prateleira 3', 'Prateleira 4'],
      description: 'Amortecedores, molas helicoidais, bandejas e buchas de suspensão.'
    },
    {
      id: 'Corredor D',
      title: 'Corredor D: Acessórios & Componentes Elétricos',
      shelves: ['Prateleira 1', 'Prateleira 2', 'Prateleira 3', 'Prateleira 4'],
      description: 'Palhetas de silicone, lâmpadas, fusíveis, relés e itens universais.'
    }
  ];

  // Identificar peças no corredor selecionado
  const partsInAisle = parts.filter((p) => {
    const matchesAisle = p.location.aisle === selectedAisle;
    if (shelfSearch.trim() !== '') {
      const term = shelfSearch.toLowerCase();
      const matchesText =
        p.name.toLowerCase().includes(term) ||
        p.code.toLowerCase().includes(term) ||
        p.location.bin.toLowerCase().includes(term);
      return matchesAisle && matchesText;
    }
    return matchesAisle;
  });

  const handleFilterMainCatalog = (aisleName: string) => {
    setSelectedShelfFilter(aisleName);
    setActiveTab('parts');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Mapa de prateleiras
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Selecione um corredor para localizar a prateleira e a gaveta de cada peça.
          </p>
        </div>
      </div>

      {/* Seletor de Corredores (Layout Oficina) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {aisles.map((aisle) => {
          const isSelected = selectedAisle === aisle.id;
          const count = parts.filter((p) => p.location.aisle === aisle.id).length;

          return (
            <button
              key={aisle.id}
              aria-pressed={isSelected}
              onClick={() => setSelectedAisle(aisle.id)}
              className={`p-4 rounded-2xl text-left border transition-all ${
                isSelected
                  ? 'bg-purple-950/40 border-purple-500 text-white shadow-lg shadow-purple-500/20 ring-1 ring-purple-500'
                  : 'bg-slate-900 border-slate-700/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-slate-800 text-purple-300">
                  {aisle.id}
                </span>
                <span className="text-xs text-slate-400 font-semibold">{count} peças</span>
              </div>
              <h3 className="text-sm font-bold text-white">{aisle.title.split(': ')[1]}</h3>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{aisle.description}</p>
            </button>
          );
        })}
      </div>

      {/* Área da Prateleira Selecionada */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-bold text-white">{selectedAisle}</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Exibindo a distribuição física das estantes e compartimentos
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-0">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={shelfSearch}
                onChange={(e) => setShelfSearch(e.target.value)}
                placeholder="Buscar nesta estante..."
                className="bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              onClick={() => handleFilterMainCatalog(selectedAisle)}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <span>Ver no Catálogo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Representação Visual das Prateleiras (1 a 4) */}
        <div className="space-y-4">
          {['Prateleira 1', 'Prateleira 2', 'Prateleira 3', 'Prateleira 4'].map((shelfLevel, index) => {
            const partsInShelf = partsInAisle.filter((p) => p.location.shelf === shelfLevel);

            return (
              <div
                key={shelfLevel}
                className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-700 flex items-center justify-center text-xs font-bold text-purple-300">
                      {4 - index}
                    </span>
                    <span className="font-bold text-sm text-slate-200">{shelfLevel}</span>
                    <span className="text-xs text-slate-500">
                      ({partsInShelf.length} {partsInShelf.length === 1 ? 'item' : 'itens'})
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-500">
                    Nível {index === 0 ? 'Térreo / Pesado' : index === 3 ? 'Superior / Leve' : 'Médio'}
                  </span>
                </div>

                {partsInShelf.length === 0 ? (
                  <div className="p-3 rounded-xl border border-dashed border-slate-700/60 text-center text-xs text-slate-500">
                    Vão livre ou sem peças cadastradas nesta altura da estante.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {partsInShelf.map((part) => (
                      <div
                        key={part.id}
                        className="p-3.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-purple-500/50 transition-all space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-slate-800 text-orange-400">
                            {part.code}
                          </span>
                          <span className="text-xs font-bold text-slate-300">
                            {part.currentStock} {part.unit}
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-white truncate">{part.name}</p>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                          <span className="text-purple-300 font-medium">Gaveta: {part.location.bin}</span>
                          <span>{part.sellingPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
