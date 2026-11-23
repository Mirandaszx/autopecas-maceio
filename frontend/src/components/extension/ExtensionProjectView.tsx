import React from 'react';
import {
  GraduationCap,
  Users,
  Target,
  Workflow,
  MapPin,
  HeartHandshake,
  TrendingUp
} from 'lucide-react';

export const ExtensionProjectView: React.FC = () => {
  const teamMembers = [
    {
      name: 'Matheus',
      role: 'Apresentação & Encerramento',
      speech:
        'Visão estratégica do projeto de extensão: levar modernização, controle de suprimentos e tecnologia acessível para oficinas mecânicas de Maceió.'
    },
    {
      name: 'Erick',
      role: 'Diagnóstico & Solução Digital',
      speech:
        'Mapeamento dos gargalos operacionais: eliminação do controle manual em papel, redução de erros de compatibilidade e velocidade de busca.'
    },
    {
      name: 'Gabriel',
      role: 'Objetivos & Contextualização Local',
      speech:
        'Análise de mercado: empreendimentos familiares, informalidade e o impacto severo da maresia e umidade tropical de Maceió na vida útil das peças.'
    },
    {
      name: 'João',
      role: 'Público Beneficiado & Metodologia',
      speech:
        'Estruturação dos 4 passos metodológicos da extensão: Mapeamento local, Desenvolvimento de software, Implantação piloto e Treinamento mecânico.'
    },
    {
      name: 'Patrick',
      role: 'Arquitetura Tecnológica & Impacto',
      speech:
        'Escolha de tecnologias robustas (React, TypeScript, Tailwind, Node.js), interface de alta usabilidade e integração de dados de estoque.'
    }
  ];

  const methodologySteps = [
    {
      step: '1',
      title: 'Mapeamento',
      desc: 'Visitas in loco a oficinas mecânicas de Maceió e levantamento de requisitos de peças e atendimento.'
    },
    {
      step: '2',
      title: 'Desenvolvimento',
      desc: 'Construção ágil da aplicação web, catálogo com compatibilidade veicular e digitalização da folha de check-in.'
    },
    {
      step: '3',
      title: 'Implantação',
      desc: 'Testes do sistema com dados de estoque reais e validação prática da usabilidade pelos próprios mecânicos.'
    },
    {
      step: '4',
      title: 'Treinamento',
      desc: 'Capacitação da equipe da oficina para assegurar a autonomia e adoção contínua da ferramenta digital.'
    }
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      <header className="extension-intro">
        <h1>Gestão de peças automotivas em Maceió</h1>
        <p>Projeto de extensão em Ciência da Computação para digitalizar o estoque e o pré-atendimento de pequenas oficinas mecânicas.</p>
        <div><GraduationCap size={17} /> Atividades Práticas de Extensão <span><MapPin size={16} /> Maceió, AL</span></div>
      </header>

      {/* Os 4 Objetivos Principais do Projeto (Do Slide 4) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-orange-400" />
          <h2 className="text-lg font-bold text-white">Objetivos do projeto</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { num: '1', title: 'Organizar Peças Locais', desc: 'Estruturação do catálogo com códigos, fabricantes e prateleiras da oficina.' },
            { num: '2', title: 'Interface Acessível', desc: 'Telas limpas e intuitivas para mecânicos e atendentes sem afinidade tecnológica.' },
            { num: '3', title: 'Eliminar Retrabalho', desc: 'Prevenção de erros na identificação de compatibilidade e atrasos na entrega.' },
            { num: '4', title: 'Validação Real', desc: 'Uso com dados e veículos autênticos da frota em circulação em Maceió.' }
          ].map((obj) => (
            <div key={obj.num} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <h3 className="font-bold text-sm text-white">{obj.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{obj.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Metodologia de Aplicação (Slide 7) */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center gap-2">
          <Workflow className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-bold text-white">Passo a Passo: Metodologia de Aplicação</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {methodologySteps.map((m) => (
            <div
              key={m.step}
              className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/80 space-y-2 relative overflow-hidden"
            >
              <div className="text-3xl font-black text-slate-800 absolute right-3 bottom-1 select-none">
                0{m.step}
              </div>
              <span className="font-bold text-xs text-blue-400 uppercase tracking-wider block">
                Etapa {m.step}
              </span>
              <h3 className="font-bold text-sm text-white">{m.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed relative z-10">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* A Equipe Discente (Slides da Apresentação) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-bold text-white">Equipe do projeto</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white">{member.name}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  {member.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{member.speech}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Resultados & Impacto Esperado (Slide 9) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <GraduationCap className="w-5 h-5 text-orange-400" />
          <h3 className="font-bold text-sm text-white">Formação Acadêmica</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Integração prática da teoria em Ciência da Computação com resolução de problemas reais de gestão mecânica.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-sm text-white">Excelência Operacional</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Processos ágeis, redução de custos com estoques parados e controle total de peças na oficina.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <HeartHandshake className="w-5 h-5 text-blue-400" />
          <h3 className="font-bold text-sm text-white">Impacto Setorial em Alagoas</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Incentivo direto à modernização e formalização de um dos setores mais tradicionais do comércio de Maceió.
          </p>
        </div>
      </div>
    </div>
  );
};
