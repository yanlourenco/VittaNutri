# Vitta Nutri — Sistema de Gestão Nutricional & Prescrição Clínica

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-0284c7?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-8.2-646cff?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon_Serverless-00E599?style=for-the-badge&logo=postgresql&logoColor=black" alt="Neon PostgreSQL" />
  <img src="https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

O **Vitta Nutri** é uma plataforma SaaS moderna desenvolvida especialmente para nutricionistas gerenciarem seus consultórios com agilidade, precisão clínica e alto padrão visual. O sistema oferece prontuário eletrônico completo, avaliação antropométrica, construtor de planos alimentares com envio para WhatsApp e calculadoras clínicas integradas.

---

## 🌟 Principais Funcionalidades

### 1. Dashboard Clínico em Tempo Real
- **Card 1 — Total de Pacientes Ativos**: Contagem em tempo real de pacientes cadastrados pela nutricionista autenticada.
- **Card 2 — Consultas da Semana**: Métrica de atendimentos e consultas registradas na semana corrente.
- **Card 3 — Pacientes sem Retorno (> 30 dias)**: Identificação automática de pacientes cuja última consulta ocorreu há mais de 30 dias e que não possuem retorno agendado.
  - Lista interativa com **acesso direto em 1 clique** ao prontuário do paciente.
  - Botão de envio rápido de mensagem no **WhatsApp** para convite de retorno.
  - Mensagem de conformidade quando todos os pacientes estiverem em dia.
- **Agenda de Próximos Retornos & Histórico Recente**: Visualização dos próximos compromissos e últimos atendimentos realizados.

### 2. Gestão de Pacientes & Anamnese Completa
- **Formulário Wizard em 3 Etapas com Barra de Progresso**:
  1. *Identificação e Medidas Iniciais* (com cálculo automático de IMC e classificação OMS).
  2. *Objetivos e Estilo de Vida* (nível de atividade, frequência alimentar, consumo de água e treinos).
  3. *Histórico Clínico e Saúde* (patologias, alergias alimentares, intolerâncias, medicamentos e suplementação).
- **Filtros Rápidos por Status**: Filtre instantaneamente por *Todos*, *Sem Retorno (>30d)* ou *Com Retorno*.
- **Busca Global**: Pesquisa em tempo real por nome, e-mail ou WhatsApp.

### 3. Prontuário Eletrônico & Evolução Antropométrica
- **Gráfico de Evolução Antropométrica**: Acompanhamento visual da evolução de peso e medidas do paciente ao longo do histórico de consultas.
- **Linha do Tempo de Consultas**: Registro detalhado de peso, circunferências (cintura e quadril), percentual de gordura e notas clínicas.
- **Relatório Timbrado para Impressão e PDF**: Formatação automática como receituário e laudo médico timbrado com espaço para assinaturas.

### 4. Construtor de Planos Alimentares (Dietas)
- Estruturação flexível de refeições (horários, porções, opções de substituição e orientações).
- **Envio Direto para WhatsApp**: Geração de texto limpo e profissional pronto para envio ao paciente.
- **Exportação em PDF e Impressão**: Layout timbrado profissional para entrega física ou digital.

### 5. Calculadoras Nutricionais Clínicas
- **Índice de Massa Corporal (IMC)**: Cálculo automático com faixa de peso saudável recomendada pela OMS.
- **Taxa Metabólica Basal (TMB) & Gasto Energético Total (GET)**: Fórmulas de *Mifflin-St Jeor* e *Harris-Benedict (Revisada)* com seleção de fator de atividade física.
- **Ingestão Hídrica Diária**: Prescrição de hidratação personalizada em litros e quantidade de copos de 250ml.

---

## 🎨 Identidade Visual & Design System

A interface do sistema foi construída seguindo padrões visuais de plataformas médicas e softwares SaaS de alta fidelidade:
- **Azul Meia-Noite (`#0b132b` / `#1c2541`)**: Autoridade, sofisticação e seriedade clínica.
- **Azul Claro / Sky (`#0284c7` / `#38bdf8` / `#e0f2fe`)**: Realces, botões de ação e métricas ativas.
- **Tons de Cinza Slate (`#f8fafc` / `#f1f5f9` / `#e2e8f0`)**: Fundos limpos, sem cansaço visual.
- **Branco Puro (`#ffffff`)**: Superfícies dos cards, modais e prontuários.
- **Iconografia Profissional**: Lucide React Vector Icons aplicados consistentemente em toda a aplicação.
- **Diálogos de Confirmação Modernos**: Modais customizados para remoção de registros em substituição aos diálogos nativos do navegador.
- **Skeleton Loaders Fluídos**: Transições e carregamentos suaves com efeito *shimmer*.

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia |
| :--- | :--- |
| **Frontend** | [React 19](https://react.dev/), [Vite](https://vitejs.dev/), [React Router v7](https://reactrouter.com/) |
| **Ícones & Estilização** | [Lucide React](https://lucide.dev/), Vanilla CSS Moderno (Design Tokens HSL/HEX) |
| **Linter & Qualidade** | [Oxlint](https://oxc.rs/) |
| **Banco de Dados** | [Neon Serverless PostgreSQL](https://neon.tech/) (`@neondatabase/serverless`) |
| **Autenticação** | Neon Auth / Better Auth Client |
| **Hospedagem / CI/CD** | [Vercel](https://vercel.com/) |

---

## 🗄️ Estrutura do Banco de Dados (Neon PostgreSQL)

```sql
-- Nutricionistas
CREATE TABLE public.nutricionistas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pacientes
CREATE TABLE public.pacientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nutricionista_id UUID REFERENCES public.nutricionistas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  data_nascimento DATE,
  sexo TEXT,
  whatsapp TEXT,
  email TEXT,
  peso_inicial NUMERIC(5,2),
  altura NUMERIC(4,2),
  objetivos TEXT[],
  objetivo_texto TEXT,
  nivel_atividade TEXT,
  patologias TEXT[],
  restricoes_alimentares TEXT[],
  alergias TEXT[],
  medicamentos TEXT,
  suplementos TEXT,
  refeicoes_por_dia INTEGER DEFAULT 3,
  horario_acorda TIME,
  horario_dorme TIME,
  litros_agua NUMERIC(3,1),
  atividade_fisica BOOLEAN DEFAULT FALSE,
  atividade_fisica_descricao TEXT,
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Consultas e Avaliações Antropométricas
CREATE TABLE public.consultas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID REFERENCES public.pacientes(id) ON DELETE CASCADE,
  data_consulta DATE NOT NULL,
  peso NUMERIC(5,2),
  cintura NUMERIC(5,2),
  quadril NUMERIC(5,2),
  percentual_gordura NUMERIC(4,2),
  observacoes TEXT,
  proximo_retorno DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Planos Alimentares
CREATE TABLE public.planos_alimentares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID REFERENCES public.pacientes(id) ON DELETE CASCADE,
  conteudo JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🚀 Como Executar o Projeto Localmente

### 1. Clone o repositório
```bash
git clone https://github.com/yanlourenco/VittaNutri.git
cd VittaNutri
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
VITE_DATABASE_URL=postgresql://neondb_owner:[SUA_SENHA]@[HOST].sa-east-1.aws.neon.tech/neondb?sslmode=require
VITE_NEON_AUTH_URL=https://[SEU_AUTH_ENDPOINT].neonauth.sa-east-1.aws.neon.tech/neondb/auth
```

### 4. Inicie o servidor de desenvolvimento
```bash
npm run dev
```
O sistema estará acessível em `http://localhost:5173`.

### 5. Build para Produção
```bash
npm run build
```

---

## ☁️ Deploy na Vercel

O projeto está pronto para deploy na **Vercel**, incluindo o arquivo `vercel.json` configurado com *rewrites* para suporte completo a Single-Page Application (SPA):

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

No painel da Vercel (*Settings > Environment Variables*), adicione:
1. `VITE_DATABASE_URL`
2. `VITE_NEON_AUTH_URL`

---

## 📄 Licença

Este projeto é desenvolvido para uso profissional em gestão de consultórios nutricionais. Todos os direitos reservados.
