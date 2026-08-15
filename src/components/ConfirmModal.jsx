import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirmação', 
  message = 'Tem certeza que deseja executar esta ação?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  loading = false
}) {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="450px"
    >
      <div className="confirm-modal-content">
        <div className={`confirm-icon-wrapper ${variant}`}>
          <AlertTriangle size={28} />
        </div>
        <p className="confirm-message">{message}</p>
        <div className="confirm-modal-actions">
          <button 
            type="button" 
            className="btn-outline" 
            onClick={onClose} 
            disabled={loading}
          >
            {cancelText}
          </button>
          <button 
            type="button" 
            className={variant === 'danger' ? 'btn-danger-action' : 'btn-primary-action'} 
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Processando...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
