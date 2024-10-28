const mongoose = require('mongoose');

const purchaseOrderItemSchema = new mongoose.Schema({
  purchaseOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PurchaseOrder',
    required: true,
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  },
  stockUnit: {
    type: String,
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  packingUnit: {
    type: String,
    required: true,
  },
  orderQty: {
    type: Number,
    required: true,
    min: 1,
  },
  itemAmount: {
    type: Number,
    required: true,
    min: 0,
    default: function () {
      return this.orderQty * this.unitPrice;
    },
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
  },
  netAmount: {
    type: Number,
    required: true,
    min: 0,
    default: function () {
      return this.itemAmount - this.discount;
    },
  },
}, {
  timestamps: true,
});

// Export the PurchaseOrderItem model
module.exports = mongoose.model('PurchaseOrderItem', purchaseOrderItemSchema);
