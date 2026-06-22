"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/Dashboard");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />
      </div>

      <div className="login-card">
        {/* Brand */}
        <div className="login-brand">
          <div className="login-logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <polygon points="16,2 30,28 2,28" stroke="#EDBF7E" strokeWidth="2" fill="none" />
              <polygon points="16,8 25,26 7,26" fill="#EDBF7E" fillOpacity="0.15" />
            </svg>
          </div>
          <h1 className="login-title">CY International</h1>
          <p className="login-subtitle">Admin Dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="admin@cyinternational.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="login-error" role="alert">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="#ef4444" strokeWidth="1.5"/>
                <path d="M8 5v3" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="8" cy="11" r="0.75" fill="#ef4444"/>
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
            id="login-submit-btn"
          >
            {loading ? (
              <span className="btn-spinner" />
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 1L17 9L9 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M1 9H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Sign In
              </>
            )}
          </button>
        </form>

        <p className="login-footer-note">Authorized personnel only</p>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          background: #09090A;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 1rem;
        }
        .login-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .login-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.18;
        }
        .login-orb-1 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, #EDBF7E, transparent 70%);
          top: -100px;
          right: -100px;
        }
        .login-orb-2 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, #C9A870, transparent 70%);
          bottom: -80px;
          left: -80px;
        }
        .login-card {
          position: relative;
          width: 100%;
          max-width: 420px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(237,191,126,0.2);
          border-radius: 20px;
          padding: 2.5rem;
          backdrop-filter: blur(24px);
          box-shadow: 0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(237,191,126,0.05) inset;
        }
        .login-brand {
          text-align: center;
          margin-bottom: 2rem;
        }
        .login-logo {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          background: rgba(237,191,126,0.1);
          border: 1px solid rgba(237,191,126,0.3);
          border-radius: 14px;
          margin-bottom: 1rem;
        }
        .login-title {
          font-family: var(--font-italiana), serif;
          font-size: 1.6rem;
          color: #EDBF7E;
          margin: 0 0 0.25rem;
          letter-spacing: 0.02em;
        }
        .login-subtitle {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.45);
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-label {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.6);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 500;
        }
        .form-input {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 0.75rem 1rem;
          color: #fff;
          font-size: 0.95rem;
          font-family: var(--font-roboto);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          width: 100%;
          box-sizing: border-box;
        }
        .form-input::placeholder { color: rgba(255,255,255,0.25); }
        .form-input:focus {
          border-color: rgba(237,191,126,0.5);
          box-shadow: 0 0 0 3px rgba(237,191,126,0.1);
        }
        .login-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.3);
          border-radius: 8px;
          color: #f87171;
          font-size: 0.875rem;
        }
        .login-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.625rem;
          width: 100%;
          padding: 0.875rem;
          background: linear-gradient(135deg, #EDBF7E 0%, #C9A870 100%);
          color: #09090A;
          font-weight: 700;
          font-size: 0.95rem;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-family: var(--font-roboto);
          letter-spacing: 0.03em;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          margin-top: 0.25rem;
          box-shadow: 0 4px 20px rgba(237,191,126,0.25);
        }
        .login-btn:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 8px 30px rgba(237,191,126,0.35);
        }
        .login-btn:active:not(:disabled) { transform: translateY(0); }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(9,9,10,0.3);
          border-top-color: #09090A;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .login-footer-note {
          text-align: center;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.2);
          margin: 1.5rem 0 0;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
      `}</style>
    </div>
  );
}
