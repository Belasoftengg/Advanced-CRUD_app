import React, { useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { FaUserPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';

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
      toast.success('Account created! 🎉');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Register failed ❌');
    } finally { setLoading(false); }
  };

  return (
    <motion.div 
      className="min-vh-100 d-flex align-items-center justify-content-center bg-light"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.6 }}
    >
      <div className="card shadow-lg p-4" style={{ maxWidth: 420, width: '100%' }}>
        <div className="text-center mb-4">
          <h3 className="fw-bold"><FaUserPlus className="me-2"/> Register</h3>
          <p className="text-muted">Create a new account</p>
        </div>
        <form onSubmit={submit}>
          <input
            className="form-control mb-3 form-control-lg"
            placeholder="Full Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="form-control mb-3 form-control-lg"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className="form-control mb-4 form-control-lg"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />
          <button 
            className="btn btn-success w-100 btn-lg d-flex align-items-center justify-content-center gap-2" 
            disabled={loading}
          >
            {loading ? <span className="spinner-border spinner-border-sm"></span> : <FaUserPlus />} 
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
