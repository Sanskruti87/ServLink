import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API, setAuthToken } from '../services/api';

const Login = ({ setUser }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister
        ? form
        : {
            email: form.email,
            password: form.password,
          };

      const { data } = await API.post(endpoint, payload);
      setAuthToken(data.token);
      localStorage.setItem('servlink_user', JSON.stringify(data.user));
      setUser(data.user);

      if (data.user.role === 'customer') {
        navigate('/customer');
      } else {
        navigate('/provider');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">
          {isRegister ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="auth-subtitle">
          Book trusted home services or grow your service business with ServLink
          Pro.
        </p>

        <div className="auth-toggle">
          <button
            className={!isRegister ? 'toggle-active' : ''}
            onClick={() => setIsRegister(false)}
          >
            Login
          </button>
          <button
            className={isRegister ? 'toggle-active' : ''}
            onClick={() => setIsRegister(true)}
          >
            Register
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                required={isRegister}
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          {isRegister && (
            <div className="form-group">
              <label>Account Type</label>
              <div className="role-select">
                <button
                  type="button"
                  className={form.role === 'customer' ? 'role-active' : ''}
                  onClick={() =>
                    setForm((prev) => ({ ...prev, role: 'customer' }))
                  }
                >
                  Customer
                </button>
                <button
                  type="button"
                  className={form.role === 'provider' ? 'role-active' : ''}
                  onClick={() =>
                    setForm((prev) => ({ ...prev, role: 'provider' }))
                  }
                >
                  Service Provider
                </button>
              </div>
            </div>
          )}

          {error && <div className="form-error">{error}</div>}

          <button
            type="submit"
            className="btn-primary btn-full"
            disabled={loading}
          >
            {loading
              ? 'Please wait...'
              : isRegister
              ? 'Create account'
              : 'Login'}
          </button>
        </form>

        <p className="auth-footnote">
          By continuing, you agree to our Terms & Privacy Policy.
        </p>
      </div>
      <div className="auth-hero">
        <div className="auth-hero-overlay">
          <h2>Premium home services, on demand.</h2>
          <p>Electricians, plumbers, cleaners, carpenters and more.</p>
          <ul>
            <li>Verified professionals</li>
            <li>Transparent pricing</li>
            <li>Instant booking</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;

