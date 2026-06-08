import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getTheme = () => {
    return user?.role === 'admin'
      ? {
          gradient: 'from-indigo-600 to-indigo-700',
          hover: 'hover:text-indigo-100',
          button: 'bg-indigo-500 hover:bg-indigo-400',
          badge: 'text-indigo-200',
          hoverBg: 'hover:bg-indigo-600',
        }
      : {
          gradient: 'from-blue-600 to-blue-700',
          hover: 'hover:text-blue-100',
          button: 'bg-blue-500 hover:bg-blue-400',
          badge: 'text-blue-200',
          hoverBg: 'hover:bg-blue-600',
        };
  };

  const theme = getTheme();

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
      <nav className={`fixed top-0 w-full bg-gradient-to-r ${theme.gradient} shadow-xl z-50`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg">
                <span className={`text-2xl font-bold ${user?.role === 'admin' ? 'text-indigo-600' : 'text-blue-600'}`}>
                  📦
                </span>
              </div>
              <div className="hidden sm:block">
                <span className="text-white font-bold text-xl">Product Manager</span>
                <div className="text-white text-xs opacity-75">Sistema de Gestão</div>
              </div>
            </Link>

            {/* Desktop Menu */}
            {user ? (
              <div className="hidden md:flex items-center space-x-8">
                <Link
                  to="/dashboard"
                  className={`text-white ${theme.hover} transition flex items-center gap-2 font-medium`}
                >
                  🏠 Dashboard
                </Link>
                
                {user.role !== 'admin' && (
                  <Link
                    to="/products"
                    className={`text-white ${theme.hover} transition flex items-center gap-2 font-medium`}
                  >
                    📦 Produtos
                  </Link>
                )}

                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`text-white ${theme.hover} transition flex items-center gap-2 font-medium`}
                  >
                    📊 Estatísticas
                  </Link>
                )}

                {/* User Section */}
                <div className="border-l border-white/20 pl-8 flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-white text-sm font-semibold">{user.name}</p>
                    <p className={`${theme.badge} text-xs capitalize font-medium`}>
                      {user.role === 'admin' ? '👨‍💼 Admin' : '👤 Cliente'}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className={`${theme.button} text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-lg hover:shadow-xl`}
                  >
                    🚪 Sair
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/login"
                  className={`text-white ${theme.hover} transition font-medium`}
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className={`bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition`}
                >
                  Registar
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            {user && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`md:hidden text-white ${theme.hover} transition`}
              >
                {mobileMenuOpen ? '✕' : '☰'}
              </button>
            )}
          </div>

          {/* Mobile Menu */}
          {user && mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-white/20 pt-4 space-y-3">
              <Link
                to="/dashboard"
                className={`block text-white ${theme.hover} transition font-medium py-2`}
                onClick={() => setMobileMenuOpen(false)}
              >
                🏠 Dashboard
              </Link>
              
              {user.role !== 'admin' && (
                <Link
                  to="/products"
                  className={`block text-white ${theme.hover} transition font-medium py-2`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  📦 Produtos
                </Link>
              )}

              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`block text-white ${theme.hover} transition font-medium py-2`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  📊 Estatísticas
                </Link>
              )}

              <button
                onClick={() => {
                  setShowLogoutModal(true);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left ${theme.button} text-white px-4 py-2 rounded-lg font-medium transition`}
              >
                🚪 Sair
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">👋</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Terminar Sessão?
              </h3>
              <p className="text-gray-600 mb-6">
                Tem a certeza que deseja sair do sistema?
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                disabled={loggingOut}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold transition disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmLogout}
                disabled={loggingOut}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loggingOut ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sair...
                  </>
                ) : (
                  '✓ Confirmar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
