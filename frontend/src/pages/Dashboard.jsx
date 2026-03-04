import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiBase } from "../App";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    fetch(`${apiBase}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setUser(data);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  function logout() {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  }

  if (loading) return <div style={{ padding: "3rem", textAlign: "center" }}>Loading…</div>;
  if (!user) return null;

  return (
    <div style={{ padding: "2rem 1.5rem" }}>
      <div className="form-card">
        <h1>Dashboard</h1>
        <p>
          Logged in as <strong>{user.username}</strong> (id: {user.id}).
        </p>
        <button type="button" onClick={logout}>
          Log out
        </button>
        <br />
        <Link to="/" style={{ display: "inline-block", marginTop: "1rem" }}>
          ← Home
        </Link>
      </div>
    </div>
  );
}
