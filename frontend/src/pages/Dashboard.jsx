import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await apiClient.get('/v1/appointments?per_page=5');
      setAppointments(response.data.data.data || []);
    } catch (error) {
      console.error('Erro ao buscar consultas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      agendada: 'bg-blue-100 text-blue-800',
      confirmada: 'bg-green-100 text-green-800',
      realizada: 'bg-gray-100 text-gray-800',
      cancelada: 'bg-red-100 text-red-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Bem-vindo(a), {user.fname}! 👋
          </h1>
          <p className="text-blue-100">
            {user.roles?.[0]?.name === 'utente' && 'Gerencie suas consultas e informações médicas'}
            {user.roles?.[0]?.name === 'medico' && 'Veja suas consultas agendadas'}
            {user.roles?.[0]?.name === 'administrativo' && 'Gerencie o sistema hospitalar'}
          </p>
        </div>

        {/* Cards de Ações Rápidas */}
        {user.roles?.[0]?.name === 'utente' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link
              to="/appointments/new"
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Marcar Consulta
              </h3>
              <p className="text-gray-600 text-sm">
                Agende uma nova consulta médica
              </p>
            </Link>

            <Link
              to="/medical-record"
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Meu RCU
              </h3>
              <p className="text-gray-600 text-sm">
                Veja seu Registo Clínico de Utente
              </p>
            </Link>

            <Link
              to="/specialties"
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition group"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition">
                <span className="text-2xl">🏥</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Especialidades
              </h3>
              <p className="text-gray-600 text-sm">
                Veja especialidades e médicos
              </p>
            </Link>
          </div>
        )}

        {/* Próximas Consultas */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {user.roles?.[0]?.name === 'medico' ? 'Suas Consultas' : 'Próximas Consultas'}
            </h2>
            <Link
              to="/appointments"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Ver todas →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-4">A carregar...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">📅</span>
              <p className="text-gray-600">Nenhuma consulta agendada</p>
              {user.roles?.[0]?.name === 'utente' && (
                <Link
                  to="/appointments/new"
                  className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Marcar primeira consulta
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-800">
                          {appointment.specialty?.name}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-1">
                        {appointment.medical_staff?.user ? 
                          `Dr(a). ${appointment.medical_staff.user.fname} ${appointment.medical_staff.user.lname}` :
                          'Médico não disponível'
                        }
                      </p>
                      <p className="text-gray-500 text-sm">
                        📅 {formatDate(appointment.appointment_date)}
                      </p>
                    </div>
                    <Link
                      to={`/appointments/${appointment.id}`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Ver detalhes
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}