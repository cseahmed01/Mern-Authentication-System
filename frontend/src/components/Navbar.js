import React from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

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
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to={user ? "/dashboard" : "/"}>MERN Auth</Link>
        <div>
          {user ? (
            <>
              <span className="me-3">Welcome, {user.name}!</span>
              <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="btn btn-outline-primary me-2" to="/register">Register</Link>
              <Link className="btn btn-outline-success me-2" to="/">Login</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
