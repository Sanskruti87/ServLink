import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API } from '../services/api';

const SERVICE_CARDS = [
  {
    id: 'electrician',
    title: 'Electrician',
    description: 'Fan, light, wiring, appliance installation & more.',
    accent: 'electrician',
  },
  {
    id: 'plumber',
    title: 'Plumber',
    description: 'Leak fixes, tap replacements, bathroom fittings.',
    accent: 'plumber',
  },
  {
    id: 'cleaner',
    title: 'Home Cleaning',
    description: 'Deep cleaning, kitchen, sofa & bathroom cleaning.',
    accent: 'cleaner',
  },
  {
    id: 'carpenter',
    title: 'Carpenter',
    description: 'Furniture repair, installation, custom work.',
    accent: 'carpenter',
  },
];

const CustomerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/bookings/customer');
      setBookings(data);
    } catch (err) {
      console.error('Failed to load bookings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="page">
      <section className="hero">
        <div>
          <h1>Book trusted professionals in minutes.</h1>
          <p>
            Choose a service, pick a time, and relax. ServLink Pro connects you
            with vetted local experts.
          </p>
        </div>
        <div className="hero-badge">
          <span className="hero-pill">New</span>
          <h3>Same-day service available</h3>
          <p>Across top categories in your city.</p>
        </div>
      </section>

      <section className="grid-2">
        <div>
          <h2 className="section-title">Popular services</h2>
          <div className="service-grid">
            {SERVICE_CARDS.map((s) => (
              <div key={s.id} className={`service-card service-${s.accent}`}>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
                <Link
                  to={`/book?service=${s.id}`}
                  className="btn-ghost"
                >
                  Book {s.title}
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="section-title">Your recent bookings</h2>
          <div className="card history-card">
            {loading ? (
              <p>Loading your bookings...</p>
            ) : bookings.length === 0 ? (
              <p className="muted">
                You have no bookings yet. Try booking a service to see it here.
              </p>
            ) : (
              <ul className="booking-list">
                {bookings.map((b) => (
                  <li key={b._id} className="booking-item">
                    <div>
                      <strong className="booking-service">
                        {b.serviceType.charAt(0).toUpperCase() +
                          b.serviceType.slice(1)}
                      </strong>
                      <p className="booking-meta">
                        With {b.providerId?.name || 'Provider'} •{' '}
                        {new Date(b.scheduledTime).toLocaleString()}
                      </p>
                    </div>
                    <div className="booking-status">
                      <span className={`status-pill status-${b.status}`}>
                        {b.status}
                      </span>
                      <span className="booking-price">₹{b.price}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomerDashboard;

