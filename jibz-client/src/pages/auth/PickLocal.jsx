import { useState, useEffect } from "react";
import "./Auth.css";

export default function PickLocal({ onBack, onFinish, loading, serverError }) {
  const [mountains, setMountains] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch("/api/Mountains")
      .then((r) => r.json())
      .then((data) => setMountains(data))
      .catch(() => {});
  }, []);

  const list = mountains.length
    ? mountains
    : [
        { id: 1, name: "Liberty", city: "Carroll Valley", state: "PA" },
        { id: 2, name: "Roundtop", city: "Lewisberry", state: "PA" },
      ];

  return (
    <div className="auth-screen">
      <div className="auth-back-row">
        <button onClick={onBack} className="back-link">← Back</button>
        <span className="auth-step">Step 2 of 2</span>
      </div>
      <div className="auth-heading">
        <h2>Pick your local</h2>
        <p>Where do you ride? You can change this later.</p>
      </div>
      {serverError && <div className="auth-error-banner">{serverError}</div>}
      <div className="local-grid">
        {list.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`local-card ${selected === m.id ? "local-card--selected" : ""}`}
            onClick={() => setSelected(m.id)}
          >
            <span className="local-card-icon">⛰️</span>
            <span className="local-card-name">{m.name}</span>
            <span className="local-card-loc">{m.city}, {m.state}</span>
          </button>
        ))}
      </div>
      <div className="auth-form" style={{ marginTop: "24px" }}>
        <button
          type="button"
          className="btn-primary"
          disabled={loading}
          onClick={() => onFinish(selected)}
        >
          {loading ? "Creating account…" : selected ? "Let's shred →" : "Skip for now →"}
        </button>
      </div>
    </div>
  );
}