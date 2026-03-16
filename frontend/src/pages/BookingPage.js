import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API } from '../services/api';

const SERVICE_BASE_PRICES = {
  electrician: 499,
  plumber: 449,
  cleaner: 799,
  carpenter: 549,
};

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const initialService = params.get('service') || 'electrician';

  const [serviceType, setServiceType] = useState(initialService);
  const [scheduledTime, setScheduledTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [providers, setProviders] = useState([]);
  const [providerId, setProviderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/auth/providers'); // optional helper; fallback below if not implemented
        setProviders(data);
        if (data.length > 0) {
          setProviderId(data[0]._id);
        }
      } catch (err) {
        // Fallback: ask user to manually select later or use a mock single provider
        console.warn('Provider listing API not implemented, using simple mock.');
        const mock = [
          { _id: 'mock-provider-id', name: 'Nearby Pro Provider' },
        ];
        setProviders(mock);
        setProviderId(mock[0]._id);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  const price = useMemo(() => {
    const base = SERVICE_BASE_PRICES[serviceType] || 499;
    // simple time-based variation: evenings slightly higher
    if (!scheduledTime) return base;
    const hour = new Date(scheduledTime).getHours();
    if (hour >= 18 || hour < 8) return base + 100;
    return base;
  }, [serviceType, scheduledTime]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!providerId) {
      setError('No provider available. Please try again later.');
      return;
    }

    try {
      setSubmitting(true);
      await API.post('/bookings/create', {
        providerId,
        serviceType,
        price,
        scheduledTime,
        paymentMethod,
      });
      setSuccess('Booking created successfully! Redirecting to dashboard...');
      setTimeout(() => navigate('/customer'), 1500);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Failed to create booking. Please try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <section className="hero hero-compact">
        <div>
          <h1>Confirm your booking</h1>
          <p>
            Select your preferred time and payment method. A nearby provider
            will be assigned instantly.
          </p>
        </div>
      </section>

      <section className="grid-2">
        <form className="card booking-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Service type</label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
            >
              <option value="electrician">Electrician</option>
              <option value="plumber">Plumber</option>
              <option value="cleaner">Home Cleaning</option>
              <option value="carpenter">Carpenter</option>
            </select>
          </div>

          <div className="form-group">
            <label>Preferred date & time</label>
            <input
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Payment method</label>
            <div className="role-select">
              <button
                type="button"
                className={paymentMethod === 'upi' ? 'role-active' : ''}
                onClick={() => setPaymentMethod('upi')}
              >
                UPI
              </button>
              <button
                type="button"
                className={paymentMethod === 'card' ? 'role-active' : ''}
                onClick={() => setPaymentMethod('card')}
              >
                Card
              </button>
              <button
                type="button"
                className={paymentMethod === 'cash' ? 'role-active' : ''}
                onClick={() => setPaymentMethod('cash')}
              >
                Cash
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Assigned provider</label>
            {loading ? (
              <p>Finding providers near you...</p>
            ) : (
              <select
                value={providerId}
                onChange={(e) => setProviderId(e.target.value)}
              >
                {providers.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}

          <button
            type="submit"
            className="btn-primary btn-full"
            disabled={submitting}
          >
            {submitting ? 'Processing payment...' : 'Confirm booking'}
          </button>
        </form>

        <div className="card booking-summary">
          <h2>Price estimate</h2>
          <p className="price-main">₹{price}</p>
          <p className="muted">
            Inclusive of visit charges and basic labour. Final price may vary
            based on actual work.
          </p>
          <hr />
          <h3>What happens next?</h3>
          <ol className="steps">
            <li>We notify the selected provider about your request.</li>
            <li>
              Once accepted, you&apos;ll see the live status in your dashboard.
            </li>
            <li>Pay securely online or in cash after service completion.</li>
          </ol>
        </div>
      </section>
    </div>
  );
};

export default BookingPage;

