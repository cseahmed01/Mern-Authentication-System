import React, { useState,useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if current user is admin
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role === 'admin') {
      setIsAdmin(true);
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", form);
      localStorage.setItem("user", JSON.stringify(res.data));
      alert("Registered successfully!");
      navigate("/dashboard");
    } catch (err) {
      const message = err.response ? err.response.data.message : err.message;
      alert("Registration failed: " + message);
    }
  };

  return (
    <div className="col-md-6 mx-auto">
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h2 className="card-title text-center mb-4" style={{ color: '#495057', fontWeight: '600' }}>Create Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label" style={{ fontWeight: '500' }}>Full Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                placeholder="Enter your full name"
                onChange={handleChange}
                required
                style={{ borderRadius: '8px', border: '1px solid #ced4da' }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label" style={{ fontWeight: '500' }}>Email Address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="Enter your email"
                onChange={handleChange}
                required
                style={{ borderRadius: '8px', border: '1px solid #ced4da' }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label" style={{ fontWeight: '500' }}>Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Create a password"
                onChange={handleChange}
                required
                style={{ borderRadius: '8px', border: '1px solid #ced4da' }}
              />
            </div>
            {isAdmin && (
              <div className="mb-3">
                <label htmlFor="role" className="form-label" style={{ fontWeight: '500' }}>Role</label>
                <select
                  className="form-control"
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  style={{ borderRadius: '8px', border: '1px solid #ced4da' }}
                >
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}
            <button
              type="submit"
              className="btn w-100"
              style={{
                backgroundColor: '#28a745',
                borderColor: '#28a745',
                borderRadius: '8px',
                padding: '10px',
                fontWeight: '500',
                color: 'white'
              }}
            >
              {isAdmin ? 'Create User' : 'Sign Up'}
            </button>
          </form>
          <div className="text-center mt-3">
            <small className="text-muted">Already have an account? <a href="/" style={{ color: '#007bff', textDecoration: 'none' }}>Sign in</a></small>
          </div>
        </div>
      </div>
    </div>
  );
}
