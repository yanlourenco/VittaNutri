import { 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  UtensilsCrossed, 
  Calculator, 
  LogOut
} from 'lucide-react';
import VittaLogo from './VittaLogo';

export default function Sidebar({ activeTab, setActiveTab, session, onLogout }) {
  const menuItems = [
    { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'pacientes', label: 'Pacientes', icon: Users },
    { id: 'consultas', label: 'Consultas & Medidas', icon: Stethoscope },
    { id: 'planos', label: 'Planos Alimentares', icon: UtensilsCrossed },
    { id: 'calculadoras', label: 'Calculadoras', icon: Calculator },
  ];

  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <VittaLogo size={24} color="#38bdf8" />
        </div>
        <div className="brand-text">
          <h2>Vitta Nutri</h2>
          <span>Gestão Clínica</span>
        </div>
      </div>

      <div className="sidebar-section-title">MENU PRINCIPAL</div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile-summary">
          <div className="avatar-circle">
            {(session?.user?.name || session?.user?.email || 'N').charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <span className="user-name">{session?.user?.name || 'Nutricionista'}</span>
            <span className="user-email">{session?.user?.email}</span>
          </div>
        </div>
        <button onClick={onLogout} className="sidebar-logout-btn" title="Encerrar Sessão">
          <LogOut size={18} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
