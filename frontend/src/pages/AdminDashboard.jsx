import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { authAPI } from '../api/client';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 30000); // Atualizar a cada 30s
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getStats();
      setStats(response.data);
      setError('');
    } catch (err) {
      setError('Erro ao carregar estatísticas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Painel de Administração</h1>
            <button
              onClick={loadStats}
              className="text-gray-600 hover:text-gray-900 text-2xl"
              title="Atualizar"
            >
              🔄
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-4">A carregar...</p>
            </div>
          ) : stats ? (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-gray-600 text-sm font-medium mb-2">Clientes Registados</div>
                      <div className="text-4xl font-bold text-blue-600">{stats.total_users || 0}</div>
                    </div>
                    <div className="text-4xl">👥</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-gray-600 text-sm font-medium mb-2">Total de Produtos</div>
                      <div className="text-4xl font-bold text-green-600">{stats.total_products || 0}</div>
                    </div>
                    <div className="text-4xl">📦</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 border-l-4 border-purple-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-gray-600 text-sm font-medium mb-2">Preço Médio</div>
                      <div className="text-4xl font-bold text-purple-600">
                        €{stats.average_price ? parseFloat(stats.average_price).toFixed(2) : '0.00'}
                      </div>
                    </div>
                    <div className="text-4xl">📊</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 border-l-4 border-orange-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-gray-600 text-sm font-medium mb-2">Produto Mais Caro</div>
                      <div className="text-4xl font-bold text-orange-600">
                        €{stats.highest_price ? parseFloat(stats.highest_price).toFixed(2) : '0.00'}
                      </div>
                    </div>
                    <div className="text-4xl">💎</div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumo do Sistema</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">📈 Métricas Chave</h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex justify-between">
                        <span>Clientes Ativos:</span>
                        <span className="font-semibold text-gray-900">{stats.total_users}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Produtos Cadastrados:</span>
                        <span className="font-semibold text-gray-900">{stats.total_products}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Média de Produtos/Cliente:</span>
                        <span className="font-semibold text-gray-900">
                          {stats.total_users > 0 ? (stats.total_products / stats.total_users).toFixed(2) : '0.00'}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">💰 Análise de Preços</h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex justify-between">
                        <span>Preço Máximo:</span>
                        <span className="font-semibold text-gray-900">€{stats.highest_price ? parseFloat(stats.highest_price).toFixed(2) : '0.00'}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Preço Médio:</span>
                        <span className="font-semibold text-gray-900">€{stats.average_price ? parseFloat(stats.average_price).toFixed(2) : '0.00'}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Valor Total Stock:</span>
                        <span className="font-semibold text-gray-900">€{stats.total_value ? parseFloat(stats.total_value).toFixed(2) : '0.00'}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Last Update */}
              <div className="text-center text-gray-600 text-sm">
                Última atualização: {new Date().toLocaleTimeString('pt-PT')}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
