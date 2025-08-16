import React from 'react';
import { FaEdit, FaTrashAlt, FaUndo } from 'react-icons/fa';

export default function ItemList({ items, onEdit, onSoftDelete, onRestore }) {
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
          {items.map((i) => (
            <tr key={i._id} className={i.deleted ? 'table-warning text-muted' : ''}>
              <td className="fw-semibold">{i.name}</td>
              <td>{i.quantity}</td>
              <td>{new Date(i.createdAt).toLocaleString()}</td>
              <td>
                <span
                  className={`badge rounded-pill ${i.deleted ? 'bg-danger' : 'bg-success'}`}
                >
                  {i.deleted ? 'Deleted' : 'Active'}
                </span>
              </td>
              <td>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    title="Edit Quantity"
                    onClick={() => {
                      const newQty = prompt('New quantity', i.quantity);
                      if (newQty) onEdit(i._id, { quantity: Number(newQty) });
                    }}
                  >
                    <FaEdit /> Edit
                  </button>

                  {!i.deleted ? (
                    <button
                      className="btn btn-sm btn-outline-danger"
                      title="Soft Delete"
                      onClick={() => onSoftDelete(i._id)}
                    >
                      <FaTrashAlt /> Delete
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm btn-outline-success"
                      title="Restore"
                      onClick={() => onRestore(i._id)}
                    >
                      <FaUndo /> Restore
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && (
        <div className="text-center p-4 text-muted fst-italic">No items found</div>
      )}
    </div>
  );
}
