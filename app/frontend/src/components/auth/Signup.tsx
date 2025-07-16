import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm_password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password || !form.confirm_password) {
      setError('All fields are required.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (form.password !== form.confirm_password) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_URL}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, email: form.email, password: form.password }),
      });
      if (res.ok) {
        navigate('/login');
      } else {
        const data = await res.json();
        setError(data.error || 'Signup failed');
      }
    } catch {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '40px auto', background: '#fff', padding: 32, borderRadius: 8, boxShadow: '0 2px 8px #0001' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Sign Up</h2>
      <input name="username" value={form.username} onChange={handleChange} placeholder="Username" style={{ width: '100%', marginBottom: 12, padding: 10, color: '#222', background: '#f9f9f9', border: '1px solid #ccc' }} />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" style={{ width: '100%', marginBottom: 12, padding: 10, color: '#222', background: '#f9f9f9', border: '1px solid #ccc' }} />
      <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" style={{ width: '100%', marginBottom: 12, padding: 10, color: '#222', background: '#f9f9f9', border: '1px solid #ccc' }} />
      <input name="confirm_password" type="password" value={form.confirm_password} onChange={handleChange} placeholder="Confirm Password" style={{ width: '100%', marginBottom: 12, padding: 10, color: '#222', background: '#f9f9f9', border: '1px solid #ccc' }} />
      <button type="submit" disabled={loading} style={{ width: '100%', padding: 10, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 600 }}>
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        Already have an account? <a href="/login" style={{ color: '#2563eb', textDecoration: 'underline' }}>Log in</a>
      </div>
    </form>
  );
} 