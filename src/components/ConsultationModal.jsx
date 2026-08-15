import { useState, useEffect } from 'react';
import Modal from './Modal';

export default function ConsultationModal({ isOpen, onClose, onSave, pacientes, preSelectedPatientId }) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    paciente_id: '',
    data_consulta: new Date().toISOString().slice(0, 10),
    peso: '',
    cintura: '',
    quadril: '',
    percentual_gordura: '',
    observacoes: '',
    proximo_retorno: ''
  });

  useEffect(() => {
    if (preSelectedPatientId) {
      setFormData(prev => ({ ...prev, paciente_id: preSelectedPatientId }));
    } else if (pacientes && pacientes.length > 0) {
      setFormData(prev => ({ ...prev, paciente_id: prev.paciente_id || pacientes[0].id }));
    }
  }, [preSelectedPatientId, pacientes, isOpen]);

  const selectedPatient = pacientes?.find(p => p.id === formData.paciente_id);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Cálculo de IMC da consulta
  const calcConsultaIMC = () => {
    const peso = parseFloat(formData.peso);
    if (!peso || !selectedPatient?.altura) return null;
    let alt = parseFloat(selectedPatient.altura);
    if (alt > 3) alt = alt / 100;
    const imc = peso / (alt * alt);
    return imc.toFixed(2);
  };

  // Relação Cintura-Quadril (RCQ)
  const calcRCQ = () => {
    const c = parseFloat(formData.cintura);
    const q = parseFloat(formData.quadril);
    if (!c || !q) return null;
    const rcq = c / q;
    const sexo = selectedPatient?.sexo || 'Feminino';
    let risco = 'Baixo';
    if (sexo === 'Feminino') {
      if (rcq > 0.85) risco = 'Alto (Risco Cardiovascular)';
      else if (rcq > 0.80) risco = 'Moderado';
    } else {
      if (rcq > 0.95) risco = 'Alto (Risco Cardiovascular)';
      else if (rcq > 0.90) risco = 'Moderado';
    }
    return { value: rcq.toFixed(2), risco };
  };

  const imcVal = calcConsultaIMC();
  const rcqResult = calcRCQ();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.paciente_id) {
      alert('Selecione o paciente para registrar a consulta.');
      return;
    }
    setLoading(true);
    try {
      await onSave({
        paciente_id: formData.paciente_id,
        data_consulta: formData.data_consulta,
        peso: formData.peso ? parseFloat(formData.peso) : null,
        cintura: formData.cintura ? parseFloat(formData.cintura) : null,
        quadril: formData.quadril ? parseFloat(formData.quadril) : null,
        percentual_gordura: formData.percentual_gordura ? parseFloat(formData.percentual_gordura) : null,
        observacoes: formData.observacoes,
        proximo_retorno: formData.proximo_retorno || null
      });
      onClose();
    } catch (err) {
      alert('Erro ao registrar consulta: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Nova Consulta & Avaliação"
      subtitle="Insira as medidas antropométricas e notas clínicas da consulta"
      maxWidth="680px"
    >
      <form onSubmit={handleSubmit} className="consultation-form">
        <div className="form-group full-width">
          <label>Selecione o Paciente *</label>
          <select
            className="form-control"
            required
            value={formData.paciente_id}
            onChange={(e) => handleChange('paciente_id', e.target.value)}
          >
            <option value="">Selecione o paciente</option>
            {pacientes?.map(p => (
              <option key={p.id} value={p.id}>
                {p.nome} {p.email ? `(${p.email})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label>Data da Consulta *</label>
            <input
              type="date"
              required
              className="form-control"
              value={formData.data_consulta}
              onChange={(e) => handleChange('data_consulta', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Data do Próximo Retorno</label>
            <input
              type="date"
              className="form-control"
              value={formData.proximo_retorno}
              onChange={(e) => handleChange('proximo_retorno', e.target.value)}
            />
          </div>
        </div>

        <div className="section-divider">
          <span>Avaliação Antropométrica</span>
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label>Peso Atual (kg)</label>
            <input
              type="number"
              step="0.1"
              placeholder="Ex: 68.4"
              className="form-control"
              value={formData.peso}
              onChange={(e) => handleChange('peso', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>% de Gordura Corporal (Opcional)</label>
            <input
              type="number"
              step="0.1"
              placeholder="Ex: 22.5"
              className="form-control"
              value={formData.percentual_gordura}
              onChange={(e) => handleChange('percentual_gordura', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Circunferência da Cintura (cm)</label>
            <input
              type="number"
              step="0.1"
              placeholder="Ex: 78"
              className="form-control"
              value={formData.cintura}
              onChange={(e) => handleChange('cintura', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Circunferência do Quadril (cm)</label>
            <input
              type="number"
              step="0.1"
              placeholder="Ex: 102"
              className="form-control"
              value={formData.quadril}
              onChange={(e) => handleChange('quadril', e.target.value)}
            />
          </div>
        </div>

        {(imcVal || rcqResult) && (
          <div className="evaluation-highlights">
            {imcVal && (
              <div className="highlight-pill">
                <span>IMC na Consulta:</span> <strong>{imcVal} kg/m²</strong>
              </div>
            )}
            {rcqResult && (
              <div className="highlight-pill">
                <span>RCQ (Cintura/Quadril):</span> <strong>{rcqResult.value}</strong> ({rcqResult.risco})
              </div>
            )}
          </div>
        )}

        <div className="form-group">
          <label>Observações Clínicas / Conduta Nutricional</label>
          <textarea
            rows="4"
            placeholder="Descreva a evolução do paciente, adesão à dieta anterior, mudanças no plano, queixas..."
            className="form-control"
            value={formData.observacoes}
            onChange={(e) => handleChange('observacoes', e.target.value)}
          />
        </div>

        <div className="modal-footer">
          <div></div>
          <div className="modal-footer-actions">
            <button type="button" className="btn-outline" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary-action" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Consulta'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
