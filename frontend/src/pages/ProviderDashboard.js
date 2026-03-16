import React, { useEffect, useState } from 'react';
import { API } from '../services/api';

const ProviderDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/bookings/provider');
      setBookings(data);
    } catch (err) {
      console.error('Failed to load provider bookings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (bookingId, status) => {
    try {
      setUpdating(bookingId + status);
      const { data } = await API.put('/bookings/updateStatus', {
        bookingId,
        status,
      });
      setBookings((prev) =>
        prev.map((b) => (b._id === data._id ? data : b))
      );
    } catch (err) {
      console.error('Failed to update booking', err);
      alert('Could not update booking status. Please try again.');
    } finally {
      setUpdating(null);
    }
  };

  const pending = bookings.filter((b) => b.status === 'pending');
  const active = bookings.filter(
    (b) => b.status === 'accepted' || b.status === 'completed'
  );

  return (
    <div className="page">
      <section className="hero">
        <div>
          <h1>Grow your service business with ServLink Pro.</h1>
          <p>
            Get a live feed of incoming jobs, manage your schedule, and keep
            customers happy.
          </p>
        </div>
      </section>

      <section className="grid-2">
        <div>
          <h2 className="section-title">New job requests</h2>
          <div className="card-list">
            {loading ? (
              <p>Loading jobs...</p>
            ) : pending.length === 0 ? (
              <p className="muted">No new requests right now.</p>
            ) : (
              pending.map((b) => (
                <div key={b._id} className="card job-card">
                  <div className="job-main">
                    <h3>
                      {b.serviceType.charAt(0).toUpperCase() +
                        b.serviceType.slice(1)}{' '}
                      • ₹{b.price}
                    </h3>
                    <p className="job-meta">
                      {b.customerId?.name || 'Customer'} •{' '}
                      {new Date(b.scheduledTime).toLocaleString()}
                    </p>
                  </div>
                  <div className="job-actions">
                    <button
                      className="btn-secondary"
                      disabled={!!updating}
                      onClick={() => updateStatus(b._id, 'rejected')}
                    >
                      {updating === b._id + 'rejected'
                        ? 'Rejecting...'
                        : 'Reject'}
                    </button>
                    <button
                      className="btn-primary"
                      disabled={!!updating}
                      onClick={() => updateStatus(b._id, 'accepted')}
                    >
                      {updating === b._id + 'accepted'
                        ? 'Accepting...'
                        : 'Accept'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="section-title">Your jobs</h2>
          <div className="card history-card">
            {active.length === 0 ? (
              <p className="muted">
                Accepted and completed jobs will appear here.
              </p>
            ) : (
              <ul className="booking-list">
                {active.map((b) => (
                  <li key={b._id} className="booking-item">
                    <div>
                      <strong className="booking-service">
                        {b.serviceType.charAt(0).toUpperCase() +
                          b.serviceType.slice(1)}
                      </strong>
                      <p className="booking-meta">
                        {b.customerId?.name || 'Customer'} •{' '}
                        {new Date(b.scheduledTime).toLocaleString()}
                      </p>
                    </div>
                    <div className="booking-status">
                      <span className={`status-pill status-${b.status}`}>
                        {b.status}
                      </span>
                      <span className="booking-price">₹{b.price}</span>
                      {b.status === 'accepted' && (
                        <button
                          className="btn-link"
                          disabled={!!updating}
                          onClick={() => updateStatus(b._id, 'completed')}
                        >
                          {updating === b._id + 'completed'
                            ? 'Updating...'
                            : 'Mark completed'}
                        </button>
                      )}
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

export default ProviderDashboard;

