import React, { useEffect, useState } from "react";
import api from "../api";
import ItemForm from "../components/ItemForm";
import ItemList from "../components/ItemList";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("-createdAt");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const limit = 5;

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/items", {
        params: { q, sort, page, limit, includeDeleted },
      });
      setItems(data.items);
      setPages(data.pages);
    } catch (e) {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line
  }, [q, sort, page, includeDeleted]);

  // Add new item
  const onCreated = (item) => {
    if (page === 1) setItems(prev => [item, ...prev].slice(0, limit));
    toast.success("✅ Added!");
  };

  // Inline edit (name or quantity)
  const onEdit = async (id, body) => {
    const prevItems = [...items];
    setItems(prev => prev.map(i => i._id === id ? { ...i, ...body } : i)); // Optimistic update
    try {
      const { data } = await api.put(`/items/${id}`, body);
      setItems(prev => prev.map(i => i._id === id ? data : i));
      toast.success("Updated!");
    } catch {
      setItems(prevItems); // rollback
      toast.error("Update failed");
    }
  };

  // Soft delete
  const onSoftDelete = async (id) => {
    const prevItems = [...items];
    setItems(prev => prev.map(i => i._id === id ? { ...i, deleted: true } : i));
    try {
      await api.delete(`/items/${id}`);
      toast.success("Soft-deleted!");
    } catch {
      setItems(prevItems);
      toast.error("Delete failed");
    }
  };

  // Restore
  const onRestore = async (id) => {
    const prevItems = [...items];
    setItems(prev => prev.map(i => i._id === id ? { ...i, deleted: false } : i));
    try {
      const { data } = await api.patch(`/items/${id}/restore`);
      setItems(prev => prev.map(i => i._id === id ? data.item : i));
      toast.success("Restored!");
    } catch {
      setItems(prevItems);
      toast.error("Restore failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-gray-800">📦 Items Dashboard</h2>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              className="pl-8 pr-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
              placeholder="Search..."
              value={q}
              onChange={(e) => {
                setPage(1);
                setQ(e.target.value);
              }}
            />
          </div>

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

          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
            <input
              type="checkbox"
              checked={includeDeleted}
              onChange={(e) => setIncludeDeleted(e.target.checked)}
              className="h-4 w-4 text-indigo-500 rounded border-gray-300"
            />
            Include deleted
          </label>
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.2 }}
        >
          <ItemList
            items={items}
            onEdit={onEdit}
            onSoftDelete={onSoftDelete}
            onRestore={onRestore}
          />
        </motion.div>
      )}
    </div>
  );
}
