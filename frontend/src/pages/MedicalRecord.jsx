import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';
import Navbar from '../components/Navbar';

export default function MedicalRecord() {
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    gender: '',
    blood_type: '',
    allergies: [],
    family_health_history: [],
    vaccination_record: [],
  });

  const [newItem, setNewItem] = useState({
    allergy: '',
    familyHistory: '',
    vaccination: '',
  });

  useEffect(() => {
    fetchMedicalRecord();
  }, []);

  const fetchMedicalRecord = async () => {
    try {
      const response = await apiClient.get('/v1/medical-record');
      setRecord(response.data.data);
      setFormData({
        gender: response.data.data.gender || '',
        blood_type: response.data.data.blood_type || '',
        allergies: response.data.data.allergies || [],
        family_health_history: response.data.data.family_health_history || [],
        vaccination_record: response.data.data.vaccination_record || [],
      });
    } catch (error) {
      console.error('Erro ao buscar RCU:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.put('/v1/medical-record/personal-data', formData);
      await fetchMedicalRecord();
      setEditing(false);
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao atualizar dados');
    } finally {
      setSaving(false);
    }
  };

  const addAllergy = () => {
    if (newItem.allergy.trim()) {
      setFormData({
        ...formData,
        allergies: [...formData.allergies, newItem.allergy.trim()],
      });
      setNewItem({ ...newItem, allergy: '' });
    }
  };

  const removeAllergy = (index) => {
    setFormData({
      ...formData,
      allergies: formData.allergies.filter((_, i) => i !== index),
    });
  };

  const addFamilyHistory = () => {
    if (newItem.familyHistory.trim()) {
      setFormData({
        ...formData,
        family_health_history: [...formData.family_health_history, newItem.familyHistory.trim()],
      });
      setNewItem({ ...newItem, familyHistory: '' });
    }
  };

  const removeFamilyHistory = (index) => {
    setFormData({
      ...formData,
      family_health_history: formData.family_health_history.filter((_, i) => i !== index),
    });
  };

  const addVaccination = () => {
    if (newItem.vaccination.trim()) {
      setFormData({
        ...formData,
        vaccination_record: [...formData.vaccination_record, newItem.vaccination.trim()],
      });
      setNewItem({ ...newItem, vaccination: '' });
    }
  };

  const removeVaccination = (index) => {
    setFormData({
      ...formData,
      vaccination_record: formData.vaccination_record.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">A carregar RCU...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <span className="text-6xl mb-4 block">📋</span>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">RCU não encontrado</h2>
            <p className="text-gray-600">Seu registo clínico não foi criado ainda.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/dashboard" className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-block">
            ← Voltar ao Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Registo Clínico de Utente (RCU)
              </h1>
              <p className="text-gray-600">Número: {record.record_number}</p>
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                ✏️ Editar Dados Pessoais
              </button>
            )}
          </div>
        </div>

        {/* Informações Administrativas */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📄 Dados Administrativos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Nome Completo</p>
              <p className="font-semibold">{record.user?.fname} {record.user?.lname}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold">{record.user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Telefone</p>
              <p className="font-semibold">{record.user?.phone || 'Não informado'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">NIF</p>
              <p className="font-semibold">{record.user?.nif || 'Não informado'}</p>
            </div>
            {record.insurance_company && (
              <>
                <div>
                  <p className="text-sm text-gray-600">Seguradora</p>
                  <p className="font-semibold">{record.insurance_company}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Nº Utente Seguradora</p>
                  <p className="font-semibold">{record.insurance_number}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Dados Médicos Fixos */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🩺 Dados Médicos Fixos</h2>
          
          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sexo</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grupo Sanguíneo</label>
                <select
                  value={formData.blood_type}
                  onChange={(e) => setFormData({ ...formData, blood_type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              {/* Alergias */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alergias</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newItem.allergy}
                    onChange={(e) => setNewItem({ ...newItem, allergy: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite uma alergia..."
                  />
                  <button
                    type="button"
                    onClick={addAllergy}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    Adicionar
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.allergies.map((allergy, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span>{allergy}</span>
                      <button
                        onClick={() => removeAllergy(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Sexo</p>
                <p className="font-semibold capitalize">{formData.gender || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Grupo Sanguíneo</p>
                <p className="font-semibold">{formData.blood_type || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Alergias</p>
                <p className="font-semibold">
                  {formData.allergies.length > 0 ? formData.allergies.join(', ') : 'Nenhuma'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Dados Pessoais Relevantes */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">👨‍👩‍👧 Dados Pessoais de Saúde</h2>
          
          {editing ? (
            <div className="space-y-6">
              {/* História Familiar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  História Familiar de Saúde
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newItem.familyHistory}
                    onChange={(e) => setNewItem({ ...newItem, familyHistory: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFamilyHistory())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Diabetes (avó materna)"
                  />
                  <button
                    type="button"
                    onClick={addFamilyHistory}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    Adicionar
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.family_health_history.map((history, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span>{history}</span>
                      <button
                        onClick={() => removeFamilyHistory(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vacinação */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Boletim de Vacinas
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newItem.vaccination}
                    onChange={(e) => setNewItem({ ...newItem, vaccination: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addVaccination())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: COVID-19 - 2024"
                  />
                  <button
                    type="button"
                    onClick={addVaccination}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    Adicionar
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.vaccination_record.map((vaccination, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span>{vaccination}</span>
                      <button
                        onClick={() => removeVaccination(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">História Familiar</p>
                {formData.family_health_history.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1">
                    {formData.family_health_history.map((history, index) => (
                      <li key={index} className="text-gray-800">{history}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Nenhum registro</p>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Vacinação</p>
                {formData.vaccination_record.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1">
                    {formData.vaccination_record.map((vaccination, index) => (
                      <li key={index} className="text-gray-800">{vaccination}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Nenhum registro</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Histórico de Consultas */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Histórico de Consultas</h2>
          {record.consultations && record.consultations.length > 0 ? (
            <div className="space-y-4">
              {record.consultations.map((consultation) => (
                <div key={consultation.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-900">
                      {consultation.medical_staff?.specialty?.name || 'Consulta'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(consultation.created_at).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Médico:</strong> Dr(a). {consultation.medical_staff?.user?.fname} {consultation.medical_staff?.user?.lname}
                  </p>
                  {consultation.diagnosis && (
                    <p className="text-sm text-gray-600">
                      <strong>Diagnóstico:</strong> {consultation.diagnosis}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Nenhuma consulta realizada ainda</p>
          )}
        </div>

        {/* Botões de Ação (Modo Edição) */}
        {editing && (
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setEditing(false)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50"
            >
              {saving ? 'A guardar...' : 'Guardar Alterações'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}