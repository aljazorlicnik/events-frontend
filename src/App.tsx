import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import { authService } from './api/authService';

// Simple Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <div className="glass-card animate-fade-in text-center">
                <h2>Events Dashboard</h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
                  Successfully logged in! Event listing coming soon.
                </p>
                <button
                  className="btn btn-primary mt-4"
                  onClick={() => authService.logout()}
                >
                  Logout
                </button>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Catch all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
