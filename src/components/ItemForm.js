import React, { useState } from 'react';
import api from '../api';
import { toast } from 'react-hot-toast';

export default function ItemForm({ onCreated }) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/items', { name, quantity });
      onCreated(data);
      setName(''); setQuantity(1);
      toast.success('Item created');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Create failed');
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="mb-3 p-3 border rounded bg-light">
      <div className="row g-2">
        <div className="col-md-6">
          <input className="form-control" placeholder="Item name" value={name}
                 onChange={e => setName(e.target.value)} required />
        </div>
        <div className="col-md-3">
          <input className="form-control" type="number" min={1} value={quantity}
                 onChange={e => setQuantity(Number(e.target.value))} />
        </div>
        <div className="col-md-3 d-grid">
          <button className="btn btn-primary" disabled={loading}>{loading ? '...' : 'Add'}</button>
        </div>
      </div>
    </form>
  );
}
