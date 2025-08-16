import React, { useState } from 'react';
import { FaEdit, FaTrashAlt, FaUndo } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function ItemList({ items, onEdit, onSoftDelete, onRestore }) {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const startEdit = (id, currentQty) => {
    setEditingId(id);
    setEditValue(currentQty);
  };

  const saveEdit = (id) => {
    onEdit(id, { quantity: Number(editValue) });
    setEditingId(null);
  };

  return (
    <div className="table-responsive shadow-sm">
      <table className="table table-hover table-bordered align-middle">
        <thead className="table-primary">
          <tr>
            <th>Name</th>
            <th>Qty</th>
            <th>Created</th>
            <th>Status</th>
            <th style={{ width: 220 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(i => (
            <motion.tr
              key={i._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={i.deleted ? 'table-warning text-muted' : ''}
            >
              <td className="fw-semibold">{i.name}</td>
              <td>
                {editingId === i._id ? (
                  <input
                    type="number"
                    value={editValue}
                    min={1}
                    className="form-control form-control-sm"
                    onChange={e => setEditValue(e.target.value)}
                    onBlur={() => saveEdit(i._id)}
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit(i._id)}
                    autoFocus
                  />
                ) : (
                  i.quantity
                )}
              </td>
              <td>{new Date(i.createdAt).toLocaleString()}</td>
              <td>
                <span className={`badge rounded-pill ${i.deleted ? 'bg-danger' : 'bg-success'}`}>
                  {i.deleted ? 'Deleted' : 'Active'}
                </span>
              </td>
              <td>
                <div className="d-flex gap-2">
                  {!i.deleted && (
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => startEdit(i._id, i.quantity)}>
                      <FaEdit /> Edit
                    </button>
                  )}
                  {!i.deleted ? (
                    <button className="btn btn-sm btn-outline-danger" onClick={() => onSoftDelete(i._id)}>
                      <FaTrashAlt /> Delete
                    </button>
                  ) : (
                    <button className="btn btn-sm btn-outline-success" onClick={() => onRestore(i._id)}>
                      <FaUndo /> Restore
                    </button>
                  )}
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && <div className="text-center p-4 text-muted fst-italic">No items found</div>}
    </div>
  );
}
