import { useState, useEffect } from 'react';
import Modal from './Modal';
import { Plus, Trash2, Clock, Share2, Printer, Check, Copy } from 'lucide-react';

const REFEICOES_PADRAO = [
  { id: '1', nome: 'Café da Manhã', horario: '07:30', alimentos: '2 ovos mexidos ou cozidos\n1 fatia de pão integral com azeite\n1 xícara de café preto sem açúcar', recomendacoes: 'Evitar sucos industrializados' },
  { id: '2', nome: 'Lanche da Manhã', horario: '10:00', alimentos: '1 fruta (maçã ou banana)\n15g de castanhas de caju ou nozes', recomendacoes: 'Beber 300ml de água' },
  { id: '3', nome: 'Almoço', horario: '12:30', alimentos: '120g de peito de frango ou peixe grelhado\n100g de arroz integral ou batata doce\n1 concha média de feijão\nSalada de folhas verdes à vontade com azeite extravirgem', recomendacoes: 'Mastigar devagar' },
  { id: '4', nome: 'Lanche da Tarde', horario: '16:00', alimentos: '1 iogurte natural desnatado com 1 colher de chia\n1 porção de morangos ou uvas', recomendacoes: 'Pode adoçar com estévia se necessário' },
  { id: '5', nome: 'Jantar', horario: '19:30', alimentos: 'Omelete de 2 ovos com legumes e queijo branco ou 100g de patinho moído com abobrinha refogada\nSalada colorida', recomendacoes: 'Evitar carboidratos pesados à noite' },
  { id: '6', nome: 'Ceia', horario: '22:00', alimentos: '1 xícara de chá de camomila ou melissa\n3 unidades de castanha do Pará', recomendacoes: 'Tomar 30 min antes de dormir' }
];

export default function MealPlanModal({ isOpen, onClose, onSave, pacientes, preSelectedPatientId, planToView }) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    paciente_id: '',
    titulo: 'Plano Alimentar Individualizado',
    meta_calorica: '1800',
    observacoes_gerais: '• Manter hidratação mínima de 2,5 litros de água ao longo do dia.\n• Priorizar alimentos in natura e evitar ultraprocessados e frituras.\n• Respeitar os horários das refeições para estabilidade glicêmica.',
    refeicoes: REFEICOES_PADRAO
  });

  useEffect(() => {
    if (planToView) {
      setFormData({
        paciente_id: planToView.paciente_id,
        titulo: planToView.conteudo?.titulo || 'Plano Alimentar',
        meta_calorica: planToView.conteudo?.meta_calorica || '',
        observacoes_gerais: planToView.conteudo?.observacoes_gerais || '',
        refeicoes: planToView.conteudo?.refeicoes || REFEICOES_PADRAO
      });
    } else {
      if (preSelectedPatientId) {
        setFormData(prev => ({ ...prev, paciente_id: preSelectedPatientId }));
      } else if (pacientes && pacientes.length > 0) {
        setFormData(prev => ({ ...prev, paciente_id: prev.paciente_id || pacientes[0].id }));
      }
    }
  }, [preSelectedPatientId, pacientes, planToView, isOpen]);

  const selectedPatient = pacientes?.find(p => p.id === formData.paciente_id);

  const handleAddRefeicao = () => {
    const newId = String(Date.now());
    setFormData(prev => ({
      ...prev,
      refeicoes: [
        ...prev.refeicoes,
        { id: newId, nome: 'Nova Refeição', horario: '15:00', alimentos: '', recomendacoes: '' }
      ]
    }));
  };

  const handleRemoveRefeicao = (id) => {
    setFormData(prev => ({
      ...prev,
      refeicoes: prev.refeicoes.filter(r => r.id !== id)
    }));
  };

  const handleRefeicaoChange = (id, field, val) => {
    setFormData(prev => ({
      ...prev,
      refeicoes: prev.refeicoes.map(r => r.id === id ? { ...r, [field]: val } : r)
    }));
  };

  const formatTextForShare = () => {
    const nome = selectedPatient?.nome || 'Paciente';
    let text = `🌱 *VITTA NUTRI — PLANO ALIMENTAR*\n`;
    text += `👤 *Paciente:* ${nome}\n`;
    text += `📋 *Plano:* ${formData.titulo}\n`;
    if (formData.meta_calorica) text += `⚡ *Meta Estimada:* ${formData.meta_calorica} kcal\n`;
    text += `\n═══════════════════════\n\n`;

    formData.refeicoes.forEach(r => {
      text += `🕒 *${r.nome.toUpperCase()} (${r.horario})*\n`;
      if (r.alimentos) {
        r.alimentos.split('\n').forEach(item => {
          if (item.trim()) text += `  • ${item.trim()}\n`;
        });
      }
      if (r.recomendacoes) {
        text += `  💡 _Obs:_ ${r.recomendacoes}\n`;
      }
      text += `\n`;
    });

    if (formData.observacoes_gerais) {
      text += `═══════════════════════\n`;
      text += `📌 *ORIENTAÇÕES GERAIS*\n${formData.observacoes_gerais}\n`;
    }

    text += `\nQualquer dúvida, estou à disposição! 🍏✨`;
    return text;
  };

  const handleCopyText = () => {
    const text = formatTextForShare();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendWhatsApp = () => {
    const text = formatTextForShare();
    const cleanPhone = selectedPatient?.whatsapp ? selectedPatient.whatsapp.replace(/\D/g, '') : '';
    const phoneParam = cleanPhone ? (cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`) : '';
    const url = `https://api.whatsapp.com/send?${phoneParam ? `phone=${phoneParam}&` : ''}text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.paciente_id) {
      alert('Selecione o paciente.');
      return;
    }
    setLoading(true);
    try {
      await onSave({
        paciente_id: formData.paciente_id,
        conteudo: {
          titulo: formData.titulo,
          meta_calorica: formData.meta_calorica,
          observacoes_gerais: formData.observacoes_gerais,
          refeicoes: formData.refeicoes
        }
      });
      onClose();
    } catch (err) {
      alert('Erro ao salvar plano alimentar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={planToView ? 'Visualizar / Editar Plano Alimentar' : 'Montador de Plano Alimentar'}
      subtitle="Estruture refeições com horários, porções e substituições"
      maxWidth="880px"
    >
      {/* Printable Letterhead */}
      <div className="print-letterhead">
        <div className="print-brand">
          <h3>VITTA NUTRI — PRESCRIÇÃO DIETÉTICA</h3>
          <p>Prescrição Nutricional Individualizada</p>
        </div>
        <div className="print-date">
          <strong>Paciente:</strong> {selectedPatient?.nome || 'Paciente'} | Data: {new Date().toLocaleDateString('pt-BR')}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="meal-plan-form">
        <div className="plan-actions-toolbar">
          <div className="toolbar-patient-select">
            <label>Paciente:</label>
            <select
              className="form-control"
              required
              disabled={Boolean(planToView)}
              value={formData.paciente_id}
              onChange={(e) => setFormData(prev => ({ ...prev, paciente_id: e.target.value }))}
            >
              <option value="">Selecione o paciente</option>
              {pacientes?.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="toolbar-export-buttons">
            <button type="button" className="btn-toolbar" onClick={handleCopyText} title="Copiar texto formatado">
              {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
              <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
            </button>
            <button type="button" className="btn-toolbar whatsapp" onClick={handleSendWhatsApp} title="Enviar via WhatsApp">
              <Share2 size={16} />
              <span>WhatsApp</span>
            </button>
            <button type="button" className="btn-toolbar" onClick={handlePrint} title="Imprimir / Salvar PDF">
              <Printer size={16} />
              <span>Imprimir / PDF</span>
            </button>
          </div>
        </div>

        <div className="form-grid-2" style={{ marginTop: '1.25rem' }}>
          <div className="form-group">
            <label>Título / Identificação do Plano *</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="Ex: Fase 1 — Definição e Hipertrofia"
              value={formData.titulo}
              onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label>Meta Calórica Estimada (kcal/dia)</label>
            <input
              type="number"
              className="form-control"
              placeholder="Ex: 2100"
              value={formData.meta_calorica}
              onChange={(e) => setFormData(prev => ({ ...prev, meta_calorica: e.target.value }))}
            />
          </div>
        </div>

        <div className="section-divider">
          <span>Estrutura do Cardápio Diário</span>
        </div>

        <div className="meals-builder-list">
          {formData.refeicoes.map((ref, idx) => (
            <div key={ref.id} className="meal-card">
              <div className="meal-card-header">
                <div className="meal-title-inputs">
                  <span className="meal-number">#{idx + 1}</span>
                  <input
                    type="text"
                    className="meal-input-title"
                    value={ref.nome}
                    onChange={(e) => handleRefeicaoChange(ref.id, 'nome', e.target.value)}
                    placeholder="Nome da Refeição"
                  />
                  <div className="meal-time-badge">
                    <Clock size={14} />
                    <input
                      type="time"
                      className="meal-input-time"
                      value={ref.horario}
                      onChange={(e) => handleRefeicaoChange(ref.id, 'horario', e.target.value)}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="meal-delete-btn"
                  onClick={() => handleRemoveRefeicao(ref.id)}
                  title="Remover refeição"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="meal-card-body">
                <div className="form-group">
                  <label>Alimentos, Porções e Opções de Substituição</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    placeholder="Ex: 2 fatias de pão integral 100%&#10;2 ovos mexidos com azeite&#10;1 xícara de café preto sem açúcar"
                    value={ref.alimentos}
                    onChange={(e) => handleRefeicaoChange(ref.id, 'alimentos', e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Dica / Orientação Especial para esta Refeição</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ex: Pode substituir o frango por peixe grelhado ou patinho moído"
                    value={ref.recomendacoes}
                    onChange={(e) => handleRefeicaoChange(ref.id, 'recomendacoes', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}

          <button type="button" className="btn-add-meal" onClick={handleAddRefeicao}>
            <Plus size={18} /> Adicionar Nova Refeição
          </button>
        </div>

        <div className="form-group" style={{ marginTop: '1.5rem' }}>
          <label>Orientações Gerais, Metas Hídricas e Suplementação</label>
          <textarea
            rows="3"
            className="form-control"
            value={formData.observacoes_gerais}
            onChange={(e) => setFormData(prev => ({ ...prev, observacoes_gerais: e.target.value }))}
          />
        </div>

        <div className="modal-footer">
          <div></div>
          <div className="modal-footer-actions">
            <button type="button" className="btn-outline" onClick={onClose}>
              Fechar
            </button>
            <button type="submit" className="btn-primary-action" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Plano Alimentar'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
