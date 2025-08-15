const Item = require('../models/Item');

// Create
exports.createItem = async (req, res, next) => {
  try {
    const item = await Item.create({ ...req.body, owner: req.user.id });
    res.json(item);
  } catch (e) { next(e); }
};

// Read (with pagination, search, sort, filters, soft delete excluded)
exports.getItems = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, q = '', sort = '-createdAt', includeDeleted = 'false' } = req.query;

    const query = { };
    if (includeDeleted !== 'true') query.deleted = false;
    if (q) query.$text = { $search: q };

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Item.find(query).sort(sort).skip(skip).limit(Number(limit)),
      Item.countDocuments(query)
    ]);

    res.json({
      items, total,
      page: Number(page), pages: Math.ceil(total / Number(limit))
    });
  } catch (e) { next(e); }
};

// Update
exports.updateItem = async (req, res, next) => {
  try {
    const updated = await Item.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Item not found' });
    res.json(updated);
  } catch (e) { next(e); }
};

// Soft delete
exports.softDeleteItem = async (req, res, next) => {
  try {
    const updated = await Item.findByIdAndUpdate(req.params.id, { deleted: true }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item soft-deleted', item: updated });
  } catch (e) { next(e); }
};

// Restore
exports.restoreItem = async (req, res, next) => {
  try {
    const updated = await Item.findByIdAndUpdate(req.params.id, { deleted: false }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item restored', item: updated });
  } catch (e) { next(e); }
};

// Hard delete (admin only)
exports.hardDeleteItem = async (req, res, next) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted permanently' });
  } catch (e) { next(e); }
};
