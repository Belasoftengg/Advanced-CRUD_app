import React from 'react';

export default function ItemList({ items, onEdit, onSoftDelete, onRestore }) {
  return (
    <div className="table-responsive">
      <table className="table table-striped align-middle">
        <thead>
          <tr>
            <th>Name</th>
            <th>Qty</th>
            <th>Created</th>
            <th>Status</th>
            <th style={{width: 220}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(i => (
            <tr key={i._id} className={i.deleted ? 'table-warning' : ''}>
              <td>{i.name}</td>
              <td>{i.quantity}</td>
              <td>{new Date(i.createdAt).toLocaleString()}</td>
              <td>{i.deleted ? 'Deleted' : 'Active'}</td>
              <td>
                <button className="btn btn-sm btn-outline-secondary me-2"
                        onClick={() => {
                          const newQty = prompt('New quantity', i.quantity);
                          if (newQty) onEdit(i._id, { quantity: Number(newQty) });
                        }}>Edit</button>

                {!i.deleted ? (
                  <button className="btn btn-sm btn-outline-danger me-2" onClick={() => onSoftDelete(i._id)}>Soft Delete</button>
                ) : (
                  <button className="btn btn-sm btn-outline-success me-2" onClick={() => onRestore(i._id)}>Restore</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
