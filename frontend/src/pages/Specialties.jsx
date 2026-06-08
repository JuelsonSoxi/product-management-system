import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function Specialties() {
  const { user } = useAuth();
  const [specialties, setSpecialties] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const fetchSpecialties = async () => {
    try {
      const response = await apiClient.get('/v1/specialties');
      setSpecialties(response.data.data || []);
    } catch (error) {
      console.error('Erro ao buscar especialidades:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async (specialtyId) => {
    setLoadingDoctors(true);
    try {
      const response = await apiClient.get(`/v1/specialties/${specialtyId}/doctors`);
      setDoctors(response.data.data || []);
    } catch (error) {
      console.error('Erro ao buscar médicos:', error);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleSpecialtyClick = (specialty) => {
    setSelectedSpecialty(specialty);
    fetchDoctors(specialty.id);
  };

  const getSpecialtyIcon = (name) => {
    const icons = {
      'Clínica Geral': '🏥',
      'Cardiologia': '❤️',
      'Pediatria': '👶',
      'Ortopedia': '🦴',
      'Dermatologia': '🧴',
      'Ginecologia': '👩‍⚕️',
    };
    return icons[name] || '⚕️';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {user && <Navbar />}
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">A carregar especialidades...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Navbar />}
      
      {!user && (
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">+</span>
                </div>
                <span className="text-2xl font-bold text-gray-800">SIS</span>
              </Link>
              <div className="space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-gray-800 font-medium">
                  Entrar
                </Link>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
                  Registar
                </Link>
              </div>
            </div>
          </div>
        </nav>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Especialidades Médicas</h1>
          <p className="text-gray-600">
            Consulte as especialidades disponíveis e os médicos especialistas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Especialidades */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Especialidades</h2>
              <div className="space-y-2">
                {specialties.map((specialty) => (
                  <button
                    key={specialty.id}
                    onClick={() => handleSpecialtyClick(specialty)}
                    className={`w-full text-left p-4 rounded-lg transition ${
                      selectedSpecialty?.id === specialty.id
                        ? 'bg-blue-100 border-2 border-blue-500'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getSpecialtyIcon(specialty.name)}</span>
                        <div>
                          <p className="font-semibold text-gray-800">{specialty.name}</p>
                          <p className="text-xs text-gray-500">
                            {specialty.medical_staff_count || 0} médico(s)
                          </p>
                        </div>
                      </div>
                      {selectedSpecialty?.id === specialty.id && (
                        <span className="text-blue-600">→</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Lista de Médicos */}
          <div className="lg:col-span-2">
            {!selectedSpecialty ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <span className="text-6xl mb-4 block">👈</span>
                <p className="text-gray-600 text-lg">
                  Selecione uma especialidade para ver os médicos disponíveis
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {selectedSpecialty.name}
                  </h2>
                  <p className="text-gray-600">{selectedSpecialty.description}</p>
                </div>

                {loadingDoctors ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600 mt-4">A carregar médicos...</p>
                  </div>
                ) : doctors.length === 0 ? (
                  <div className="text-center py-12">
                    <span className="text-6xl mb-4 block">🩺</span>
                    <p className="text-gray-600">
                      Nenhum médico disponível nesta especialidade no momento
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {doctors.map((medicalStaff) => (
                      <div
                        key={medicalStaff.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl">👨‍⚕️</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-800 mb-1">
                              Dr(a). {medicalStaff.user?.fname} {medicalStaff.user?.lname}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {medicalStaff.specialty?.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              CRM: {medicalStaff.license_number}
                            </p>
                            
                            {user ? (
                              <Link
                                to="/appointments/new"
                                state={{ 
                                  specialtyId: selectedSpecialty.id,
                                  medicalStaffId: medicalStaff.id 
                                }}
                                className="mt-3 inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                              >
                                Marcar Consulta
                              </Link>
                            ) : (
                              <Link
                                to="/login"
                                className="mt-3 inline-block bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                              >
                                Entrar para marcar
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}