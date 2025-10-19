import React, { useEffect, useState } from "react";
import api from "../api";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/user");
        setUser(res.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        // Redirect to login if not authenticated
        window.location.href = "/";
      }
    };
    fetchUser();
  }, []);

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-danger';
      case 'moderator': return 'bg-warning';
      case 'user': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="col-md-8 mx-auto">
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h2 className="card-title mb-4" style={{ color: '#495057', fontWeight: '600' }}>Dashboard</h2>
          {user ? (
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ color: '#6c757d' }}>Full Name</label>
                  <p className="mb-0" style={{ fontSize: '1.1rem', color: '#495057' }}>{user.name}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ color: '#6c757d' }}>Email Address</label>
                  <p className="mb-0" style={{ fontSize: '1.1rem', color: '#495057' }}>{user.email}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ color: '#6c757d' }}>Role</label>
                  <p className="mb-0">
                    <span className={`badge ${getRoleBadgeColor(user.role)}`} style={{ fontSize: '0.9rem' }}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ color: '#6c757d' }}>Member Since</label>
                  <p className="mb-0" style={{ fontSize: '1.1rem', color: '#495057' }}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
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
    </div>
  );
}
