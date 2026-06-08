import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function Appointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await apiClient.get('/v1/appointments?per_page=50');
      setAppointments(response.data.data.data || []);
    } catch (error) {
      console.error('Erro ao buscar consultas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (id) => {
    if (!confirm('Tem certeza que deseja cancelar esta consulta?')) return;

    setCancellingId(id);
    try {
      await apiClient.put(`/v1/appointments/${id}/cancel`);
      fetchAppointments();
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao cancelar consulta');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      agendada: { color: 'bg-blue-100 text-blue-800', icon: '📅' },
      confirmada: { color: 'bg-green-100 text-green-800', icon: '✓' },
      realizada: { color: 'bg-gray-100 text-gray-800', icon: '✓✓' },
      cancelada: { color: 'bg-red-100 text-red-800', icon: '✗' },
    };
    return badges[status] || badges.agendada;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-PT', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('pt-PT', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') {
      return new Date(apt.appointment_date) >= new Date() && apt.status !== 'cancelada';
    }
    if (filter === 'past') {
      return new Date(apt.appointment_date) < new Date() || apt.status === 'realizada';
    }
    return apt.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">A carregar consultas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Minhas Consultas</h1>
            <p className="text-gray-600">Gerencie suas consultas agendadas</p>
          </div>
          {user?.roles?.[0]?.name === 'utente' && (
            <Link
              to="/appointments/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              + Nova Consulta
            </Link>
          )}
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'Todas' },
              { value: 'upcoming', label: 'Próximas' },
              { value: 'agendada', label: 'Agendadas' },
              { value: 'confirmada', label: 'Confirmadas' },
              { value: 'realizada', label: 'Realizadas' },
              { value: 'cancelada', label: 'Canceladas' },
              { value: 'past', label: 'Anteriores' },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === f.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Consultas */}
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <span className="text-6xl mb-4 block">📅</span>
            <p className="text-gray-600 text-lg mb-4">
              {filter === 'all' ? 'Nenhuma consulta encontrada' : `Nenhuma consulta ${filter}`}
            </p>
            {user?.roles?.[0]?.name === 'utente' && (
              <Link
                to="/appointments/new"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                Marcar Nova Consulta
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => {
              const badge = getStatusBadge(appointment.status);
              const isPast = new Date(appointment.appointment_date) < new Date();
              const canCancel = !isPast && appointment.status === 'agendada';

              return (
                <div
                  key={appointment.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color} flex items-center gap-1`}
                          >
                            <span>{badge.icon}</span>
                            {appointment.status}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {appointment.type}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {appointment.specialty?.name}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <span>👨‍⚕️</span>
                            <span>
                              {appointment.medical_staff?.user
                                ? `Dr(a). ${appointment.medical_staff.user.fname} ${appointment.medical_staff.user.lname}`
                                : 'Médico não disponível'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <span>📅</span>
                            <span>{formatDate(appointment.appointment_date)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <span>🕐</span>
                            <span>{formatTime(appointment.appointment_date)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <span>🔢</span>
                            <span>{appointment.appointment_number}</span>
                          </div>
                        </div>

                        {appointment.reason && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">
                              <strong>Motivo:</strong> {appointment.reason}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Link
                          to={`/appointments/${appointment.id}`}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition text-center"
                        >
                          Ver Detalhes
                        </Link>
                        
                        {canCancel && (
                          <button
                            onClick={() => handleCancelAppointment(appointment.id)}
                            disabled={cancellingId === appointment.id}
                            className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
                          >
                            {cancellingId === appointment.id ? 'A cancelar...' : 'Cancelar'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}