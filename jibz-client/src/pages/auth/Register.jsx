import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PickLocal from "./PickLocal";
import "./Auth.css";

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    username: "", email: "", password: "", confirmPassword: "",
    dateOfBirth: "", stance: "Regular",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate() {
    const e = {};
    if (!form.username.trim()) e.username = "Username is required.";
    else if (form.username.length < 3) e.username = "At least 3 characters.";
    else if (/\s/.test(form.username)) e.username = "No spaces allowed.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 8) e.password = "At least 8 characters.";
    if (!form.confirmPassword) e.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match.";
    return e;
  }

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  }

  function handleContinue(e) {
    e.preventDefault();
    setServerError("");
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setStep(2);
  }

  async function handleFinish(mountainId) {
    setLoading(true);
    setServerError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username, email: form.email, password: form.password,
          dateOfBirth: form.dateOfBirth || null, stance: form.stance,
          localMountainId: mountainId,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setServerError(data.message || "Registration failed."); setStep(1); return; }
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch {
      setServerError("Something went wrong. Try again.");
      setStep(1);
    } finally {
      setLoading(false);
    }
  }

  if (step === 2) return <PickLocal onBack={() => setStep(1)} onFinish={handleFinish} loading={loading} serverError={serverError} />;

  return (
    <div className="auth-screen">
      <div className="auth-back-row">
        <Link to="/login" className="back-link">← Back</Link>
        <span className="auth-step">Step 1 of 2</span>
      </div>
      <div className="auth-heading">
        <h2>Create account</h2>
        <p>Join your local mountain.</p>
      </div>
      <form className="auth-form" onSubmit={handleContinue} noValidate>
        {serverError && <div className="auth-error-banner">{serverError}</div>}
        <div className="auth-field">
          <label htmlFor="username">Username</label>
          <input id="username" name="username" type="text" placeholder="shredder99"
            value={form.username} onChange={handleChange} className={errors.username ? "input-error" : ""} />
          {errors.username && <span className="field-error">{errors.username}</span>}
        </div>
        <div className="auth-field">
          <label htmlFor="reg-email">Email</label>
          <input id="reg-email" name="email" type="email" placeholder="you@email.com"
            value={form.email} onChange={handleChange} className={errors.email ? "input-error" : ""} />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>
        <div className="auth-field">
          <label htmlFor="reg-password">Password</label>
          <input id="reg-password" name="password" type="password" placeholder="At least 8 characters"
            value={form.password} onChange={handleChange} className={errors.password ? "input-error" : ""} />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </div>
        <div className="auth-field">
          <label htmlFor="confirmPassword">Confirm password</label>
          <input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••"
            value={form.confirmPassword} onChange={handleChange} className={errors.confirmPassword ? "input-error" : ""} />
          {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
        </div>
        <div className="auth-row">
          <div className="auth-field">
            <label htmlFor="dateOfBirth">Date of birth <span className="optional">(optional)</span></label>
            <input id="dateOfBirth" name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} />
          </div>
          <div className="auth-field">
            <label htmlFor="stance">Stance</label>
            <select id="stance" name="stance" value={form.stance} onChange={handleChange}>
              <option>Regular</option>
              <option>Goofy</option>
            </select>
          </div>
        </div>
        <button type="submit" className="btn-primary">Continue →</button>
        <div className="auth-alt">Already have an account? <Link to="/login">Sign in</Link></div>
      </form>
    </div>
  );
}