import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiBase } from "../App";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.detail || "Registration failed");
        return;
      }
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "2rem 1.5rem" }}>
      <div className="form-card">
        <h1>Create account</h1>
        <form onSubmit={handleSubmit}>
          <label className="label" htmlFor="username">
            Username (letters, numbers, _ -)
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            minLength={2}
            required
          />
          <label className="label" htmlFor="password">
            Password (min 8 characters)
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Creating…" : "Register"}
          </button>
        </form>
        <p style={{ marginTop: "1.5rem", fontSize: "0.9rem", color: "#94a3b8" }}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
        <Link to="/" style={{ display: "inline-block", marginTop: "1rem" }}>
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
