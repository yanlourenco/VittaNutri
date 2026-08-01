import { useNavigate } from 'react-router-dom';
import { signOut } from '../lib/auth';
import { Activity, LogOut, Users } from 'lucide-react';

export default function Dashboard({ session }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      <nav className="navbar">
        <div className="navbar-brand">
          <Activity color="var(--primary)" size={24} />
          Vitta Nutri
        </div>
        <div className="nav-actions">
          <span>Olá, {session.user?.name || session.user?.email}</span>
          <button onClick={handleLogout} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LogOut size={16} /> Sair
          </button>
        </div>
      </nav>

      <main className="dashboard-content">
        <div className="welcome-section">
          <h2>Bem-vindo(a) ao Vitta Nutri</h2>
          <p>Gerencie seus pacientes e planos alimentares de forma simples e eficiente.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div className="auth-card" style={{ width: '100%', maxWidth: 'none', margin: '0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ backgroundColor: '#eff6ff', padding: '1rem', borderRadius: '8px', color: 'var(--primary)' }}>
                <Users size={24} />
              </div>
              <h3>Pacientes</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Cadastre e acompanhe a evolução de todos os seus pacientes.</p>
            <button className="btn-primary">Ver pacientes</button>
          </div>
          
          {/* Adicione mais cartões conforme a necessidade */}
        </div>
      </main>
    </div>
  );
}
