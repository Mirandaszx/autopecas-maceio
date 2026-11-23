# Projeto de Intervenção: Gestão de Peças Automotivas
> **Atividades Práticas de Extensão • Ciência da Computação**  
> *Modernização e eficiência para oficinas mecânicas em Maceió/AL*

Este projeto foi concebido para resolver os gargalos operacionais de oficinas mecânicas locais, eliminando o controle manual em papel, reduzindo o tempo de procura por peças e prevenindo erros de compatibilidade com veículos.

---

## 👥 Equipe Discente do Projeto
- **Matheus**: Visão estratégica, coordenação e apresentação.
- **Erick**: Diagnóstico de gargalos e especificação da solução digital.
- **Gabriel**: Análise de mercado local, informalidade e fatores climáticos (maresia em Maceió).
- **João**: Metodologia de extensão (Mapeamento, Desenvolvimento, Implantação e Treinamento).
- **Patrick**: Arquitetura tecnológica, banco de dados e engenharia de software.

---

## 🛠️ Tecnologias Utilizadas no Frontend
- **React 19** com **TypeScript**
- **Vite** (Build ultrarrápido)
- **Tailwind CSS v4** (Design moderno, responsivo e adaptado para tablets de mecânicos)
- **Lucide React** (Ícones temáticos automotivos e de oficina)
- **LocalStorage State Provider** (Persistência reativa completa sem necessidade imediata de backend)

---

## 🚀 Como Executar o Frontend

```bash
# 1. Acesse a pasta do frontend
cd frontend

# 2. Instale as dependências (caso ainda não tenha feito)
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

Abra seu navegador no endereço exibido no terminal (geralmente `http://localhost:5173`).

---

## 📋 Módulos e Telas Implementadas

### 1. 📊 Visão Geral (Dashboard)
- Indicadores em tempo real: total de modelos e unidades físicas em estoque, itens em nível crítico abaixo do estoque mínimo, valor total imobilizado (custo vs. venda) e ordens ativas.
- Alertas de reposição imediata com atalho de entrada de estoque.
- Módulo regional de **alerta de desgaste por maresia e umidade litorânea de Maceió**.
- Histórico das últimas movimentações com rastreabilidade por mecânico.

### 2. 📦 Catálogo de Peças & Suprimentos
- Cadastro estruturado com Código/SKU, Categoria, Fabricante, Preço de Custo, Preço de Venda, Unidade e Estoque Mínimo.
- **Localização física precisa na oficina**: Corredor, Prateleira e Gaveta/Caixa (resolvendo o problema de mecânicos perderem tempo procurando peças).
- **Compatibilidade veicular multi-modelos** (ex: Palio, Onix, Gol, Kwid, Corolla, Toro).
- Busca instantânea inteligente (digite o modelo do carro, o código da peça ou a prateleira).
- Alternância entre visualização em **Tabela** (desktop administrativo) e **Cards** (tablet para a oficina).
- Modal para movimentação rápida (Entrada, Saída, Ajuste de Balanço).

### 3. 📝 Ficha de Check-in Digital (*Pre-Service Check-In Sheet*)
Fielmente inspirada no anexo do formulário de inspeção veicular (**Form #RC-100 / Item #7280**):
- **Dados do Proprietário**: Nome, Telefone, Endereço e Bairro em Maceió.
- **Identificação do Veículo**: Marca, Modelo, Ano, Placa, VIN/Chassi (17 dígitos), Cor e KM atual.
- **Checklist de Serviços Requisitados**: Troca de óleo/filtro, lubrificação, alinhamento, freios, ar condicionado, arrefecimento, etc.
- **Sintomas de Dirigibilidade (*Drivability*)**: Falhas a frio/quente, ruídos no motor, problemas na partida, fumaça, freios puxando para o lado.
- **Alocação Direta de Peças do Estoque**: Permite selecionar peças do estoque, calcular subtotais e efetuar a **baixa automática do estoque** ao salvar.
- Cálculo de mão de obra e valor total estimado.

### 4. 📋 Ordens de Serviço (Acompanhamento)
- Acompanhamento do ciclo de vida: *Check-in* → *Em Diagnóstico* → *Aguardando Peças* → *Em Execução* → *Finalizado*.
- Visualização de ficha para impressão com termo de autorização assinado pelo cliente.

### 5. 🗺️ Mapa Visual de Prateleiras (Localizador de Estoque)
- Mapeamento interativo dos corredores (A, B, C, D) e estantes (níveis 1 a 4).
- O mecânico clica na estante e visualiza instantaneamente o que está guardado naquele local físico.

### 6. 🚚 Fornecedores de Autopeças
- Cadastro de distribuidores locais de Maceió e região.
- Informações de contato, categorias atendidas e prazo médio de entrega.

### 7. 🎓 Painel do Projeto de Extensão
- Apresentação acadêmica com justificativa socioeconômica para Maceió, metodologia em 4 passos (Mapeamento, Desenvolvimento, Implantação e Treinamento) e papéis da equipe.

---

## 🔌 Estrutura Futura para o Backend Node.js

Para adicionar a API em Node.js no mesmo repositório, basta criar uma pasta `backend/`:
```
Projeto de Extensão/
├── frontend/          # React + Vite + TypeScript + Tailwind
├── backend/           # Node.js + Express/Fastify + SQLite/Prisma (futuro)
└── README.md
```
As chamadas no `WorkshopContext.tsx` foram projetadas para serem facilmente integradas a requisições `fetch`/`axios` apontando para a API Node.js.
