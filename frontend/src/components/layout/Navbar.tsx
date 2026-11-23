import { useState } from 'react';
import { Search, Wrench, RotateCcw, Plus } from 'lucide-react';
import { useWorkshop } from '../../context/WorkshopContext';

export function Navbar() {
  const { setActiveTab, setSearchTerm, setSelectedShelfFilter, setSelectedPartForEdit, setIsPartModalOpen, resetToDefaults } = useWorkshop();
  const [query, setQuery] = useState('');

  return (
    <header className="workbar">
      <button className="brand" onClick={() => setActiveTab('dashboard')} aria-label="AutoPeças Maceió, visão geral">
        <span className="brand-icon"><Wrench size={23} strokeWidth={2.4} /></span>
        <span>AutoPeças <strong>Maceió</strong></span>
      </button>
      <form role="search" aria-label="Busca global" className="global-search" onSubmit={(event) => {
        event.preventDefault();
        setSearchTerm(query.trim());
        setSelectedShelfFilter(null);
        setActiveTab('parts');
        setQuery('');
      }}>
        <Search size={17} />
        <input type="search" aria-label="Buscar peças no catálogo" placeholder="Buscar peça, código ou veículo" value={query} onChange={e => setQuery(e.target.value)} />
        <button type="submit" aria-label="Pesquisar no catálogo">Buscar</button>
      </form>
      <div className="toolbar-actions">
        <button className="tool-button add-part" aria-label="Nova peça" title="Nova peça" onClick={() => { setSelectedPartForEdit(null); setIsPartModalOpen(true); }}>
          <Plus size={17} /><span>Nova peça</span>
        </button>
        <button className="tool-button" aria-label="Restaurar dados de demonstração" title="Restaurar dados de demonstração" onClick={() => {
          if (window.confirm('Restaurar os dados de demonstração? As alterações salvas neste navegador serão substituídas.')) resetToDefaults();
        }}><RotateCcw size={16} /></button>
      </div>
    </header>
  );
}
