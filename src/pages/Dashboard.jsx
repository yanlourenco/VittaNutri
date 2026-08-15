import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../lib/auth';
import {
  getOrCreateNutricionista,
  getDashboardData,
  getPacientes,
  createPaciente,
  updatePaciente,
  deletePaciente,
  createConsulta,
  getAllPlanosAlimentares,
  createPlanoAlimentar,
  deletePlanoAlimentar
} from '../lib/db';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import Toast from '../components/Toast';
import PatientFormModal from '../components/PatientFormModal';
import PatientDetailsModal from '../components/PatientDetailsModal';
import ConsultationModal from '../components/ConsultationModal';
import MealPlanModal from '../components/MealPlanModal';
import CalculatorsTab from '../components/CalculatorsTab';

import {
  Users,
  Stethoscope,
  UtensilsCrossed,
  Calendar,
  Search,
  Plus,
  ArrowRight,
  Eye,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Scale,
  Clock,
  RefreshCw,
  Share2
} from 'lucide-react';

export default function Dashboard({ session }) {
  const navigate = useNavigate();

  // Navigation
  const [activeTab, setActiveTab] = useState('overview');

  // Nutricionista & Data State
  const [nutricionista, setNutricionista] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [pacientesList, setPacientesList] = useState([]);
  const [allPlanosList, setAllPlanosList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Search & Filters
  const [pacienteSearch, setPacienteSearch] = useState('');
  const [objetivoFilter, setObjetivoFilter] = useState('');
  const [planoSearch, setPlanoSearch] = useState('');

  // Modals Control
  const [isPatientFormOpen, setIsPatientFormOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedPatientForDetails, setSelectedPatientForDetails] = useState(null);

  const [isConsultaOpen, setIsConsultaOpen] = useState(false);
  const [preSelectedPatientId, setPreSelectedPatientId] = useState(null);

  const [isMealPlanOpen, setIsMealPlanOpen] = useState(false);
  const [planToView, setPlanToView] = useState(null);

  // Toast notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Carregar dados iniciais
  useEffect(() => {
    async function init() {
      if (!session?.user) return;
      try {
        setLoading(true);
        const nutri = await getOrCreateNutricionista(session.user);
        setNutricionista(nutri);
        if (nutri) {
          await loadAllData(nutri.id);
        }
      } catch (err) {
        console.error('Error initializing dashboard:', err);
        showToast('Erro ao carregar dados do usuário.', 'error');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [session]);

  const loadAllData = async (nutriId) => {
    if (!nutriId) return;
    try {
      const [stats, pacientes, planos] = await Promise.all([
        getDashboardData(nutriId),
        getPacientes(nutriId),
        getAllPlanosAlimentares(nutriId)
      ]);
      setDashboardStats(stats);
      setPacientesList(pacientes || []);
      setAllPlanosList(planos || []);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  const handleRefresh = async () => {
    if (!nutricionista?.id) return;
    setRefreshing(true);
    await loadAllData(nutricionista.id);
    setRefreshing(false);
    showToast('Dados atualizados com sucesso!');
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  // PACIENTE ACTIONS
  const handleOpenNewPatient = () => {
    setPatientToEdit(null);
    setIsPatientFormOpen(true);
  };

  const handleOpenEditPatient = (p) => {
    setPatientToEdit(p);
    setIsPatientFormOpen(true);
  };

  const handleSavePatient = async (patientData) => {
    if (!nutricionista?.id) return;
    if (patientToEdit?.id) {
      await updatePaciente(patientToEdit.id, patientData);
      showToast('Paciente atualizado com sucesso!');
      if (selectedPatientForDetails?.id === patientToEdit.id) {
        setSelectedPatientForDetails(prev => ({ ...prev, ...patientData }));
      }
    } else {
      await createPaciente(nutricionista.id, patientData);
      showToast('Paciente cadastrado com sucesso!');
    }
    await loadAllData(nutricionista.id);
  };

  const handleDeletePatient = async (id, nome) => {
    if (window.confirm(`Deseja realmente remover o paciente ${nome}? Todas as consultas e planos também serão apagados.`)) {
      await deletePaciente(id);
      showToast('Paciente removido com sucesso!');
      if (selectedPatientForDetails?.id === id) {
        setIsDetailsOpen(false);
      }
      await loadAllData(nutricionista.id);
    }
  };

  const handleViewPatientDetails = (p) => {
    setSelectedPatientForDetails(p);
    setIsDetailsOpen(true);
  };

  // CONSULTA ACTIONS
  const handleOpenNewConsulta = (patientId = null) => {
    setPreSelectedPatientId(patientId);
    setIsConsultaOpen(true);
  };

  const handleSaveConsulta = async (consultaData) => {
    await createConsulta(consultaData);
    showToast('Consulta e medidas registradas com sucesso!');
    if (nutricionista?.id) {
      await loadAllData(nutricionista.id);
    }
  };

  // PLANO ACTIONS
  const handleOpenNewPlano = (patientId = null) => {
    setPreSelectedPatientId(patientId);
    setPlanToView(null);
    setIsMealPlanOpen(true);
  };

  const handleViewPlano = (plano) => {
    setPlanToView(plano);
    setPreSelectedPatientId(plano.paciente_id);
    setIsMealPlanOpen(true);
  };

  const handleSavePlano = async (planoData) => {
    await createPlanoAlimentar(planoData);
    showToast('Plano alimentar salvo com sucesso!');
    if (nutricionista?.id) {
      await loadAllData(nutricionista.id);
    }
  };

  const handleDeletePlanoItem = async (id) => {
    if (window.confirm('Deseja excluir este plano alimentar?')) {
      await deletePlanoAlimentar(id);
      showToast('Plano alimentar excluído.');
      if (nutricionista?.id) {
        await loadAllData(nutricionista.id);
      }
    }
  };

  // FILTRAGEM DE PACIENTES
  const filteredPacientes = useMemo(() => {
    return pacientesList.filter(p => {
      const matchSearch = pacienteSearch === '' ||
        p.nome?.toLowerCase().includes(pacienteSearch.toLowerCase()) ||
        p.email?.toLowerCase().includes(pacienteSearch.toLowerCase()) ||
        p.whatsapp?.includes(pacienteSearch);

      const matchObjetivo = objetivoFilter === '' ||
        (Array.isArray(p.objetivos) && p.objetivos.includes(objetivoFilter));

      return matchSearch && matchObjetivo;
    });
  }, [pacientesList, pacienteSearch, objetivoFilter]);

  // FILTRAGEM DE PLANOS
  const filteredPlanos = useMemo(() => {
    return allPlanosList.filter(pl => {
      const title = pl.conteudo?.titulo || '';
      const pName = pl.paciente_nome || '';
      return planoSearch === '' ||
        title.toLowerCase().includes(planoSearch.toLowerCase()) ||
        pName.toLowerCase().includes(planoSearch.toLowerCase());
    });
  }, [allPlanosList, planoSearch]);

  if (loading) {
    return (
      <div className="dashboard-loading-screen">
        <div className="spinner" />
        <p>Carregando sistema Vitta Nutri...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        session={session}
        onLogout={handleLogout}
      />

      <div className="app-main-layout">
        <Header
          session={session}
          onNewPatient={handleOpenNewPatient}
          onNewConsulta={() => handleOpenNewConsulta()}
          onNewPlano={() => handleOpenNewPlano()}
        />

        <Toast toast={toast} onClose={() => setToast(null)} />

        <main className="main-content-scroll">
          {/* ========================================================
              TAB 1: VISÃO GERAL (OVERVIEW)
             ======================================================== */}
          {activeTab === 'overview' && (
            <div className="overview-tab">
              {/* Top Banner with summary metrics */}
              <div className="stats-grid">
                <StatsCard
                  title="Total de Pacientes"
                  value={dashboardStats?.totalPacientes || 0}
                  subtitle="Cadastrados no sistema"
                  icon={Users}
                  color="blue"
                  onClick={() => setActiveTab('pacientes')}
                />
                <StatsCard
                  title="Consultas Realizadas"
                  value={dashboardStats?.totalConsultas || 0}
                  subtitle="Avaliações antropométricas"
                  icon={Stethoscope}
                  color="green"
                  onClick={() => setActiveTab('consultas')}
                />
                <StatsCard
                  title="Próximos Retornos"
                  value={dashboardStats?.totalProximosRetornos || 0}
                  subtitle="Consultas agendadas"
                  icon={Calendar}
                  color="orange"
                  onClick={() => setActiveTab('consultas')}
                />
                <StatsCard
                  title="Planos Criados"
                  value={dashboardStats?.totalPlanos || 0}
                  subtitle="Cardápios individualizados"
                  icon={UtensilsCrossed}
                  color="purple"
                  onClick={() => setActiveTab('planos')}
                />
              </div>

              {/* Two Column Layout: Retornos & Recent Consultations */}
              <div className="overview-grid-2">
                {/* Card 1: Próximos Retornos */}
                <div className="dashboard-section-card">
                  <div className="section-card-header">
                    <div>
                      <h3>📅 Próximos Retornos Agendados</h3>
                      <p>Pacientes com retorno previsto para os próximos dias</p>
                    </div>
                    <button className="btn-link" onClick={() => setActiveTab('consultas')}>
                      Ver todos <ArrowRight size={14} />
                    </button>
                  </div>

                  {dashboardStats?.proximosRetornos?.length === 0 ? (
                    <div className="empty-state-mini">
                      <Calendar size={32} color="var(--text-muted)" />
                      <p>Nenhum retorno agendado para os próximos dias.</p>
                      <button className="btn-outline btn-sm" onClick={() => handleOpenNewConsulta()}>
                        Registrar Consulta / Retorno
                      </button>
                    </div>
                  ) : (
                    <div className="retornos-list">
                      {dashboardStats?.proximosRetornos?.map((ret) => (
                        <div key={ret.id} className="retorno-item">
                          <div className="retorno-avatar">
                            {ret.paciente_nome?.charAt(0).toUpperCase() || 'P'}
                          </div>
                          <div className="retorno-info">
                            <strong>{ret.paciente_nome}</strong>
                            <span>Retorno em: {new Date(ret.proximo_retorno).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <div className="retorno-actions">
                            {ret.paciente_whatsapp && (
                              <a
                                href={`https://api.whatsapp.com/send?phone=55${ret.paciente_whatsapp.replace(/\D/g, '')}&text=Ol%C3%A1%20${encodeURIComponent(ret.paciente_nome)},%20lembrando%20da%20sua%20consulta%20de%20retorno%20no%20dia%20${encodeURIComponent(new Date(ret.proximo_retorno).toLocaleDateString('pt-BR'))}!`}
                                target="_blank"
                                rel="noreferrer"
                                className="btn-icon-whatsapp"
                                title="Lembrar pelo WhatsApp"
                              >
                                <Share2 size={14} />
                              </a>
                            )}
                            <button
                              className="btn-outline btn-sm"
                              onClick={() => handleOpenNewConsulta(ret.paciente_id)}
                            >
                              Atender
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card 2: Consultas Recentes */}
                <div className="dashboard-section-card">
                  <div className="section-card-header">
                    <div>
                      <h3>🩺 Atendimentos Recentes</h3>
                      <p>Últimas consultas e avaliações registradas</p>
                    </div>
                    <button className="btn-link" onClick={() => setActiveTab('consultas')}>
                      Histórico <ArrowRight size={14} />
                    </button>
                  </div>

                  {dashboardStats?.consultasRecentes?.length === 0 ? (
                    <div className="empty-state-mini">
                      <Stethoscope size={32} color="var(--text-muted)" />
                      <p>Nenhuma consulta realizada ainda.</p>
                      <button className="btn-primary-action btn-sm" onClick={() => handleOpenNewConsulta()}>
                        Registrar Primeira Consulta
                      </button>
                    </div>
                  ) : (
                    <div className="recent-consultas-list">
                      {dashboardStats?.consultasRecentes?.map((c) => (
                        <div key={c.id} className="recent-consulta-item">
                          <div className="consulta-date-box">
                            <span className="c-day">{new Date(c.data_consulta).getDate()}</span>
                            <span className="c-month">
                              {new Date(c.data_consulta).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
                            </span>
                          </div>
                          <div className="recent-consulta-info">
                            <strong>{c.paciente_nome}</strong>
                            <div className="recent-consulta-sub">
                              {c.peso && <span>Peso: {c.peso} kg</span>}
                              {c.percentual_gordura && <span>% Gordura: {c.percentual_gordura}%</span>}
                            </div>
                          </div>
                          <button
                            className="btn-outline btn-sm"
                            onClick={() => {
                              const p = pacientesList.find(item => item.id === c.paciente_id);
                              if (p) handleViewPatientDetails(p);
                            }}
                          >
                            Ver Prontuário
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Objetivos dos Pacientes & Atalhos Rápidos */}
              <div className="overview-grid-2" style={{ marginTop: '1.5rem' }}>
                <div className="dashboard-section-card">
                  <div className="section-card-header">
                    <div>
                      <h3>🎯 Distribuição de Objetivos</h3>
                      <p>Metas mais comuns entre seus pacientes</p>
                    </div>
                  </div>

                  {dashboardStats?.objetivosCount && Object.keys(dashboardStats.objetivosCount).length > 0 ? (
                    <div className="objetivos-progress-list">
                      {Object.entries(dashboardStats.objetivosCount).map(([obj, count]) => {
                        const total = dashboardStats.totalPacientes || 1;
                        const pct = Math.round((count / total) * 100);
                        return (
                          <div key={obj} className="progress-item">
                            <div className="progress-label-row">
                              <span className="progress-title">{obj}</span>
                              <span className="progress-count">{count} ({pct}%)</span>
                            </div>
                            <div className="progress-bar-bg">
                              <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-muted" style={{ padding: '1rem 0' }}>Cadastre pacientes com objetivos para visualizar o gráfico de metas.</p>
                  )}
                </div>

                <div className="dashboard-section-card quick-actions-panel">
                  <div className="section-card-header">
                    <div>
                      <h3>⚡ Ações Rápidas</h3>
                      <p>Atalhos para as operações mais frequentes</p>
                    </div>
                  </div>

                  <div className="quick-buttons-grid">
                    <button className="quick-btn" onClick={handleOpenNewPatient}>
                      <div className="quick-btn-icon" style={{ backgroundColor: '#eff6ff', color: 'var(--primary)' }}>
                        <Users size={20} />
                      </div>
                      <div className="quick-btn-text">
                        <strong>Cadastrar Paciente</strong>
                        <span>Ficha completa de anamnese</span>
                      </div>
                    </button>

                    <button className="quick-btn" onClick={() => handleOpenNewConsulta()}>
                      <div className="quick-btn-icon" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
                        <Stethoscope size={20} />
                      </div>
                      <div className="quick-btn-text">
                        <strong>Nova Consulta</strong>
                        <span>Medição e evolução</span>
                      </div>
                    </button>

                    <button className="quick-btn" onClick={() => handleOpenNewPlano()}>
                      <div className="quick-btn-icon" style={{ backgroundColor: '#faf5ff', color: '#8b5cf6' }}>
                        <UtensilsCrossed size={20} />
                      </div>
                      <div className="quick-btn-text">
                        <strong>Montar Cardápio</strong>
                        <span>Gerador e envio WhatsApp</span>
                      </div>
                    </button>

                    <button className="quick-btn" onClick={() => setActiveTab('calculadoras')}>
                      <div className="quick-btn-icon" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
                        <Scale size={20} />
                      </div>
                      <div className="quick-btn-text">
                        <strong>Calculadoras Clínicas</strong>
                        <span>IMC, TMB, GET e Água</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 2: GESTÃO DE PACIENTES
             ======================================================== */}
          {activeTab === 'pacientes' && (
            <div className="pacientes-tab">
              <div className="page-header-row">
                <div>
                  <h2>Gestão de Pacientes ({filteredPacientes.length})</h2>
                  <p>Cadastre, acompanhe a evolução e acesse prontuários completos</p>
                </div>
                <button className="btn-primary-action" onClick={handleOpenNewPatient}>
                  <Plus size={16} /> Novo Paciente
                </button>
              </div>

              {/* Filters Bar */}
              <div className="filters-bar">
                <div className="search-input-wrapper">
                  <Search size={18} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Buscar por nome, email ou whatsapp..."
                    value={pacienteSearch}
                    onChange={(e) => setPacienteSearch(e.target.value)}
                  />
                </div>

                <div className="filter-select-wrapper">
                  <select
                    value={objetivoFilter}
                    onChange={(e) => setObjetivoFilter(e.target.value)}
                    className="form-control-sm"
                  >
                    <option value="">Todos os Objetivos</option>
                    <option value="Emagrecimento">Emagrecimento</option>
                    <option value="Hipertrofia / Ganho de Massa">Hipertrofia</option>
                    <option value="Reeducação Alimentar">Reeducação Alimentar</option>
                    <option value="Saúde & Qualidade de Vida">Saúde & Qualidade de Vida</option>
                    <option value="Performance Esportiva">Performance</option>
                  </select>
                </div>

                <button className="btn-refresh" onClick={handleRefresh} title="Recarregar">
                  <RefreshCw size={16} className={refreshing ? 'spinning' : ''} />
                </button>
              </div>

              {/* Pacientes Table / List */}
              {filteredPacientes.length === 0 ? (
                <div className="empty-state-card">
                  <Users size={48} className="empty-icon" />
                  <h3>Nenhum paciente encontrado</h3>
                  <p>Cadastre seus pacientes para acompanhar prontuários, consultas e dietas.</p>
                  <button className="btn-primary-action" onClick={handleOpenNewPatient}>
                    <Plus size={16} /> Cadastrar Primeiro Paciente
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Paciente</th>
                        <th>Contato</th>
                        <th>Objetivo Principal</th>
                        <th>Peso Inicial</th>
                        <th>Consultas</th>
                        <th>Próximo Retorno</th>
                        <th style={{ textAlign: 'right' }}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPacientes.map((p) => {
                        const objPrincipal = Array.isArray(p.objetivos) && p.objetivos.length > 0 ? p.objetivos[0] : 'Geral';
                        return (
                          <tr key={p.id}>
                            <td>
                              <div className="table-patient-cell">
                                <div className="table-avatar">
                                  {p.nome.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <span className="table-p-name">{p.nome}</span>
                                  <span className="table-p-sub">{p.sexo || 'Sexo N/I'} • {p.nivel_atividade || 'Sedentário'}</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="table-contact-cell">
                                {p.whatsapp && (
                                  <span className="contact-link"><Phone size={13} /> {p.whatsapp}</span>
                                )}
                                {p.email && (
                                  <span className="contact-link"><Mail size={13} /> {p.email}</span>
                                )}
                              </div>
                            </td>
                            <td>
                              <span className="tag-pill tag-primary">{objPrincipal}</span>
                            </td>
                            <td>
                              <strong>{p.peso_inicial ? `${p.peso_inicial} kg` : '--'}</strong>
                            </td>
                            <td>
                              <span className="badge-count">{p.total_consultas || 0} avaliações</span>
                            </td>
                            <td>
                              {p.proximo_retorno ? (
                                <span className="retorno-badge">
                                  <Clock size={12} /> {new Date(p.proximo_retorno).toLocaleDateString('pt-BR')}
                                </span>
                              ) : (
                                <span className="text-muted">Não agendado</span>
                              )}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div className="table-actions-row">
                                <button
                                  className="btn-table-action btn-view"
                                  onClick={() => handleViewPatientDetails(p)}
                                  title="Ver Prontuário Completo"
                                >
                                  <Eye size={15} /> Prontuário
                                </button>
                                <button
                                  className="btn-table-action btn-edit"
                                  onClick={() => handleOpenEditPatient(p)}
                                  title="Editar Dados"
                                >
                                  <Edit2 size={15} />
                                </button>
                                <button
                                  className="btn-table-action btn-delete"
                                  onClick={() => handleDeletePatient(p.id, p.nome)}
                                  title="Excluir Paciente"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              TAB 3: CONSULTAS & MEDIDAS
             ======================================================== */}
          {activeTab === 'consultas' && (
            <div className="consultas-tab">
              <div className="page-header-row">
                <div>
                  <h2>Consultas & Avaliações Antropométricas</h2>
                  <p>Registro de peso, circunferências, percentual de gordura e evolução</p>
                </div>
                <button className="btn-primary-action" onClick={() => handleOpenNewConsulta()}>
                  <Plus size={16} /> Nova Consulta
                </button>
              </div>

              {/* Cards de Próximos Retornos */}
              <div className="dashboard-section-card" style={{ marginBottom: '2rem' }}>
                <div className="section-card-header">
                  <div>
                    <h3>Agenda de Próximos Retornos</h3>
                    <p>Controle de retornos para acompanhamento contínuo</p>
                  </div>
                </div>

                {dashboardStats?.proximosRetornos?.length === 0 ? (
                  <p className="text-muted" style={{ padding: '1rem 0' }}>Nenhum retorno futuro agendado.</p>
                ) : (
                  <div className="retornos-cards-grid">
                    {dashboardStats?.proximosRetornos?.map(ret => (
                      <div key={ret.id} className="retorno-agenda-card">
                        <div className="agenda-date-tag">
                          <Calendar size={14} />
                          <span>{new Date(ret.proximo_retorno).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <h4>{ret.paciente_nome}</h4>
                        <div className="agenda-card-actions">
                          <button
                            className="btn-primary-action btn-sm"
                            onClick={() => handleOpenNewConsulta(ret.paciente_id)}
                          >
                            Iniciar Retorno
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Lista Geral de Consultas Recentes */}
              <div className="dashboard-section-card">
                <div className="section-card-header">
                  <div>
                    <h3>Histórico Geral de Avaliações</h3>
                  </div>
                </div>

                {dashboardStats?.consultasRecentes?.length === 0 ? (
                  <div className="empty-state-mini">
                    <Stethoscope size={40} className="empty-icon" />
                    <p>Nenhuma consulta registrada até o momento.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Data</th>
                          <th>Paciente</th>
                          <th>Peso</th>
                          <th>% Gordura</th>
                          <th>Cintura</th>
                          <th>Quadril</th>
                          <th>Observações</th>
                          <th style={{ textAlign: 'right' }}>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardStats?.consultasRecentes?.map(c => (
                          <tr key={c.id}>
                            <td>
                              <strong>{new Date(c.data_consulta).toLocaleDateString('pt-BR')}</strong>
                            </td>
                            <td>
                              <span className="table-p-name">{c.paciente_nome}</span>
                            </td>
                            <td>{c.peso ? `${c.peso} kg` : '--'}</td>
                            <td>{c.percentual_gordura ? `${c.percentual_gordura}%` : '--'}</td>
                            <td>{c.cintura ? `${c.cintura} cm` : '--'}</td>
                            <td>{c.quadril ? `${c.quadril} cm` : '--'}</td>
                            <td>
                              <span className="text-truncate" style={{ maxWidth: '200px', display: 'inline-block' }}>
                                {c.observacoes || 'Sem notas'}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <button
                                className="btn-table-action btn-view"
                                onClick={() => {
                                  const p = pacientesList.find(item => item.id === c.paciente_id);
                                  if (p) handleViewPatientDetails(p);
                                }}
                              >
                                <Eye size={14} /> Ficha
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 4: PLANOS ALIMENTARES
             ======================================================== */}
          {activeTab === 'planos' && (
            <div className="planos-tab">
              <div className="page-header-row">
                <div>
                  <h2>Planos Alimentares Criados ({filteredPlanos.length})</h2>
                  <p>Cardápios personalizados, metas calóricas e envio para pacientes</p>
                </div>
                <button className="btn-primary-action" onClick={() => handleOpenNewPlano()}>
                  <Plus size={16} /> Montar Novo Plano
                </button>
              </div>

              {/* Search Bar */}
              <div className="filters-bar">
                <div className="search-input-wrapper">
                  <Search size={18} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Buscar por título do plano ou nome do paciente..."
                    value={planoSearch}
                    onChange={(e) => setPlanoSearch(e.target.value)}
                  />
                </div>
              </div>

              {filteredPlanos.length === 0 ? (
                <div className="empty-state-card">
                  <UtensilsCrossed size={48} className="empty-icon" />
                  <h3>Nenhum plano alimentar encontrado</h3>
                  <p>Monte cardápios customizados com refeições, horários e substituições.</p>
                  <button className="btn-primary-action" onClick={() => handleOpenNewPlano()}>
                    <Plus size={16} /> Criar Primeiro Plano
                  </button>
                </div>
              ) : (
                <div className="planos-cards-grid">
                  {filteredPlanos.map(pl => {
                    const cont = pl.conteudo || {};
                    const refeicoes = Array.isArray(cont.refeicoes) ? cont.refeicoes : [];
                    return (
                      <div key={pl.id} className="plano-hub-card">
                        <div className="plano-hub-header">
                          <span className="plano-patient-tag">{pl.paciente_nome}</span>
                          <span className="plano-date-text">
                            {new Date(pl.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>

                        <h4>{cont.titulo || 'Plano Alimentar'}</h4>

                        <div className="plano-hub-meta">
                          {cont.meta_calorica && (
                            <span className="meta-pill">⚡ {cont.meta_calorica} kcal</span>
                          )}
                          <span className="meta-pill">🍽️ {refeicoes.length} refeições</span>
                        </div>

                        <div className="plano-meals-preview">
                          {refeicoes.slice(0, 3).map((r, i) => (
                            <div key={i} className="meal-preview-line">
                              <span className="meal-p-time">{r.horario || '--:--'}</span>
                              <span className="meal-p-name">{r.nome}</span>
                            </div>
                          ))}
                          {refeicoes.length > 3 && (
                            <span className="more-meals-label">+ {refeicoes.length - 3} outras refeições</span>
                          )}
                        </div>

                        <div className="plano-hub-footer">
                          <button
                            className="btn-outline btn-sm"
                            onClick={() => handleViewPlano(pl)}
                          >
                            <Eye size={14} /> Abrir Plano
                          </button>
                          <button
                            className="btn-icon-danger"
                            onClick={() => handleDeletePlanoItem(pl.id)}
                            title="Excluir Plano"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              TAB 5: CALCULADORAS
             ======================================================== */}
          {activeTab === 'calculadoras' && (
            <CalculatorsTab />
          )}
        </main>
      </div>

      {/* ========================================================
          MODALS GLOBAIS
         ======================================================== */}
      <PatientFormModal
        isOpen={isPatientFormOpen}
        onClose={() => setIsPatientFormOpen(false)}
        onSave={handleSavePatient}
        patientToEdit={patientToEdit}
      />

      <PatientDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        patient={selectedPatientForDetails}
        onEditPatient={(p) => {
          setIsDetailsOpen(false);
          handleOpenEditPatient(p);
        }}
        onNewConsultaForPatient={(patientId) => {
          setIsDetailsOpen(false);
          handleOpenNewConsulta(patientId);
        }}
        onNewPlanoForPatient={(patientId) => {
          setIsDetailsOpen(false);
          handleOpenNewPlano(patientId);
        }}
        onViewPlan={(plano) => {
          setIsDetailsOpen(false);
          handleViewPlano(plano);
        }}
      />

      <ConsultationModal
        isOpen={isConsultaOpen}
        onClose={() => setIsConsultaOpen(false)}
        onSave={handleSaveConsulta}
        pacientes={pacientesList}
        preSelectedPatientId={preSelectedPatientId}
      />

      <MealPlanModal
        isOpen={isMealPlanOpen}
        onClose={() => setIsMealPlanOpen(false)}
        onSave={handleSavePlano}
        pacientes={pacientesList}
        preSelectedPatientId={preSelectedPatientId}
        planToView={planToView}
      />
    </div>
  );
}
