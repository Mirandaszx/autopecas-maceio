import { WorkshopDialog } from '../common/WorkshopDialog';
import React, { useState } from 'react';
import { useWorkshop } from '../../context/WorkshopContext';
import { Truck, Phone, Mail, MapPin, Clock, Plus, Trash2, X, Building } from 'lucide-react';

export const SuppliersView: React.FC = () => {
  const { suppliers, addSupplier, deleteSupplier } = useWorkshop();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [categories, setCategories] = useState('Freios, Filtros, Óleos');
  const [deliveryDays, setDeliveryDays] = useState<number>(2);
  const [city, setCity] = useState('Maceió - AL');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    addSupplier({
      name: name.trim(),
      cnpj: cnpj.trim() || '00.000.000/0001-00',
      phone: phone.trim() || '(82) 3000-0000',
      email: email.trim(),
      contactPerson: contactPerson.trim() || 'Comercial',
      categoriesSupplied: categories.split(',').map((c) => c.trim()).filter(Boolean),
      averageDeliveryDays: Number(deliveryDays),
      city: city.trim()
    });

    setIsModalOpen(false);
    setName('');
    setCnpj('');
    setPhone('');
    setEmail('');
    setContactPerson('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold text-white tracking-tight">Fornecedores</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {suppliers.length} parceiros
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Consulte contatos, categorias e prazos de entrega.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="action-primary"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Novo Fornecedor</span>
        </button>
      </div>

      {/* Grid de Fornecedores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliers.map((sup) => (
          <div
            key={sup.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-lg hover:border-slate-600 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white leading-tight">{sup.name}</h3>
                    <span className="font-mono text-[11px] text-slate-400">{sup.cnpj}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (window.confirm(`Remover fornecedor "${sup.name}"?`)) {
                      deleteSupplier(sup.id);
                    }
                  }}
                  className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                  title="Remover fornecedor"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Categorias */}
              <div className="flex flex-wrap gap-1.5">
                {sup.categoriesSupplied.map((cat, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700"
                  >
                    {cat}
                  </span>
                ))}
              </div>

              {/* Contatos */}
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-xs space-y-1.5">
                <p className="text-slate-300 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-orange-400" />
                  <span>{sup.phone}</span>
                </p>
                {sup.email && (
                  <p className="text-slate-400 flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    <span>{sup.email}</span>
                  </p>
                )}
                <p className="text-slate-400 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{sup.city}</span>
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 text-amber-300 font-medium">
                <Clock className="w-3.5 h-3.5" />
                Entrega em ~{sup.averageDeliveryDays} dia(s)
              </span>
              <span>Contato: {sup.contactPerson}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Cadastro de Fornecedor */}
      {isModalOpen && (
        <WorkshopDialog title="Novo fornecedor" onDismiss={() => setIsModalOpen(false)}>
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-orange-400" />
                Cadastrar Fornecedor de Peças
              </h2>
              <button
                aria-label="Fechar janela"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label htmlFor="SuppliersView-name" className="block text-xs font-semibold text-slate-300 mb-1">Razão Social / Nome *</label>
                <input id="SuppliersView-name"
                  type="text"
                  required
                  placeholder="Ex: Distribuidora Alagoas de Peças"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="SuppliersView-cnpj" className="block text-xs font-semibold text-slate-300 mb-1">CNPJ</label>
                  <input id="SuppliersView-cnpj"
                    type="text"
                    placeholder="00.000.000/0001-00"
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="SuppliersView-phone" className="block text-xs font-semibold text-slate-300 mb-1">Telefone</label>
                  <input id="SuppliersView-phone"
                    type="text"
                    placeholder="(82) 3333-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="SuppliersView-email" className="block text-xs font-semibold text-slate-300 mb-1">E-mail Comercial</label>
                <input id="SuppliersView-email"
                  type="email"
                  placeholder="pedidos@empresa.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="SuppliersView-contactPerson" className="block text-xs font-semibold text-slate-300 mb-1">Pessoa de Contato</label>
                  <input id="SuppliersView-contactPerson"
                    type="text"
                    placeholder="Ex: Vendedor Carlos"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="SuppliersView-deliveryDays" className="block text-xs font-semibold text-slate-300 mb-1">Prazo Médio (Dias)</label>
                  <input id="SuppliersView-deliveryDays"
                    type="number"
                    min="1"
                    value={deliveryDays}
                    onChange={(e) => setDeliveryDays(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="SuppliersView-city" className="block text-xs font-semibold text-slate-300 mb-1">Localização (Cidade/Bairro)</label>
                <input id="SuppliersView-city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="SuppliersView-categories" className="block text-xs font-semibold text-slate-300 mb-1">Categorias Fornecidas</label>
                <input id="SuppliersView-categories"
                  type="text"
                  placeholder="Freios, Filtros, Lubrificantes (separar por vírgula)"
                  value={categories}
                  onChange={(e) => setCategories(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-bold"
                >
                  Salvar Fornecedor
                </button>
              </div>
            </form>
          </div>
        </WorkshopDialog>
      )}
    </div>
  );
};
