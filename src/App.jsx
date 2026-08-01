import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSession } from './lib/auth';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="auth-page">
        <p>Carregando Vitta Nutri...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={session ? <Navigate to="/" /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={session ? <Navigate to="/" /> : <Register />} 
        />
        <Route 
          path="/" 
          element={session ? <Dashboard session={session} /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
