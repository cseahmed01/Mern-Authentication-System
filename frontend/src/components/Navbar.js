import React from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdminOrModerator = user && (user.role === 'admin' || user.role === 'moderator');

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("user");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if API call fails
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: '#ffffff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderBottom: '1px solid #e9ecef' }}>
      <div className="container">
        <Link className="navbar-brand" to={user ? "/dashboard" : "/"} style={{ fontWeight: '600', color: '#495057', textDecoration: 'none' }}>MERN Auth</Link>
        <div className="d-flex align-items-center">
          {user ? (
            <>
              <span className="me-3" style={{ color: '#6c757d', fontWeight: '500' }}>Welcome, {user.name}!</span>
              {isAdminOrModerator && (
                <Link
                  className="btn me-2"
                  to="/admin"
                  style={{
                    backgroundColor: '#6c757d',
                    borderColor: '#6c757d',
                    color: 'white',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontWeight: '500',
                    textDecoration: 'none'
                  }}
                >
                  Admin Panel
                </Link>
              )}
              <button
                className="btn"
                onClick={handleLogout}
                style={{
                  backgroundColor: '#dc3545',
                  borderColor: '#dc3545',
                  color: 'white',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontWeight: '500'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                className="btn me-2"
                to="/register"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #007bff',
                  color: '#007bff',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontWeight: '500',
                  textDecoration: 'none'
                }}
              >
                Register
              </Link>
              <Link
                className="btn"
                to="/"
                style={{
                  backgroundColor: '#28a745',
                  borderColor: '#28a745',
                  color: 'white',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontWeight: '500',
                  textDecoration: 'none'
                }}
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
