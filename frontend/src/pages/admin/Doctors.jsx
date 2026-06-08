import { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import Navbar from '../../components/Navbar';

// ── Regras de validação (contexto angolano) ────────────────────────────────────
const RULES = {
  fname: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-ZÀ-ÿ\s'-]+$/,
    patternMsg: 'Apenas letras, espaços, hífens e apóstrofes são permitidos',
  },
  lname: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-ZÀ-ÿ\s'-]+$/,
    patternMsg: 'Apenas letras, espaços, hífens e apóstrofes são permitidos',
  },
  email: {
    required: true,
    maxLength: 100,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    patternMsg: 'Introduza um email válido',
  },
  phone: {
    required: true,
    // Telefones angolanos: +244XXXXXXXXX, 00244XXXXXXXXX ou 9XXXXXXXX
    pattern: /^(\+244|00244)?9\d{8}$/,
    patternMsg: 'Número inválido. Ex: +244912345678 ou 912345678',
  },
  nif: {
    // NIF angolano AGT: 10 dígitos ou 13–14 alfanuméricos começando por dígito
    validate: (val) => {
      if (!val) return null;
      const clean = val.toUpperCase().trim();
      const isTenDigits = /^\d{10}$/.test(clean);
      const isLong = /^\d[A-Z0-9]{12,13}$/.test(clean);
      if (!isTenDigits && !isLong) {
        return 'NIF inválido. Ex: 5000000001 (10 dígitos) ou 5000000000123A (14 caracteres)';
      }
      return null;
    },
    minLength: 10,
    maxLength: 14,
  },
  password: {
    required: true,
    minLength: 8,
    maxLength: 72,
    validate: (val) => {
      if (!val) return null;
      if (!/[A-Z]/.test(val)) return 'Deve conter pelo menos uma letra maiúscula';
      if (!/[0-9]/.test(val)) return 'Deve conter pelo menos um número';
      return null;
    },
  },
  specialty_id: {
    required: true,
    validate: (val) => (!val ? 'Selecione uma especialidade' : null),
  },
  license_number: {
    required: true,
    minLength: 4,
    maxLength: 30,
    // Ordem de Médicos de Angola (OMA): formato alfanumérico
    pattern: /^[A-Za-z0-9/-]+$/,
    patternMsg: 'Número OMA inválido. Apenas letras, números, hífens e barras',
  },
};

// Bloqueia caracteres inválidos em tempo real
const ALLOWED_KEYS = {
  fname:          /[a-zA-ZÀ-ÿ\s'-]/,
  lname:          /[a-zA-ZÀ-ÿ\s'-]/,
  nif:            /[a-zA-Z0-9]/,
  phone:          /[\d+]/,
  license_number: /[A-Za-z0-9/-]/,
};

function validateField(name, value) {
  const rule = RULES[name];
  if (!rule) return null;

  if (rule.required && !String(value).trim()) return 'Este campo é obrigatório';
  if (!value) return null;

  const str = String(value);
  if (rule.minLength && str.length < rule.minLength)
    return `Mínimo ${rule.minLength} caracteres`;
  if (rule.maxLength && str.length > rule.maxLength)
    return `Máximo ${rule.maxLength} caracteres`;
  if (rule.pattern && !rule.pattern.test(str))
    return rule.patternMsg || 'Valor inválido';
  if (rule.validate) {
    const msg = rule.validate(str);
    if (msg) return msg;
  }
  return null;
}

function validateAll(formData) {
  const newErrors = {};
  let hasError = false;
  Object.keys(RULES).forEach((name) => {
    const err = validateField(name, formData[name]);
    newErrors[name] = err;
    if (err) hasError = true;
  });
  return { newErrors, hasError };
}

// ── Componente de input reutilizável ──────────────────────────────────────────
function Field({ label, name, type = 'text', value, onChange, onBlur, error, required, placeholder, hint, maxLength, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {hint && <p className="text-xs text-gray-400 mb-1">{hint}</p>}
      {children ?? (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition
            ${error
              ? 'border-red-400 focus:ring-red-400 bg-red-50'
              : 'border-gray-300 focus:ring-blue-500'
            }`}
        />
      )}
      {error && (
        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

// ── Estado inicial do formulário ──────────────────────────────────────────────
const EMPTY_FORM = {
  fname: '',
  lname: '',
  email: '',
  phone: '',
  password: '',
  nif: '',
  specialty_id: '',
  license_number: '',
};

const EMPTY_SCHEDULE = {
  segunda: [], terca: [], quarta: [], quinta: [],
  sexta: [], sabado: [], domingo: [],
};

const DAYS_OF_WEEK = [
  { key: 'segunda', label: 'Segunda-feira' },
  { key: 'terca',   label: 'Terça-feira' },
  { key: 'quarta',  label: 'Quarta-feira' },
  { key: 'quinta',  label: 'Quinta-feira' },
  { key: 'sexta',   label: 'Sexta-feira' },
  { key: 'sabado',  label: 'Sábado' },
  { key: 'domingo', label: 'Domingo' },
];

// ── Componente principal ──────────────────────────────────────────────────────
export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Modal criar médico
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Modal horário
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [scheduleData, setScheduleData] = useState(EMPTY_SCHEDULE);

  // Força da password
  const passwordStrength = () => {
    const p = formData.password;
    if (!p) return null;
    let score = 0;
    if (p.length >= 8) score++;
    if (p.length >= 12) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^a-zA-Z0-9]/.test(p)) score++;
    if (score <= 2) return { label: 'Fraca',      color: 'bg-red-400',    width: 'w-1/4' };
    if (score === 3) return { label: 'Média',      color: 'bg-yellow-400', width: 'w-2/4' };
    if (score === 4) return { label: 'Forte',      color: 'bg-blue-500',   width: 'w-3/4' };
    return              { label: 'Muito forte', color: 'bg-green-500',  width: 'w-full' };
  };

  useEffect(() => {
    fetchDoctors();
    fetchSpecialties();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await apiClient.get('/v1/admin/doctors');
      setDoctors(response.data.data || []);
    } catch (error) {
      console.error('Erro ao buscar médicos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecialties = async () => {
    try {
      const response = await apiClient.get('/v1/specialties');
      setSpecialties(response.data.data || []);
    } catch (error) {
      console.error('Erro ao buscar especialidades:', error);
    }
  };

  // ── Handlers do formulário ────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;

    const allowedPattern = ALLOWED_KEYS[name];
    if (allowedPattern) {
      const filtered = value.split('').filter((ch) => allowedPattern.test(ch)).join('');
      if (filtered !== value) {
        setFormData((prev) => ({ ...prev, [name]: filtered }));
        if (touched[name]) {
          setErrors((prev) => ({ ...prev, [name]: validateField(name, filtered) }));
        }
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const openModal = () => {
    setFormData(EMPTY_FORM);
    setErrors({});
    setTouched({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData(EMPTY_FORM);
    setErrors({});
    setTouched({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Valida todos os campos
    const { newErrors, hasError } = validateAll(formData);
    setErrors(newErrors);
    setTouched(Object.keys(RULES).reduce((acc, k) => ({ ...acc, [k]: true }), {}));
    if (hasError) return;

    setSaving(true);
    try {
      await apiClient.post('/v1/admin/doctors', formData);
      fetchDoctors();
      closeModal();
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao criar médico');
    } finally {
      setSaving(false);
    }
  };

  // Helper para passar props ao Field
  const f = (name) => ({
    name,
    value: formData[name],
    onChange: handleChange,
    onBlur: handleBlur,
    error: touched[name] ? errors[name] : null,
  });

  // ── Handlers do horário ───────────────────────────────────────────────────
  const openScheduleModal = (doctor) => {
    setSelectedDoctor(doctor);
    setScheduleData(doctor.schedule || EMPTY_SCHEDULE);
    setShowScheduleModal(true);
  };

  const addPeriod = (day) => {
    const newPeriod = prompt('Digite o período (ex: 08:00-12:00):');
    if (newPeriod && /^\d{2}:\d{2}-\d{2}:\d{2}$/.test(newPeriod)) {
      setScheduleData((prev) => ({
        ...prev,
        [day]: [...(prev[day] || []), newPeriod],
      }));
    } else if (newPeriod) {
      alert('Formato inválido. Use: HH:MM-HH:MM');
    }
  };

  const removePeriod = (day, index) => {
    setScheduleData((prev) => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index),
    }));
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.put(`/v1/admin/doctors/${selectedDoctor.id}/schedule`, { schedule: scheduleData });
      fetchDoctors();
      setShowScheduleModal(false);
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao atualizar horário');
    } finally {
      setSaving(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">A carregar médicos...</p>
          </div>
        </div>
      </div>
    );
  }

  const strength = passwordStrength();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestão de Médicos</h1>
            <p className="text-gray-600">Total: {doctors.length} médicos</p>
          </div>
          <button
            onClick={openModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            + Criar Novo Médico
          </button>
        </div>

        {/* Grid de Médicos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">👨‍⚕️</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">
                    Dr(a). {doctor.user?.fname} {doctor.user?.lname}
                  </h3>
                  <p className="text-sm text-blue-600 font-medium mb-2">
                    {doctor.specialty?.name}
                  </p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>📧 {doctor.user?.email}</p>
                    <p>📞 {doctor.user?.phone || 'Sem telefone'}</p>
                    <p>🆔 OMA: {doctor.license_number}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      doctor.user?.status === 1
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {doctor.user?.status === 1 ? 'Ativo' : 'Inativo'}
                    </span>
                    <button
                      onClick={() => openScheduleModal(doctor)}
                      className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1 rounded-lg text-xs font-medium transition"
                    >
                      📅 Horário
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {doctors.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <span className="text-6xl mb-4 block">👨‍⚕️</span>
            <p className="text-gray-600 text-lg mb-4">Nenhum médico cadastrado</p>
            <button
              onClick={openModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Criar Primeiro Médico
            </button>
          </div>
        )}
      </div>

      {/* ── Modal Criar Médico ────────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Criar Novo Médico</h2>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">

              {/* Dados Pessoais */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Dados Pessoais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field
                    label="Primeiro Nome"
                    required
                    placeholder="Ex: João"
                    maxLength={50}
                    hint="Apenas letras"
                    {...f('fname')}
                  />
                  <Field
                    label="Último Nome"
                    required
                    placeholder="Ex: Silva"
                    maxLength={50}
                    hint="Apenas letras"
                    {...f('lname')}
                  />
                  <Field
                    label="NIF"
                    placeholder="5000000001 ou 5000000000123A"
                    maxLength={14}
                    hint="10 dígitos ou 13–14 alfanuméricos (AGT/BI)"
                    {...f('nif')}
                  />
                  <Field
                    label="Número OMA"
                    required
                    placeholder="Ex: OMA-12345 ou 2024/1234"
                    maxLength={30}
                    hint="Ordem dos Médicos de Angola"
                    {...f('license_number')}
                  />
                </div>
              </div>

              {/* Contacto */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Contacto
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field
                    label="Email"
                    type="email"
                    required
                    placeholder="medico@hospital.ao"
                    maxLength={100}
                    {...f('email')}
                  />
                  <Field
                    label="Telefone"
                    type="tel"
                    required
                    placeholder="+244 912 345 678"
                    hint="Ex: +244912345678 ou 912345678"
                    {...f('phone')}
                  />
                </div>
              </div>

              {/* Dados Profissionais */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Dados Profissionais
                </h3>
                <Field
                  label="Especialidade"
                  required
                  {...f('specialty_id')}
                  error={touched.specialty_id ? errors.specialty_id : null}
                >
                  <select
                    name="specialty_id"
                    value={formData.specialty_id}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition
                      ${touched.specialty_id && errors.specialty_id
                        ? 'border-red-400 focus:ring-red-400 bg-red-50'
                        : 'border-gray-300 focus:ring-blue-500'
                      }`}
                  >
                    <option value="">Selecione uma especialidade</option>
                    {specialties.map((spec) => (
                      <option key={spec.id} value={spec.id}>
                        {spec.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              {/* Acesso ao Sistema */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Acesso ao Sistema
                </h3>
                <div className="max-w-sm">
                  <Field
                    label="Palavra-passe"
                    type="password"
                    required
                    placeholder="Mínimo 8 caracteres"
                    maxLength={72}
                    hint="Mínimo 8 caracteres, 1 maiúscula e 1 número"
                    {...f('password')}
                  />
                  {/* Barra de força */}
                  {formData.password && strength && (
                    <div className="mt-2">
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Força: {strength.label}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50"
                >
                  {saving ? 'A criar...' : 'Criar Médico'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal Editar Horário ──────────────────────────────────────────────── */}
      {showScheduleModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Horário — Dr(a). {selectedDoctor.user?.fname} {selectedDoctor.user?.lname}
            </h2>
            <p className="text-gray-500 mb-6">{selectedDoctor.specialty?.name}</p>

            <form onSubmit={handleScheduleSubmit} className="space-y-3">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day.key} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900">{day.label}</h3>
                    <button
                      type="button"
                      onClick={() => addPeriod(day.key)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition"
                    >
                      + Adicionar
                    </button>
                  </div>

                  {scheduleData[day.key]?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {scheduleData[day.key].map((period, index) => (
                        <div
                          key={index}
                          className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 flex items-center gap-2"
                        >
                          <span className="text-blue-900 font-medium">🕐 {period}</span>
                          <button
                            type="button"
                            onClick={() => removePeriod(day.key, index)}
                            className="text-red-500 hover:text-red-700 font-bold"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm italic">Sem horário definido</p>
                  )}
                </div>
              ))}

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  disabled={saving}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50"
                >
                  {saving ? 'A guardar...' : 'Guardar Horário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}