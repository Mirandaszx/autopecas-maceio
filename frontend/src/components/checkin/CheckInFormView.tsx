import { serviceOptions, symptomOptions } from './checkInOptions';
import React, { useState } from 'react';
import { useWorkshop } from '../../context/WorkshopContext';
import type { AllocatedPart } from '../../types';
import {
  Car,
  User,
  Wrench,
  AlertCircle,
  Plus,
  Trash2,
  Sparkles,
  ClipboardList
} from 'lucide-react';

export const CheckInFormView: React.FC = () => {
  const { parts, createCheckInOrder, setActiveTab, showToast } = useWorkshop();

  // Dados do Cliente
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Maceió - AL');

  // Dados do Veículo
  const [year, setYear] = useState('2022');
  const [make, setMake] = useState('Fiat');
  const [model, setModel] = useState('Argo Drive 1.0');
  const [licensePlate, setLicensePlate] = useState('RGK-5B19');
  const [vin, setVin] = useState('9BD358A14N1029384');
  const [color, setColor] = useState('Prata');
  const [mileage, setMileage] = useState('34.500 km');

  // Serviços Solicitados (Exatamente conforme o anexo do formulário)
  const [services, setServices] = useState({
    changeOilFilter: true,
    lubrication: true,
    frontAlignment: false,
    transmissionOil: false,
    wheelBearings: false,
    tireRotation: false,
    wheelBalance: false,
    checkBrakes: true,
    checkAC: false,
    checkHeater: false,
    checkExhaust: false,
    engineTuneUp: false,
    checkCooling: true,
    serviceTransmission: false,
    safetyInspection: true,
    engineOilLeak: false,
    checkShocksSteering: false
  });

  // Sintomas / Drivability (Conforme anexo)
  const [drivability, setDrivability] = useState({
    engineRunsErratic: false,
    engineWillNotStart: false,
    engineNoise: false,
    stallsBraking: false,
    roadTestRequested: false,
    hardStartCold: false,
    hardStartHot: false,
    roughIdle: false,
    noStarterAction: false,
    stallsTurning: false,
    engineStalls: false,
    cranksNoStart: false,
    engineRunsTurnedOff: false,
    exhaustSmokes: false,
    brakesPullToOneSide: false
  });

  const [otherConcerns, setOtherConcerns] = useState(
    'Cliente solicita revisão periódica antes de viagem rodoviária pela AL-101 Sul.'
  );
  const [technicianName, setTechnicianName] = useState('Mecânico Patrick');
  const [estimatedLaborCost, setEstimatedLaborCost] = useState<number>(150);

  // Peças Alocadas diretamente do estoque
  const [allocatedParts, setAllocatedParts] = useState<AllocatedPart[]>([]);
  const [selectedPartIdToAdd, setSelectedPartIdToAdd] = useState<string>('');
  const [quantityToAdd, setQuantityToAdd] = useState<number>(1);

  // Sugestões de peças compatíveis com o modelo preenchido
  const compatibleSuggestedParts = parts.filter((p) => {
    const brand = make.trim().toLowerCase();
    const vehicle = model.trim().toLowerCase();
    if (!brand && !vehicle) return false;
    return p.compatibility.some(c => (!brand || c.make.toLowerCase() === brand) &&
      (!vehicle || c.model.toLowerCase().split(' / ').some(m => vehicle.includes(m) || m.includes(vehicle))));
  });

  const handleAddPartToOrder = () => {
    if (!selectedPartIdToAdd) return;
    const part = parts.find((p) => p.id === selectedPartIdToAdd);
    if (!part) return;

    const allocated = allocatedParts.find(item => item.partId === part.id)?.quantity ?? 0;
    if (!Number.isInteger(quantityToAdd) || quantityToAdd < 1 || allocated + quantityToAdd > part.currentStock) {
      showToast('Quantidade inválida. Disponível para alocar: ' + (part.currentStock - allocated) + ' ' + part.unit + '.', 'error');
      return;
    }

    const existingIndex = allocatedParts.findIndex((item) => item.partId === part.id);
    if (existingIndex !== -1) {
      const updated = [...allocatedParts];
      const newQty = updated[existingIndex].quantity + quantityToAdd;
      updated[existingIndex].quantity = newQty;
      updated[existingIndex].totalPrice = newQty * part.sellingPrice;
      setAllocatedParts(updated);
    } else {
      setAllocatedParts([
        ...allocatedParts,
        {
          partId: part.id,
          code: part.code,
          name: part.name,
          quantity: quantityToAdd,
          unitPrice: part.sellingPrice,
          totalPrice: quantityToAdd * part.sellingPrice
        }
      ]);
    }

    setSelectedPartIdToAdd('');
    setQuantityToAdd(1);
  };

  const handleRemoveAllocatedPart = (partId: string) => {
    setAllocatedParts(allocatedParts.filter((p) => p.partId !== partId));
  };

  const partsTotal = allocatedParts.reduce((acc, p) => acc + p.totalPrice, 0);
  const grandTotal = partsTotal + Number(estimatedLaborCost);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !make.trim() || !model.trim()) {
      alert('Por favor, informe ao menos o Nome do Cliente, Marca e Modelo do Veículo.');
      return;
    }

    const order = createCheckInOrder({
      status: 'CHECK_IN',
      customer: {
        name: customerName.trim(),
        phone: phone.trim() || '(82) 90000-0000',
        address: address.trim() || 'Maceió',
        city: city.trim()
      },
      vehicle: {
        year: year.trim(),
        make: make.trim(),
        model: model.trim(),
        licensePlate: licensePlate.trim().toUpperCase(),
        vin: vin.trim().toUpperCase(),
        color: color.trim(),
        mileage: mileage.trim()
      },
      requestedServices: services,
      drivabilityIssues: drivability,
      otherConcerns: otherConcerns.trim(),
      allocatedParts,
      estimatedLaborCost: Number(estimatedLaborCost),
      totalCost: grandTotal,
      technicianName: technicianName.trim() || 'Equipe Oficina'
    });

    if (order) setActiveTab('orders');
  };

  const handleFillDemoData = () => {
    setCustomerName('Rodrigo Viana Albuquerque');
    setPhone('(82) 99182-3344');
    setAddress('Av. Senador Rui Palmeira, Levada');
    setCity('Maceió - AL');
    setYear('2020');
    setMake('Chevrolet');
    setModel('Onix 1.0 Flex');
    setLicensePlate('QWI-8890');
    setVin('9BGKL48T0L1029384');
    setColor('Preto');
    setMileage('58.120 km');
    setServices((prev) => ({
      ...prev,
      changeOilFilter: true,
      lubrication: true,
      checkBrakes: true,
      checkCooling: true
    }));
    setDrivability((prev) => ({
      ...prev,
      brakesPullToOneSide: true,
      engineNoise: false
    }));
    setOtherConcerns('Maresia forte oxidando presilhas e ruído de pastilha na roda dianteira.');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Check-in de veículo
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              RC-100
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Registre a entrada do veículo, os serviços e as peças utilizadas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleFillDemoData}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs font-semibold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Preencher exemplo</span>
          </button>
        </div>
      </div>

      {/* Formulário Principal em Cartão Estilizado (Inspirado no documento físico) */}
      <form onSubmit={handleSubmit} className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl space-y-8">
        {/* Bloco 1: Dados do Cliente */}
        <div className="space-y-4">
          <h2 className="form-section-title">
            <User className="w-4 h-4 text-orange-400" />
            <span>1. Cliente</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="CheckInFormView-customerName" className="block text-xs font-semibold text-slate-300 mb-1.5">Nome Completo *</label>
              <input id="CheckInFormView-customerName"
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ex: João da Silva Santos"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>

            <div>
              <label htmlFor="CheckInFormView-phone" className="block text-xs font-semibold text-slate-300 mb-1.5">Telefone / WhatsApp *</label>
              <input id="CheckInFormView-phone"
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(82) 9____-____"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="CheckInFormView-address" className="block text-xs font-semibold text-slate-300 mb-1.5">Endereço</label>
              <input id="CheckInFormView-address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Rua, número, bairro em Maceió"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>

            <div>
              <label htmlFor="CheckInFormView-city" className="block text-xs font-semibold text-slate-300 mb-1.5">Cidade / UF</label>
              <input id="CheckInFormView-city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>
          </div>
        </div>

        {/* Bloco 2: Dados do Veículo */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <h2 className="form-section-title">
            <Car className="w-4 h-4 text-orange-400" />
            <span>2. Veículo</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="CheckInFormView-make" className="block text-xs font-semibold text-slate-300 mb-1.5">Marca *</label>
              <input id="CheckInFormView-make"
                type="text"
                required
                value={make}
                onChange={(e) => setMake(e.target.value)}
                placeholder="Ex: Fiat, Chevrolet"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>

            <div>
              <label htmlFor="CheckInFormView-model" className="block text-xs font-semibold text-slate-300 mb-1.5">Modelo *</label>
              <input id="CheckInFormView-model"
                type="text"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Ex: Argo, Onix, Gol"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>

            <div>
              <label htmlFor="CheckInFormView-year" className="block text-xs font-semibold text-slate-300 mb-1.5">Ano Fabricação/Modelo</label>
              <input id="CheckInFormView-year"
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2021"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>

            <div>
              <label htmlFor="CheckInFormView-licensePlate" className="block text-xs font-semibold text-slate-300 mb-1.5">Placa do Carro *</label>
              <input id="CheckInFormView-licensePlate"
                type="text"
                required
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                placeholder="ABC-1234 / BRA2E19"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white uppercase focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="CheckInFormView-vin" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Chassi / VIN (17 Dígitos)
              </label>
              <input id="CheckInFormView-vin"
                type="text"
                value={vin}
                onChange={(e) => setVin(e.target.value.toUpperCase())}
                placeholder="9BG..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white font-mono uppercase focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>

            <div>
              <label htmlFor="CheckInFormView-color" className="block text-xs font-semibold text-slate-300 mb-1.5">Cor</label>
              <input id="CheckInFormView-color"
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="Prata, Branco, etc."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>

            <div>
              <label htmlFor="CheckInFormView-mileage" className="block text-xs font-semibold text-slate-300 mb-1.5">Quilometragem (KM)</label>
              <input id="CheckInFormView-mileage"
                type="text"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                placeholder="Ex: 45.000 km"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>
          </div>
        </div>

        {/* Bloco 3: Serviços Solicitados (SERVICE REQUESTED) */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="form-section-title">
              <Wrench className="w-4 h-4 text-orange-400" />
              <span>3. Serviços solicitados</span>
            </h2>
            <span className="text-xs text-slate-400">Marque as opções demandadas</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {serviceOptions.map((srv) => (
              <label
                key={srv.id}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                  services[srv.id as keyof typeof services]
                    ? 'bg-orange-500/15 border-orange-500/40 text-orange-200 font-semibold'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <input
                  type="checkbox"
                  checked={services[srv.id as keyof typeof services]}
                  onChange={(e) =>
                    setServices({ ...services, [srv.id]: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-orange-500 bg-slate-900 border-slate-700 focus:ring-orange-500"
                />
                <span>{srv.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Bloco 4: Drivability / Sintomas e Problemas relatados */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <h2 className="form-section-title">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>4. Sintomas relatados</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {symptomOptions.map((issue) => (
              <label
                key={issue.id}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                  drivability[issue.id as keyof typeof drivability]
                    ? 'bg-rose-500/15 border-rose-500/40 text-rose-200 font-semibold'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <input
                  type="checkbox"
                  checked={drivability[issue.id as keyof typeof drivability]}
                  onChange={(e) =>
                    setDrivability({ ...drivability, [issue.id]: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-rose-500 bg-slate-900 border-slate-700 focus:ring-rose-500"
                />
                <span>{issue.label}</span>
              </label>
            ))}
          </div>

          <div>
            <label htmlFor="CheckInFormView-otherConcerns" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Outras Queixas / Descrição Detalhada do Problema
            </label>
            <textarea id="CheckInFormView-otherConcerns"
              rows={2}
              value={otherConcerns}
              onChange={(e) => setOtherConcerns(e.target.value)}
              placeholder="Descreva observações relatadas pelo condutor..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            />
          </div>
        </div>

        {/* Bloco 5: Alocação Direta de Peças do Estoque */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="form-section-title">
              <ClipboardList className="w-4 h-4 text-emerald-400" />
              <span>5. Peças utilizadas</span>
            </h2>
            <span className="text-xs text-slate-400">
              {make.trim() || model.trim() ? compatibleSuggestedParts.length + ' sugestões por marca ou modelo' : 'Consulte a aplicação no catálogo'}
            </span>
          </div>

          {/* Seletor de Peças */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full">
              <label htmlFor="CheckInFormView-selectedPartIdToAdd" className="block text-[11px] font-semibold text-slate-300 mb-1">
                Selecionar Peça do Estoque
              </label>
              <select id="CheckInFormView-selectedPartIdToAdd"
                value={selectedPartIdToAdd}
                onChange={(e) => setSelectedPartIdToAdd(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              >
                <option value="">Selecione uma peça...</option>
                {parts.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.code}] {p.name} - {p.sellingPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} ({p.currentStock} {p.unit} disp. em {p.location.aisle})
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-28">
              <label htmlFor="CheckInFormView-quantityToAdd" className="block text-[11px] font-semibold text-slate-300 mb-1">Qtd</label>
              <input id="CheckInFormView-quantityToAdd"
                type="number"
                min="1"
                value={quantityToAdd}
                onChange={(e) => setQuantityToAdd(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleAddPartToOrder}
              disabled={!selectedPartIdToAdd}
              className="w-full sm:w-auto mt-auto sm:mt-5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Alocar Peça</span>
            </button>
          </div>

          {/* Tabela de Peças Alocadas */}
          {allocatedParts.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-800 text-slate-400 font-semibold border-b border-slate-700">
                    <th className="py-2.5 px-3">Código</th>
                    <th className="py-2.5 px-3">Peça</th>
                    <th className="py-2.5 px-3 text-center">Qtd</th>
                    <th className="py-2.5 px-3 text-right">Unitário</th>
                    <th className="py-2.5 px-3 text-right">Subtotal</th>
                    <th className="py-2.5 px-3 text-center">Remover</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {allocatedParts.map((item) => (
                    <tr key={item.partId} className="hover:bg-slate-800/40">
                      <td className="py-2 px-3 font-mono text-orange-400 font-bold">{item.code}</td>
                      <td className="py-2 px-3 text-white">{item.name}</td>
                      <td className="py-2 px-3 text-center font-bold">{item.quantity}</td>
                      <td className="py-2 px-3 text-right text-slate-300">
                        {item.unitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-emerald-400">
                        {item.totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveAllocatedPart(item.partId)}
                          className="p-1 text-rose-400 hover:text-rose-300"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Bloco 6: Custos Estimados & Responsável */}
        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div>
            <label htmlFor="CheckInFormView-technicianName" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Mecânico Responsável
            </label>
            <input id="CheckInFormView-technicianName"
              type="text"
              value={technicianName}
              onChange={(e) => setTechnicianName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="CheckInFormView-estimatedLaborCost" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Mão de Obra Estimada (R$)
            </label>
            <input id="CheckInFormView-estimatedLaborCost"
              type="number"
              min="0"
              value={estimatedLaborCost}
              onChange={(e) => setEstimatedLaborCost(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
            />
          </div>

          <div className="text-right p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 block">Total Previsto (Peças + Mão de Obra):</span>
            <span className="text-2xl font-black text-emerald-400">
              {grandTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
        </div>

        {/* Rodapé com Ações */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            Ao salvar, as peças alocadas darão saída automática do estoque com registro de rastreabilidade.
          </p>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Ver Ordens Existentes
            </button>
            <button
              type="submit"
              className="action-primary"
            >
              Gravar Ficha de Check-In
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
