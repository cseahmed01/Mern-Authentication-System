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
      navigate("/dashboard");
    } catch (err) {
      const message = err.response ? err.response.data.message : err.message;
      alert("Login failed: " + message);
    }
  };

  return (
    <div className="col-md-6 mx-auto">
      <h3>Login</h3>
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" name="email" placeholder="Email" onChange={handleChange} />
        <input className="form-control mb-2" name="password" type="password" placeholder="Password" onChange={handleChange} />
        <button className="btn btn-success w-100">Login</button>
      </form>
    </div>
  );
}
