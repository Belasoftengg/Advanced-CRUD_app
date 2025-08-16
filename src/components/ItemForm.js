import React, { useState } from 'react';
import api from '../api';
import { toast } from 'react-hot-toast';
import { FaPlusCircle } from 'react-icons/fa';

export default function ItemForm({ onCreated }) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

 const submit = async (e) => {
  e.preventDefault();

  if (quantity < 1) {
    toast.error("❌ Quantity must be at least 1");
    return;
  }

  setLoading(true);
  try {
    const { data } = await api.post('/items', { name, quantity });
    onCreated(data);
    setName('');
    setQuantity(1);
    toast.success('✅ Item created successfully');
  } catch (e) {
    toast.error(e?.response?.data?.message || '❌ Create failed');
  } finally {
    setLoading(false);
  }
};


  return (
    <form onSubmit={submit} className="shadow-sm mb-4 p-4 border rounded bg-white">
      <div className="row g-3 align-items-center">
        <div className="col-md-6">
          <input
            className="form-control form-control-lg"
            placeholder="Enter item name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            className="form-control form-control-lg"
            type="number"
            min={1}
            value={quantity}
           onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}

          />
        </div>
        <div className="col-md-3 d-grid">
          <button className="btn btn-lg btn-primary d-flex align-items-center justify-content-center gap-2" disabled={loading}>
            {loading ? (
              <span className="spinner-border spinner-border-sm"></span>
            ) : (
              <>
                <FaPlusCircle /> Add Item
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
