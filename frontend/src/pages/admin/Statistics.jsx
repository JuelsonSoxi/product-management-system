import { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import Navbar from '../../components/Navbar';

export default function AdminStatistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await apiClient.get('/v1/admin/statistics');
      setStats(response.data.data);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">A carregar estatísticas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <span className="text-6xl mb-4 block">📊</span>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Sem dados disponíveis</h2>
            <p className="text-gray-600">Não foi possível carregar as estatísticas do sistema.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Estatísticas do Sistema</h1>
          <p className="text-gray-600">Visão geral do SIS</p>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">👥</span>
              <div className="text-right">
                <p className="text-3xl font-bold">{stats.total_users}</p>
                <p className="text-blue-100 text-sm">Utilizadores</p>
              </div>
            </div>
            <div className="text-sm text-blue-100">
              {stats.active_users} ativos
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">👨‍⚕️</span>
              <div className="text-right">
                <p className="text-3xl font-bold">{stats.total_doctors}</p>
                <p className="text-green-100 text-sm">Médicos</p>
              </div>
            </div>
            <div className="text-sm text-green-100">
              {stats.specialties_count} especialidades
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">📅</span>
              <div className="text-right">
                <p className="text-3xl font-bold">{stats.total_appointments}</p>
                <p className="text-purple-100 text-sm">Consultas</p>
              </div>
            </div>
            <div className="text-sm text-purple-100">
              {stats.upcoming_appointments} próximas
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">📋</span>
              <div className="text-right">
                <p className="text-3xl font-bold">{stats.total_medical_records}</p>
                <p className="text-orange-100 text-sm">RCUs</p>
              </div>
            </div>
            <div className="text-sm text-orange-100">
              Registos clínicos
            </div>
          </div>
        </div>

        {/* Consultas por Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Consultas por Status</h2>
            <div className="space-y-3">
              {Object.entries(stats.appointments_by_status || {}).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      status === 'agendada' ? 'bg-blue-500' :
                      status === 'confirmada' ? 'bg-green-500' :
                      status === 'realizada' ? 'bg-gray-500' :
                      'bg-red-500'
                    }`}></div>
                    <span className="capitalize text-gray-700">{status}</span>
                  </div>
                  <span className="font-bold text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Utilizadores por Tipo</h2>
            <div className="space-y-3">
              {Object.entries(stats.users_by_role || {}).map(([role, count]) => (
                <div key={role} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      role === 'utente' ? 'bg-blue-500' :
                      role === 'medico' ? 'bg-green-500' :
                      role === 'administrativo' ? 'bg-purple-500' :
                      'bg-red-500'
                    }`}></div>
                    <span className="capitalize text-gray-700">{role}</span>
                  </div>
                  <span className="font-bold text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Médicos por Especialidade */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Médicos por Especialidade</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(stats.doctors_by_specialty || {}).map(([specialty, count]) => (
              <div key={specialty} className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">{specialty}</p>
                <p className="text-2xl font-bold text-gray-900">{count} médico(s)</p>
              </div>
            ))}
          </div>
        </div>

        {/* Atividade Recente */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Atividade Recente (Últimos 30 dias)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">{stats.new_users_month}</p>
              <p className="text-sm text-gray-600 mt-1">Novos Utilizadores</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">{stats.appointments_month}</p>
              <p className="text-sm text-gray-600 mt-1">Consultas Marcadas</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">{stats.consultations_month}</p>
              <p className="text-sm text-gray-600 mt-1">Consultas Realizadas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}