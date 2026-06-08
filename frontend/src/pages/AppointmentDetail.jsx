import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function AppointmentDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchAppointment();
  }, [id]);

  const fetchAppointment = async () => {
    try {
      const response = await apiClient.get(`/v1/appointments/${id}`);
      setAppointment(response.data.data);
    } catch (error) {
      console.error('Erro ao buscar consulta:', error);
      navigate('/appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Tem certeza que deseja cancelar esta consulta?')) return;

    setCancelling(true);
    try {
      await apiClient.put(`/v1/appointments/${id}/cancel`);
      fetchAppointment();
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao cancelar consulta');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      agendada: { color: 'bg-blue-100 text-blue-800', icon: '📅', label: 'Agendada' },
      confirmada: { color: 'bg-green-100 text-green-800', icon: '✓', label: 'Confirmada' },
      realizada: { color: 'bg-gray-100 text-gray-800', icon: '✓✓', label: 'Realizada' },
      cancelada: { color: 'bg-red-100 text-red-800', icon: '✗', label: 'Cancelada' },
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">A carregar detalhes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <span className="text-6xl mb-4 block">❌</span>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Consulta não encontrada</h2>
            <Link to="/appointments" className="text-blue-600 hover:text-blue-700 font-medium">
              ← Voltar às consultas
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const badge = getStatusBadge(appointment.status);
  const isPast = new Date(appointment.appointment_date) < new Date();
  const canCancel = !isPast && appointment.status === 'agendada';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/appointments" className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-block">
          ← Voltar às consultas
        </Link>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${badge.color} flex items-center gap-2`}>
                  <span>{badge.icon}</span>
                  {badge.label}
                </span>
                <span className="px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  {appointment.type}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Consulta de {appointment.specialty?.name}
              </h1>
              <p className="text-gray-600">
                Número: <span className="font-mono font-semibold">{appointment.appointment_number}</span>
              </p>
            </div>
            
            {canCancel && (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-50"
              >
                {cancelling ? 'A cancelar...' : 'Cancelar Consulta'}
              </button>
            )}
          </div>

          {/* Data e Hora */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Data</p>
                <p className="text-lg font-semibold text-gray-900 capitalize">
                  {formatDate(appointment.appointment_date)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🕐</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Hora</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatTime(appointment.appointment_date)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Informações do Médico */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Informações do Médico</h2>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-3xl">👨‍⚕️</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Dr(a). {appointment.medical_staff?.user?.fname} {appointment.medical_staff?.user?.lname}
              </h3>
              <p className="text-gray-600 mb-2">{appointment.specialty?.name}</p>
              {appointment.medical_staff?.license_number && (
                <p className="text-sm text-gray-500">
                  CRM: {appointment.medical_staff.license_number}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Informações do Paciente (se for médico/admin vendo) */}
        {user?.roles?.some(r => ['medico', 'admin'].includes(r.name)) && appointment.user && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Informações do Paciente</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nome</p>
                <p className="text-lg font-semibold text-gray-900">
                  {appointment.user.fname} {appointment.user.lname}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg font-semibold text-gray-900">{appointment.user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Telefone</p>
                <p className="text-lg font-semibold text-gray-900">{appointment.user.phone || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">NIF</p>
                <p className="text-lg font-semibold text-gray-900">{appointment.user.nif || 'Não informado'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Motivo da Consulta */}
        {appointment.reason && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Motivo da Consulta</h2>
            <p className="text-gray-700 leading-relaxed">{appointment.reason}</p>
          </div>
        )}

        {/* Observações */}
        {appointment.notes && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
            <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span>📝</span>
              Observações
            </h2>
            <p className="text-gray-700">{appointment.notes}</p>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Histórico</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm">📅</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Consulta criada</p>
                <p className="text-sm text-gray-600">
                  {new Date(appointment.created_at).toLocaleString('pt-PT')}
                </p>
              </div>
            </div>
            
            {appointment.status === 'cancelada' && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm">❌</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Consulta cancelada</p>
                  <p className="text-sm text-gray-600">
                    {new Date(appointment.updated_at).toLocaleString('pt-PT')}
                  </p>
                </div>
              </div>
            )}

            {appointment.status === 'realizada' && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm">✅</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Consulta realizada</p>
                  <p className="text-sm text-gray-600">
                    {new Date(appointment.updated_at).toLocaleString('pt-PT')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}