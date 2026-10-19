import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Radio, AlertCircle, ArrowRight } from 'lucide-react';

const CREDENTIALS = {
  developer: { email: 'dev@urbanflow.io',       password: 'Dev@2026'   },
  admin:     { email: 'admin@urbanflow.gov.in',  password: 'Admin@2026' },
  user:      { email: 'user@urbanflow.gov.in',   password: 'User@2026'  },
};

export default function Login() {
  const navigate = useNavigate();
  const [role,     setRole]     = useState('admin');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const creds = CREDENTIALS[role];
    if (email !== creds.email || password !== creds.password) {
      setError('Invalid email or password for the selected role.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('urbanflow_auth', JSON.stringify({
        authenticated: true, role, email, timestamp: Date.now(),
      }));
      navigate('/');
    }, 500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#F1F5F9', padding: 16,
    }}>
      {/* subtle grid */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(37,99,235,0.05) 1px, transparent 1px), linear-gradient(90deg,rgba(37,99,235,0.05) 1px,transparent 1px)',
        backgroundSize: '28px 28px',
      }} />

      <div style={{
        width: '100%', maxWidth: 360,
        background: '#fff', borderRadius: 12,
        boxShadow: '0 8px 24px rgba(15,23,42,0.10)',
        border: '1px solid #E2E8F0',
        overflow: 'hidden', position: 'relative', zIndex: 1,
      }}>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg,#1E3A8A,#2563EB)',
          padding: '24px', textAlign: 'center',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10,
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 10px',
          }}>
            <Radio size={22} color="#fff" strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: 0 }}>UrbanFlow AI</h1>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', marginTop: 4, letterSpacing: '0.07em', fontWeight: 600 }}>
            TRAFFIC CONTROL CONSOLE
          </p>
        </div>

        {/* Form */}
        <div style={{ padding: '24px' }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', margin: '0 0 18px' }}>
            Sign In
          </h2>

          {error && (
            <div style={{
              background: '#FEF2F2', border: '1px solid #FECACA', color: '#EF4444',
              padding: '8px 12px', borderRadius: 6, fontSize: 12,
              display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14,
            }}>
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Role */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 5 }}>
                Role
              </label>
              <select
                className="form-select"
                value={role}
                onChange={e => { setRole(e.target.value); setError(''); }}
                style={{ width: '100%', fontSize: 13 }}
              >
                <option value="developer">Developer</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 5 }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: 34, width: '100%', boxSizing: 'border-box', fontSize: 13 }}
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <Mail size={14} color="#94A3B8"
                  style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 5 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPwd ? 'text' : 'password'}
                  className="form-input"
                  style={{ paddingLeft: 34, paddingRight: 36, width: '100%', boxSizing: 'border-box', fontSize: 13 }}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <Lock size={14} color="#94A3B8"
                  style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }} />
                <button type="button"
                  onClick={() => setShowPwd(p => !p)}
                  style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8',
                    display: 'flex', padding: 0,
                  }}>
                  {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '10px', fontSize: 13, marginTop: 2 }}
              disabled={loading}
            >
              {loading ? 'Signing in…' : <><span>Sign In</span><ArrowRight size={14} /></>}
            </button>
          </form>


        </div>
      </div>
    </div>
  );
}
