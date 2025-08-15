const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, index: true },
  quantity: { type: Number, default: 1 },
  deleted: { type: Boolean, default: false },         // soft delete
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

ItemSchema.index({ name: 'text' }); // enable text search

module.exports = mongoose.model('Item', ItemSchema);
