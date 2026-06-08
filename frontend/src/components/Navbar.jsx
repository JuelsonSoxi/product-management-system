import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Definir tema baseado no role do usuário
  const getTheme = () => {
    const role = user?.roles?.[0]?.name;
    
    switch(role) {
      case 'admin':
        return {
          gradient: 'from-purple-600 to-purple-700',
          hover: 'hover:text-purple-100',
          button: 'bg-purple-500 hover:bg-purple-400',
          badge: 'text-purple-200'
        };
      case 'medico':
        return {
          gradient: 'from-green-600 to-green-700',
          hover: 'hover:text-green-100',
          button: 'bg-green-500 hover:bg-green-400',
          badge: 'text-green-200'
        };
      case 'utente':
      default:
        return {
          gradient: 'from-blue-600 to-blue-700',
          hover: 'hover:text-blue-100',
          button: 'bg-blue-500 hover:bg-blue-400',
          badge: 'text-blue-200'
        };
    }
  };

  const theme = getTheme();

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  return (
    <>
      <nav className={`bg-gradient-to-r ${theme.gradient} shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className={`text-2xl font-bold ${user?.roles?.[0]?.name === 'admin' ? 'text-purple-600' : user?.roles?.[0]?.name === 'medico' ? 'text-green-600' : 'text-blue-600'}`}>
                  +
                </span>
              </div>
              <span className="text-white font-bold text-xl">SIS</span>
            </Link>

            {user && (
              <div className="flex items-center space-x-6">
                <Link to="/dashboard" className={`text-white ${theme.hover} transition`}>
                  Dashboard
                </Link>
                
                {user.roles?.some(r => r.name === 'utente') && (
                  <>
                    <Link to="/appointments" className={`text-white ${theme.hover} transition`}>
                      Consultas
                    </Link>
                    <Link to="/medical-record" className={`text-white ${theme.hover} transition`}>
                      Meu RCU
                    </Link>
                    <Link to="/specialties" className={`text-white ${theme.hover} transition`}>
                      Especialidades
                    </Link>
                  </>
                )}

                {user.roles?.some(r => r.name === 'medico') && (
                  <>
                    <Link to="/appointments" className={`text-white ${theme.hover} transition`}>
                      Minhas Consultas
                    </Link>
                    <Link to="/doctor/schedule" className={`text-white ${theme.hover} transition`}>
                      Meu Horário
                    </Link>
                  </>
                )}

                {user.roles?.some(r => r.name === 'admin') && (
                  <>
                    <Link to="/admin/users" className={`text-white ${theme.hover} transition`}>
                      Utilizadores
                    </Link>
                    <Link to="/admin/doctors" className={`text-white ${theme.hover} transition`}>
                      Médicos
                    </Link>
                    <Link to="/admin/specialties" className={`text-white ${theme.hover} transition`}>
                      Especialidades
                    </Link>
                    <Link to="/admin/reports" className={`text-white ${theme.hover} transition`}>
                      Relatórios
                    </Link>
                    <Link to="/admin/statistics" className={`text-white ${theme.hover} transition`}>
                      Estatísticas
                    </Link>
                  </>
                )}

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-white text-sm font-medium">{user.fname} {user.lname}</p>
                    <p className={`${theme.badge} text-xs capitalize`}>
                      {user.roles?.[0]?.name || 'Utilizador'}
                    </p>
                  </div>
                  <button
                    onClick={handleLogoutClick}
                    className={`${theme.button} text-white px-4 py-2 rounded-lg text-sm font-medium transition`}
                  >
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Modal de Confirmação */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Terminar Sessão?
              </h3>
              <p className="text-gray-600">
                Tem a certeza que deseja sair do sistema?
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                disabled={loggingOut}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmLogout}
                disabled={loggingOut}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loggingOut ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>A sair...</span>
                  </>
                ) : (
                  'Sim, sair'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}