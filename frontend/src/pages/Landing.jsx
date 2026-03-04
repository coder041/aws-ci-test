import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div style={{ padding: "3rem 1.5rem", textAlign: "center" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>aws-ci-test</h1>
      <p style={{ color: "#94a3b8", marginBottom: "2rem" }}>
        Simple auth + PostgreSQL. Principal-grade setup.
      </p>
      <Link to="/login" style={{ marginRight: "0.75rem" }}>
        <button type="button">Log in</button>
      </Link>
      <Link to="/register">
        <button type="button" style={{ background: "#334155", color: "#e2e8f0" }}>
          Register
        </button>
      </Link>
    </div>
  );
}
