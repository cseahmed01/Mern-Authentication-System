import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [userRole, setUserRole] = useState('');

  const fetchUsers = useCallback(async () => {
    try {
      const response = await api.get(`/admin/users?page=${currentPage}&limit=10`);
      setUsers(response.data.users);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  useEffect(() => {
    // Get current user role
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserRole(user.role);
    }

    fetchUsers();
    fetchStats();
  }, [currentPage, fetchUsers, fetchStats]);

  const handleRoleChange = async (userId, role) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role });
      alert('User role updated successfully');
      fetchUsers();
      fetchStats();
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating role:', error);
      alert(error.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      return;
    }

    try {
      await api.delete(`/admin/users/${userId}`);
      alert('User deleted successfully');
      fetchUsers();
      fetchStats();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-danger';
      case 'moderator': return 'bg-warning';
      case 'user': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <h2 className="mb-4">
        {userRole === 'admin' ? 'Admin Panel' : 'Moderator Panel'}
      </h2>
      {userRole === 'moderator' && (
        <div className="alert alert-info mb-4">
          <strong>Moderator Access:</strong> You can view users and statistics but cannot modify roles or delete users.
        </div>
      )}

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">Total Users</h5>
              <h3>{stats.totalUsers || 0}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-danger text-white">
            <div className="card-body">
              <h5 className="card-title">Admins</h5>
              <h3>{stats.adminCount || 0}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <h5 className="card-title">Moderators</h5>
              <h3>{stats.moderatorCount || 0}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">Regular Users</h5>
              <h3>{stats.userCount || 0}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">User Management</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      {editingUser === user._id ? (
                        <div className="d-flex gap-2">
                          <select
                            className="form-select form-select-sm"
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                          >
                            <option value="user">User</option>
                            <option value="moderator">Moderator</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleRoleChange(user._id, newRole)}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setEditingUser(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <span className={`badge ${getRoleBadgeColor(user.role)}`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      )}
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="btn-group" role="group">
                        {userRole === 'admin' && (
                          <>
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => {
                                setEditingUser(user._id);
                                setNewRole(user.role);
                              }}
                            >
                              Edit Role
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDeleteUser(user._id, user.name)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                        {userRole === 'moderator' && (
                          <span className="text-muted small">View Only</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav aria-label="User pagination" className="mt-3">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(page)}>
                      {page}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}