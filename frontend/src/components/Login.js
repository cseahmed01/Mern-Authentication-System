import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("user", JSON.stringify(res.data));

      // Redirect based on user role
      if (res.data.role === 'admin') {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      const message = err.response ? err.response.data.message : err.message;
      alert("Login failed: " + message);
    }
  };

  return (
    <div className="col-md-6 mx-auto">
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h2 className="card-title text-center mb-4" style={{ color: '#495057', fontWeight: '600' }}>Welcome Back</h2>
          <form onSubmit={handleSubmit}>
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
                placeholder="Enter your password"
                onChange={handleChange}
                required
                style={{ borderRadius: '8px', border: '1px solid #ced4da' }}
              />
            </div>
            <button
              type="submit"
              className="btn w-100"
              style={{
                backgroundColor: '#007bff',
                borderColor: '#007bff',
                borderRadius: '8px',
                padding: '10px',
                fontWeight: '500',
                color: 'white'
              }}
            >
              Sign In
            </button>
          </form>
          <div className="text-center mt-3">
            <small className="text-muted">Don't have an account? <a href="/register" style={{ color: '#007bff', textDecoration: 'none' }}>Sign up</a></small>
          </div>
        </div>
      </div>
    </div>
  );
}
