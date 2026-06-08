import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-white">+</span>
              </div>
              <span className="text-2xl font-bold text-gray-800">SIS</span>
            </div>
            <div className="space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-800 font-medium transition"
              >
                Entrar
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
              >
                Registar
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Sistema de Informação de Saúde
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Gerencie suas consultas médicas, registos clínicos e acompanhamento de saúde de forma simples e segura.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition shadow-lg hover:shadow-xl"
            >
              Criar Conta Gratuita
            </Link>
            <Link
              to="/login"
              className="bg-white hover:bg-gray-50 text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg transition border-2 border-blue-600"
            >
              Já tenho conta
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-3xl">📅</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Marcação de Consultas
            </h3>
            <p className="text-gray-600">
              Marque consultas online com médicos especialistas de forma rápida e fácil.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-3xl">📋</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Registo Clínico
            </h3>
            <p className="text-gray-600">
              Acesse seu histórico médico completo e mantenha seus dados de saúde sempre atualizados.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-3xl">🔒</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Seguro e Privado
            </h3>
            <p className="text-gray-600">
              Seus dados são protegidos com os mais altos padrões de segurança e privacidade.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">
            © 2026 SIS - Sistema de Informação de Saúde. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}