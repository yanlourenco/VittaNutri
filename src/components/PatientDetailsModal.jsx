import { useState, useEffect } from 'react';
import Modal from './Modal';
import ConfirmModal from './ConfirmModal';
import { 
  User, 
  Stethoscope, 
  UtensilsCrossed, 
  Calendar, 
  Phone, 
  Mail, 
  Plus, 
  Edit, 
  Trash2, 
  Printer, 
  Eye,
  Clock,
  TrendingDown,
  TrendingUp,
  Activity,
  Target,
  Pill,
  FileText
} from 'lucide-react';
import { getConsultas, getPlanosAlimentares, deleteConsulta, deletePlanoAlimentar } from '../lib/db';

export default function PatientDetailsModal({ 
  isOpen, 
  onClose, 
  patient, 
  onEditPatient, 
  onNewConsultaForPatient, 
  onEditConsulta,
  onNewPlanoForPatient,
  onViewPlan 
}) {
  const [activeTab, setActiveTab] = useState('anamnese');
  const [consultas, setConsultas] = useState([]);
  const [planos, setPlanos] = useState([]);

  // Confirm modal state
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });

  useEffect(() => {
    async function loadData() {
      if (!patient?.id) return;
      try {
        const [cList, pList] = await Promise.all([
          getConsultas(patient.id),
          getPlanosAlimentares(patient.id)
        ]);
        setConsultas(cList || []);
        setPlanos(pList || []);
      } catch (err) {
        console.error('Error loading patient details:', err);
      }
    }
    if (patient?.id && isOpen) {
      loadData();
    }
  }, [patient?.id, isOpen]);

  const loadDetails = async () => {
    if (!patient?.id) return;
    try {
      const [cList, pList] = await Promise.all([
        getConsultas(patient.id),
        getPlanosAlimentares(patient.id)
      ]);
      setConsultas(cList || []);
      setPlanos(pList || []);
    } catch (err) {
      console.error('Error loading patient details:', err);
    }
  };

  const handleDeleteConsulta = (id) => {
    setConfirmState({
      isOpen: true,
      title: 'Excluir Consulta',
      message: 'Tem certeza que deseja excluir este registro de avaliação médica/antropométrica?',
      onConfirm: async () => {
        await deleteConsulta(id);
        setConfirmState(prev => ({ ...prev, isOpen: false }));
        loadDetails();
      }
    });
  };

  const handleDeletePlano = (id) => {
    setConfirmState({
      isOpen: true,
      title: 'Excluir Plano Alimentar',
      message: 'Tem certeza que deseja remover este cardápio/plano alimentar?',
      onConfirm: async () => {
        await deletePlanoAlimentar(id);
        setConfirmState(prev => ({ ...prev, isOpen: false }));
        loadDetails();
      }
    });
  };

  if (!patient) return null;

  // Cálculos de evolução
  const pesoInicial = patient.peso_inicial ? parseFloat(patient.peso_inicial) : null;
  const pesoAtual = consultas.length > 0 && consultas[0].peso ? parseFloat(consultas[0].peso) : pesoInicial;
  const diferencaPeso = (pesoAtual !== null && pesoInicial !== null) ? (pesoAtual - pesoInicial).toFixed(1) : null;

  // Ordenar consultas em ordem cronológica (antiga -> recente) para gráfico de evolução
  const consultasCronologicas = [...consultas].sort((a, b) => new Date(a.data_consulta) - new Date(b.data_consulta));

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Prontuário Clínico — ${patient.nome}`}
        subtitle={`Cadastrado em ${patient.created_at ? new Date(patient.created_at).toLocaleDateString('pt-BR') : 'Data não informada'}`}
        maxWidth="950px"
      >
        <div className="patient-details-view">
          {/* Printable Letterhead Header (visible during print) */}
          <div className="print-letterhead">
            <div className="print-brand">
              <h3>VITTA NUTRI — CLÍNICA NUTRICIONAL</h3>
              <p>Relatório de Acompanhamento e Avaliação Antropométrica</p>
            </div>
            <div className="print-date">
              Emitido em: {new Date().toLocaleDateString('pt-BR')}
            </div>
          </div>

          {/* Top Summary Banner */}
          <div className="patient-hero-banner">
            <div className="hero-avatar">
              {patient.nome.charAt(0).toUpperCase()}
            </div>
            <div className="hero-info">
              <div className="hero-title-row">
                <h4>{patient.nome}</h4>
                <span className="hero-badge">{patient.sexo || 'Sexo não informado'}</span>
                {patient.nivel_atividade && (
                  <span className="hero-badge badge-neutral">{patient.nivel_atividade}</span>
                )}
              </div>
              <div className="hero-contacts">
                {patient.whatsapp && (
                  <span><Phone size={14} /> {patient.whatsapp}</span>
                )}
                {patient.email && (
                  <span><Mail size={14} /> {patient.email}</span>
                )}
                {patient.data_nascimento && (
                  <span><Calendar size={14} /> Nasc: {new Date(patient.data_nascimento).toLocaleDateString('pt-BR')}</span>
                )}
              </div>
            </div>
            <div className="hero-metrics">
              <div className="hero-metric-item">
                <span className="metric-lbl">Peso Inicial</span>
                <span className="metric-val">{pesoInicial ? `${pesoInicial} kg` : '--'}</span>
              </div>
              <div className="hero-metric-item">
                <span className="metric-lbl">Peso Atual</span>
                <span className="metric-val">{pesoAtual ? `${pesoAtual} kg` : '--'}</span>
              </div>
              {diferencaPeso !== null && (
                <div className={`hero-metric-item ${parseFloat(diferencaPeso) <= 0 ? 'metric-good' : 'metric-up'}`}>
                  <span className="metric-lbl">Variação</span>
                  <span className="metric-val" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    {parseFloat(diferencaPeso) <= 0 ? <TrendingDown size={18} /> : <TrendingUp size={18} />}
                    {parseFloat(diferencaPeso) > 0 ? `+${diferencaPeso} kg` : `${diferencaPeso} kg`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Tabs Bar */}
          <div className="details-tab-bar">
            <button
              className={`details-tab-btn ${activeTab === 'anamnese' ? 'active' : ''}`}
              onClick={() => setActiveTab('anamnese')}
            >
              <User size={16} /> Ficha de Anamnese
            </button>
            <button
              className={`details-tab-btn ${activeTab === 'consultas' ? 'active' : ''}`}
              onClick={() => setActiveTab('consultas')}
            >
              <Stethoscope size={16} /> Consultas & Medições ({consultas.length})
            </button>
            <button
              className={`details-tab-btn ${activeTab === 'planos' ? 'active' : ''}`}
              onClick={() => setActiveTab('planos')}
            >
              <UtensilsCrossed size={16} /> Planos Alimentares ({planos.length})
            </button>
          </div>

          {/* TAB 1: ANAMNESE COMPLETA */}
          {activeTab === 'anamnese' && (
            <div className="details-tab-panel">
              <div className="details-section-grid">
                {/* Objetivos */}
                <div className="details-card">
                  <h5><Target size={16} color="var(--primary)" /> Objetivos & Metas</h5>
                  <div className="tags-display">
                    {Array.isArray(patient.objetivos) && patient.objetivos.length > 0 ? (
                      patient.objetivos.map(obj => <span key={obj} className="tag-pill tag-primary">{obj}</span>)
                    ) : (
                      <span className="text-muted">Nenhum objetivo listado</span>
                    )}
                  </div>
                  {patient.objetivo_texto && (
                    <p className="details-desc">{patient.objetivo_texto}</p>
                  )}
                </div>

                {/* Rotina & Hábitos */}
                <div className="details-card">
                  <h5><Activity size={16} color="var(--primary)" /> Rotina & Estilo de Vida</h5>
                  <ul className="details-list">
                    <li><strong>Nível de Atividade:</strong> {patient.nivel_atividade || 'Não informado'}</li>
                    <li>
                      <strong>Prática de Atividade Física:</strong> {patient.atividade_fisica ? 'Sim' : 'Não'}
                      {patient.atividade_fisica_descricao ? ` (${patient.atividade_fisica_descricao})` : ''}
                    </li>
                    <li><strong>Refeições/dia:</strong> {patient.refeicoes_por_dia || '--'}</li>
                    <li><strong>Consumo de Água:</strong> {patient.litros_agua ? `${patient.litros_agua} L/dia` : '--'}</li>
                    <li><strong>Horários:</strong> Acorda: {patient.horario_acorda || '--'} | Dorme: {patient.horario_dorme || '--'}</li>
                  </ul>
                </div>

                {/* Saúde e Restrições */}
                <div className="details-card">
                  <h5><Stethoscope size={16} color="var(--primary)" /> Saúde & Restrições Clínicas</h5>
                  <div className="sub-detail-group">
                    <span className="sub-detail-label">Patologias:</span>
                    <div className="tags-display">
                      {Array.isArray(patient.patologias) && patient.patologias.length > 0 ? (
                        patient.patologias.map(pat => <span key={pat} className="tag-pill tag-warning">{pat}</span>)
                      ) : <span className="text-muted">Nenhuma informada</span>}
                    </div>
                  </div>

                  <div className="sub-detail-group">
                    <span className="sub-detail-label">Restrições / Preferências:</span>
                    <div className="tags-display">
                      {Array.isArray(patient.restricoes_alimentares) && patient.restricoes_alimentares.length > 0 ? (
                        patient.restricoes_alimentares.map(r => <span key={r} className="tag-pill tag-info">{r}</span>)
                      ) : <span className="text-muted">Nenhuma</span>}
                    </div>
                  </div>

                  <div className="sub-detail-group">
                    <span className="sub-detail-label">Alergias Alimentares:</span>
                    <div className="tags-display">
                      {Array.isArray(patient.alergias) && patient.alergias.length > 0 ? (
                        patient.alergias.map(a => <span key={a} className="tag-pill tag-danger">{a}</span>)
                      ) : <span className="text-muted">Nenhuma</span>}
                    </div>
                  </div>
                </div>

                {/* Medicamentos & Observações */}
                <div className="details-card">
                  <h5><Pill size={16} color="var(--primary)" /> Medicamentos & Suplementação</h5>
                  <ul className="details-list">
                    <li><strong>Medicamentos Contínuos:</strong> {patient.medicamentos || 'Nenhum'}</li>
                    <li><strong>Suplementação:</strong> {patient.suplementos || 'Nenhum'}</li>
                  </ul>
                  {patient.observacoes && (
                    <div style={{ marginTop: '0.75rem' }}>
                      <strong>Observações Gerais:</strong>
                      <p className="details-desc">{patient.observacoes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Signatures line during print */}
              <div className="print-signature-section">
                <div className="sig-block">
                  <div className="sig-line" />
                  <span>Assinatura do(a) Nutricionista</span>
                </div>
                <div className="sig-block">
                  <div className="sig-line" />
                  <span>Assinatura do(a) Paciente</span>
                </div>
              </div>

              <div className="details-panel-actions">
                <button className="btn-outline" onClick={() => onEditPatient(patient)}>
                  <Edit size={16} /> Editar Dados Cadastrais
                </button>
                <button className="btn-primary-action" onClick={() => window.print()}>
                  <Printer size={16} /> Imprimir / Exportar PDF
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: HISTÓRICO DE CONSULTAS & GRÁFICO */}
          {activeTab === 'consultas' && (
            <div className="details-tab-panel">
              <div className="tab-header-action-row">
                <h5>Histórico de Avaliações Clínicas</h5>
                <button 
                  className="btn-primary-action btn-sm" 
                  onClick={() => onNewConsultaForPatient(patient.id)}
                >
                  <Plus size={16} /> Registrar Nova Consulta
                </button>
              </div>

              {/* Gráfico Visual de Evolução de Peso */}
              {consultasCronologicas.length > 1 && (
                <div className="evolution-chart-box">
                  <div className="chart-header">
                    <Activity size={16} color="var(--primary)" />
                    <strong>Evolução Antropométrica (Peso em kg ao longo das consultas)</strong>
                  </div>
                  <div className="chart-bars-flow">
                    {consultasCronologicas.map((c) => (
                      <div key={c.id} className="chart-bar-col">
                        <span className="chart-val">{c.peso ? `${c.peso}kg` : '--'}</span>
                        <div 
                          className="chart-pill-bar" 
                          style={{ height: `${Math.min(100, Math.max(25, ((parseFloat(c.peso) || 50) / 120) * 100))}px` }} 
                        />
                        <span className="chart-lbl">
                          {new Date(c.data_consulta).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {consultas.length === 0 ? (
                <div className="empty-tab-state">
                  <Stethoscope size={40} className="empty-icon" />
                  <p>Nenhuma consulta registrada para este paciente ainda.</p>
                  <button 
                    className="btn-outline"
                    onClick={() => onNewConsultaForPatient(patient.id)}
                  >
                    Registrar Primeira Consulta
                  </button>
                </div>
              ) : (
                <div className="consultations-timeline">
                  {consultas.map((c, idx) => (
                    <div key={c.id} className="timeline-item">
                      <div className="timeline-dot" />
                      <div className="timeline-card">
                        <div className="timeline-card-header">
                          <div>
                            <strong className="timeline-date">
                              {new Date(c.data_consulta).toLocaleDateString('pt-BR')}
                            </strong>
                            {idx === 0 && <span className="badge-pill latest">Mais Recente</span>}
                          </div>
                          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                            <button 
                              className="btn-table-action btn-edit" 
                              onClick={() => onEditConsulta && onEditConsulta(c)}
                              title="Editar Consulta"
                            >
                              <Edit size={14} /> Editar
                            </button>
                            <button 
                              className="btn-icon-danger" 
                              onClick={() => handleDeleteConsulta(c.id)}
                              title="Excluir Consulta"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>

                        <div className="measurements-grid">
                          {c.peso && (
                            <div className="measurement-box">
                              <span className="meas-label">Peso</span>
                              <span className="meas-val">{c.peso} kg</span>
                            </div>
                          )}
                          {c.percentual_gordura && (
                            <div className="measurement-box">
                              <span className="meas-label">% Gordura</span>
                              <span className="meas-val">{c.percentual_gordura}%</span>
                            </div>
                          )}
                          {c.cintura && (
                            <div className="measurement-box">
                              <span className="meas-label">Cintura</span>
                              <span className="meas-val">{c.cintura} cm</span>
                            </div>
                          )}
                          {c.quadril && (
                            <div className="measurement-box">
                              <span className="meas-label">Quadril</span>
                              <span className="meas-val">{c.quadril} cm</span>
                            </div>
                          )}
                        </div>

                        {c.observacoes && (
                          <p className="timeline-obs">
                            <strong>Conduta / Observações:</strong> {c.observacoes}
                          </p>
                        )}

                        {c.proximo_retorno && (
                          <div className="timeline-retorno">
                            <Clock size={14} /> Retorno agendado para: <strong>{new Date(c.proximo_retorno).toLocaleDateString('pt-BR')}</strong>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PLANOS ALIMENTARES */}
          {activeTab === 'planos' && (
            <div className="details-tab-panel">
              <div className="tab-header-action-row">
                <h5>Planos Alimentares Criados</h5>
                <button 
                  className="btn-primary-action btn-sm" 
                  onClick={() => onNewPlanoForPatient(patient.id)}
                >
                  <Plus size={16} /> Criar Novo Plano
                </button>
              </div>

              {planos.length === 0 ? (
                <div className="empty-tab-state">
                  <FileText size={40} className="empty-icon" />
                  <p>Nenhum plano alimentar cadastrado para este paciente.</p>
                  <button 
                    className="btn-outline"
                    onClick={() => onNewPlanoForPatient(patient.id)}
                  >
                    Montar Cardápio Agora
                  </button>
                </div>
              ) : (
                <div className="plans-list-grid">
                  {planos.map(pl => {
                    const conteudo = pl.conteudo || {};
                    const refeicoesCount = Array.isArray(conteudo.refeicoes) ? conteudo.refeicoes.length : 0;
                    return (
                      <div key={pl.id} className="plan-item-card">
                        <div className="plan-item-header">
                          <h6>{conteudo.titulo || 'Plano Alimentar'}</h6>
                          <span className="plan-date">
                            {new Date(pl.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <div className="plan-item-details">
                          <span>Meta Calórica: {conteudo.meta_calorica ? `${conteudo.meta_calorica} kcal` : 'Não especificada'}</span>
                          <span>{refeicoesCount} refeições estruturadas</span>
                        </div>
                        <div className="plan-item-actions">
                          <button className="btn-outline btn-sm" onClick={() => onViewPlan(pl)}>
                            <Eye size={14} /> Ver / Editar
                          </button>
                          <button className="btn-icon-danger" onClick={() => handleDeletePlano(pl.id)} title="Excluir Plano">
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
        </div>
      </Modal>

      {/* Confirmação customizada moderna */}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        message={confirmState.message}
      />
    </>
  );
}
