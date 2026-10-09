import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  function validate() {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.password) e.password = "Password is required.";
    return e;
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    setServerError("");
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) { setServerError(data.message || "Invalid email or password."); return; }
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch {
      setServerError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  }

  return (
    <div className="auth-screen">
      <div className="auth-logo">
        <div className="auth-logo-icon">⛰️</div>
        <h1 className="auth-logo-title">Jibz</h1>
        <p className="auth-logo-sub">Your local mountain, your clips</p>
      </div>
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {serverError && <div className="auth-error-banner">{serverError}</div>}
        <div className="auth-field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email"
            placeholder="you@email.com" value={form.email} onChange={handleChange}
            className={errors.email ? "input-error" : ""} />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>
        <div className="auth-field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password"
            placeholder="••••••••" value={form.password} onChange={handleChange}
            className={errors.password ? "input-error" : ""} />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <div className="auth-divider" />
        <Link to="/register" className="btn-ghost">Create account</Link>
        <div className="auth-alt">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
      </form>
    </div>
  );
}