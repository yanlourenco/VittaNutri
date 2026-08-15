import { Calendar, UserPlus, PlusCircle, UtensilsCrossed } from 'lucide-react';

export default function Header({ session, onNewPatient, onNewConsulta, onNewPlano }) {
  const todayFormatted = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <header className="app-header">
      <div className="header-greeting">
        <h1>Olá, {session?.user?.name ? session.user.name.split(' ')[0] : 'Nutricionista'} 👋</h1>
        <div className="header-date">
          <Calendar size={15} />
          <span>{capitalize(todayFormatted)}</span>
        </div>
      </div>

      <div className="header-quick-actions">
        <button className="btn-action btn-action-secondary" onClick={onNewPlano}>
          <UtensilsCrossed size={16} />
          <span>Novo Plano</span>
        </button>
        <button className="btn-action btn-action-secondary" onClick={onNewConsulta}>
          <PlusCircle size={16} />
          <span>Nova Consulta</span>
        </button>
        <button className="btn-action btn-action-primary" onClick={onNewPatient}>
          <UserPlus size={16} />
          <span>Novo Paciente</span>
        </button>
      </div>
    </header>
  );
}
