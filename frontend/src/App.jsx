import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Specialties from './pages/Specialties';
import NewAppointment from './pages/NewAppointment';
import Appointments from './pages/Appointments';
import AppointmentDetail from './pages/AppointmentDetail';
import MedicalRecord from './pages/MedicalRecord';
import AdminUsers from './pages/admin/Users';
import AdminDoctors from './pages/admin/Doctors';
import AdminStatistics from './pages/admin/Statistics';
import AdminSpecialties from './pages/admin/Specialties';
import AdminReports from './pages/admin/Reports';
import DoctorSchedule from './pages/doctor/Schedule';

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">A carregar...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0) {
    const hasRole = user.roles?.some(r => allowedRoles.includes(r.name));
    if (!hasRole) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">A carregar...</p>
        </div>
      </div>
    );
  }

  return user ? <Navigate to="/dashboard" replace /> : children;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/specialties" element={<Specialties />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* Rotas Protegidas - Geral */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          
          {/* Rotas Utente */}
          <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
          <Route path="/appointments/:id" element={<ProtectedRoute><AppointmentDetail /></ProtectedRoute>} />
          <Route path="/appointments/new" element={<ProtectedRoute allowedRoles={['utente']}><NewAppointment /></ProtectedRoute>} />
          <Route path="/medical-record" element={<ProtectedRoute allowedRoles={['utente']}><MedicalRecord /></ProtectedRoute>} />
          
          {/* Rotas Médico */}
          <Route path="/doctor/schedule" element={<ProtectedRoute allowedRoles={['medico']}><DoctorSchedule /></ProtectedRoute>} />
          
          {/* Rotas Admin */}
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/doctors" element={<ProtectedRoute allowedRoles={['admin']}><AdminDoctors /></ProtectedRoute>} />
          <Route path="/admin/specialties" element={<ProtectedRoute allowedRoles={['admin']}><AdminSpecialties /></ProtectedRoute>} />
          <Route path="/admin/statistics" element={<ProtectedRoute allowedRoles={['admin']}><AdminStatistics /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><AdminReports /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;