import { useState, useEffect } from 'react';
import Modal from './Modal';
import { User, Activity, Heart, Check, ArrowLeft, ArrowRight, Plus } from 'lucide-react';

const OBJETIVOS_OPCOES = [
  'Emagrecer',
  'Ganhar massa',
  'Controlar diabetes',
  'Saúde geral',
  'Performance esportiva',
  'Reeducação alimentar'
];

const PATOLOGIAS_PADRAO = [
  'Diabetes',
  'Hipertensão',
  'Hipotireoidismo',
  'Hipertireoidismo',
  'Síndrome do ovário policístico',
  'Doença celíaca',
  'Colesterol alto'
];

const RESTRICOES_PADRAO = [
  'Lactose',
  'Glúten',
  'Açúcar',
  'Carne vermelha',
  'Frutos do mar'
];

const ALERGIAS_PADRAO = [
  'Amendoim',
  'Leite',
  'Ovo',
  'Soja',
  'Trigo',
  'Frutos do mar'
];

export default function PatientFormModal({ isOpen, onClose, onSave, patientToEdit }) {
  const [activeTab, setActiveTab] = useState('pessoal');
  const [loading, setLoading] = useState(false);

  // Custom tags inputs
  const [customPatologia, setCustomPatologia] = useState('');
  const [customRestricao, setCustomRestricao] = useState('');
  const [customAlergia, setCustomAlergia] = useState('');

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
    patologias: [],
    restricoes_alimentares: [],
    alergias: [],
    medicamentos: '',
    suplementos: '',
    refeicoes_por_dia: 3,
    horario_acorda: '',
    horario_dorme: '',
    litros_agua: '',
    atividade_fisica: false,
    atividade_fisica_descricao: '',
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
        altura: patientToEdit.altura ? (parseFloat(patientToEdit.altura) > 3 ? patientToEdit.altura : (parseFloat(patientToEdit.altura) * 100).toFixed(0)) : '',
        objetivos: Array.isArray(patientToEdit.objetivos) ? patientToEdit.objetivos : [],
        objetivo_texto: patientToEdit.objetivo_texto || '',
        nivel_atividade: patientToEdit.nivel_atividade || 'Sedentário',
        patologias: Array.isArray(patientToEdit.patologias) ? patientToEdit.patologias : [],
        restricoes_alimentares: Array.isArray(patientToEdit.restricoes_alimentares) ? patientToEdit.restricoes_alimentares : [],
        alergias: Array.isArray(patientToEdit.alergias) ? patientToEdit.alergias : [],
        medicamentos: patientToEdit.medicamentos || '',
        suplementos: patientToEdit.suplementos || '',
        refeicoes_por_dia: patientToEdit.refeicoes_por_dia || 3,
        horario_acorda: patientToEdit.horario_acorda || '',
        horario_dorme: patientToEdit.horario_dorme || '',
        litros_agua: patientToEdit.litros_agua || '',
        atividade_fisica: Boolean(patientToEdit.atividade_fisica),
        atividade_fisica_descricao: patientToEdit.atividade_fisica_descricao || '',
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
        objetivos: ['Emagrecer'],
        objetivo_texto: '',
        nivel_atividade: 'Sedentário',
        patologias: [],
        restricoes_alimentares: [],
        alergias: [],
        medicamentos: '',
        suplementos: '',
        refeicoes_por_dia: 3,
        horario_acorda: '07:00',
        horario_dorme: '23:00',
        litros_agua: '2.0',
        atividade_fisica: false,
        atividade_fisica_descricao: '',
        observacoes: ''
      });
    }
    setActiveTab('pessoal');
  }, [patientToEdit, isOpen]);

  // Formatação inteligente de WhatsApp
  const formatPhone = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits ? `(${digits}` : '';
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  // Conversão inteligente de formato de horário (ex: 6 -> 06:00, 630 -> 06:30, 23 -> 23:00)
  const formatTimeString = (val) => {
    if (!val) return '';
    const clean = val.trim();
    if (clean.includes(':')) {
      const [h, m] = clean.split(':');
      const formattedH = (h || '0').padStart(2, '0');
      const formattedM = (m || '00').padEnd(2, '0').slice(0, 2);
      return `${formattedH}:${formattedM}`;
    }
    const digits = clean.replace(/\D/g, '');
    if (!digits) return '';
    if (digits.length === 1) return `0${digits}:00`;
    if (digits.length === 2) {
      const num = parseInt(digits, 10);
      if (num <= 23) return `${digits.padStart(2, '0')}:00`;
      return `0${digits[0]}:${digits[1]}0`;
    }
    if (digits.length === 3) {
      const h = digits.slice(0, 1).padStart(2, '0');
      const m = digits.slice(1, 3);
      return `${h}:${m}`;
    }
    if (digits.length >= 4) {
      const h = digits.slice(0, 2);
      const m = digits.slice(2, 4);
      return `${h}:${m}`;
    }
    return val;
  };

  // Cálculo automático de idade
  const calcAge = (birthDateStr) => {
    if (!birthDateStr) return null;
    const birth = new Date(birthDateStr);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age >= 0 ? age : null;
  };

  const calculatedAge = calcAge(formData.data_nascimento);

  // Cálculo de IMC em tempo real
  const calcIMC = () => {
    const peso = parseFloat(formData.peso_inicial);
    let altura = parseFloat(formData.altura);
    if (!peso || !altura || altura <= 0) return null;
    if (altura > 3) altura = altura / 100;
    const imc = peso / (altura * altura);
    let classif = 'Normal';
    let color = '#0284c7';
    if (imc < 18.5) { classif = 'Abaixo do peso'; color = '#d97706'; }
    else if (imc < 25) { classif = 'Peso normal / Adequado'; color = '#059669'; }
    else if (imc < 30) { classif = 'Sobrepeso'; color = '#ea580c'; }
    else if (imc < 35) { classif = 'Obesidade Grau I'; color = '#dc2626'; }
    else if (imc < 40) { classif = 'Obesidade Grau II'; color = '#b91c1c'; }
    else { classif = 'Obesidade Grau III'; color = '#991b1b'; }

    return { value: imc.toFixed(2), classif, color };
  };

  const imcResult = calcIMC();

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Tag selection with support for "Nenhum"
  const toggleArrayItem = (field, item) => {
    setFormData(prev => {
      const current = prev[field] || [];
      if (item === 'Nenhum') {
        if (current.includes('Nenhum')) {
          return { ...prev, [field]: [] };
        }
        return { ...prev, [field]: ['Nenhum'] };
      }

      // Se clicar em outro item, remove "Nenhum"
      const withoutNenhum = current.filter(i => i !== 'Nenhum');
      if (withoutNenhum.includes(item)) {
        return { ...prev, [field]: withoutNenhum.filter(i => i !== item) };
      }
      return { ...prev, [field]: [...withoutNenhum, item] };
    });
  };

  const addCustomItem = (field, value, clearFn) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setFormData(prev => {
      const current = (prev[field] || []).filter(i => i !== 'Nenhum');
      if (!current.includes(trimmed)) {
        return { ...prev, [field]: [...current, trimmed] };
      }
      return prev;
    });
    clearFn('');
  };

  const getStepProgress = () => {
    if (activeTab === 'pessoal') return { step: 1, pct: 33 };
    if (activeTab === 'clinico') return { step: 2, pct: 66 };
    return { step: 3, pct: 100 };
  };

  const currentProgress = getStepProgress();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação dos campos obrigatórios conforme regras do Prompt 4
    if (!formData.nome.trim()) {
      alert('O campo "Nome Completo" é obrigatório.');
      setActiveTab('pessoal');
      return;
    }
    if (!formData.data_nascimento) {
      alert('O campo "Data de Nascimento" é obrigatório.');
      setActiveTab('pessoal');
      return;
    }
    if (!formData.whatsapp.trim()) {
      alert('O campo "WhatsApp" é obrigatório.');
      setActiveTab('pessoal');
      return;
    }
    if (!formData.peso_inicial || parseFloat(formData.peso_inicial) <= 0) {
      alert('O campo "Peso Atual" é obrigatório.');
      setActiveTab('clinico');
      return;
    }
    if (!formData.altura || parseFloat(formData.altura) <= 0) {
      alert('O campo "Altura" é obrigatório.');
      setActiveTab('clinico');
      return;
    }

    setLoading(true);
    try {
      let alturaFinal = parseFloat(formData.altura);
      if (alturaFinal > 3) {
        alturaFinal = alturaFinal / 100;
      }

      await onSave({
        ...formData,
        altura: alturaFinal
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
      title={patientToEdit ? 'Editar Ficha do Paciente' : 'Cadastro de Paciente'}
      subtitle="Formulário Clínico e Anamnese Nutricional"
      maxWidth="820px"
    >
      <form onSubmit={handleSubmit} className="patient-form">
        {/* Progress Bar Wizard */}
        <div className="wizard-progress-container">
          <div className="wizard-header">
            <span className="wizard-step-label">Aba {currentProgress.step} de 3</span>
            <span className="wizard-step-title">
              {activeTab === 'pessoal' && 'Aba 1 — Informações Pessoais'}
              {activeTab === 'clinico' && 'Aba 2 — Dados Clínicos & Antropometria'}
              {activeTab === 'habitos' && 'Aba 3 — Hábitos & Rotina'}
            </span>
          </div>
          <div className="wizard-track">
            <div className="wizard-bar" style={{ width: `${currentProgress.pct}%` }} />
          </div>
        </div>

        {/* Sub-navegação em 3 abas */}
        <div className="form-tabs">
          <button
            type="button"
            className={`form-tab-btn ${activeTab === 'pessoal' ? 'active' : ''}`}
            onClick={() => setActiveTab('pessoal')}
          >
            <User size={16} /> 1. Pessoal
          </button>
          <button
            type="button"
            className={`form-tab-btn ${activeTab === 'clinico' ? 'active' : ''}`}
            onClick={() => setActiveTab('clinico')}
          >
            <Heart size={16} /> 2. Clínico
          </button>
          <button
            type="button"
            className={`form-tab-btn ${activeTab === 'habitos' ? 'active' : ''}`}
            onClick={() => setActiveTab('habitos')}
          >
            <Activity size={16} /> 3. Hábitos
          </button>
        </div>

        {/* ========================================================
            ABA 1 — PESSOAL
           ======================================================== */}
        {activeTab === 'pessoal' && (
          <div className="form-tab-content">
            <div className="form-grid-2">
              <div className="form-group full-width">
                <label>Nome Completo *</label>
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
                <label>
                  Data de Nascimento *
                  {calculatedAge !== null && (
                    <span className="age-pill-badge">{calculatedAge} anos</span>
                  )}
                </label>
                <input
                  type="date"
                  required
                  className="form-control"
                  value={formData.data_nascimento}
                  onChange={(e) => handleChange('data_nascimento', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Sexo</label>
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
                <label>WhatsApp *</label>
                <input
                  type="tel"
                  required
                  placeholder="(11) 99999-9999"
                  className="form-control"
                  value={formData.whatsapp}
                  onChange={(e) => handleChange('whatsapp', formatPhone(e.target.value))}
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
          </div>
        )}

        {/* ========================================================
            ABA 2 — CLÍNICO
           ======================================================== */}
        {activeTab === 'clinico' && (
          <div className="form-tab-content">
            <div className="form-grid-2">
              <div className="form-group">
                <label>Peso Atual (kg) *</label>
                <div className="input-suffix-wrapper">
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="Ex: 70.5"
                    className="form-control"
                    value={formData.peso_inicial}
                    onChange={(e) => handleChange('peso_inicial', e.target.value)}
                  />
                  <span className="input-suffix">kg</span>
                </div>
              </div>

              <div className="form-group">
                <label>Altura (cm) *</label>
                <div className="input-suffix-wrapper">
                  <input
                    type="number"
                    step="1"
                    required
                    placeholder="Ex: 168"
                    className="form-control"
                    value={formData.altura}
                    onChange={(e) => handleChange('altura', e.target.value)}
                  />
                  <span className="input-suffix">cm</span>
                </div>
              </div>
            </div>

            {/* IMC Calculado Automaticamente (Somente Leitura) */}
            {imcResult ? (
              <div className="imc-calc-box" style={{ borderColor: imcResult.color }}>
                <div className="imc-badge">
                  <span>IMC Calculado:</span> <strong>{imcResult.value} kg/m²</strong>
                </div>
                <div className="imc-classification" style={{ color: imcResult.color }}>
                  Classificação OMS: <strong>{imcResult.classif}</strong>
                </div>
              </div>
            ) : (
              <p className="text-muted" style={{ fontSize: '0.8rem', margin: '0.5rem 0 1rem' }}>
                * Preencha o peso e altura para o cálculo automático do IMC.
              </p>
            )}

            <div className="form-group" style={{ marginTop: '1.25rem' }}>
              <label>Objetivo</label>
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
              <label>Detalhamento adicional do objetivo</label>
              <textarea
                rows="2"
                placeholder="Anotações adicionais do objetivo do paciente..."
                className="form-control"
                value={formData.objetivo_texto}
                onChange={(e) => handleChange('objetivo_texto', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Nível de Atividade Física</label>
              <select
                className="form-control"
                value={formData.nivel_atividade}
                onChange={(e) => handleChange('nivel_atividade', e.target.value)}
              >
                <option value="Sedentário">Sedentário</option>
                <option value="Levemente ativo">Levemente ativo</option>
                <option value="Moderadamente ativo">Moderadamente ativo</option>
                <option value="Muito ativo">Muito ativo</option>
                <option value="Extremamente ativo">Extremamente ativo</option>
              </select>
            </div>

            {/* Patologias ou Condições de Saúde */}
            <div className="form-group">
              <label>Patologias ou Condições de Saúde</label>
              <div className="tags-selector">
                <button
                  type="button"
                  className={`tag-chip ${formData.patologias.includes('Nenhum') ? 'active-neutral' : ''}`}
                  onClick={() => toggleArrayItem('patologias', 'Nenhum')}
                >
                  {formData.patologias.includes('Nenhum') && <Check size={14} />}
                  Nenhum
                </button>
                {PATOLOGIAS_PADRAO.map((pat) => {
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
                {/* Itens customizados */}
                {formData.patologias.filter(p => p !== 'Nenhum' && !PATOLOGIAS_PADRAO.includes(p)).map((custom) => (
                  <button
                    key={custom}
                    type="button"
                    className="tag-chip active-warning"
                    onClick={() => toggleArrayItem('patologias', custom)}
                  >
                    <Check size={14} />
                    {custom}
                  </button>
                ))}
              </div>

              {/* Campo para adicionar livremente */}
              <div className="add-tag-inline-form">
                <input
                  type="text"
                  placeholder="Adicionar outra patologia..."
                  className="form-control form-control-sm"
                  value={customPatologia}
                  onChange={(e) => setCustomPatologia(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomItem('patologias', customPatologia, setCustomPatologia);
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn-outline btn-sm"
                  onClick={() => addCustomItem('patologias', customPatologia, setCustomPatologia)}
                >
                  <Plus size={14} /> Adicionar
                </button>
              </div>
            </div>

            {/* Restrições Alimentares */}
            <div className="form-group">
              <label>Restrições Alimentares</label>
              <div className="tags-selector">
                <button
                  type="button"
                  className={`tag-chip ${formData.restricoes_alimentares.includes('Nenhum') ? 'active-neutral' : ''}`}
                  onClick={() => toggleArrayItem('restricoes_alimentares', 'Nenhum')}
                >
                  {formData.restricoes_alimentares.includes('Nenhum') && <Check size={14} />}
                  Nenhum
                </button>
                {RESTRICOES_PADRAO.map((rest) => {
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
                {/* Itens customizados */}
                {formData.restricoes_alimentares.filter(r => r !== 'Nenhum' && !RESTRICOES_PADRAO.includes(r)).map((custom) => (
                  <button
                    key={custom}
                    type="button"
                    className="tag-chip active"
                    onClick={() => toggleArrayItem('restricoes_alimentares', custom)}
                  >
                    <Check size={14} />
                    {custom}
                  </button>
                ))}
              </div>

              {/* Campo para adicionar livremente */}
              <div className="add-tag-inline-form">
                <input
                  type="text"
                  placeholder="Adicionar outra restrição..."
                  className="form-control form-control-sm"
                  value={customRestricao}
                  onChange={(e) => setCustomRestricao(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomItem('restricoes_alimentares', customRestricao, setCustomRestricao);
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn-outline btn-sm"
                  onClick={() => addCustomItem('restricoes_alimentares', customRestricao, setCustomRestricao)}
                >
                  <Plus size={14} /> Adicionar
                </button>
              </div>
            </div>

            {/* Alergias Alimentares */}
            <div className="form-group">
              <label>Alergias Alimentares</label>
              <div className="tags-selector">
                <button
                  type="button"
                  className={`tag-chip ${formData.alergias.includes('Nenhum') ? 'active-neutral' : ''}`}
                  onClick={() => toggleArrayItem('alergias', 'Nenhum')}
                >
                  {formData.alergias.includes('Nenhum') && <Check size={14} />}
                  Nenhum
                </button>
                {ALERGIAS_PADRAO.map((alerg) => {
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
                {/* Itens customizados */}
                {formData.alergias.filter(a => a !== 'Nenhum' && !ALERGIAS_PADRAO.includes(a)).map((custom) => (
                  <button
                    key={custom}
                    type="button"
                    className="tag-chip active-danger"
                    onClick={() => toggleArrayItem('alergias', custom)}
                  >
                    <Check size={14} />
                    {custom}
                  </button>
                ))}
              </div>

              {/* Campo para adicionar livremente */}
              <div className="add-tag-inline-form">
                <input
                  type="text"
                  placeholder="Adicionar outra alergia..."
                  className="form-control form-control-sm"
                  value={customAlergia}
                  onChange={(e) => setCustomAlergia(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomItem('alergias', customAlergia, setCustomAlergia);
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn-outline btn-sm"
                  onClick={() => addCustomItem('alergias', customAlergia, setCustomAlergia)}
                >
                  <Plus size={14} /> Adicionar
                </button>
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Medicamentos Contínuos</label>
                <input
                  type="text"
                  placeholder="Ex: Losartana 50mg, Levotiroxina 75mcg..."
                  className="form-control"
                  value={formData.medicamentos}
                  onChange={(e) => handleChange('medicamentos', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Suplementos em Uso</label>
                <input
                  type="text"
                  placeholder="Ex: Creatina 5g, Whey Protein, Vitamina D..."
                  className="form-control"
                  value={formData.suplementos}
                  onChange={(e) => handleChange('suplementos', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            ABA 3 — HÁBITOS
           ======================================================== */}
        {activeTab === 'habitos' && (
          <div className="form-tab-content">
            <div className="form-grid-2">
              <div className="form-group">
                <label>Quantas refeições faz por dia?</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  className="form-control"
                  value={formData.refeicoes_por_dia}
                  onChange={(e) => handleChange('refeicoes_por_dia', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Quantidade de água por dia (litros)</label>
                <div className="input-suffix-wrapper">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Ex: 2.5"
                    className="form-control"
                    value={formData.litros_agua}
                    onChange={(e) => handleChange('litros_agua', e.target.value)}
                  />
                  <span className="input-suffix">litros</span>
                </div>
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Horário que acorda</label>
                <input
                  type="text"
                  placeholder="Ex: 06:30 ou 630"
                  className="form-control"
                  value={formData.horario_acorda}
                  onChange={(e) => handleChange('horario_acorda', e.target.value)}
                  onBlur={(e) => handleChange('horario_acorda', formatTimeString(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label>Horário que dorme</label>
                <input
                  type="text"
                  placeholder="Ex: 22:30 ou 2230"
                  className="form-control"
                  value={formData.horario_dorme}
                  onChange={(e) => handleChange('horario_dorme', e.target.value)}
                  onBlur={(e) => handleChange('horario_dorme', formatTimeString(e.target.value))}
                />
              </div>
            </div>

            <div className="form-group checkbox-wrapper" style={{ marginTop: '0.5rem' }}>
              <label className="custom-checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.atividade_fisica}
                  onChange={(e) => handleChange('atividade_fisica', e.target.checked)}
                />
                <span>Pratica atividade física atualmente?</span>
              </label>
            </div>

            {formData.atividade_fisica && (
              <div className="form-group">
                <label>Qual atividade e frequência semanal?</label>
                <input
                  type="text"
                  placeholder="Ex: Musculação 4x na semana (50 min) + Corrida aos sábados"
                  className="form-control"
                  value={formData.atividade_fisica_descricao}
                  onChange={(e) => handleChange('atividade_fisica_descricao', e.target.value)}
                />
              </div>
            )}

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label>Observações Gerais</label>
              <textarea
                rows="3"
                placeholder="Anotações adicionais da rotina, histórico familiar, queixas alimentares..."
                className="form-control"
                value={formData.observacoes}
                onChange={(e) => handleChange('observacoes', e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="modal-footer">
          <div className="modal-footer-nav">
            {activeTab !== 'pessoal' && (
              <button
                type="button"
                className="btn-outline"
                onClick={() => setActiveTab(activeTab === 'habitos' ? 'clinico' : 'pessoal')}
              >
                <ArrowLeft size={16} /> Aba Anterior
              </button>
            )}
            {activeTab !== 'habitos' && (
              <button
                type="button"
                className="btn-primary-action"
                onClick={() => setActiveTab(activeTab === 'pessoal' ? 'clinico' : 'habitos')}
              >
                Próxima Aba <ArrowRight size={16} />
              </button>
            )}
          </div>
          <div className="modal-footer-actions">
            <button type="button" className="btn-outline" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary-action" disabled={loading}>
              {loading ? 'Salvando...' : (patientToEdit ? 'Atualizar Paciente' : 'Salvar Paciente')}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
