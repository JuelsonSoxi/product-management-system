import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20">
        {/* Hero */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                ⚡ Novo Sistema
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Gerencie seus <span className="text-blue-600">Produtos</span> com Facilidade
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Plataforma completa para gerenciar inventário, controlar stock e visualizar estatísticas em tempo real.
              </p>
              <div className="flex gap-4 flex-wrap">
                {user ? (
                  <>
                    <button
                      onClick={() => navigate('/products')}
                      className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold text-lg"
                    >
                      📦 Meus Produtos
                    </button>
                    {user.role === 'admin' && (
                      <button
                        onClick={() => navigate('/admin')}
                        className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold text-lg"
                      >
                        📊 Estatísticas
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => navigate('/login')}
                      className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold text-lg"
                    >
                      🔐 Entrar
                    </button>
                    <button
                      onClick={() => navigate('/register')}
                      className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition font-semibold text-lg"
                    >
                      ✍️ Criar Conta
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Right - Visual */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute top-0 right-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="relative bg-white rounded-2xl shadow-2xl p-8">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Controle Total</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Gerencie produtos em tempo real
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Controle automático de stock
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Estatísticas detalhadas
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Interface intuitiva
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto px-4 py-20">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Recursos Principais</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '➕',
                title: 'Criar Produtos',
                desc: 'Adicione novos produtos com todas as informações necessárias em segundos.'
              },
              {
                icon: '✏️',
                title: 'Editar com Facilidade',
                desc: 'Atualize produtos existentes com interface simples e intuitiva.'
              },
              {
                icon: '📊',
                title: 'Controle de Stock',
                desc: 'Monitore stock em tempo real com alertas automáticos.'
              },
              {
                icon: '🔍',
                title: 'Pesquisa Avançada',
                desc: 'Encontre produtos rapidamente com busca inteligente.'
              },
              {
                icon: '📈',
                title: 'Estatísticas',
                desc: 'Visualize dados importantes em dashboards interativos.'
              },
              {
                icon: '🔒',
                title: 'Segurança',
                desc: 'Dados protegidos com autenticação JWT de alta segurança.'
              },
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-8">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        {!user && (
          <div className="bg-blue-600 text-white py-16">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-4">Pronto para Começar?</h2>
              <p className="text-blue-100 mb-8 text-lg">
                Crie sua conta gratuitamente e gerencie seus produtos agora mesmo!
              </p>
              <button
                onClick={() => navigate('/register')}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition font-semibold text-lg inline-block"
              >
                Criar Conta Grátis →
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-8">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p>© 2026 Product Manager. Todos os direitos reservados. | v1.0.0</p>
          </div>
        </footer>
      </div>
    </>
  );
}