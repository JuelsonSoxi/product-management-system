import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Welcome */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Bem-vindo, <span className="text-blue-600">{user?.name || 'Utilizador'}</span>! 👋
            </h1>
            <p className="text-gray-600 text-lg">
              {user?.role === 'admin' 
                ? '📊 Painel administrativo - Visualize estatísticas completas do sistema'
                : '📦 Gerencie seus produtos com facilidade e controle seu inventário'}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-600 text-sm font-medium">Seu Papel</div>
                  <div className="text-2xl font-bold text-gray-900 mt-2">
                    {user?.role === 'admin' ? '👨‍💼 Administrador' : '👤 Cliente'}
                  </div>
                </div>
                <div className="text-4xl">{user?.role === 'admin' ? '⚙️' : '🛍️'}</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-600 text-sm font-medium">Email</div>
                  <div className="text-lg font-bold text-gray-900 mt-2 truncate">{user?.email}</div>
                </div>
                <div className="text-4xl">📧</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-600 text-sm font-medium">Status</div>
                  <div className="text-lg font-bold text-green-600 mt-2">✅ Autenticado</div>
                </div>
                <div className="text-4xl">🔐</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Ações Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => navigate('/products')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition flex items-center justify-center gap-2 group"
              >
                <span className="text-2xl group-hover:scale-110 transition">📦</span>
                <span>Meus Produtos</span>
              </button>

              {user?.role === 'admin' && (
                <>
                  <button
                    onClick={() => navigate('/admin')}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 rounded-lg transition flex items-center justify-center gap-2 group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition">📊</span>
                    <span>Estatísticas</span>
                  </button>

                  <button
                    onClick={() => navigate('/admin')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-lg transition flex items-center justify-center gap-2 group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition">👥</span>
                    <span>Utilizadores</span>
                  </button>

                  <button
                    onClick={() => navigate('/admin')}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-4 rounded-lg transition flex items-center justify-center gap-2 group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition">⚙️</span>
                    <span>Configuração</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">💡 Dica</h3>
              <p className="text-blue-100">
                Comece criando seus primeiros produtos. Use a busca rápida para encontrar produtos rapidamente.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">🎯 Próximas Ações</h3>
              <ul className="space-y-2 text-green-100">
                <li>✓ Criar novo produto</li>
                <li>✓ Gerenciar stock</li>
                <li>✓ Visualizar estatísticas</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
