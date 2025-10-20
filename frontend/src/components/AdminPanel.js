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
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = "/";
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-danger';
      case 'moderator': return 'bg-warning';
      case 'user': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  const renderContent = () => {
    if (activeMenu === 'dashboard') {
      return (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0" style={{ color: '#495057', fontWeight: '600' }}>
              {userRole === 'admin' ? 'Admin Dashboard' : 'Moderator Dashboard'}
            </h2>
          </div>
          {userRole === 'moderator' && (
            <div className="alert alert-info mb-4">
              <strong>Moderator Access:</strong> You can view users and statistics but cannot modify roles or delete users.
            </div>
          )}

          {/* Statistics Cards */}
          <div className="row mb-4">
            <div className="col-6 col-md-3 mb-3 mb-md-0">
              <div className="card bg-primary text-white shadow-sm">
                <div className="card-body text-center">
                  <h5 className="card-title h6">Total Users</h5>
                  <h3 className="mb-0">{stats.totalUsers || 0}</h3>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3 mb-3 mb-md-0">
              <div className="card bg-danger text-white shadow-sm">
                <div className="card-body text-center">
                  <h5 className="card-title h6">Admins</h5>
                  <h3 className="mb-0">{stats.adminCount || 0}</h3>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card bg-warning text-white shadow-sm">
                <div className="card-body text-center">
                  <h5 className="card-title h6">Moderators</h5>
                  <h3 className="mb-0">{stats.moderatorCount || 0}</h3>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card bg-success text-white shadow-sm">
                <div className="card-body text-center">
                  <h5 className="card-title h6">Regular Users</h5>
                  <h3 className="mb-0">{stats.userCount || 0}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="card shadow-sm border-0">
            <div className="card-header bg-light">
              <h5 className="mb-0">User Management</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light d-none d-md-table-header-group">
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
                        <td>
                          <div className="d-block d-md-none mb-2">
                            <strong>{user.name}</strong>
                          </div>
                          <div className="d-none d-md-block">{user.name}</div>
                          <div className="d-block d-md-none text-muted small">{user.email}</div>
                        </td>
                        <td className="d-none d-md-table-cell">{user.email}</td>
                        <td>
                          {editingUser === user._id ? (
                            <div className="d-flex flex-column flex-md-row gap-2">
                              <select
                                className="form-select form-select-sm"
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                              >
                                <option value="user">User</option>
                                <option value="moderator">Moderator</option>
                                <option value="admin">Admin</option>
                              </select>
                              <div className="d-flex gap-1">
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
                            </div>
                          ) : (
                            <>
                              <span className={`badge ${getRoleBadgeColor(user.role)} d-block d-md-inline`}>
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                              </span>
                              <div className="d-block d-md-none mt-1 text-muted small">
                                Joined: {new Date(user.createdAt).toLocaleDateString()}
                              </div>
                            </>
                          )}
                        </td>
                        <td className="d-none d-md-table-cell">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="btn-group-vertical btn-group-sm d-block d-md-none" role="group">
                            {userRole === 'admin' && (
                              <>
                                <button
                                  className="btn btn-outline-primary btn-sm mb-1"
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
                          <div className="btn-group d-none d-md-block" role="group">
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
        </>
      );
    } else if (activeMenu === 'settings') {
      return (
        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <h2 className="card-title" style={{ color: '#495057', fontWeight: '600' }}>Settings</h2>
            <p className="text-muted">Admin/Moderator settings panel. (Placeholder)</p>
          </div>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        {/* Mobile Menu Button */}
        <button
          className={`btn ${userRole === 'admin' ? 'btn-danger' : 'btn-warning'} d-md-none position-fixed rounded-circle shadow`}
          style={{
            top: '15px',
            left: '15px',
            zIndex: 1050,
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <i className="bi bi-list fs-5"></i>
        </button>

        {/* Sidebar */}
        <div
          className={`${userRole === 'admin' ? 'bg-danger' : 'bg-warning'} border-end text-white ${sidebarOpen ? 'd-block' : 'd-none'} d-md-block`}
          style={{
            width: '280px',
            position: 'fixed',
            height: '100vh',
            overflowY: 'auto',
            zIndex: 1040,
            top: 0,
            left: 0,
            boxShadow: sidebarOpen ? '4px 0 15px rgba(0,0,0,0.15)' : 'none',
            transition: 'box-shadow 0.3s ease'
          }}
        >
          <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0 fw-bold d-flex align-items-center">
                <i className={`bi ${userRole === 'admin' ? 'bi-shield-fill' : 'bi-person-badge-fill'} me-2 fs-4`}></i>
                {userRole === 'admin' ? 'Admin Panel' : 'Moderator Panel'}
              </h5>
              <button
                className="btn btn-link text-white d-md-none p-0 ms-2"
                onClick={() => setSidebarOpen(false)}
                style={{ fontSize: '1.3rem' }}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <h6 className="text-white-50 mb-4">Navigation</h6>
            <ul className="nav flex-column gap-2">
              <li className="nav-item">
                <button
                  className={`nav-link btn text-start text-white w-100 d-flex align-items-center px-3 py-3 rounded-3 ${activeMenu === 'dashboard' ? 'bg-white bg-opacity-20 fw-bold shadow-sm' : ''}`}
                  onClick={() => {
                    setActiveMenu('dashboard');
                    setSidebarOpen(false);
                  }}
                  style={{
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    border: 'none',
                    backgroundColor: activeMenu === 'dashboard' ? 'rgba(255,255,255,0.2)' : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (activeMenu !== 'dashboard') {
                      e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeMenu !== 'dashboard') {
                      e.target.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <i className="bi bi-speedometer2 me-3 fs-5"></i>
                  <span className="fs-6">Dashboard</span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link btn text-start text-white w-100 d-flex align-items-center px-3 py-3 rounded-3 ${activeMenu === 'users' ? 'bg-white bg-opacity-20 fw-bold shadow-sm' : ''}`}
                  onClick={() => {
                    setActiveMenu('dashboard');
                    setSidebarOpen(false);
                  }}
                  style={{
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    border: 'none',
                    backgroundColor: activeMenu === 'users' ? 'rgba(255,255,255,0.2)' : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (activeMenu !== 'users') {
                      e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeMenu !== 'users') {
                      e.target.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <i className="bi bi-people-fill me-3 fs-5"></i>
                  <span className="fs-6">Users</span>
                </button>
              </li>
              {userRole === 'admin' && (
                <li className="nav-item">
                  <button
                    className={`nav-link btn text-start text-white w-100 d-flex align-items-center px-3 py-3 rounded-3 ${activeMenu === 'settings' ? 'bg-white bg-opacity-20 fw-bold shadow-sm' : ''}`}
                    onClick={() => {
                      setActiveMenu('settings');
                      setSidebarOpen(false);
                    }}
                    style={{
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      border: 'none',
                      backgroundColor: activeMenu === 'settings' ? 'rgba(255,255,255,0.2)' : 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (activeMenu !== 'settings') {
                        e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeMenu !== 'settings') {
                        e.target.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <i className="bi bi-gear-fill me-3 fs-5"></i>
                    <span className="fs-6">Settings</span>
                  </button>
                </li>
              )}
              <li className="nav-item mt-4 pt-3 border-top border-white border-opacity-25">
                <button
                  className="nav-link btn text-start text-white w-100 d-flex align-items-center px-3 py-3 rounded-3"
                  onClick={handleLogout}
                  style={{
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    border: 'none'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <i className="bi bi-box-arrow-right me-3 fs-5"></i>
                  <span className="fs-6">Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="d-md-none position-fixed"
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 1030
            }}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div
          className="flex-grow-1 d-flex align-items-center justify-content-center"
          style={{
            marginLeft: window.innerWidth >= 768 ? '250px' : '0',
            padding: window.innerWidth >= 768 ? '20px' : '20px 15px 20px 60px'
          }}
        >
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <nav className={`navbar navbar-expand-lg navbar-dark ${userRole === 'admin' ? 'bg-danger' : 'bg-warning'} border-bottom shadow-sm`} style={{ zIndex: 1020 }}>
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            {/* Mobile Menu Button */}
            <button
              className={`btn ${userRole === 'admin' ? 'btn-danger' : 'btn-warning'} d-md-none me-3 rounded-circle shadow`}
              style={{
                width: '45px',
                height: '45px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <i className="bi bi-list fs-5"></i>
            </button>

            <h4 className="mb-0 text-white fw-bold">
              <i className={`bi ${userRole === 'admin' ? 'bi-shield-fill' : 'bi-person-badge-fill'} me-2`}></i>
              {userRole === 'admin' ? 'Admin Panel' : 'Moderator Panel'}
            </h4>
          </div>

          <div className="d-flex align-items-center">
            <div className="dropdown">
              <button
                className="btn btn-outline-light dropdown-toggle d-flex align-items-center"
                type="button"
                id="adminDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-person-circle me-2"></i>
                <span className="d-none d-sm-inline">{userRole === 'admin' ? 'Admin' : 'Moderator'}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="adminDropdown">
                <li><a className="dropdown-item" href="#" onClick={() => setActiveMenu('dashboard')}><i className="bi bi-speedometer2 me-2"></i>Dashboard</a></li>
                <li><a className="dropdown-item" href="#" onClick={() => setActiveMenu('dashboard')}><i className="bi bi-people me-2"></i>Users</a></li>
                {userRole === 'admin' && <li><a className="dropdown-item" href="#" onClick={() => setActiveMenu('settings')}><i className="bi bi-gear me-2"></i>Settings</a></li>}
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item text-danger" href="#" onClick={handleLogout}><i className="bi bi-box-arrow-right me-2"></i>Logout</a></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <div
          className={`${userRole === 'admin' ? 'bg-danger' : 'bg-warning'} border-end text-white ${sidebarOpen ? 'd-block' : 'd-none'} d-md-block`}
          style={{
            width: '280px',
            position: 'fixed',
            height: 'calc(100vh - 76px)',
            overflowY: 'auto',
            zIndex: 1040,
            top: '76px',
            left: 0,
            boxShadow: sidebarOpen ? '4px 0 15px rgba(0,0,0,0.15)' : 'none',
            transition: 'box-shadow 0.3s ease'
          }}
        >
          <div className="p-3">
            <ul className="nav flex-column gap-2">
              <li className="nav-item">
                <button
                  className={`nav-link btn text-white w-100 d-flex align-items-center px-3 py-2 rounded-2 ${activeMenu === 'dashboard' ? 'bg-white bg-opacity-20 fw-bold' : ''}`}
                  onClick={() => {
                    setActiveMenu('dashboard');
                    setSidebarOpen(false);
                  }}
                  style={{
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    border: 'none',
                    backgroundColor: activeMenu === 'dashboard' ? 'rgba(255,255,255,0.2)' : 'transparent',
                    minHeight: '40px',
                    fontSize: '0.9rem'
                  }}
                  onMouseEnter={(e) => {
                    if (activeMenu !== 'dashboard') {
                      e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeMenu !== 'dashboard') {
                      e.target.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <i className="bi bi-speedometer2 me-2 fs-6"></i>
                  <span>Dashboard</span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link btn text-white w-100 d-flex align-items-center px-3 py-2 rounded-2 ${activeMenu === 'users' ? 'bg-white bg-opacity-20 fw-bold' : ''}`}
                  onClick={() => {
                    setActiveMenu('dashboard');
                    setSidebarOpen(false);
                  }}
                  style={{
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    border: 'none',
                    backgroundColor: activeMenu === 'users' ? 'rgba(255,255,255,0.2)' : 'transparent',
                    minHeight: '40px',
                    fontSize: '0.9rem'
                  }}
                  onMouseEnter={(e) => {
                    if (activeMenu !== 'users') {
                      e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeMenu !== 'users') {
                      e.target.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <i className="bi bi-people me-2 fs-6"></i>
                  <span>Users</span>
                </button>
              </li>
              {userRole === 'admin' && (
                <li className="nav-item">
                  <button
                    className={`nav-link btn text-white w-100 d-flex align-items-center px-3 py-2 rounded-2 ${activeMenu === 'settings' ? 'bg-white bg-opacity-20 fw-bold' : ''}`}
                    onClick={() => {
                      setActiveMenu('settings');
                      setSidebarOpen(false);
                    }}
                    style={{
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      border: 'none',
                      backgroundColor: activeMenu === 'settings' ? 'rgba(255,255,255,0.2)' : 'transparent',
                      minHeight: '40px',
                      fontSize: '0.9rem'
                    }}
                    onMouseEnter={(e) => {
                      if (activeMenu !== 'settings') {
                        e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeMenu !== 'settings') {
                        e.target.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <i className="bi bi-gear me-2 fs-6"></i>
                    <span>Settings</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="d-md-none position-fixed"
            style={{
              top: '76px',
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 1030
            }}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div
          className="flex-grow-1"
          style={{
            marginLeft: window.innerWidth >= 768 ? '280px' : '0',
            marginTop: '76px',
            padding: '30px',
            minHeight: 'calc(100vh - 76px)'
          }}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
}