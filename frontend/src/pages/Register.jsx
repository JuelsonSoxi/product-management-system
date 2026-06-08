import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ── Regras de validação (contexto angolano) ────────────────────────────────────
const RULES = {
  fname: {
    required: true,
    minLength: 1,
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
  nif: {
    // NIF angolano: 10 dígitos (formato AGT/BI) — pode ter 13 ou 14 caracteres alfanuméricos
    // Formato comum: começa com dígito, mistura números e letras maiúsculas
    // Exemplos: 5000000001 (10 dígitos) ou K000000001LA0 (13 chars) ou 5000000000123A (14 chars)
    validate: (val) => {
      if (!val) return null;
      const clean = val.toUpperCase().trim();
      // Aceita: 10 dígitos numéricos OU 13–14 caracteres alfanuméricos começando por dígito
      const isTenDigits = /^\d{10}$/.test(clean);
      const isLong = /^\d[A-Z0-9]{12,13}$/.test(clean);
      if (!isTenDigits && !isLong) {
        return 'NIF inválido. Formato: 10 dígitos (ex: 5000000001) ou 13-14 caracteres alfanuméricos (ex: 5000000000123A)';
      }
      return null;
    },
    minLength: 10,
    maxLength: 14,
  },
  date_of_birth: {
    required: true,
    validate: (val) => {
      if (!val) return null;
      const dob = new Date(val);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      if (dob > today) return 'A data não pode ser no futuro';
      if (age > 120) return 'Data de nascimento inválida';
      return null;
    },
  },
  email: {
    required: true,
    maxLength: 100,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    patternMsg: 'Introduza um email válido',
  },
  phone: {
    required: true,
    // Telefones angolanos: 9 dígitos começando por 9 (Unitel, Africell, Movicel)
    // Aceita: +244XXXXXXXXX, 00244XXXXXXXXX, ou 9XXXXXXXX (9 dígitos)
    pattern: /^(\+244|00244)?9\d{8}$/,
    patternMsg: 'Número inválido. Ex: +244912345678 ou 912345678',
  },
  street: {
    required: true,
    minLength: 5,
    maxLength: 150,
  },
  city: {
    required: true,
    minLength: 2,
    maxLength: 80,
    pattern: /^[a-zA-ZÀ-ÿ\s'-]+$/,
    patternMsg: 'Apenas letras e espaços são permitidos',
  },
  // Código postal não é obrigatório nem padronizado em Angola — campo livre
  zip: {
    maxLength: 20,
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
};

function validateField(name, value, formData) {
  const rule = RULES[name];
  if (!rule) return null;

  if (rule.required && !value.trim()) return 'Este campo é obrigatório';
  if (!value) return null; // campo opcional vazio — sem mais erros

  if (rule.minLength && value.length < rule.minLength)
    return `Mínimo ${rule.minLength} caracteres`;
  if (rule.maxLength && value.length > rule.maxLength)
    return `Máximo ${rule.maxLength} caracteres`;
  if (rule.pattern && !rule.pattern.test(value))
    return rule.patternMsg || 'Valor inválido';
  if (rule.validate) {
    const msg = rule.validate(value, formData);
    if (msg) return msg;
  }

  // Confirmação de password
  if (name === 'password_confirmation') {
    if (value !== formData.password) return 'As palavras-passe não coincidem';
  }

  return null;
}

// Impede caracteres inválidos em tempo real
const ALLOWED_KEYS = {
  fname: /[a-zA-ZÀ-ÿ\s'-]/,
  lname: /[a-zA-ZÀ-ÿ\s'-]/,
  nif:   /[a-zA-Z0-9]/,       // letras + dígitos (NIF angolano alfanumérico)
  phone: /[\d+]/,              // dígitos e + (para +244...)
  city:  /[a-zA-ZÀ-ÿ\s'-]/,
  zip:   /[\w\s-]/,
};

// ── Componente de input reutilizável ──────────────────────────────────────────
function Field({ label, name, type = 'text', value, onChange, onBlur, error, required, placeholder, hint, maxLength }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {hint && <p className="text-xs text-gray-400 mb-1">{hint}</p>}
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
      {error && (
        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function Register() {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    nif: '',
    date_of_birth: '',
    street: '',
    city: '',
    zip: '',
    insurance_company: '',
    insurance_number: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Limites de data
  const today = new Date().toISOString().split('T')[0];
  const minDate = '1900-01-01';

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Bloqueio de caracteres inválidos em tempo real
    const allowedPattern = ALLOWED_KEYS[name];
    if (allowedPattern) {
      const filtered = value.split('').filter(ch => allowedPattern.test(ch)).join('');
      if (filtered !== value) {
        setFormData(prev => ({ ...prev, [name]: filtered }));
        if (touched[name]) {
          setErrors(prev => ({ ...prev, [name]: validateField(name, filtered, { ...formData, [name]: filtered }) }));
        }
        return;
      }
    }

    setFormData(prev => ({ ...prev, [name]: value }));

    if (touched[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, value, { ...formData, [name]: value }),
        ...(name === 'password' && touched.password_confirmation
          ? { password_confirmation: value !== formData.password_confirmation && formData.password_confirmation ? 'As palavras-passe não coincidem' : null }
          : {}),
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value, formData) }));
  };

  const validateAll = () => {
    const fields = Object.keys(formData);
    const newErrors = {};
    let hasError = false;

    fields.forEach(name => {
      const err = validateField(name, formData[name], formData);
      newErrors[name] = err;
      if (err) hasError = true;
    });

    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'As palavras-passe não coincidem';
      hasError = true;
    }

    setErrors(newErrors);
    setTouched(fields.reduce((acc, f) => ({ ...acc, [f]: true }), {}));
    return !hasError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateAll()) return;

    setLoading(true);
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  const f = (name) => ({
    name,
    value: formData[name],
    onChange: handleChange,
    onBlur: handleBlur,
    error: touched[name] ? errors[name] : null,
  });

  // Indicador de força da password
  const passwordStrength = () => {
    const p = formData.password;
    if (!p) return null;
    let score = 0;
    if (p.length >= 8) score++;
    if (p.length >= 12) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^a-zA-Z0-9]/.test(p)) score++;
    if (score <= 2) return { label: 'Fraca', color: 'bg-red-400', width: 'w-1/4' };
    if (score === 3) return { label: 'Média', color: 'bg-yellow-400', width: 'w-2/4' };
    if (score === 4) return { label: 'Forte', color: 'bg-blue-500', width: 'w-3/4' };
    return { label: 'Muito forte', color: 'bg-green-500', width: 'w-full' };
  };

  const strength = passwordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center">
              <span className="text-3xl font-bold text-white">+</span>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Criar Conta</h2>
          <p className="text-gray-600 text-center mb-8">Registe-se no Sistema de Informação de Saúde</p>

          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-6">

            {/* ── Dados Pessoais ───────────────────────────────── */}
            <section className="border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Dados Pessoais</h3>
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
                  hint="10 dígitos ou 13–14 caracteres alfanuméricos (AGT/BI)"
                  {...f('nif')}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Nascimento <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min={minDate}
                    max={today}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition
                      ${touched.date_of_birth && errors.date_of_birth
                        ? 'border-red-400 focus:ring-red-400 bg-red-50'
                        : 'border-gray-300 focus:ring-blue-500'
                      }`}
                  />
                  {touched.date_of_birth && errors.date_of_birth && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <span>⚠</span> {errors.date_of_birth}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* ── Contacto ─────────────────────────────────────── */}
            <section className="border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Contacto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field
                  label="Email"
                  type="email"
                  required
                  placeholder="exemplo@email.com"
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
            </section>

            {/* ── Morada ───────────────────────────────────────── */}
            <section className="border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Morada</h3>
              <div className="space-y-4">
                <Field
                  label="Rua / Endereço"
                  required
                  placeholder="Rua Comandante Gika, 45"
                  maxLength={150}
                  {...f('street')}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field
                    label="Cidade / Município"
                    required
                    placeholder="Luanda"
                    maxLength={80}
                    hint="Apenas letras"
                    {...f('city')}
                  />
                  <Field
                    label="Bairro / Código Postal"
                    placeholder="Maianga, Talatona..."
                    maxLength={20}
                    hint="Bairro ou referência de localização"
                    {...f('zip')}
                  />
                </div>
              </div>
            </section>

            {/* ── Seguro de Saúde ──────────────────────────────── */}
            <section className="border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Seguro de Saúde <span className="text-gray-400 font-normal text-sm">(Opcional)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field
                  label="Seguradora"
                  placeholder="Ex: ENSA, AAA, Nors Angola..."
                  maxLength={100}
                  {...f('insurance_company')}
                />
                <Field
                  label="Número de Apólice / Cartão"
                  placeholder="Nº da apólice ou cartão"
                  maxLength={50}
                  {...f('insurance_number')}
                />
              </div>
            </section>

            {/* ── Segurança ────────────────────────────────────── */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Segurança</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Field
                    label="Palavra-passe"
                    type="password"
                    required
                    placeholder="Mínimo 8 caracteres"
                    maxLength={72}
                    hint="Mínimo 8 caracteres, 1 maiúscula e 1 número"
                    {...f('password')}
                  />
                  {/* Barra de força da password */}
                  {formData.password && strength && (
                    <div className="mt-2">
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Força: {strength.label}</p>
                    </div>
                  )}
                </div>
                <Field
                  label="Confirmar Palavra-passe"
                  type="password"
                  required
                  placeholder="Repita a palavra-passe"
                  maxLength={72}
                  {...f('password_confirmation')}
                />
              </div>
            </section>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'A criar conta...' : 'Criar Conta'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Já tem conta?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}