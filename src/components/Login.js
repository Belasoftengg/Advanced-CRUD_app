import React, { useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data);
      toast.success('Welcome back!');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 420 }}>
      <h3 className="mb-3">Login</h3>
      <form onSubmit={submit}>
        <input className="form-control mb-2" placeholder="Email" type="email"
               value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        <input className="form-control mb-3" placeholder="Password" type="password"
               value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? '...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
