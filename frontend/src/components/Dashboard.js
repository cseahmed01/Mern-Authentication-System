import React, { useEffect, useState } from "react";
import api from "../api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ phone: '', bio: '' });
  const [pictureFile, setPictureFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState('profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/user");
        setUser(res.data);
        setFormData({ phone: res.data.phone || '', bio: res.data.bio || '' });
      } catch (error) {
        console.error("Failed to fetch user:", error);
        // Redirect to login if not authenticated
        window.location.href = "/";
      }
    };
    fetchUser();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPictureFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('bio', formData.bio);
      if (pictureFile) {
        formDataToSend.append('picture', pictureFile);
      }
      const res = await api.put("/auth/profile", formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUser(res.data);
      setIsEditing(false);
      setPictureFile(null);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
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
    if (activeMenu === 'profile') {
      return (
        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="card-title" style={{ color: '#495057', fontWeight: '600' }}>My Profile</h2>
              {!isEditing && (
                <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
              )}
            </div>
            {user ? (
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-12 col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: '#6c757d' }}>Full Name</label>
                      <p className="mb-0" style={{ fontSize: '1.1rem', color: '#495057' }}>{user.name}</p>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: '#6c757d' }}>Email Address</label>
                      <p className="mb-0" style={{ fontSize: '1.1rem', color: '#495057' }}>{user.email}</p>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: '#6c757d' }}>Phone</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="form-control"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter phone number"
                        />
                      ) : (
                        <p className="mb-0" style={{ fontSize: '1.1rem', color: '#495057' }}>{user.phone || 'Not provided'}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: '#6c757d' }}>Profile Picture</label>
                      {isEditing ? (
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      ) : (
                        <p className="mb-0" style={{ fontSize: '1.1rem', color: '#495057' }}>
                          {user.picture ? <img src={`http://localhost:5000${user.picture}`} alt="Profile" style={{ width: '50px', height: '50px', borderRadius: '50%' }} /> : 'Not provided'}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: '#6c757d' }}>Bio</label>
                      {isEditing ? (
                        <textarea
                          className="form-control"
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          placeholder="Enter bio"
                          rows="3"
                        />
                      ) : (
                        <p className="mb-0" style={{ fontSize: '1.1rem', color: '#495057' }}>{user.bio || 'Not provided'}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: '#6c757d' }}>Role</label>
                      <p className="mb-0">
                        <span className={`badge ${getRoleBadgeColor(user.role)}`} style={{ fontSize: '0.9rem' }}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: '#6c757d' }}>Member Since</label>
                      <p className="mb-0" style={{ fontSize: '1.1rem', color: '#495057' }}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                {isEditing && (
                  <div className="d-flex gap-2 mt-3">
                    <button type="submit" className="btn btn-success" disabled={loading}>
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                  </div>
                )}
              </form>
            ) : (
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">Loading your information...</p>
              </div>
            )}
          </div>
        </div>
      );
    } else if (activeMenu === 'settings') {
      return (
        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <h2 className="card-title" style={{ color: '#495057', fontWeight: '600' }}>Settings</h2>
            <p className="text-muted">Settings panel for users. (Placeholder)</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm" style={{ zIndex: 1020 }}>
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            {/* Mobile Menu Button */}
            <button
              className="btn btn-success d-md-none me-3 rounded-circle shadow"
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

            <h4 className="mb-0 text-success fw-bold">
              <i className="bi bi-house-door-fill me-2"></i>
              User Dashboard
            </h4>
          </div>

          <div className="d-flex align-items-center">
            {user && (
              <div className="dropdown">
                <button
                  className="btn btn-outline-success dropdown-toggle d-flex align-items-center"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle me-2"></i>
                  <span className="d-none d-sm-inline">{user.name}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li><a className="dropdown-item" href="#" onClick={() => setActiveMenu('profile')}><i className="bi bi-person me-2"></i>Profile</a></li>
                  <li><a className="dropdown-item" href="#" onClick={() => setActiveMenu('settings')}><i className="bi bi-gear me-2"></i>Settings</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item text-danger" href="#" onClick={handleLogout}><i className="bi bi-box-arrow-right me-2"></i>Logout</a></li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <div
          className={`bg-success border-end text-white ${sidebarOpen ? 'd-block' : 'd-none'} d-md-block`}
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
                  className={`nav-link btn text-white w-100 d-flex align-items-center px-3 py-2 rounded-2 position-relative ${activeMenu === 'profile' ? 'bg-white bg-opacity-20 fw-bold' : ''}`}
                  onClick={() => {
                    setActiveMenu('profile');
                    setSidebarOpen(false);
                  }}
                  style={{
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    border: 'none',
                    backgroundColor: activeMenu === 'profile' ? 'rgba(255,255,255,0.2)' : 'transparent',
                    minHeight: '40px',
                    fontSize: '0.9rem'
                  }}
                  onMouseEnter={(e) => {
                    if (activeMenu !== 'profile') {
                      e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeMenu !== 'profile') {
                      e.target.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <i className="bi bi-person-circle me-2 fs-6"></i>
                  <span>Profile</span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link btn text-white w-100 d-flex align-items-center px-3 py-2 rounded-2 position-relative ${activeMenu === 'settings' ? 'bg-white bg-opacity-20 fw-bold' : ''}`}
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
