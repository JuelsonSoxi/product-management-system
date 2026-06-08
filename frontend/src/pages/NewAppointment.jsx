import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import apiClient from '../api/client';
import Navbar from '../components/Navbar';

export default function NewAppointment() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [appointmentConfirmation, setAppointmentConfirmation] = useState(null);
  
  const [formData, setFormData] = useState({
    specialty_id: location.state?.specialtyId || '',
    medical_staff_id: location.state?.medicalStaffId || '',
    date: '',
    time: '',
    type: 'consulta',
    reason: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const daysOfWeek = [
    { key: 'segunda', label: 'Segunda' },
    { key: 'terca', label: 'Terça' },
    { key: 'quarta', label: 'Quarta' },
    { key: 'quinta', label: 'Quinta' },
    { key: 'sexta', label: 'Sexta' },
    { key: 'sabado', label: 'Sábado' },
    { key: 'domingo', label: 'Domingo' },
  ];

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const fetchSpecialties = async () => {
    try {
      const response = await apiClient.get('/v1/specialties');
      setSpecialties(response.data.data || []);
    } catch (error) {
      console.error('Erro ao buscar especialidades:', error);
    }
  };

  const fetchDoctors = useCallback(async (specialtyId) => {
    setLoadingDoctors(true);
    try {
      const response = await apiClient.get(`/v1/specialties/${specialtyId}/doctors`);
      setDoctors(response.data.data || []);
    } catch (error) {
      console.error('Erro ao buscar médicos:', error);
    } finally {
      setLoadingDoctors(false);
    }
  }, []);

  const fetchAvailableSlots = useCallback(async () => {
    if (!formData.medical_staff_id || !formData.date) return;
    
    setLoadingSlots(true);
    try {
      const response = await apiClient.get('/v1/appointments/available-slots', {
        params: {
          medical_staff_id: formData.medical_staff_id,
          date: formData.date,
        },
      });
      setAvailableSlots(response.data.data || []);
    } catch (error) {
      console.error('Erro ao buscar horários:', error);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [formData.medical_staff_id, formData.date]);

  useEffect(() => {
    if (formData.specialty_id) {
      fetchDoctors(formData.specialty_id);
    }
  }, [formData.specialty_id, fetchDoctors]);

  useEffect(() => {
    if (formData.medical_staff_id) {
      const doctor = doctors.find(d => d.id === formData.medical_staff_id);
      setSelectedDoctor(doctor || null);
    }
  }, [formData.medical_staff_id, doctors]);

  useEffect(() => {
    fetchAvailableSlots();
  }, [fetchAvailableSlots]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.time) {
      setError('Por favor, selecione um horário');
      setLoading(false);
      return;
    }

    try {
      const appointmentDateTime = `${formData.date} ${formData.time}:00`;
      
      const response = await apiClient.post('/v1/appointments', {
        specialty_id: formData.specialty_id,
        medical_staff_id: formData.medical_staff_id,
        appointment_date: appointmentDateTime,
        type: formData.type,
        reason: formData.reason || null,
      });

      setAppointmentConfirmation(response.data.data);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao marcar consulta');
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  };

  const printConfirmation = () => {
    window.print();
  };

  if (success && appointmentConfirmation) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">✓</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Consulta Marcada com Sucesso!
              </h2>
              <p className="text-gray-600">
                Guarde este comprovativo para a sua consulta
              </p>
            </div>

            <div className="border-2 border-gray-200 rounded-xl p-6 mb-6 print:border-black">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                COMPROVATIVO DE MARCAÇÃO
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Número:</span>
                  <span className="font-bold">{appointmentConfirmation.appointment_number}</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Especialidade:</span>
                  <span className="font-bold">{appointmentConfirmation.specialty?.name}</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Médico:</span>
                  <span className="font-bold">
                    Dr(a). {appointmentConfirmation.medical_staff?.user?.fname} {appointmentConfirmation.medical_staff?.user?.lname}
                  </span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Data:</span>
                  <span className="font-bold">
                    {new Date(appointmentConfirmation.appointment_date).toLocaleDateString('pt-PT', {
                      weekday: 'long',
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Hora:</span>
                  <span className="font-bold">
                    {new Date(appointmentConfirmation.appointment_date).toLocaleTimeString('pt-PT', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Tipo:</span>
                  <span className="font-bold capitalize">{appointmentConfirmation.type}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {appointmentConfirmation.status}
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Importante:</strong> Por favor, chegue com 15 minutos de antecedência. 
                  Traga um documento de identificação válido.
                </p>
              </div>
            </div>

            <div className="flex gap-4 print:hidden">
              <button
                onClick={printConfirmation}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition"
              >
                🖨️ Imprimir
              </button>
              <Link
                to="/appointments"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition text-center"
              >
                Ver Minhas Consultas
              </Link>
            </div>
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
          <Link to="/dashboard" className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-block">
            ← Voltar ao Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Marcar Nova Consulta</h1>
          <p className="text-gray-600">Preencha os dados para agendar a sua consulta</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tipo de Marcação *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'consulta' })}
                    className={`p-4 rounded-lg border-2 transition ${
                      formData.type === 'consulta'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl block mb-2">🩺</span>
                    <p className="font-semibold">Consulta Médica</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'exame' })}
                    className={`p-4 rounded-lg border-2 transition ${
                      formData.type === 'exame'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl block mb-2">🔬</span>
                    <p className="font-semibold">Exame</p>
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Especialidade *
                </label>
                <select
                  value={formData.specialty_id}
                  onChange={(e) => setFormData({ ...formData, specialty_id: e.target.value, medical_staff_id: '', date: '', time: '' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecione uma especialidade</option>
                  {specialties.map((specialty) => (
                    <option key={specialty.id} value={specialty.id}>
                      {specialty.name}
                    </option>
                  ))}
                </select>
              </div>

              {formData.specialty_id && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Médico *
                  </label>
                  {loadingDoctors ? (
                    <div className="text-center py-4">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <select
                      value={formData.medical_staff_id}
                      onChange={(e) => setFormData({ ...formData, medical_staff_id: e.target.value, date: '', time: '' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Selecione um médico</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          Dr(a). {doctor.user?.fname} {doctor.user?.lname}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {formData.medical_staff_id && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    min={getMinDate()}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value, time: '' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              )}

              {formData.date && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Horário Disponível *
                  </label>
                  {loadingSlots ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <p className="text-gray-600 mt-4">A carregar horários...</p>
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
                      Nenhum horário disponível para esta data. Tente outra data.
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setFormData({ ...formData, time: slot })}
                          className={`p-3 rounded-lg border-2 font-medium transition ${
                            formData.time === slot
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-blue-300 text-gray-700'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo da Consulta (Opcional)
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Descreva brevemente o motivo da consulta..."
                ></textarea>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading || !formData.time}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'A agendar...' : 'Confirmar Marcação'}
                </button>
              </div>
            </form>
          </div>

          {/* Horário do Médico */}
          <div className="lg:col-span-1">
            {selectedDoctor ? (
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Horário de Atendimento
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Dr(a). {selectedDoctor.user?.fname} {selectedDoctor.user?.lname}
                </p>

                <div className="space-y-2">
                  {daysOfWeek.map((day) => (
                    <div key={day.key} className="border-b border-gray-100 pb-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-700">{day.label}</span>
                        <div className="text-right">
                          {selectedDoctor.schedule?.[day.key]?.length > 0 ? (
                            <div className="space-y-1">
                              {selectedDoctor.schedule[day.key].map((period, idx) => (
                                <div key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                  🕐 {period}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 italic">Fechado</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-6">
                <p className="text-gray-500 text-center text-sm">
                  Selecione um médico para ver o horário de atendimento
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}