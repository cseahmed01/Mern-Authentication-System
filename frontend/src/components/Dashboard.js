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

  return (
    <div className="col-md-6 mx-auto">
      <h3>Dashboard</h3>
      {user ? (
        <div className="card p-3">
          <h5>Name: {user.name}</h5>
          <p>Email: {user.email}</p>
        </div>
      ) : (
        <p>Loading user...</p>
      )}
    </div>
  );
}
