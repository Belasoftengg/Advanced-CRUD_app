import React, { useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function Register() {
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      login(data);
      toast.success('Account created!');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Register failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 420 }}>
      <h3 className="mb-3">Register</h3>
      <form onSubmit={submit}>
        <input className="form-control mb-2" placeholder="Full name"
               value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <input className="form-control mb-2" placeholder="Email" type="email"
               value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        <input className="form-control mb-3" placeholder="Password" type="password"
               value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
        <button className="btn btn-success w-100" disabled={loading}>
          {loading ? '...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
}
