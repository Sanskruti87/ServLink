import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import CustomerDashboard from './pages/CustomerDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import BookingPage from './pages/BookingPage';

const App = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('servlink_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('servlink_user');
    localStorage.removeItem('servlink_token');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="app-root">
      <header className="top-nav">
        <div className="nav-left">
          <img src="/logo.svg" alt="ServLink Pro" className="nav-logo" />
        </div>
        <div className="nav-right">
          {user ? (
            <>
              <span className="nav-user">
                Signed in as <strong>{user.name}</strong> ({user.role})
              </span>
              <button className="btn-secondary" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <button className="btn-primary" onClick={() => navigate('/login')}>
              Login / Register
            </button>
          )}
        </div>
      </header>

      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                user.role === 'customer' ? (
                  <Navigate to="/customer" replace />
                ) : (
                  <Navigate to="/provider" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route
            path="/customer"
            element={
              user && user.role === 'customer' ? (
                <CustomerDashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/provider"
            element={
              user && user.role === 'provider' ? (
                <ProviderDashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/book"
            element={
              user && user.role === 'customer' ? (
                <BookingPage />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;

