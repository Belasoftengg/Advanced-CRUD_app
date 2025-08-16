import React, { useState } from 'react';
import { FaEdit, FaTrashAlt, FaUndo } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function ItemList({ items, onEdit, onSoftDelete, onRestore, selected, setSelected, darkMode }) {
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ name: '', quantity: 1 });

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditValues({ name: item.name, quantity: item.quantity });
  };

  const saveEdit = (id) => {
    onEdit(id, editValues);
    setEditingId(null);
  };

  const toggleSelect = (id) => {
    if (selected.includes(id)) setSelected(selected.filter(s => s !== id));
    else setSelected([...selected, id]);
  };

  return (
    <div className="table-responsive shadow-sm">
      <table className={`${darkMode ? "table-dark" : "table-light"} table table-hover table-bordered align-middle`}>
        <thead className="table-primary">
          <tr>
            <th><input type="checkbox" checked={selected.length === items.length && items.length > 0} onChange={(e) => e.target.checked ? setSelected(items.map(i => i._id)) : setSelected([])} /></th>
            <th>Name</th>
            <th>Qty</th>
            <th>Created</th>
            <th>Status</th>
            <th style={{ width: 220 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <motion.tr
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={item.deleted ? 'table-warning text-muted' : ''}
            >
              <td>
                <input type="checkbox" checked={selected.includes(item._id)} onChange={() => toggleSelect(item._id)} />
              </td>
              <td>
                {editingId === item._id ? (
                  <input type="text" className="form-control form-control-sm" value={editValues.name} onChange={(e) => setEditValues({...editValues, name: e.target.value})} />
                ) : item.name}
              </td>
              <td>
                {editingId === item._id ? (
                  <input type="number" className="form-control form-control-sm" min={1} value={editValues.quantity} onChange={(e) => setEditValues({...editValues, quantity: Number(e.target.value)})} />
                ) : item.quantity}
              </td>
              <td>{new Date(item.createdAt).toLocaleString()}</td>
              <td><span className={`badge rounded-pill ${item.deleted ? 'bg-danger' : 'bg-success'}`}>{item.deleted ? 'Deleted' : 'Active'}</span></td>
              <td className="d-flex gap-2">
                {!item.deleted && (
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => editingId === item._id ? saveEdit(item._id) : startEdit(item)}>
                    <FaEdit /> {editingId === item._id ? 'Save' : 'Edit'}
                  </button>
                )}
                {!item.deleted ? (
                  <button className="btn btn-sm btn-outline-danger" onClick={() => onSoftDelete([item._id])}><FaTrashAlt /> Delete</button>
                ) : (
                  <button className="btn btn-sm btn-outline-success" onClick={() => onRestore([item._id])}><FaUndo /> Restore</button>
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && <div className="text-center p-4 text-muted fst-italic">No items found</div>}
    </div>
  );
}
