import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Layout from './components/Layout.jsx';
import Login from './components/Login.jsx';
import Home from './pages/Home.jsx';
import Gorner from './pages/Gorner.jsx';
import Taylor from './pages/Taylor.jsx';
import Newton from './pages/Newton.jsx';
import Iteration from './pages/Iteration.jsx';
import Transport from './pages/Transport.jsx';
import Investment from './pages/Investment.jsx';
import History from './pages/History.jsx';
// Himoyalangan marshrut
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}

// Login sahifasi (agar tizimga kirilgan bo'lsa, bosh sahifaga yo'naltirish)
function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return !user ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Public marshrut */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />

      {/* Himoyalangan marshrutlar */}
      <Route 
        path="/" 
        element={
          <PrivateRoute>
            <Layout>
              <Home />
            </Layout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/gorner" 
        element={
          <PrivateRoute>
            <Layout>
              <Gorner />
            </Layout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/taylor-sin" 
        element={
          <PrivateRoute>
            <Layout>
              <Taylor tur="sin" />
            </Layout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/taylor-cos" 
        element={
          <PrivateRoute>
            <Layout>
              <Taylor tur="cos" />
            </Layout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/nyuton" 
        element={
          <PrivateRoute>
            <Layout>
              <Newton />
            </Layout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/iteratsiya" 
        element={
          <PrivateRoute>
            <Layout>
              <Iteration />
            </Layout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/transport" 
        element={
          <PrivateRoute>
            <Layout>
              <Transport />
            </Layout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/investitsiya" 
        element={
          <PrivateRoute>
            <Layout>
              <Investment />
            </Layout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/tarix" 
        element={
          <PrivateRoute>
            <Layout>
              <History />
            </Layout>
          </PrivateRoute>
        } 
      />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
