const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemNo: {
    type: String,
    unique: true,
    required: true,
    default: function () {
      return `ITEM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    },
  },
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
  },
 location: {
    type: String,
    required: [true, 'Inventory location is required'],
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true,
    validate: {
      validator: async function (value) {
        const supplier = await mongoose.model('Supplier').findById(value);
        return supplier && supplier.status === 'Active';
      },
      message: 'Supplier must be active and exist in the system',
    },
  },
  stockUnit: {
    type: String,
    required: [true, 'Stock unit is required'],
    enum: ['pcs', 'kg', 'liters', 'boxes', 'units'], 
  },
  unitPrice: {
    type: Number,
    required: [true, 'Unit price is required'],
    min: [0, 'Unit price must be a positive number'],
  },
  images: [{
    type: String,
  }],
  status: {
    type: String,
    enum: ['Enabled', 'Disabled'],
    default: 'Enabled',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Item', itemSchema);
