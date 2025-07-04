import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        // Optionally: localStorage.setItem('token', data.token);
        navigate('/profile');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '40px auto', background: '#fff', padding: 32, borderRadius: 8, boxShadow: '0 2px 8px #0001' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Login</h2>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" style={{ width: '100%', marginBottom: 12, padding: 10, color: '#222', background: '#f9f9f9', border: '1px solid #ccc' }} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" style={{ width: '100%', marginBottom: 12, padding: 10, color: '#222', background: '#f9f9f9', border: '1px solid #ccc' }} />
      <button type="submit" disabled={loading} style={{ width: '100%', padding: 10, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 600 }}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        Don't have an account? <a href="/signup" style={{ color: '#2563eb', textDecoration: 'underline' }}>Sign up</a>
      </div>
    </form>
  );
} 