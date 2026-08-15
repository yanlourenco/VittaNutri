import { useState, useEffect } from 'react';
import Modal from './Modal';
import { User, Heart, Sparkles, Check, ArrowLeft, ArrowRight } from 'lucide-react';

const OBJETIVOS_OPCOES = [
  'Emagrecimento',
  'Hipertrofia / Ganho de Massa',
  'Reeducação Alimentar',
  'Saúde & Qualidade de Vida',
  'Controle de Patologia',
  'Performance Esportiva',
  'Manutenção de Peso',
  'Vegetarianismo / Veganismo'
];

const PATOLOGIAS_OPCOES = [
  'Diabetes Tipo 1',
  'Diabetes Tipo 2',
  'Hipertensão Arterial',
  'Dislipidemia (Colesterol Alto)',
  'Hipotireoidismo',
  'Hipertireoidismo',
  'Gastrite / Refluxo',
  'Síndrome do Intestino Irritável',
  'Esteatose Hepática (Gordura no Fígado)',
  'Resistência à Insulina'
];

const RESTRICOES_OPCOES = [
  'Intolerância à Lactose',
  'Intolerância ao Glúten',
  'Doença Celíaca',
  'Vegano',
  'Vegetariano',
  'Low Carb',
  'Sem Frutos do Mar',
  'Sem Açúcar Refinado'
];

const ALERGIAS_OPCOES = [
  'Amendoim / Castanhas',
  'Leite e Derivados',
  'Ovo',
  'Frutos do Mar / Crustáceos',
  'Soja',
  'Trigo',
  'Corantes artificiais'
];

export default function PatientFormModal({ isOpen, onClose, onSave, patientToEdit }) {
  const [activeTab, setActiveTab] = useState('dados');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    data_nascimento: '',
    sexo: 'Feminino',
    whatsapp: '',
    email: '',
    peso_inicial: '',
    altura: '',
    objetivos: [],
    objetivo_texto: '',
    nivel_atividade: 'Sedentário',
    atividade_fisica: false,
    atividade_fisica_descricao: '',
    refeicoes_por_dia: 3,
    horario_acorda: '',
    horario_dorme: '',
    litros_agua: '',
    patologias: [],
    restricoes_alimentares: [],
    alergias: [],
    medicamentos: '',
    suplementos: '',
    observacoes: ''
  });

  useEffect(() => {
    if (patientToEdit) {
      setFormData({
        nome: patientToEdit.nome || '',
        data_nascimento: patientToEdit.data_nascimento ? patientToEdit.data_nascimento.slice(0, 10) : '',
        sexo: patientToEdit.sexo || 'Feminino',
        whatsapp: patientToEdit.whatsapp || '',
        email: patientToEdit.email || '',
        peso_inicial: patientToEdit.peso_inicial || '',
        altura: patientToEdit.altura || '',
        objetivos: Array.isArray(patientToEdit.objetivos) ? patientToEdit.objetivos : [],
        objetivo_texto: patientToEdit.objetivo_texto || '',
        nivel_atividade: patientToEdit.nivel_atividade || 'Sedentário',
        atividade_fisica: Boolean(patientToEdit.atividade_fisica),
        atividade_fisica_descricao: patientToEdit.atividade_fisica_descricao || '',
        refeicoes_por_dia: patientToEdit.refeicoes_por_dia || 3,
        horario_acorda: patientToEdit.horario_acorda || '',
        horario_dorme: patientToEdit.horario_dorme || '',
        litros_agua: patientToEdit.litros_agua || '',
        patologias: Array.isArray(patientToEdit.patologias) ? patientToEdit.patologias : [],
        restricoes_alimentares: Array.isArray(patientToEdit.restricoes_alimentares) ? patientToEdit.restricoes_alimentares : [],
        alergias: Array.isArray(patientToEdit.alergias) ? patientToEdit.alergias : [],
        medicamentos: patientToEdit.medicamentos || '',
        suplementos: patientToEdit.suplementos || '',
        observacoes: patientToEdit.observacoes || ''
      });
    } else {
      setFormData({
        nome: '',
        data_nascimento: '',
        sexo: 'Feminino',
        whatsapp: '',
        email: '',
        peso_inicial: '',
        altura: '',
        objetivos: ['Emagrecimento'],
        objetivo_texto: '',
        nivel_atividade: 'Sedentário',
        atividade_fisica: false,
        atividade_fisica_descricao: '',
        refeicoes_por_dia: 3,
        horario_acorda: '07:00',
        horario_dorme: '23:00',
        litros_agua: '2.0',
        patologias: [],
        restricoes_alimentares: [],
        alergias: [],
        medicamentos: '',
        suplementos: '',
        observacoes: ''
      });
    }
    setActiveTab('dados');
  }, [patientToEdit, isOpen]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field, item) => {
    setFormData(prev => {
      const arr = prev[field] || [];
      if (arr.includes(item)) {
        return { ...prev, [field]: arr.filter(i => i !== item) };
      } else {
        return { ...prev, [field]: [...arr, item] };
      }
    });
  };

  // Cálculo de IMC em tempo real
  const calcIMC = () => {
    const peso = parseFloat(formData.peso_inicial);
    let altura = parseFloat(formData.altura);
    if (!peso || !altura) return null;
    if (altura > 3) altura = altura / 100;
    const imc = peso / (altura * altura);
    let classif = 'Normal';
    let color = '#10b981';
    if (imc < 18.5) { classif = 'Abaixo do peso'; color = '#eab308'; }
    else if (imc < 25) { classif = 'Peso normal / Adequado'; color = '#10b981'; }
    else if (imc < 30) { classif = 'Sobrepeso'; color = '#f97316'; }
    else if (imc < 35) { classif = 'Obesidade Grau I'; color = '#ef4444'; }
    else if (imc < 40) { classif = 'Obesidade Grau II'; color = '#dc2626'; }
    else { classif = 'Obesidade Grau III'; color = '#991b1b'; }

    return { value: imc.toFixed(2), classif, color };
  };

  const imcResult = calcIMC();

  const getStepProgress = () => {
    if (activeTab === 'dados') return { step: 1, pct: 33 };
    if (activeTab === 'rotina') return { step: 2, pct: 66 };
    return { step: 3, pct: 100 };
  };

  const currentProgress = getStepProgress();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nome.trim()) {
      alert('Por favor, informe o nome completo do paciente.');
      return;
    }
    setLoading(true);
    try {
      let altura = formData.altura ? parseFloat(formData.altura) : null;
      if (altura && altura > 3) altura = altura / 100;

      await onSave({
        ...formData,
        altura
      });
      onClose();
    } catch (err) {
      alert('Erro ao salvar paciente: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={patientToEdit ? 'Editar Ficha do Paciente' : 'Cadastrar Novo Paciente'}
      subtitle="Ficha de Anamnese Clínica e Cadastro Nutricional"
      maxWidth="800px"
    >
      <form onSubmit={handleSubmit} className="patient-form">
        {/* Progress Bar Wizard */}
        <div className="wizard-progress-container">
          <div className="wizard-header">
            <span className="wizard-step-label">Passo {currentProgress.step} de 3</span>
            <span className="wizard-step-title">
              {activeTab === 'dados' && '1. Identificação & Medidas Iniciais'}
              {activeTab === 'rotina' && '2. Objetivos & Estilo de Vida'}
              {activeTab === 'clinico' && '3. Histórico Clínico & Saúde'}
            </span>
          </div>
          <div className="wizard-track">
            <div className="wizard-bar" style={{ width: `${currentProgress.pct}%` }} />
          </div>
        </div>

        {/* Sub-navegação do formulário */}
        <div className="form-tabs">
          <button
            type="button"
            className={`form-tab-btn ${activeTab === 'dados' ? 'active' : ''}`}
            onClick={() => setActiveTab('dados')}
          >
            <User size={16} /> 1. Dados Pessoais
          </button>
          <button
            type="button"
            className={`form-tab-btn ${activeTab === 'rotina' ? 'active' : ''}`}
            onClick={() => setActiveTab('rotina')}
          >
            <Sparkles size={16} /> 2. Objetivos & Rotina
          </button>
          <button
            type="button"
            className={`form-tab-btn ${activeTab === 'clinico' ? 'active' : ''}`}
            onClick={() => setActiveTab('clinico')}
          >
            <Heart size={16} /> 3. Histórico Clínico
          </button>
        </div>

        {/* TAB 1: DADOS PESSOAIS */}
        {activeTab === 'dados' && (
          <div className="form-tab-content">
            <div className="form-grid-2">
              <div className="form-group full-width">
                <label>Nome Completo do Paciente *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Mariana Vasconcelos"
                  className="form-control"
                  value={formData.nome}
                  onChange={(e) => handleChange('nome', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Data de Nascimento</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.data_nascimento}
                  onChange={(e) => handleChange('data_nascimento', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Sexo Biológico</label>
                <select
                  className="form-control"
                  value={formData.sexo}
                  onChange={(e) => handleChange('sexo', e.target.value)}
                >
                  <option value="Feminino">Feminino</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div className="form-group">
                <label>WhatsApp / Celular</label>
                <input
                  type="tel"
                  placeholder="(11) 99999-9999"
                  className="form-control"
                  value={formData.whatsapp}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="paciente@email.com"
                  className="form-control"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </div>
            </div>

            <div className="section-divider">
              <span>Medidas Antropométricas Iniciais</span>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Peso Inicial (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Ex: 72.5"
                  className="form-control"
                  value={formData.peso_inicial}
                  onChange={(e) => handleChange('peso_inicial', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Altura (m ou cm)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Ex: 1.68 ou 168"
                  className="form-control"
                  value={formData.altura}
                  onChange={(e) => handleChange('altura', e.target.value)}
                />
              </div>
            </div>

            {imcResult && (
              <div className="imc-calc-box">
                <div className="imc-badge">
                  <span>IMC Inicial:</span> <strong>{imcResult.value} kg/m²</strong>
                </div>
                <div className="imc-classification" style={{ color: imcResult.color }}>
                  Classificação OMS: <strong>{imcResult.classif}</strong>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: OBJETIVOS E ROTINA */}
        {activeTab === 'rotina' && (
          <div className="form-tab-content">
            <div className="form-group">
              <label>Objetivos Principais (Selecione os aplicáveis)</label>
              <div className="tags-selector">
                {OBJETIVOS_OPCOES.map((obj) => {
                  const selected = formData.objetivos.includes(obj);
                  return (
                    <button
                      key={obj}
                      type="button"
                      className={`tag-chip ${selected ? 'active' : ''}`}
                      onClick={() => toggleArrayItem('objetivos', obj)}
                    >
                      {selected && <Check size={14} />}
                      {obj}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-group">
              <label>Detalhamento do Objetivo & Queixa Principal</label>
              <textarea
                rows="2"
                placeholder="Ex: Deseja perder 5kg para casamento em 3 meses e melhorar disposição matinal..."
                className="form-control"
                value={formData.objetivo_texto}
                onChange={(e) => handleChange('objetivo_texto', e.target.value)}
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Nível de Atividade Diária</label>
                <select
                  className="form-control"
                  value={formData.nivel_atividade}
                  onChange={(e) => handleChange('nivel_atividade', e.target.value)}
                >
                  <option value="Sedentário">Sedentário (trabalho sentado, pouco movimento)</option>
                  <option value="Levemente Ativo">Levemente Ativo (caminhadas leves, 1-2x/semana)</option>
                  <option value="Moderadamente Ativo">Moderadamente Ativo (exercícios 3-5x/semana)</option>
                  <option value="Muito Ativo">Muito Ativo (treinos pesados 6-7x/semana)</option>
                  <option value="Extremamente Ativo">Extremamente Ativo (atleta / trabalho braçal)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Refeições habituais por dia</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  className="form-control"
                  value={formData.refeicoes_por_dia}
                  onChange={(e) => handleChange('refeicoes_por_dia', e.target.value)}
                />
              </div>
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label>Horário que acorda</label>
                <input
                  type="time"
                  className="form-control"
                  value={formData.horario_acorda}
                  onChange={(e) => handleChange('horario_acorda', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Horário que dorme</label>
                <input
                  type="time"
                  className="form-control"
                  value={formData.horario_dorme}
                  onChange={(e) => handleChange('horario_dorme', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Água por dia (Litros)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Ex: 2.0"
                  className="form-control"
                  value={formData.litros_agua}
                  onChange={(e) => handleChange('litros_agua', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group checkbox-wrapper">
              <label className="custom-checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.atividade_fisica}
                  onChange={(e) => handleChange('atividade_fisica', e.target.checked)}
                />
                <span>Pratica atividade física / esportes atualmente?</span>
              </label>
            </div>

            {formData.atividade_fisica && (
              <div className="form-group">
                <label>Descrição dos treinos (Modalidade, frequência, duração)</label>
                <input
                  type="text"
                  placeholder="Ex: Musculação 4x na semana (50 min) + Corrida aos sábados"
                  className="form-control"
                  value={formData.atividade_fisica_descricao}
                  onChange={(e) => handleChange('atividade_fisica_descricao', e.target.value)}
                />
              </div>
            )}
          </div>
        )}

        {/* TAB 3: HISTÓRICO CLÍNICO */}
        {activeTab === 'clinico' && (
          <div className="form-tab-content">
            <div className="form-group">
              <label>Patologias Diagnosticadas</label>
              <div className="tags-selector">
                {PATOLOGIAS_OPCOES.map((pat) => {
                  const selected = formData.patologias.includes(pat);
                  return (
                    <button
                      key={pat}
                      type="button"
                      className={`tag-chip ${selected ? 'active-warning' : ''}`}
                      onClick={() => toggleArrayItem('patologias', pat)}
                    >
                      {selected && <Check size={14} />}
                      {pat}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-group">
              <label>Restrições / Preferências Alimentares</label>
              <div className="tags-selector">
                {RESTRICOES_OPCOES.map((rest) => {
                  const selected = formData.restricoes_alimentares.includes(rest);
                  return (
                    <button
                      key={rest}
                      type="button"
                      className={`tag-chip ${selected ? 'active' : ''}`}
                      onClick={() => toggleArrayItem('restricoes_alimentares', rest)}
                    >
                      {selected && <Check size={14} />}
                      {rest}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-group">
              <label>Alergias Alimentares</label>
              <div className="tags-selector">
                {ALERGIAS_OPCOES.map((alerg) => {
                  const selected = formData.alergias.includes(alerg);
                  return (
                    <button
                      key={alerg}
                      type="button"
                      className={`tag-chip ${selected ? 'active-danger' : ''}`}
                      onClick={() => toggleArrayItem('alergias', alerg)}
                    >
                      {selected && <Check size={14} />}
                      {alerg}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Medicamentos de Uso Contínuo</label>
                <input
                  type="text"
                  placeholder="Ex: Losartana 50mg pela manhã"
                  className="form-control"
                  value={formData.medicamentos}
                  onChange={(e) => handleChange('medicamentos', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Suplementos em Uso</label>
                <input
                  type="text"
                  placeholder="Ex: Creatina 5g, Vitamina D, Whey Protein"
                  className="form-control"
                  value={formData.suplementos}
                  onChange={(e) => handleChange('suplementos', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Observações Clínicas / Histórico Familiar</label>
              <textarea
                rows="3"
                placeholder="Anotações adicionais da rotina, histórico familiar, sintomas gastrointestinais..."
                className="form-control"
                value={formData.observacoes}
                onChange={(e) => handleChange('observacoes', e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="modal-footer">
          <div className="modal-footer-nav">
            {activeTab !== 'dados' && (
              <button
                type="button"
                className="btn-outline"
                onClick={() => setActiveTab(activeTab === 'clinico' ? 'rotina' : 'dados')}
              >
                <ArrowLeft size={16} /> Etapa Anterior
              </button>
            )}
            {activeTab !== 'clinico' && (
              <button
                type="button"
                className="btn-primary-action"
                onClick={() => setActiveTab(activeTab === 'dados' ? 'rotina' : 'clinico')}
              >
                Próxima Etapa <ArrowRight size={16} />
              </button>
            )}
          </div>
          <div className="modal-footer-actions">
            <button type="button" className="btn-outline" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary-action" disabled={loading}>
              {loading ? 'Salvando...' : (patientToEdit ? 'Atualizar Paciente' : 'Finalizar Cadastro')}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
