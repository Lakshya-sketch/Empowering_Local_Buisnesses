import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Shared.css';
import '../css/Admin.css';

function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchData();
  }, [activeTab]);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || user.role !== 'admin') {
      alert('Access denied. Admin only.');
      navigate('/login');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      let endpoint = '';
      switch (activeTab) {
        case 'users':
          endpoint = '/api/users';
          break;
        case 'providers':
          endpoint = '/api/providers';
          break;
        case 'bookings':
          endpoint = '/api/bookings';
          break;
        case 'orders':
          endpoint = '/api/orders';
          break;
        case 'services':
          endpoint = '/api/services';
          break;
        default:
          return;
      }

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        switch (activeTab) {
          case 'users':
            setUsers(data.users || []);
            break;
          case 'providers':
            setProviders(data.providers || []);
            break;
          case 'bookings':
            setBookings(data.bookings || []);
            break;
          case 'orders':
            setOrders(data.orders || []);
            break;
          case 'services':
            setServices(data.services || []);
            break;
        }
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/${type}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        alert('Deleted successfully');
        fetchData();
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete');
    }
  };

  const handleStatusUpdate = async (type, id, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/${type}/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      if (data.success) {
        alert('Status updated successfully');
        fetchData();
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update status');
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your platform</p>
      </div>

      <div className="admin-tabs">
        <button 
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button 
          className={activeTab === 'providers' ? 'active' : ''}
          onClick={() => setActiveTab('providers')}
        >
          Providers
        </button>
        <button 
          className={activeTab === 'bookings' ? 'active' : ''}
          onClick={() => setActiveTab('bookings')}
        >
          Bookings
        </button>
        <button 
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button 
          className={activeTab === 'services' ? 'active' : ''}
          onClick={() => setActiveTab('services')}
        >
          Services
        </button>
      </div>

      <div className="admin-content">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {activeTab === 'users' && (
              <div className="data-table">
                <h2>Users ({users.length})</h2>
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Phone</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td><span className={`badge ${user.role}`}>{user.role}</span></td>
                        <td>{user.phone || 'N/A'}</td>
                        <td>
                          <button 
                            className="delete-btn"
                            onClick={() => handleDelete('users', user.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'providers' && (
              <div className="data-table">
                <h2>Providers ({providers.length})</h2>
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Service</th>
                      <th>Experience</th>
                      <th>Rating</th>
                      <th>Price/hr</th>
                      <th>Verified</th>
                    </tr>
                  </thead>
                  <tbody>
                    {providers.map(provider => (
                      <tr key={provider.id}>
                        <td>{provider.id}</td>
                        <td>{provider.name}</td>
                        <td>{provider.service_type}</td>
                        <td>{provider.experience} years</td>
                        <td>⭐ {provider.rating?.toFixed(1)}</td>
                        <td>₹{provider.price_per_hour}</td>
                        <td>{provider.verified ? '✅' : '❌'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="data-table">
                <h2>Bookings ({bookings.length})</h2>
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User</th>
                      <th>Service</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Amount</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(booking => (
                      <tr key={booking.id}>
                        <td>{booking.id}</td>
                        <td>{booking.user_name}</td>
                        <td>{booking.service_type}</td>
                        <td>{new Date(booking.booking_date).toLocaleDateString()}</td>
                        <td>
                          <select 
                            value={booking.status}
                            onChange={(e) => handleStatusUpdate('bookings', booking.id, e.target.value)}
                            className={`status-select ${booking.status}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td>₹{booking.total_amount}</td>
                        <td>
                          <button 
                            className="delete-btn"
                            onClick={() => handleDelete('bookings', booking.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="data-table">
                <h2>Orders ({orders.length})</h2>
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Payment</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.user_name}</td>
                        <td>₹{order.total_amount}</td>
                        <td>
                          <select 
                            value={order.status}
                            onChange={(e) => handleStatusUpdate('orders', order.id, e.target.value)}
                            className={`status-select ${order.status}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td>{order.payment_status}</td>
                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                        <td>
                          <button 
                            className="view-btn"
                            onClick={() => navigate(`/order/${order.id}`)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="data-table">
                <h2>Services ({services.length})</h2>
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Active</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map(service => (
                      <tr key={service.id}>
                        <td>{service.id}</td>
                        <td>{service.name}</td>
                        <td>{service.category}</td>
                        <td>{service.description?.substring(0, 50)}...</td>
                        <td>{service.active ? '✅' : '❌'}</td>
                        <td>
                          <button 
                            className="delete-btn"
                            onClick={() => handleDelete('services', service.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Admin;
