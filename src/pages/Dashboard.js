import React, { useEffect, useState } from "react";
import api from "../api";
import ItemForm from "../components/ItemForm";
import ItemList from "../components/ItemList";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Search, Sun, Moon } from "lucide-react";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("-createdAt");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const limit = 5;

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/items", {
        params: { q, sort, page, limit, includeDeleted },
      });
      setItems(data.items);
      setPages(data.pages);
    } catch {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line
  }, [q, sort, page, includeDeleted]);

  const onCreated = (item) => {
    if (page === 1) setItems(prev => [item, ...prev].slice(0, limit));
    toast.success("✅ Added!");
  };

  const onEdit = async (id, body) => {
    const prevItems = [...items];
    setItems(prev => prev.map(i => i._id === id ? { ...i, ...body } : i));
    try {
      const { data } = await api.put(`/items/${id}`, body);
      setItems(prev => prev.map(i => i._id === id ? data : i));
      toast.success("Updated!");
    } catch {
      setItems(prevItems);
      toast.error("Update failed");
    }
  };

  const onSoftDelete = async (ids) => {
    const prevItems = [...items];
    setItems(prev => prev.map(i => ids.includes(i._id) ? { ...i, deleted: true } : i));
    try {
      await Promise.all(ids.map(id => api.delete(`/items/${id}`)));
      toast.success("Deleted!");
      setSelected([]);
    } catch {
      setItems(prevItems);
      toast.error("Delete failed");
    }
  };

  const onRestore = async (ids) => {
    const prevItems = [...items];
    setItems(prev => prev.map(i => ids.includes(i._id) ? { ...i, deleted: false } : i));
    try {
      await Promise.all(ids.map(id => api.patch(`/items/${id}/restore`)));
      toast.success("Restored!");
      setSelected([]);
    } catch {
      setItems(prevItems);
      toast.error("Restore failed");
    }
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"} min-h-screen py-6 px-4 transition-colors duration-300`}>

      {/* Header */}
     <motion.div
  className="relative flex items-center mb-6"
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
>
 

  {/* Right Controls */}
  <div className="ml-auto flex gap-3 items-center">

    {/* Sorting */}
    <select
      className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
      value={sort}
      onChange={(e) => setSort(e.target.value)}
    >
      <option value="-createdAt">Newest</option>
      <option value="createdAt">Oldest</option>
      <option value="name">Name A-Z</option>
      <option value="-name">Name Z-A</option>
      <option value="-quantity">Qty High-Low</option>
      <option value="quantity">Qty Low-High</option>
    </select>

    {/* Include deleted */}
    {/* <label className=" gap-6 cursor-pointer text-sm">
      <input
        type="checkbox"
        checked={includeDeleted}
        onChange={(e) => setIncludeDeleted(e.target.checked)}
        className="h-4 w-4 text-indigo-500 rounded border-gray-300"
      />
      Include deleted
    </label> */}

    {/* Dark/Light Mode */}
    <button
      onClick={() => setDarkMode(prev => !prev)}
      className="p-2 rounded-full border"
    >
      {darkMode ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}
    </button>
  </div>
</motion.div>


      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <ItemForm onCreated={onCreated} />
      </motion.div>

      {/* Bulk Actions */}
      {selected.length > 0 && (
        <div className="mb-3 flex gap-2">
          <button className="btn btn-sm btn-danger" onClick={() => onSoftDelete(selected)}>Delete Selected</button>
          <button className="btn btn-sm btn-success" onClick={() => onRestore(selected)}>Restore Selected</button>
          <span className="ml-2 text-sm">{selected.length} item(s) selected</span>
        </div>
      )}

      {/* Items List */}
      {loading ? (
        <motion.div
          className="text-center py-8 text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Loading...
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ staggerChildren: 0.2 }}>
          <ItemList
            items={items}
            selected={selected}
            setSelected={setSelected}
            onEdit={onEdit}
            onSoftDelete={onSoftDelete}
            onRestore={onRestore}
            darkMode={darkMode}
          />
        </motion.div>
      )}
    </div>
  );
}
