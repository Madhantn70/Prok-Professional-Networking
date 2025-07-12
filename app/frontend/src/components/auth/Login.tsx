import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from './api';
import { profileApi } from '../profile/api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const t = localStorage.getItem('token');
    setToken(t);
    if (t) {
      navigate('/posts');
    }
  }, [localStorage.getItem('token')]);

  console.log('Login component rendered');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    console.log('Attempting login with:', { username, password });
    
    try {
      const res = await authApi.login({ username, password });
      console.log('Response status:', res.status);
      console.log('Response headers:', res.headers);
      
      let data: any = {};
      try {
        data = await res.json();
        console.log('Response data:', data);
      } catch (parseErr) {
        console.log('Failed to parse response:', parseErr);
      }
      
      if (res.ok) {
        localStorage.setItem('token', data.token);
        console.log('Token set:', data.token);
        // Fetch profile to verify token
        try {
          const profile = await profileApi.getProfile();
          console.log('Profile fetch after login:', profile);
          navigate('/posts');
        } catch (profileErr) {
          console.log('Profile fetch error:', profileErr);
          setError('Login succeeded but profile fetch failed. Please try again.');
          localStorage.removeItem('token');
        }
      } else if (res.status === 401) {
        setError('Invalid credentials.');
      } else if (res.status === 400) {
        setError(data.error || 'Missing username or password.');
      } else {
        setError(data.error || `Login failed (Status: ${res.status})`);
      }
    } catch (err: any) {
      console.log('Network error:', err);
      setError('Network error: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '20px' }}>
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <div className="spinner" style={{ margin: '0 auto', width: 32, height: 32, border: '4px solid #eee', borderTop: '4px solid #2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <div style={{ marginTop: 12, color: '#2563eb' }}>Logging in...</div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '40px auto', background: '#fff', padding: 32, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 24, color: '#333' }}>Login to Prok</h2>
          <div style={{ textAlign: 'center', marginBottom: 16, fontSize: '12px', color: '#666' }}>
            Try: demo / demo123
          </div>
          <input 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            placeholder="Username" 
            style={{ width: '100%', marginBottom: 12, padding: 12, color: '#222', background: '#f9f9f9', border: '1px solid #ccc', borderRadius: 4 }} 
          />
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            placeholder="Password" 
            style={{ width: '100%', marginBottom: 12, padding: 12, color: '#222', background: '#f9f9f9', border: '1px solid #ccc', borderRadius: 4 }} 
          />
          <button 
            type="submit" 
            disabled={loading} 
            style={{ width: '100%', padding: 12, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', marginBottom: 8 }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <button 
            type="button" 
            onClick={() => {
              setUsername('demo');
              setPassword('demo123');
            }}
            style={{ width: '100%', padding: 8, background: '#f0f0f0', color: '#666', border: '1px solid #ccc', borderRadius: 4, fontSize: '12px' }}
          >
            Fill Demo Credentials
          </button>
          <button 
            type="button" 
            onClick={() => {
              localStorage.removeItem('token');
              setError('Token cleared. Please login again.');
            }}
            style={{ width: '100%', padding: 8, background: '#ffebee', color: '#d32f2f', border: '1px solid #ffcdd2', borderRadius: 4, fontSize: '12px', marginTop: 8 }}
          >
            Clear Token & Relogin
          </button>
          {error && <div style={{ color: 'red', marginTop: 12, textAlign: 'center' }}>{error}</div>}
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            Don't have an account? <a href="/signup" style={{ color: '#2563eb', textDecoration: 'underline' }}>Sign up</a>
          </div>
        </form>
      )}
      {/* Debug: Show token */}
      <div style={{ marginTop: 16, fontSize: 10, color: '#888', wordBreak: 'break-all' }}>
        Token: {token || 'No token'}
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 