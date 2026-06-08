import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';
import Navbar from '../components/Navbar';

export default function DoctorSchedule() {
  const [medicalStaff, setMedicalStaff] = useState(null);
  const [schedule, setSchedule] = useState({
    segunda: [],
    terca: [],
    quarta: [],
    quinta: [],
    sexta: [],
    sabado: [],
    domingo: [],
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const daysOfWeek = [
    { key: 'segunda', label: 'Segunda-feira' },
    { key: 'terca', label: 'Terça-feira' },
    { key: 'quarta', label: 'Quarta-feira' },
    { key: 'quinta', label: 'Quinta-feira' },
    { key: 'sexta', label: 'Sexta-feira' },
    { key: 'sabado', label: 'Sábado' },
    { key: 'domingo', label: 'Domingo' },
  ];

  useEffect(() => {
    fetchMedicalStaff();
  }, []);

  const fetchMedicalStaff = async () => {
    try {
      const response = await apiClient.get('/v1/doctor/profile');
      setMedicalStaff(response.data.data);
      setSchedule(response.data.data.schedule || {
        segunda: [],
        terca: [],
        quarta: [],
        quinta: [],
        sexta: [],
        sabado: [],
        domingo: [],
      });
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPeriod = (day) => {
    const newSchedule = { ...schedule };
    if (!newSchedule[day]) newSchedule[day] = [];
    newSchedule[day].push('08:00-12:00');
    setSchedule(newSchedule);
  };

  const removePeriod = (day, index) => {
    const newSchedule = { ...schedule };
    newSchedule[day].splice(index, 1);
    setSchedule(newSchedule);
  };

  const updatePeriod = (day, index, value) => {
    const newSchedule = { ...schedule };
    newSchedule[day][index] = value;
    setSchedule(newSchedule);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.put('/v1/doctor/schedule', { schedule });
      await fetchMedicalStaff();
      setEditing(false);
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao atualizar horário');
    } finally {
      setSaving(false);
    }
  };

  const timeOptions = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour = String(h).padStart(2, '0');
      const min = String(m).padStart(2, '0');
      timeOptions.push(`${hour}:${min}`);
    }
  }

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

  if (!medicalStaff) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <span className="text-6xl mb-4 block">⚠️</span>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Perfil não encontrado</h2>
            <p className="text-gray-600">Você não está registado como médico no sistema.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/dashboard" className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-block">
            ← Voltar ao Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Meu Horário de Atendimento</h1>
              <p className="text-gray-600">
                Especialidade: {medicalStaff.specialty?.name} | CRM: {medicalStaff.license_number}
              </p>
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                ✏️ Editar Horário
              </button>
            )}
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 text-sm">
            ⚠️ <strong>Atenção:</strong> Você só pode alterar seu horário com 1 mês de antecedência e caso não tenha consultas já marcadas.
          </p>
        </div>

        <div className="space-y-4">
          {daysOfWeek.map((day) => (
            <div key={day.key} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">{day.label}</h3>
                {editing && (
                  <button
                    onClick={() => addPeriod(day.key)}
                    className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg text-sm font-medium transition"
                  >
                    + Adicionar Período
                  </button>
                )}
              </div>

              {schedule[day.key] && schedule[day.key].length > 0 ? (
                <div className="space-y-3">
                  {schedule[day.key].map((period, index) => (
                    <div key={index} className="flex items-center gap-3">
                      {editing ? (
                        <>
                          <input
                            type="text"
                            value={period}
                            onChange={(e) => updatePeriod(day.key, index, e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: 08:00-12:00"
                          />
                          <button
                            onClick={() => removePeriod(day.key, index)}
                            className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium transition"
                          >
                            Remover
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                          <span className="text-2xl">🕐</span>
                          <span className="font-medium text-gray-800">{period}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">Sem atendimento neste dia</p>
              )}
            </div>
          ))}
        </div>

        {editing && (
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => {
                setEditing(false);
                fetchMedicalStaff();
              }}
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