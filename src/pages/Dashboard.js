import React, { useEffect, useState } from 'react';
import api from '../api';
import ItemForm from '../components/ItemForm';
import ItemList from '../components/ItemList';
import { toast } from 'react-hot-toast';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const limit = 5;

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/items', { params: { q, sort, page, limit, includeDeleted } });
      setItems(data.items); setPages(data.pages);
    } catch (e) {
      toast.error('Failed to load');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); /* eslint-disable-next-line */ }, [q, sort, page, includeDeleted]);

  const onCreated = (item) => {
    if (page === 1) setItems(prev => [item, ...prev].slice(0, limit));
    toast.success('Added!');
  };

  const onEdit = async (id, body) => {
    try {
      const { data } = await api.put(`/items/${id}`, body);
      setItems(prev => prev.map(i => i._id === id ? data : i));
      toast.success('Updated');
    } catch { toast.error('Update failed'); }
  };

  const onSoftDelete = async (id) => {
    try {
      await api.delete(`/items/${id}`);
      setItems(prev => prev.map(i => i._id === id ? { ...i, deleted: true } : i));
      toast.success('Soft-deleted');
    } catch { toast.error('Delete failed'); }
  };

  const onRestore = async (id) => {
    try {
      const { data } = await api.patch(`/items/${id}/restore`);
      setItems(prev => prev.map(i => i._id === id ? data.item : i));
      toast.success('Restored');
    } catch { toast.error('Restore failed'); }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="m-0">Items</h4>
        <div className="d-flex gap-2">
          <input className="form-control" placeholder="Search..." value={q} onChange={e => { setPage(1); setQ(e.target.value); }} />
          <select className="form-select" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="-createdAt">Newest</option>
            <option value="createdAt">Oldest</option>
            <option value="name">Name A-Z</option>
            <option value="-name">Name Z-A</option>
            <option value="-quantity">Qty High-Low</option>
            <option value="quantity">Qty Low-High</option>
          </select>
          <div className="form-check d-flex align-items-center ms-2">
            <input className="form-check-input me-2" type="checkbox" checked={includeDeleted} onChange={e => setIncludeDeleted(e.target.checked)} id="incdel" />
            <label htmlFor="incdel" className="form-check-label">Include deleted</label>
          </div>
        </div>
      </div>

      <ItemForm onCreated={onCreated} />

      {loading ? <div className="text-center py-5">Loading...</div> :
        <ItemList items={items} onEdit={onEdit} onSoftDelete={onSoftDelete} onRestore={onRestore} />}

      <nav className="d-flex justify-content-center mt-3">
        <ul className="pagination">
          <li className={`page-item ${page===1?'disabled':''}`}>
            <button className="page-link" onClick={() => setPage(p => Math.max(1, p-1))}>Prev</button>
          </li>
          {Array.from({length: pages}, (_,i)=>i+1).map(n=>(
            <li key={n} className={`page-item ${n===page?'active':''}`}>
              <button className="page-link" onClick={()=>setPage(n)}>{n}</button>
            </li>
          ))}
          <li className={`page-item ${page===pages?'disabled':''}`}>
            <button className="page-link" onClick={() => setPage(p => Math.min(pages, p+1))}>Next</button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
