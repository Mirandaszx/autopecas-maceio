import { WorkshopDialog } from '../common/WorkshopDialog';
import React, { useState, useEffect } from 'react';
import { useWorkshop } from '../../context/WorkshopContext';
import type { PartCategory, VehicleCompatibility } from '../../types';
import { X, Plus, Trash2, MapPin, Wrench, Car } from 'lucide-react';

const CATEGORIES: PartCategory[] = [
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

export const PartModal: React.FC = () => {
  const { isPartModalOpen, setIsPartModalOpen, selectedPartForEdit, addPart, updatePart } = useWorkshop();

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<PartCategory>('Filtros');
  const [manufacturer, setManufacturer] = useState('');
  const [aisle, setAisle] = useState('Corredor A');
  const [shelf, setShelf] = useState('Prateleira 1');
  const [bin, setBin] = useState('');
  const [currentStock, setCurrentStock] = useState<number>(0);
  const [minStock, setMinStock] = useState<number>(5);
  const [costPrice, setCostPrice] = useState<number>(0);
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [unit, setUnit] = useState('UN');
  const [notes, setNotes] = useState('');
  const [criticalMaceioWeather, setCriticalMaceioWeather] = useState(false);
  const [compatibilities, setCompatibilities] = useState<VehicleCompatibility[]>([
    { make: '', model: '', yearRange: '', engine: '' }
  ]);

  useEffect(() => {
    if (selectedPartForEdit) {
      setCode(selectedPartForEdit.code);
      setName(selectedPartForEdit.name);
      setCategory(selectedPartForEdit.category);
      setManufacturer(selectedPartForEdit.manufacturer);
      setAisle(selectedPartForEdit.location.aisle);
      setShelf(selectedPartForEdit.location.shelf);
      setBin(selectedPartForEdit.location.bin);
      setCurrentStock(selectedPartForEdit.currentStock);
      setMinStock(selectedPartForEdit.minStock);
      setCostPrice(selectedPartForEdit.costPrice);
      setSellingPrice(selectedPartForEdit.sellingPrice);
      setUnit(selectedPartForEdit.unit);
      setNotes(selectedPartForEdit.notes || '');
      setCriticalMaceioWeather(!!selectedPartForEdit.criticalMaceioWeather);
      setCompatibilities(
        selectedPartForEdit.compatibility.length > 0
          ? selectedPartForEdit.compatibility
          : [{ make: '', model: '', yearRange: '', engine: '' }]
      );
    } else {
      // Limpar formulário para novo cadastro
      setCode('');
      setName('');
      setCategory('Filtros');
      setManufacturer('');
      setAisle('Corredor A');
      setShelf('Prateleira 1');
      setBin('Gaveta A1-01');
      setCurrentStock(10);
      setMinStock(5);
      setCostPrice(0);
      setSellingPrice(0);
      setUnit('UN');
      setNotes('');
      setCriticalMaceioWeather(false);
      setCompatibilities([{ make: '', model: '', yearRange: '', engine: '' }]);
    }
  }, [selectedPartForEdit, isPartModalOpen]);

  if (!isPartModalOpen) return null;

  const handleAddCompatibility = () => {
    setCompatibilities([...compatibilities, { make: '', model: '', yearRange: '', engine: '' }]);
  };

  const handleRemoveCompatibility = (index: number) => {
    setCompatibilities(compatibilities.filter((_, i) => i !== index));
  };

  const handleCompatibilityChange = (
    index: number,
    field: keyof VehicleCompatibility,
    value: string
  ) => {
    const updated = [...compatibilities];
    updated[index] = { ...updated[index], [field]: value };
    setCompatibilities(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim() || !name.trim()) {
      alert('Por favor, informe o código e o nome da peça.');
      return;
    }

    const filteredCompatibilities = compatibilities.filter(
      (c) => c.make.trim() !== '' || c.model.trim() !== ''
    );

    const partData = {
      code: code.trim().toUpperCase(),
      name: name.trim(),
      category,
      manufacturer: manufacturer.trim() || 'Genérico',
      location: {
        aisle,
        shelf,
        bin: bin.trim() || 'Prateleira Geral'
      },
      currentStock: Number(currentStock),
      minStock: Number(minStock),
      costPrice: Number(costPrice),
      sellingPrice: Number(sellingPrice),
      unit: unit.trim().toUpperCase(),
      notes: notes.trim(),
      criticalMaceioWeather,
      compatibility: filteredCompatibilities
    };

    if (selectedPartForEdit) {
      updatePart({
        ...partData,
        id: selectedPartForEdit.id,
        lastUpdated: selectedPartForEdit.lastUpdated
      });
    } else {
      addPart(partData);
    }

    setIsPartModalOpen(false);
  };

  return (
    <WorkshopDialog title="Cadastro de peça" onDismiss={() => setIsPartModalOpen(false)}>
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl my-8 overflow-hidden">
        {/* Header do Modal */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {selectedPartForEdit ? 'Editar Peça Automotiva' : 'Cadastrar Nova Peça no Estoque'}
              </h2>
              <p className="text-xs text-slate-400">
                Cadastro estruturado para busca imediata e controle na oficina
              </p>
            </div>
          </div>
          <button
            aria-label="Fechar janela"
                onClick={() => setIsPartModalOpen(false)}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Seção 1: Identificação Básica */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
              Identificação da Peça & Fabricante
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="PartModal-code" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Código de Fábrica / SKU *
                </label>
                <input id="PartModal-code"
                  type="text"
                  required
                  placeholder="Ex: FLT-OC90, FR-203"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="PartModal-name" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nome / Descrição da Peça *
                </label>
                <input id="PartModal-name"
                  type="text"
                  required
                  placeholder="Ex: Filtro de Óleo Blindado Motor 1.0/1.6"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                />
              </div>

              <div>
                <label htmlFor="PartModal-category" className="block text-xs font-semibold text-slate-300 mb-1.5">Categoria</label>
                <select id="PartModal-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as PartCategory)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="PartModal-manufacturer" className="block text-xs font-semibold text-slate-300 mb-1.5">Fabricante / Marca</label>
                <input id="PartModal-manufacturer"
                  type="text"
                  placeholder="Ex: Bosch, Mahle, Cofap"
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                />
              </div>

              <div>
                <label htmlFor="PartModal-unit" className="block text-xs font-semibold text-slate-300 mb-1.5">Unidade de Medida</label>
                <select id="PartModal-unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                >
                  <option value="UN">Unidade (UN)</option>
                  <option value="LT">Litro (LT)</option>
                  <option value="JOGO">Jogo (JOGO)</option>
                  <option value="KIT">Kit (KIT)</option>
                  <option value="PAR">Par (PAR)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Seção 2: Localização Física na Oficina (Resolvendo o problema de buscas demoradas!) */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-400" />
              Localização Física na Oficina (Prateleira & Gaveta)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="PartModal-aisle" className="block text-xs font-semibold text-slate-300 mb-1.5">Corredor</label>
                <select id="PartModal-aisle"
                  value={aisle}
                  onChange={(e) => setAisle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                >
                  <option value="Corredor A">Corredor A (Filtros e Óleos)</option>
                  <option value="Corredor B">Corredor B (Freios e Correias)</option>
                  <option value="Corredor C">Corredor C (Suspensão e Amortecedores)</option>
                  <option value="Corredor D">Corredor D (Acessórios e Elétrica)</option>
                </select>
              </div>

              <div>
                <label htmlFor="PartModal-shelf" className="block text-xs font-semibold text-slate-300 mb-1.5">Prateleira</label>
                <select id="PartModal-shelf"
                  value={shelf}
                  onChange={(e) => setShelf(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                >
                  <option value="Prateleira 1">Prateleira 1 (Baixa)</option>
                  <option value="Prateleira 2">Prateleira 2 (Média-Baixa)</option>
                  <option value="Prateleira 3">Prateleira 3 (Média-Alta)</option>
                  <option value="Prateleira 4">Prateleira 4 (Alta)</option>
                </select>
              </div>

              <div>
                <label htmlFor="PartModal-bin" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Caixa / Gaveta / Posição
                </label>
                <input id="PartModal-bin"
                  type="text"
                  placeholder="Ex: Gaveta B2-05 ou Caixa 3"
                  value={bin}
                  onChange={(e) => setBin(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                />
              </div>
            </div>
          </div>

          {/* Seção 3: Quantidades e Preços */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
              Controle de Estoque & Valores
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="PartModal-currentStock" className="block text-xs font-semibold text-slate-300 mb-1.5">Estoque Atual</label>
                <input id="PartModal-currentStock"
                  type="number"
                  min="0"
                  value={currentStock}
                  onChange={(e) => setCurrentStock(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                />
              </div>

              <div>
                <label htmlFor="PartModal-minStock" className="block text-xs font-semibold text-slate-300 mb-1.5">Estoque Mínimo</label>
                <input id="PartModal-minStock"
                  type="number"
                  min="0"
                  value={minStock}
                  onChange={(e) => setMinStock(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                />
              </div>

              <div>
                <label htmlFor="PartModal-costPrice" className="block text-xs font-semibold text-slate-300 mb-1.5">Preço Custo (R$)</label>
                <input id="PartModal-costPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={costPrice}
                  onChange={(e) => setCostPrice(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                />
              </div>

              <div>
                <label htmlFor="PartModal-sellingPrice" className="block text-xs font-semibold text-slate-300 mb-1.5">Preço Venda (R$)</label>
                <input id="PartModal-sellingPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                />
              </div>
            </div>
          </div>

          {/* Seção 4: Compatibilidade com Veículos */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
                <Car className="w-4 h-4 text-orange-400" />
                Veículos Compatíveis (Para Busca Instantânea)
              </h3>
              <button
                type="button"
                onClick={handleAddCompatibility}
                className="inline-flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Carro</span>
              </button>
            </div>

            <div className="space-y-3">
              {compatibilities.map((comp, index) => (
                <div
                  key={index}
                  className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center"
                >
                  <input
                    type="text"
                    placeholder="Marca (ex: Fiat)"
                    value={comp.make}
                    onChange={(e) => handleCompatibilityChange(index, 'make', e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Modelo (ex: Palio, Onix)"
                    value={comp.model}
                    onChange={(e) => handleCompatibilityChange(index, 'model', e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Anos (ex: 2012-2020)"
                    value={comp.yearRange}
                    onChange={(e) => handleCompatibilityChange(index, 'yearRange', e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Motor (ex: 1.0 Fire)"
                      value={comp.engine || ''}
                      onChange={(e) => handleCompatibilityChange(index, 'engine', e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white flex-1"
                    />
                    {compatibilities.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCompatibility(index)}
                        className="p-1.5 text-rose-400 hover:text-rose-300 rounded hover:bg-rose-500/10"
                        title="Remover veículo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seção 5: Condição Climática Especial Maceió & Observações */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 cursor-pointer hover:bg-slate-800">
              <input
                type="checkbox"
                checked={criticalMaceioWeather}
                onChange={(e) => setCriticalMaceioWeather(e.target.checked)}
                className="w-4 h-4 rounded text-orange-500 bg-slate-900 border-slate-700 focus:ring-orange-500"
              />
              <div className="text-xs">
                <span className="font-bold text-white block">
                  🌊 Item com Desgaste Acelerado por Maresia / Clima de Maceió
                </span>
                <span className="text-slate-400">
                  Marque esta opção para peças vulneráveis a oxidação precoce ou sobrecarga térmica local.
                </span>
              </div>
            </label>

            <div>
              <label htmlFor="PartModal-notes" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Observações Técnicas / Aplicação
              </label>
              <textarea id="PartModal-notes"
                rows={2}
                placeholder="Ex: Instalar com junta nova; aplicar torque recomendado de 25Nm..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>
          </div>

          {/* Rodapé e Botões */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsPartModalOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="action-primary"
            >
              {selectedPartForEdit ? 'Salvar Alterações' : 'Cadastrar no Estoque'}
            </button>
          </div>
        </form>
      </div>
    </WorkshopDialog>
  );
};
