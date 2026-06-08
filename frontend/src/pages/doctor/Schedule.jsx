import { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import Navbar from '../../components/Navbar';

export default function DoctorSchedule() {
  const [schedule, setSchedule] = useState({
    segunda: [],
    terca: [],
    quarta: [],
    quinta: [],
    sexta: [],
    sabado: [],
    domingo: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const dias = [
    { key: 'segunda', label: 'Segunda-feira' },
    { key: 'terca', label: 'Terça-feira' },
    { key: 'quarta', label: 'Quarta-feira' },
    { key: 'quinta', label: 'Quinta-feira' },
    { key: 'sexta', label: 'Sexta-feira' },
    { key: 'sabado', label: 'Sábado' },
    { key: 'domingo', label: 'Domingo' },
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await apiClient.get('/v1/doctor/profile');
      const currentSchedule = response.data.data.schedule || {};
      setSchedule({
        segunda: currentSchedule.segunda || [],
        terca: currentSchedule.terca || [],
        quarta: currentSchedule.quarta || [],
        quinta: currentSchedule.quinta || [],
        sexta: currentSchedule.sexta || [],
        sabado: currentSchedule.sabado || [],
        domingo: currentSchedule.domingo || [],
      });
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.put('/v1/doctor/schedule', { schedule });
      await fetchProfile();
      setEditing(false);
      alert('Horário atualizado com sucesso!');
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao atualizar horário');
    } finally {
      setSaving(false);
    }
  };

  const addPeriod = (dia) => {
    const newPeriod = prompt('Digite o período (ex: 08:00-12:00):');
    if (newPeriod && /^\d{2}:\d{2}-\d{2}:\d{2}$/.test(newPeriod)) {
      setSchedule({
        ...schedule,
        [dia]: [...schedule[dia], newPeriod],
      });
    } else if (newPeriod) {
      alert('Formato inválido. Use: HH:MM-HH:MM');
    }
  };

  const removePeriod = (dia, index) => {
    setSchedule({
      ...schedule,
      [dia]: schedule[dia].filter((_, i) => i !== index),
    });
  };

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

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Meu Horário</h1>
            <p className="text-gray-600">Gerencie seus horários de atendimento</p>
          </div>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              ✏️ Editar Horário
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-50"
              >
                {saving ? 'A guardar...' : 'Guardar'}
              </button>
            </div>
          )}
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Atenção:</strong> O horário só pode ser alterado com um mês de antecedência e se não houver consultas marcadas.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {dias.map((dia) => (
            <div key={dia.key} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">{dia.label}</h3>
                {editing && (
                  <button
                    onClick={() => addPeriod(dia.key)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition"
                  >
                    + Adicionar Período
                  </button>
                )}
              </div>

              {schedule[dia.key].length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {schedule[dia.key].map((period, index) => (
                    <div
                      key={index}
                      className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 flex items-center gap-2"
                    >
                      <span className="text-blue-900 font-medium">🕐 {period}</span>
                      {editing && (
                        <button
                          onClick={() => removePeriod(dia.key, index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Sem horário definido</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}