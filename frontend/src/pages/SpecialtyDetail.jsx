import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import apiClient from '../api/client';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function SpecialtyDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [specialty, setSpecialty] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSpecialty();
  }, [id]);

  const fetchSpecialty = async () => {
    try {
      const [specialtyRes, doctorsRes] = await Promise.all([
        apiClient.get(`/v1/specialties/${id}`),
        apiClient.get(`/v1/specialties/${id}/doctors`)
      ]);
      
      setSpecialty(specialtyRes.data.data);
      setDoctors(doctorsRes.data.data || []);
    } catch (error) {
      console.error('Erro ao buscar especialidade:', error);
    } finally {
      setLoading(false);
    }
  };

  const daysOfWeek = [
    { key: 'segunda', label: 'Segunda' },
    { key: 'terca', label: 'Terça' },
    { key: 'quarta', label: 'Quarta' },
    { key: 'quinta', label: 'Quinta' },
    { key: 'sexta', label: 'Sexta' },
    { key: 'sabado', label: 'Sábado' },
    { key: 'domingo', label: 'Domingo' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">A carregar...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link to="/specialties" className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-block">
          ← Voltar às Especialidades
        </Link>

        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{specialty?.name}</h1>
          <p className="text-gray-600">{specialty?.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lista de Médicos */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Médicos Disponíveis</h2>
            <div className="space-y-4">
              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className={`bg-white rounded-xl shadow-md p-6 cursor-pointer transition ${
                    selectedDoctor?.id === doctor.id ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedDoctor(doctor)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">👨‍⚕️</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">
                        Dr(a). {doctor.user?.fname} {doctor.user?.lname}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">CRM: {doctor.license_number}</p>
                      
                      {user ? (
                        <Link
                          to="/appointments/new"
                          state={{ 
                            specialtyId: specialty.id,
                            medicalStaffId: doctor.id 
                          }}
                          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                        >
                          Marcar Consulta
                        </Link>
                      ) : (
                        <Link
                          to="/login"
                          className="inline-block bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                        >
                          Entrar para marcar
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Horário do Médico */}
          <div>
            {selectedDoctor ? (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Horário de Atendimento
                </h2>
                <p className="text-gray-600 mb-6">
                  Dr(a). {selectedDoctor.user?.fname} {selectedDoctor.user?.lname}
                </p>

                <div className="space-y-3">
                  {daysOfWeek.map((day) => (
                    <div key={day.key} className="border-b border-gray-100 pb-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-700">{day.label}</span>
                        <div className="flex flex-wrap gap-2 justify-end">
                          {selectedDoctor.schedule?.[day.key]?.length > 0 ? (
                            selectedDoctor.schedule[day.key].map((period, idx) => (
                              <span
                                key={idx}
                                className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium"
                              >
                                🕐 {period}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400 text-sm italic">Sem atendimento</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <span className="text-6xl mb-4 block">👈</span>
                <p className="text-gray-600">
                  Selecione um médico para ver seu horário de atendimento
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
