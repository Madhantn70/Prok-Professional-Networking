import React, { useState } from 'react';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!username || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', color: '#111' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', color: '#111', padding: 32, borderRadius: 8, boxShadow: '0 2px 8px #0001', minWidth: 320 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, textAlign: 'center' }}>Sign Up</h2>
        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Username"
            style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc', fontSize: 16, color: '#111', background: '#fff' }}
            autoFocus
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc', fontSize: 16, color: '#111', background: '#fff' }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc', fontSize: 16, color: '#111', background: '#fff' }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc', fontSize: 16, color: '#111', background: '#fff' }}
          />
        </div>
        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
        {success && <div style={{ color: 'green', marginBottom: 12 }}>Signup successful!</div>}
        <button
          type="submit"
          style={{ width: '100%', padding: 10, borderRadius: 4, background: '#2563eb', color: '#fff', fontWeight: 600, fontSize: 16, border: 'none', cursor: 'pointer' }}
          disabled={loading}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
} 